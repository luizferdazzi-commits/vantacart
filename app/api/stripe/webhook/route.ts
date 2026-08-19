import {createHmac,timingSafeEqual} from 'crypto';
import {NextResponse} from 'next/server';
import {markOrderPaidFromSession} from '../../../../lib/orders';

export const runtime='nodejs';

function verifyStripeSignature(payload:string,header:string,secret:string){
  const parts=header.split(',').map(v=>v.trim());
  const timestamp=parts.find(v=>v.startsWith('t='))?.slice(2);
  const signatures=parts.filter(v=>v.startsWith('v1=')).map(v=>v.slice(3));
  if(!timestamp||!signatures.length)return false;
  const age=Math.abs(Math.floor(Date.now()/1000)-Number(timestamp));
  if(!Number.isFinite(age)||age>300)return false;
  const expected=createHmac('sha256',secret).update(`${timestamp}.${payload}`,'utf8').digest('hex');
  return signatures.some(sig=>{
    try{
      const a=Buffer.from(expected,'hex');
      const b=Buffer.from(sig,'hex');
      return a.length===b.length&&timingSafeEqual(a,b);
    }catch{return false}
  });
}

export async function POST(req:Request){
  const secret=process.env.STRIPE_WEBHOOK_SECRET;
  if(!secret)return NextResponse.json({error:'Stripe webhook is not configured.'},{status:500});
  const signature=req.headers.get('stripe-signature')||'';
  const payload=await req.text();
  if(!verifyStripeSignature(payload,signature,secret))return NextResponse.json({error:'Invalid Stripe signature.'},{status:400});
  let event:any;
  try{event=JSON.parse(payload)}catch{return NextResponse.json({error:'Invalid JSON.'},{status:400})}
  try{
    if(event.type==='checkout.session.completed'||event.type==='checkout.session.async_payment_succeeded'){
      const session=event.data?.object;
      if(session?.payment_status==='paid')await markOrderPaidFromSession(session);
    }
    return NextResponse.json({received:true});
  }catch(e){
    console.error('Stripe webhook processing failed',e);
    return NextResponse.json({error:e instanceof Error?e.message:'Webhook processing failed.'},{status:500});
  }
}
