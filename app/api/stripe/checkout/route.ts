import {NextResponse} from 'next/server';
import {attachStripeSession,createPendingOrder,markOrderCheckoutFailed} from '../../../../lib/orders';

type CheckoutItem={id:string;name:string;price:number;qty:number;vid?:string;variant?:string};

export async function POST(req:Request){
  let publicId='';
  try{
    // During sandbox validation, prefer the explicit Stripe test key.
    // Keep the existing key as a fallback so production migration can be handled separately.
    const secret=process.env.STRIPE_TEST_SECRET_KEY||process.env.STRIPE_SECRET_KEY;
    if(!secret)return NextResponse.json({error:'Stripe is not configured.'},{status:500});
    const body=await req.json();
    const items:Array<CheckoutItem>=Array.isArray(body.items)?body.items:[];
    const shipping=Number(body.shipping||0);
    const country=String(body.country||'');
    const zip=String(body.zip||'');
    const shippingMethod=String(body.shippingMethod||'');
    if(!items.length||items.some(i=>!i.vid||!Number.isFinite(i.price)||!Number.isInteger(i.qty)||i.qty<1))return NextResponse.json({error:'Invalid cart items.'},{status:400});
    if(!country||!Number.isFinite(shipping)||shipping<0)return NextResponse.json({error:'Calculate a valid shipping quote first.'},{status:400});

    const order=await createPendingOrder({items,shipping,country,zip,shippingMethod});
    publicId=order.public_id;

    const origin=new URL(req.url).origin;
    const p=new URLSearchParams();
    p.set('mode','payment');
    p.set('success_url',`${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
    p.set('cancel_url',`${origin}/cart`);
    p.set('billing_address_collection','required');
    p.set('client_reference_id',publicId);
    items.forEach((item,index)=>{
      p.set(`line_items[${index}][quantity]`,String(item.qty));
      p.set(`line_items[${index}][price_data][currency]`,'usd');
      p.set(`line_items[${index}][price_data][unit_amount]`,String(Math.round(item.price*100)));
      p.set(`line_items[${index}][price_data][product_data][name]`,item.variant?`${item.name} — ${item.variant}`:item.name);
      p.set(`line_items[${index}][price_data][product_data][metadata][cj_product_id]`,item.id);
      p.set(`line_items[${index}][price_data][product_data][metadata][cj_variant_id]`,item.vid||'');
    });
    if(shipping>0){
      const i=items.length;
      p.set(`line_items[${i}][quantity]`,'1');
      p.set(`line_items[${i}][price_data][currency]`,'usd');
      p.set(`line_items[${i}][price_data][unit_amount]`,String(Math.round(shipping*100)));
      p.set(`line_items[${i}][price_data][product_data][name]`,shippingMethod?`Shipping — ${shippingMethod}`:'Shipping');
    }
    p.set('metadata[order_id]',publicId);
    p.set('metadata[destination_country]',country);
    p.set('metadata[destination_postal_code]',zip);
    p.set('metadata[shipping_method]',shippingMethod);

    const stripe=await fetch('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{Authorization:`Bearer ${secret}`,'Content-Type':'application/x-www-form-urlencoded'},body:p.toString()});
    const data=await stripe.json();
    if(!stripe.ok){await markOrderCheckoutFailed(publicId,data);return NextResponse.json({error:data?.error?.message||'Stripe checkout creation failed.'},{status:502});}
    await attachStripeSession(publicId,data.id);
    return NextResponse.json({url:data.url,id:data.id,orderId:publicId});
  }catch(e){
    if(publicId){try{await markOrderCheckoutFailed(publicId,{error:e instanceof Error?e.message:String(e)})}catch{}}
    return NextResponse.json({error:e instanceof Error?e.message:'Unable to create checkout.'},{status:500})
  }
}
