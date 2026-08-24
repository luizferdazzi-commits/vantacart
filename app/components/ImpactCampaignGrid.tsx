'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { trackEvent } from './Analytics';

type Lang='pt'|'en';
type Campaign={id:string;name:string;advertiser:string;description?:string;url?:string;status?:string;trackingLink?:string;allowsDeeplinking?:string;type?:string};

function slugify(value:string){
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

function landingUrl(c:Campaign,lang:Lang){
  const n=`${c.name} ${c.advertiser}`.toLowerCase();
  if(n.includes('creao'))return `/offers/creao?lang=${lang}`;
  if(n.includes('riibase'))return `/offers/riibase?lang=${lang}`;
  if(n.includes('protoarc'))return `/offers/protoarc?lang=${lang}`;
  if(n.includes('pixverse'))return `/offers/pixverse?lang=${lang}`;
  return `/offers/${slugify(c.name)}?lang=${lang}`;
}

function shortDescription(c:Campaign,lang:Lang){
  if(c.description)return c.description;
  return lang==='pt'?'Oferta ativa de parceiro aprovado na Impact.':'Active offer from an approved Impact partner.';
}

export default function ImpactCampaignGrid({lang}:{lang:Lang}){
  const[campaigns,setCampaigns]=useState<Campaign[]>([]);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    let cancelled=false;
    fetch('/api/impact/campaigns',{cache:'no-store'})
      .then(r=>r.json())
      .then(data=>{
        if(!cancelled&&data?.ok&&Array.isArray(data.campaigns)){
          setCampaigns(data.campaigns.filter((c:Campaign)=>c.status==='Active'&&c.trackingLink));
        }
      })
      .finally(()=>{if(!cancelled)setLoading(false)});
    return()=>{cancelled=true};
  },[]);

  const active=useMemo(()=>[...campaigns].sort((a,b)=>a.name.localeCompare(b.name)),[campaigns]);

  if(loading)return <div style={{padding:24}}>{lang==='pt'?'Sincronizando parceiros ativos...':'Syncing active partners...'}</div>;
  if(!active.length)return <div style={{padding:24}}>{lang==='pt'?'Novas ofertas estão sendo sincronizadas.':'New offers are being synchronized.'}</div>;

  return <>
    <div style={{display:'flex',alignItems:'center',gap:8,margin:'0 0 16px',fontSize:13,color:'#166534',fontWeight:800}}>
      <CheckCircle2 size={17}/>{lang==='pt'?`${active.length} parceiros Impact ativos e sincronizados`:`${active.length} active Impact partners synchronized`}
    </div>
    <div className="cleanProducts">
      {active.map((campaign,index)=>{
        const href=landingUrl(campaign,lang);
        return <a key={campaign.id} className="cleanProduct" href={href}
          onClick={()=>trackEvent('select_content',{content_type:'affiliate_offer',content_id:campaign.id,partner:campaign.advertiser,offer_name:campaign.name,language:lang,destination:'landing_page'})}
          style={{textDecoration:'none',color:'inherit',overflow:'hidden'}}>
          <div className="cleanProductImage" style={{minHeight:205,position:'relative',overflow:'hidden',background:`linear-gradient(135deg,hsl(${(index*47)%360} 35% 17%),hsl(${(index*47+28)%360} 55% 30%))`,padding:18,color:'#fff'}}>
            <span className="cleanBadge">{campaign.type||'Partner'}</span>
            <div style={{height:169,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
              <div style={{display:'flex',justifyContent:'flex-end'}}><div style={{width:68,height:68,borderRadius:18,display:'grid',placeItems:'center',background:'rgba(255,255,255,.14)',border:'1px solid rgba(255,255,255,.22)'}}><Sparkles size={36}/></div></div>
              <div><div style={{fontSize:11,fontWeight:900,letterSpacing:1.8,opacity:.75}}>VANTACART • IMPACT</div><strong style={{display:'block',fontSize:25,lineHeight:1.05,marginTop:7}}>{campaign.name}</strong></div>
            </div>
          </div>
          <div className="cleanProductBody">
            <div style={{fontSize:12,fontWeight:800,color:'#166534',marginBottom:6}}>{campaign.advertiser}</div>
            <div className="cleanProductTitle">{campaign.name}</div>
            <p style={{fontSize:13,lineHeight:1.5,color:'#64748b',margin:'8px 0 12px',display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{shortDescription(campaign,lang)}</p>
            <div className="deliveryHint"><CheckCircle2 size={13}/>{lang==='pt'?'Programa afiliado ativo':'Active affiliate program'}</div>
            <div style={{display:'flex',alignItems:'center',gap:7,marginTop:14,fontWeight:800,color:'#166534'}}>{lang==='pt'?'Ver detalhes e oferta':'View details and offer'} <ArrowRight size={15}/></div>
          </div>
        </a>;
      })}
    </div>
    <div style={{display:'flex',alignItems:'center',gap:6,marginTop:14,fontSize:11,color:'#64748b'}}><ExternalLink size={12}/>{lang==='pt'?'A compra ou contratação é finalizada no site oficial do parceiro.':'Purchase or signup is completed on the partner’s official website.'}</div>
  </>;
}
