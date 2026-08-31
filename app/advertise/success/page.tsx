import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default async function VendorSuccess({searchParams}:{searchParams:Promise<{plan?:string}>}){
  const sp=await searchParams;
  const plan=(sp?.plan||'vendor plan').replace(/-/g,' ');
  return <main style={{minHeight:'100vh',background:'#f6f7f6',display:'grid',placeItems:'center',padding:'24px',color:'#0f172a'}}>
    <section style={{maxWidth:680,width:'100%',background:'#fff',border:'1px solid #dfe5e1',borderRadius:18,padding:'38px',boxShadow:'0 14px 40px rgba(15,23,42,.07)'}}>
      <CheckCircle2 size={42} color="#159447"/>
      <h1 style={{fontSize:34,letterSpacing:'-1.2px',margin:'18px 0 10px'}}>Payment received.</h1>
      <p style={{fontSize:15,lineHeight:1.7,color:'#64748b'}}>Your VantaCart <b style={{color:'#0f172a'}}>{plan}</b> purchase has been registered. Our team will review the brand, website and placement fit before publication. Sponsored visibility is activated only after this quality review.</p>
      <p style={{fontSize:13,lineHeight:1.7,color:'#64748b'}}>Keep the Stripe receipt for your records. We may contact the billing email if we need additional assets, preferred category, campaign dates or brand information.</p>
      <Link href="/" style={{display:'inline-flex',marginTop:12,padding:'12px 16px',borderRadius:9,background:'#159447',color:'#fff',fontWeight:900,textDecoration:'none',fontSize:13}}>Return to VantaCart</Link>
    </section>
  </main>
}
