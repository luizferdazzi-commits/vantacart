'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, ExternalLink, Languages, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { trackEvent } from './Analytics';

type Lang='pt'|'en';
export type GenericImpactCampaign={id:string;name:string;advertiser:string;description?:string;url?:string;status?:string;trackingLink?:string;type?:string;allowsDeeplinking?:string};

export default function GenericImpactOfferLanding({campaign,lang,slug}:{campaign:GenericImpactCampaign;lang:Lang;slug:string}){
  const pt=lang==='pt';
  const cta=pt?'Acessar oferta oficial':'Open official offer';
  const description=campaign.description||(pt?'Conheça esta solução de um parceiro aprovado e ativo no ecossistema VantaCart.':'Explore this solution from an approved, active VantaCart partner.');
  const go=()=>trackEvent('affiliate_click',{partner:campaign.advertiser,offer_name:campaign.name,campaign_id:campaign.id,language:lang,destination:'impact_tracking_link'});

  return <main style={{minHeight:'100vh',background:'#f4f7f4',color:'#0b1711',fontFamily:'Arial,Helvetica,sans-serif'}}>
    <header style={{position:'sticky',top:0,zIndex:20,background:'rgba(244,247,244,.92)',backdropFilter:'blur(16px)',borderBottom:'1px solid #dde6df'}}>
      <div style={{maxWidth:1180,margin:'auto',padding:'16px 22px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:18}}>
        <Link href={`/?lang=${lang}`} style={{fontSize:26,fontWeight:900,color:'#07130d',textDecoration:'none',letterSpacing:'-1.4px'}}>Vanta<span style={{color:'#23d56f'}}>Cart</span></Link>
        <Link href={`/offers/${slug}?lang=${pt?'en':'pt'}`} style={{display:'flex',gap:7,alignItems:'center',padding:'10px 14px',border:'1px solid #d4dfd7',borderRadius:999,textDecoration:'none',color:'#183326',background:'#fff',fontWeight:800}}><Languages size={16}/>{pt?'EN':'PT'}</Link>
      </div>
    </header>

    <section style={{maxWidth:1180,margin:'30px auto 0',padding:'0 22px'}}>
      <div style={{position:'relative',overflow:'hidden',borderRadius:34,background:'radial-gradient(circle at 86% 15%,rgba(78,242,143,.28),transparent 24%),linear-gradient(125deg,#07130d,#10331f 68%,#185237)',color:'#fff',padding:'70px 64px',boxShadow:'0 32px 85px rgba(7,30,17,.18)'}}>
        <div style={{maxWidth:760,position:'relative',zIndex:2}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,border:'1px solid rgba(115,255,166,.28)',background:'rgba(72,236,129,.08)',padding:'9px 13px',borderRadius:999,color:'#a9f6c2',fontSize:12,fontWeight:900,letterSpacing:.7}}><CheckCircle2 size={15}/>{pt?'PARCEIRO IMPACT ATIVO':'ACTIVE IMPACT PARTNER'}</div>
          <p style={{margin:'18px 0 8px',color:'#8eeeb1',fontWeight:900,fontSize:13,letterSpacing:1.2}}>{campaign.advertiser}</p>
          <h1 style={{fontSize:'clamp(48px,7vw,82px)',lineHeight:.96,letterSpacing:'-4px',margin:'0 0 24px'}}>{campaign.name}</h1>
          <p style={{fontSize:18,lineHeight:1.65,color:'#c7d9ce',maxWidth:720}}>{description}</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:30}}>
            <a href={campaign.trackingLink} target="_blank" rel="sponsored noopener noreferrer" onClick={go} style={{display:'inline-flex',alignItems:'center',gap:9,padding:'15px 19px',borderRadius:13,background:'#54ed91',color:'#06140c',fontWeight:900,textDecoration:'none'}}>{cta}<ArrowRight size={19}/></a>
            {campaign.url&&<a href={campaign.url} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'15px 19px',borderRadius:13,border:'1px solid rgba(255,255,255,.18)',color:'#fff',textDecoration:'none',fontWeight:800}}>{pt?'Site do parceiro':'Partner website'}<ExternalLink size={16}/></a>}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginTop:25,color:'#a9beb2',fontSize:12}}><ShieldCheck size={18}/><span>{pt?'Link rastreado da Impact • sem custo adicional para você':'Impact tracked link • no extra cost to you'}</span></div>
        </div>
      </div>
    </section>

    <section style={{maxWidth:1180,margin:'24px auto',padding:'0 22px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}>
      {[
        [CheckCircle2,pt?'Contrato verificado':'Verified contract',pt?'A oferta só aparece quando o programa está Active na Impact.':'The offer is only shown while the program is Active on Impact.'],
        [ShieldCheck,pt?'Destino oficial':'Official destination',pt?'Você continua para o ambiente do próprio parceiro para contratar ou comprar.':'You continue to the partner’s own website to purchase or sign up.'],
        [Zap,pt?'Acesso direto':'Direct access',pt?'Sem checkout intermediário da VantaCart e sem taxa adicional de indicação.':'No VantaCart checkout in the middle and no extra referral fee.'],
        [Sparkles,pt?'Curadoria VantaCart':'VantaCart curation',pt?'Parceiros ativos são sincronizados para facilitar descoberta e comparação.':'Active partners are synchronized to make discovery and comparison easier.']
      ].map(([Icon,title,text]:any)=><article key={title} style={{background:'#fff',border:'1px solid #dfe8e2',borderRadius:22,padding:24,boxShadow:'0 12px 30px rgba(8,35,19,.04)'}}><Icon size={24} color="#18a957"/><h2 style={{fontSize:18,margin:'18px 0 8px'}}>{title}</h2><p style={{fontSize:13,lineHeight:1.55,color:'#6b7e73',margin:0}}>{text}</p></article>)}
    </section>

    <section style={{maxWidth:1180,margin:'26px auto 70px',padding:'0 22px'}}>
      <div style={{borderRadius:28,background:'#0b1c13',color:'#fff',padding:'40px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:26,flexWrap:'wrap'}}>
        <div><div style={{color:'#74efa2',fontSize:12,fontWeight:900,letterSpacing:1}}>{pt?'PRONTO PARA CONHECER?':'READY TO EXPLORE?'}</div><h2 style={{fontSize:34,letterSpacing:'-1.7px',margin:'8px 0 6px'}}>{campaign.name}</h2><p style={{color:'#a9beb2',margin:0}}>{pt?'Veja preços, recursos e condições diretamente no parceiro oficial.':'See pricing, features and terms directly on the official partner website.'}</p></div>
        <a href={campaign.trackingLink} target="_blank" rel="sponsored noopener noreferrer" onClick={go} style={{display:'inline-flex',alignItems:'center',gap:9,padding:'15px 19px',borderRadius:13,background:'#54ed91',color:'#06140c',fontWeight:900,textDecoration:'none'}}>{cta}<ArrowRight size={19}/></a>
      </div>
      <p style={{fontSize:11,color:'#718178',lineHeight:1.6,marginTop:18}}>{pt?'Divulgação: alguns links da VantaCart são links de afiliados. Podemos receber comissão quando você contrata ou compra pelo link, sem custo adicional para você.':'Disclosure: some VantaCart links are affiliate links. We may earn a commission when you purchase or sign up through them, at no extra cost to you.'}</p>
    </section>
  </main>;
}
