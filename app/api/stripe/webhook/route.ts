import {createHmac,timingSafeEqual} from 'crypto';
import {NextResponse} from 'next/server';
import {claimOrderForFulfillment,markOrderCjSubmitted,markOrderFulfillmentFailed,markOrderPaidFromSession} from '../../../../lib/orders';
import {createCjOrderV2} from '../../../../lib/cj';

export const runtime='nodejs';

function verifyStripeSignature(payload:string,header:string,secret:string){
  const parts=header.split(',').map(v=>v.trim());const timestamp=parts.find(v=>v.startsWith('t='))?.slice(2);const signatures=parts.filter(v=>v.startsWith('v1=')).map(v=>v.slice(3));
  if(!timestamp||!signatures.length)return false;const age=Math.abs(Math.floor(Date.now()/1000)-Number(timestamp));if(!Number.isFinite(age)||age>300)return false;
  const expected=createHmac('sha256',secret).update(`${timestamp}.${payload}`,'utf8').digest('hex');
  return signatures.some(sig=>{try{const a=Buffer.from(expected,'hex');const b=Buffer.from(sig,'hex');return a.length===b.length&&timingSafeEqual(a,b)}catch{return false}});
}

async function fulfillPaidOrder(publicId:string,livemode:boolean){
  // Sandbox orders may be sent only as CJ sandbox orders. Real CJ orders require an explicit production switch.
  if(livemode&&process.env.CJ_LIVE_FULFILLMENT_ENABLED!=='true'){
    console.log('CJ live fulfillment safely disabled',{orderId:publicId});
    return {status:'LIVE_DISABLED'};
  }
  const order=await claimOrderForFulfillment(publicId);
  if(!order)return {status:'NOT_CLAIMED'};
  try{
    const address:any=order.customer_address||{};
    const items=(order.items||[]).map((item:any)=>({
      productId:String(item.cj_product_id||''),variantId:String(item.cj_variant_id||''),quantity:Number(item.quantity||1),lineItemId:String(item.id)
    }));
    if(items.some((x:any)=>!x.variantId))throw new Error('Order contains an item without a CJ variant ID');
    const result=await createCjOrderV2({
      orderNumber:order.public_id,
      items,
      logisticName:String(order.shipping_method||''),
      sandbox:!livemode,
      shipping:{
        countryCode:String(address.country||order.destination_country||''),country:String(address.country||order.destination_country||''),
        province:String(address.state||''),city:String(address.city||''),address:String(address.line1||''),address2:String(address.line2||''),
        zip:String(address.postal_code||order.destination_postal_code||''),name:String(address.name||order.customer_name||''),
        phone:String(address.phone||order.customer_phone||''),email:String(order.customer_email||'')
      }
    });
    await markOrderCjSubmitted(publicId,result);
    console.log('CJ order submitted',{orderId:publicId,sandbox:!livemode,cjOrderId:result?.data?.orderId||result?.data?.id||null});
    return {status:'SUBMITTED',result};
  }catch(e){
    const message=e instanceof Error?e.message:'CJ fulfillment failed';
    await markOrderFulfillmentFailed(publicId,message);
    console.error('CJ fulfillment failed',{orderId:publicId,error:message});
    return {status:'FAILED',error:message};
  }
}

export async function POST(req:Request){
  const secret=process.env.STRIPE_WEBHOOK_SECRET;if(!secret)return NextResponse.json({error:'Stripe webhook is not configured.'},{status:500});
  const signature=req.headers.get('stripe-signature')||'';const payload=await req.text();
  if(!verifyStripeSignature(payload,signature,secret))return NextResponse.json({error:'Invalid Stripe signature.'},{status:400});
  let event:any;try{event=JSON.parse(payload)}catch{return NextResponse.json({error:'Invalid JSON.'},{status:400})}
  console.log('Stripe webhook received',{id:event?.id,type:event?.type,livemode:event?.livemode,created:event?.created});
  try{
    let fulfillment:any=null;
    if(event.type==='checkout.session.completed'||event.type==='checkout.session.async_payment_succeeded'){
      const session=event.data?.object;
      console.log('Stripe checkout webhook',{sessionId:session?.id,paymentStatus:session?.payment_status,orderId:session?.metadata?.order_id||session?.client_reference_id||null});
      if(session?.payment_status==='paid'){
        const paid=await markOrderPaidFromSession(session);
        if(paid?.public_id)fulfillment=await fulfillPaidOrder(String(paid.public_id),Boolean(event?.livemode));
      }
    }
    return NextResponse.json({received:true,eventType:event?.type||null,eventId:event?.id||null,fulfillment:fulfillment?.status||null});
  }catch(e){console.error('Stripe webhook processing failed',e);return NextResponse.json({error:e instanceof Error?e.message:'Webhook processing failed.'},{status:500});}
}
