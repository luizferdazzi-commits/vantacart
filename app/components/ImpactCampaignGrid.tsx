'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, ExternalLink, Search, SlidersHorizontal } from 'lucide-react';
import { trackEvent } from './Analytics';

type Lang='pt'|'en';
type Campaign={id:string;name:string;advertiser:string;description?:string;url?:string;status?:string;trackingLink?:string;allowsDeeplinking?:string;type?:string};
type Category='all'|'ai'|'business'|'home'|'creators'|'productivity'|'technology'|'gaming';

const CACHE_KEY='vantacart_active_impact_campaigns_v2';
const editorialRank=['gearup for mobile','gearup','movavi','pixverse','creao','riibase','protoarc','vidu','gamsgo','appy pie','lorka','wizstar'];

function slugify(value:string){return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function landingUrl(c:Campaign,lang:Lang){const n=`${c.name} ${c.advertiser}`.toLowerCase();if(n.includes('creao'))return `/offers/creao?lang=${lang}`;if(n.includes('riibase'))return `/offers/riibase?lang=${lang}`;if(n.includes('protoarc'))return `/offers/protoarc?lang=${lang}`;if(n.includes('pixverse'))return `/offers/pixverse?lang=${lang}`;return `/offers/${slugify(c.name)}?lang=${lang}`;}
function shortDescription(c:Campaign,lang:Lang){if(c.description)return c.description;return lang==='pt'?'Oferta ativa de parceiro aprovado na Impact.':'Active offer from an approved Impact partner.';}
function categoryOf(c:Campaign):Category{
  const s=`${c.name} ${c.advertiser} ${c.description||''}`.toLowerCase();
  if(/gearup|game booster|gaming|games|ping|packet loss|lag/.test(s))return 'gaming';
  if(/protoarc|keyboard|mouse|ergonomic|workspace|desk|home office/.test(s))return 'home';
  if(/pixverse|vidu|wizstar|movavi|video|image|creator|creative|design|film|audio|multimedia/.test(s))return 'creators';
  if(/riibase|crm|sales|business|marketing|customer|accio|supplier|ecommerce|e-commerce/.test(s))return 'business';
  if(/gamsgo|productivity|workflow|organize|subscription/.test(s))return 'productivity';
  if(/creao|lorka|verdent|medo|appy pie|presentation intelligence|deepvinci|artificial intelligence|\bai\b|\bai |automation|agent|app builder/.test(s))return 'ai';
  return 'technology';
}
function score(c:Campaign){const n=`${c.name} ${c.advertiser}`.toLowerCase();const idx=editorialRank.findIndex(k=>n.includes(k));return idx<0?0:100-idx*7;}
function categoryLabel(cat:Category,lang:Lang){const pt:{[K in Category]:string}={all:'Todas',ai:'IA & Software',business:'Negócios',home:'Home office',creators:'Criadores',productivity:'Produtividade',technology:'Tecnologia',gaming:'Gaming'};const en:{[K in Category]:string}={all:'All',ai:'AI & Software',business:'Business',home:'Home office',creators:'Creators',productivity:'Productivity',technology:'Technology',gaming:'Gaming'};return (lang==='pt'?pt:en)[cat];}

function OfferCard({campaign,index,lang}:{campaign:Campaign;index:number;lang:Lang}){
  const ref=useRef<HTMLAnchorElement|null>(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;let sent=false;
    const obs=new IntersectionObserver(entries=>{if(!sent&&entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.45)){sent=true;trackEvent('view_offer',{offer_id:campaign.id,offer_name:campaign.name,partner:campaign.advertiser,category:categoryOf(campaign),language:lang,rank_position:index+1});obs.disconnect();}},{threshold:[.45]});
    obs.observe(el);return()=>obs.disconnect();
  },[campaign,index,lang]);
  const href=landingUrl(campaign,lang);const featured=score(campaign)>=65;
  return <a ref={ref} key={campaign.id} className="cleanProduct" href={href}
    onClick={()=>{trackEvent('select_offer',{offer_id:campaign.id,partner:campaign.advertiser,offer_name:campaign.name,category:categoryOf(campaign),language:lang,rank_position:index+1,destination:'landing_page'});trackEvent('select_content',{content_type:'affiliate_offer',content_id:campaign.id,partner:campaign.advertiser,offer_name:campaign.name,language:lang,destination:'landing_page'});}}
    style={{textDecoration:'none',color:'inherit',overflow:'hidden'}}>
    <div className="cleanProductImage" style={{minHeight:190,position:'relative',overflow:'hidden',background:`linear-gradient(135deg,hsl(${(index*47)%360} 35% 17%),hsl(${(index*47+28)%360} 55% 30%))`,padding:18,color:'#fff'}}>
      <span className="cleanBadge">{featured?(lang==='pt'?'Destaque':'Featured'):(campaign.type||'Partner')}</span>
      <div style={{height:154,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}><span style={{fontSize:10,fontWeight:900,letterSpacing:1.3,opacity:.72}}>{categoryLabel(categoryOf(campaign),lang).toUpperCase()}</span><div style={{width:58,height:58,borderRadius:16,display:'grid',placeItems:'center',background:'rgba(255,255,255,.14)',border:'1px solid rgba(255,255,255,.22)'}}><Sparkles size={30}/></div></div>
        <div><div style={{fontSize:10,fontWeight:900,letterSpacing:1.5,opacity:.7}}>VANTACART • IMPACT</div><strong style={{display:'block',fontSize:23,lineHeight:1.05,marginTop:6}}>{campaign.name}</strong></div>
      </div>
    </div>
    <div className="cleanProductBody">
      <div style={{fontSize:11,fontWeight:800,color:'#166534',marginBottom:5}}>{campaign.advertiser}</div>
      <div className="cleanProductTitle">{campaign.name}</div>
      <p style={{fontSize:12,lineHeight:1.45,color:'#64748b',margin:'7px 0 10px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{shortDescription(campaign,lang)}</p>
      <div className="deliveryHint"><CheckCircle2 size={13}/>{lang==='pt'?'Programa afiliado ativo':'Active affiliate program'}</div>
      <div style={{display:'flex',alignItems:'center',gap:7,marginTop:11,fontWeight:800,color:'#166534',fontSize:12}}>{lang==='pt'?'Ver oferta':'View offer'} <ArrowRight size={14}/></div>
    </div>
  </a>;
}

export default function ImpactCampaignGrid({lang,initialQuery='',initialCategory='all'}:{lang:Lang;initialQuery?:string;initialCategory?:string}){
  const[campaigns,setCampaigns]=useState<Campaign[]>([]);const[loading,setLoading]=useState(true);const[query,setQuery]=useState(initialQuery);const[category,setCategory]=useState<Category>((['all','ai','business','home','creators','productivity','technology','gaming'].includes(initialCategory)?initialCategory:'all') as Category);

  useEffect(()=>{
    let cancelled=false;
    try{const cached=localStorage.getItem(CACHE_KEY);if(cached){const parsed=JSON.parse(cached);if(Array.isArray(parsed)&&parsed.length)setCampaigns(parsed);}}catch{}
    fetch('/api/impact/campaigns',{cache:'no-store'}).then(r=>r.json()).then(data=>{if(!cancelled&&data?.ok&&Array.isArray(data.campaigns)){const active=data.campaigns.filter((c:Campaign)=>c.status==='Active'&&c.trackingLink);setCampaigns(active);try{localStorage.setItem(CACHE_KEY,JSON.stringify(active));}catch{}}}).catch(()=>{}).finally(()=>{if(!cancelled)setLoading(false)});return()=>{cancelled=true};
  },[]);

  const ranked=useMemo(()=>[...campaigns].sort((a,b)=>score(b)-score(a)||a.name.localeCompare(b.name)),[campaigns]);
  const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return ranked.filter(c=>{const cat=categoryOf(c);const matchesCat=category==='all'||cat===category;const hay=`${c.name} ${c.advertiser} ${c.description||''}`.toLowerCase();return matchesCat&&(!q||hay.includes(q));});},[ranked,query,category]);
  const setFilter=(cat:Category)=>{setCategory(cat);trackEvent('filter_offers',{category:cat,language:lang});};

  return <>
    <div style={{display:'grid',gridTemplateColumns:'minmax(220px,1fr) auto',gap:10,margin:'0 0 14px'}}>
      <label style={{height:42,display:'flex',alignItems:'center',gap:9,background:'#fff',border:'1px solid #dce4de',borderRadius:8,padding:'0 12px'}}><Search size={16} color="#64748b"/><input value={query} onChange={e=>setQuery(e.target.value)} onBlur={()=>query&&trackEvent('search_offers',{search_term:query,language:lang,results:filtered.length})} placeholder={lang==='pt'?'Buscar dentro das ofertas...':'Search within offers...'} style={{border:0,outline:0,width:'100%',fontSize:13,background:'transparent'}}/></label>
      <div style={{display:'flex',alignItems:'center',gap:7,color:'#64748b',fontSize:11,padding:'0 4px'}}><SlidersHorizontal size={15}/>{filtered.length} {lang==='pt'?'resultados':'results'}</div>
    </div>
    <div style={{display:'flex',gap:7,overflowX:'auto',paddingBottom:10,marginBottom:5}}>{(['all','ai','business','gaming','home','creators','productivity','technology'] as Category[]).map(cat=><button key={cat} onClick={()=>setFilter(cat)} style={{whiteSpace:'nowrap',border:`1px solid ${category===cat?'#159447':'#dfe6e1'}`,background:category===cat?'#eaf8ef':'#fff',color:category===cat?'#116b37':'#334155',borderRadius:999,padding:'8px 11px',fontSize:11,fontWeight:800,cursor:'pointer'}}>{categoryLabel(cat,lang)}</button>)}</div>

    {campaigns.length>0&&<div style={{display:'flex',alignItems:'center',gap:8,margin:'0 0 14px',fontSize:12,color:'#166534',fontWeight:800}}><CheckCircle2 size={16}/>{lang==='pt'?`${campaigns.length} parceiros Impact ativos • todos com página própria`:`${campaigns.length} active Impact partners • each with its own page`}</div>}

    {loading&&!campaigns.length?<div className="cleanProducts">{Array.from({length:6}).map((_,i)=><div key={i} className="cleanProduct" style={{minHeight:330,background:'#fff'}}><div style={{height:190,background:'linear-gradient(90deg,#eef2ef,#f8faf8,#eef2ef)'}}/><div style={{padding:12}}><div style={{height:10,width:'45%',background:'#e5e9e6',borderRadius:6,marginBottom:10}}/><div style={{height:14,width:'80%',background:'#e5e9e6',borderRadius:6,marginBottom:8}}/><div style={{height:10,width:'95%',background:'#eef1ef',borderRadius:6}}/></div></div>)}</div>:
    filtered.length?<div className="cleanProducts">{filtered.map((campaign,index)=><OfferCard key={campaign.id} campaign={campaign} index={index} lang={lang}/>)}</div>:
    <div style={{padding:'30px 18px',background:'#fff',border:'1px solid #e2e7e3',borderRadius:8,textAlign:'center',color:'#64748b',fontSize:13}}>{lang==='pt'?'Nenhuma oferta encontrada. Tente outro termo ou categoria.':'No offers found. Try another search or category.'}</div>}

    <div style={{display:'flex',alignItems:'center',gap:6,marginTop:14,fontSize:11,color:'#64748b'}}><ExternalLink size={12}/>{lang==='pt'?'A compra ou contratação é finalizada no site oficial do parceiro.':'Purchase or signup is completed on the partner’s official website.'}</div>
  </>;
}