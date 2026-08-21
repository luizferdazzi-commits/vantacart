import {NextResponse} from 'next/server';
import {attachStripeSession,createPendingOrder,markOrderCheckoutFailed} from '../../../../lib/orders';

type CheckoutItem={id:string;name:string;price:number;qty:number;vid?:string;variant?:string};

async function getUsdToBrlRate(){
  const response=await fetch('https://api.frankfurter.app/latest?from=USD&to=BRL',{cache:'no-store'});
  if(!response.ok)throw new Error('Unable to obtain USD/BRL exchange rate.');
  const data=await response.json();
  const rate=Number(data?.rates?.BRL);
  if(!Number.isFinite(rate)||rate<=0)throw new Error('Invalid USD/BRL exchange rate.');
  return rate;
}

export async function POST(req:Request){
  let publicId='';
  try{
    const isProduction=process.env.VERCEL_ENV==='production';
    const secret=isProduction
      ? (process.env.STRIPE_LIVE_SECRET_KEY||process.env.STRIPE_SECRET_KEY)
      : (process.env.STRIPE_TEST_SECRET_KEY||process.env.STRIPE_SECRET_KEY);
    if(!secret)return NextResponse.json({error:'Stripe is not configured.'},{status:500});
    const body=await req.json();
    const items:Array<CheckoutItem>=Array.isArray(body.items)?body.items:[];
    const shipping=Number(body.shipping||0);
    const country=String(body.country||'').trim().toUpperCase();
    const zip=String(body.zip||'');
    const shippingMethod=String(body.shippingMethod||'');
    if(!items.length||items.some(i=>!i.vid||!Number.isFinite(i.price)||!Number.isInteger(i.qty)||i.qty<1))return NextResponse.json({error:'Invalid cart items.'},{status:400});
    if(!/^[A-Z]{2}$/.test(country)||!Number.isFinite(shipping)||shipping<0)return NextResponse.json({error:'Calculate a valid shipping quote first.'},{status:400});

    // Catalog and supplier values are maintained in USD, but this Brazilian Stripe
    // account settles in BRL. Adaptive Pricing requires the integration currency
    // to be a settlement currency, so convert the checkout base amount to BRL.
    // When Adaptive Pricing is enabled in Stripe, customers can then be presented
    // with supported local currencies while the merchant settles in BRL.
    const usdToBrl=await getUsdToBrlRate();

    const order=await createPendingOrder({items,shipping,country,zip,shippingMethod});
    publicId=order.public_id;

    const origin=new URL(req.url).origin;
    const p=new URLSearchParams();
    p.set('mode','payment');
    p.set('success_url',`${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
    p.set('cancel_url',`${origin}/cart`);
    p.set('billing_address_collection','required');
    p.set('shipping_address_collection[allowed_countries][0]',country);
    p.set('phone_number_collection[enabled]','true');
    p.set('client_reference_id',publicId);
    if(country==='BR'){
      p.set('custom_fields[0][key]','tax_id');
      p.set('custom_fields[0][label][type]','custom');
      p.set('custom_fields[0][label][custom]','CPF ou CNPJ');
      p.set('custom_fields[0][type]','text');
      p.set('custom_fields[0][text][minimum_length]','6');
      p.set('custom_fields[0][text][maximum_length]','20');
      p.set('custom_fields[0][optional]','false');
    }
    items.forEach((item,index)=>{
      p.set(`line_items[${index}][quantity]`,String(item.qty));
      p.set(`line_items[${index}][price_data][currency]`,'brl');
      p.set(`line_items[${index}][price_data][unit_amount]`,String(Math.round(item.price*usdToBrl*100)));
      p.set(`line_items[${index}][price_data][product_data][name]`,item.variant?`${item.name} — ${item.variant}`:item.name);
      p.set(`line_items[${index}][price_data][product_data][metadata][cj_product_id]`,item.id);
      p.set(`line_items[${index}][price_data][product_data][metadata][cj_variant_id]`,item.vid||'');
      p.set(`line_items[${index}][price_data][product_data][metadata][catalog_currency]`,'usd');
      p.set(`line_items[${index}][price_data][product_data][metadata][catalog_unit_amount]`,String(item.price));
    });
    if(shipping>0){
      const i=items.length;
      p.set(`line_items[${i}][quantity]`,'1');
      p.set(`line_items[${i}][price_data][currency]`,'brl');
      p.set(`line_items[${i}][price_data][unit_amount]`,String(Math.round(shipping*usdToBrl*100)));
      p.set(`line_items[${i}][price_data][product_data][name]`,shippingMethod?`Shipping — ${shippingMethod}`:'Shipping');
    }
    p.set('metadata[order_id]',publicId);
    p.set('metadata[destination_country]',country);
    p.set('metadata[destination_postal_code]',zip);
    p.set('metadata[shipping_method]',shippingMethod);
    p.set('metadata[catalog_currency]','usd');
    p.set('metadata[integration_currency]','brl');
    p.set('metadata[usd_brl_rate]',usdToBrl.toFixed(6));

    const stripe=await fetch('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{Authorization:`Bearer ${secret}`,'Content-Type':'application/x-www-form-urlencoded'},body:p.toString()});
    const data=await stripe.json();
    if(!stripe.ok){await markOrderCheckoutFailed(publicId,data);return NextResponse.json({error:data?.error?.message||'Stripe checkout creation failed.'},{status:502});}
    await attachStripeSession(publicId,data.id);
    return NextResponse.json({url:data.url,id:data.id,orderId:publicId,currency:'brl',usdToBrl});
  }catch(e){
    if(publicId){try{await markOrderCheckoutFailed(publicId,{error:e instanceof Error?e.message:String(e)})}catch{}}
    return NextResponse.json({error:e instanceof Error?e.message:'Unable to create checkout.'},{status:500})
  }
}
