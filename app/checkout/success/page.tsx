import Link from 'next/link';
import {CheckCircle2,ShieldCheck,TriangleAlert} from 'lucide-react';
import {getOrderBySession,markOrderPaidFromSession} from '../../../lib/orders';
import ClearCart from './ClearCart';

async function retrieveStripeSession(sessionId:string){
  const secret=process.env.STRIPE_SECRET_KEY;
  if(!secret) throw new Error('Stripe is not configured');
  const r=await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,{
    headers:{Authorization:`Bearer ${secret}`},
    cache:'no-store'
  });
  const data=await r.json();
  if(!r.ok) throw new Error(data?.error?.message||'Unable to verify payment');
  return data;
}

export default async function CheckoutSuccess({searchParams}:{searchParams:Promise<{session_id?:string}>}){
  const params=await searchParams;
  const sessionId=String(params?.session_id||'');
  let order:any=null;
  let verified=false;
  let message='We could not verify this payment yet.';
  if(sessionId){
    try{
      const session=await retrieveStripeSession(sessionId);
      if(session?.payment_status==='paid'){
        order=await markOrderPaidFromSession(session);
        if(!order) order=await getOrderBySession(sessionId);
        verified=true;
        message='Your payment was confirmed securely. The order is now queued for fulfillment review.';
      }else{
        order=await getOrderBySession(sessionId);
        message='Payment is still processing. Please keep your order reference.';
      }
    }catch{
      order=await getOrderBySession(sessionId).catch(()=>null);
    }
  }
  return <main className="checkoutPage"><header className="checkoutHeader"><Link href="/" className="checkoutLogo">Vanta<span>Cart</span></Link><div className="checkoutSecure"><ShieldCheck size={17}/> Secure payment</div></header><div className="checkoutShell"><div className="checkoutCard" style={{maxWidth:720,margin:'70px auto',textAlign:'center',padding:48}}>{verified?<><ClearCart/><CheckCircle2 size={58} style={{margin:'0 auto 20px'}}/><h1>Payment confirmed</h1></>:<><TriangleAlert size={54} style={{margin:'0 auto 20px'}}/><h1>Payment status</h1></>}<p>{message}</p>{order?.public_id&&<p style={{fontWeight:700,marginTop:18}}>Order {order.public_id}</p>}{order?.customer_email&&<p style={{marginTop:6}}>Confirmation email: {order.customer_email}</p>}<Link href="/" className="marketBtnPrimary" style={{display:'inline-block',marginTop:22,padding:'14px 24px'}}>Return to VantaCart</Link></div></div></main>}
