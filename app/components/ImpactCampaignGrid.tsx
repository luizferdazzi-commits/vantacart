'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ExternalLink, Search, SlidersHorizontal } from 'lucide-react';
import { trackEvent } from './Analytics';

type Lang='pt'|'en';
type PricingType='fixed'|'from'|'range'|'plans'|'unknown';
type Campaign={id:string;name:string;advertiser:string;description?:string;url?:string;status?:string;trackingLink?:string;allowsDeeplinking?:string;type?:string;network?:'impact'|'hotmart';category?:string;price?:number;priceFrom?:number;priceMax?:number;currency?:string;pricingType?:PricingType;lastPriceCheck?:string;priceNote?:string};
type Category='all'|'ai'|'business'|'home'|'creators'|'productivity'|'technology'|'gaming';

const CACHE_KEY='vantacart_active_affiliate_campaigns_v5';
const editorialRank=['leadlovers','base44','domoai','wizstar','gearup for mobile','gearup','movavi','pixverse','creao','riibase','protoarc','vidu','gamsgo','appy pie','lorka'];
const brandDomains:[RegExp,string][]=[
  [/leadlovers/i,'leadlovers.com'],[/base44/i,'base44.com'],[/domoai/i,'domoai.app'],[/protoarc/i,'protoarc.com'],[/movavi/i,'movavi.com'],[/pixverse/i,'pixverse.ai'],
  [/gearup/i,'gearupbooster.com'],[/creao/i,'creao.ai'],[/riibase/i,'riibase.com'],[/vidu/i,'vidu.com'],[/gamsgo/i,'gamsgo.com'],
  [/appy pie/i,'appypie.com'],[/lorka/i,'lorka.com'],[/wizstar/i,'wizstar.ai'],[/asimov/i,'asimov.academy']
];
function slugify(value:string){return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function landingUrl(c:Campaign,lang:Lang){return `/offers/${slugify(c.name)}?lang=${lang}`;}
function cleanText(value:string){return value.replace(/\s+/g,' ').trim();}
function conciseDescription(c:Campaign,lang:Lang){
  const fallback=lang==='pt'?'Oferta selecionada de parceiro verificado.':'Selected offer from a verified partner.';
  if(!c.description)return fallback;
  const text=cleanText(c.description);
  const firstSentence=text.match(/^(.{20,220}?[.!?])(?:\s|$)/)?.[1]||text;
  if(firstSentence.length<=145)return firstSentence;
  const cut=firstSentence.slice(0,145);
  const lastSpace=cut.lastIndexOf(' ');
  return `${cut.slice(0,lastSpace>90?lastSpace:145).replace(/[,:;\-\s]+$/,'')}…`;
}
function brandDomain(c:Campaign){
  // Future-proof: always prefer the official campaign URL supplied by the affiliate network.
  // This prevents new partners from falling back to a plain initial just because they are not
  // in our editorial brand map yet.
  if(c.url){
    try{
      const host=new URL(c.url).hostname.replace(/^www\./,'').toLowerCase();
      if(host&&!/(^|\.)((sjv|pxf)\.io|impact\.com)$/.test(host))return host;
    }catch{}
  }
  const text=`${c.name} ${c.advertiser}`;
  return brandDomains.find(([rx])=>rx.test(text))?.[1];
}
function brandLogo(c:Campaign){
  const domain=brandDomain(c);
  // Google favicon service is intentionally used as a resilient logo resolver for both current
  // and future partners; no manual whitelist is required when Impact provides the official URL.
  return domain?`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`:null;
}
function showAdvertiser(c:Campaign){
  const name=cleanText(c.name).toLowerCase();
  const advertiser=cleanText(c.advertiser||'').toLowerCase();
  if(!advertiser)return false;
  const brand=advertiser.replace(/\b(limited|ltd|llc|inc|pte|private|software|portal|technologies|technology|company|co)\b/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  return brand.length>2&&!name.includes(brand);
}
function quickBenefit(c:Campaign,lang:Lang){const s=`${c.name} ${c.advertiser} ${c.description||''}`.toLowerCase();if(/leadlovers/.test(s))return lang==='pt'?'Automação de marketing e vendas':'Marketing & sales automation';if(/base44/.test(s))return lang==='pt'?'Crie aplicativos com IA em minutos':'Build AI-powered apps in minutes';if(/domoai/.test(s))return lang==='pt'?'Criação visual e vídeos com IA':'AI-powered visual and video creation';if(/wizstar/.test(s))return lang==='pt'?'Vídeos com IA para conteúdo e vendas':'AI video for content and commerce';if(/protoarc/.test(s))return lang==='pt'?'Ergonomia para trabalho e home office':'Ergonomics for work & home office';if(/movavi/.test(s))return lang==='pt'?'Edição de vídeo simples e profissional':'Simple, professional video editing';if(/pixverse|vidu/.test(s))return lang==='pt'?'Criação de vídeos com IA':'AI video creation';if(/gearup for mobile/.test(s))return lang==='pt'?'Menos lag em jogos no celular':'Less lag for mobile gaming';if(/gearup/.test(s))return lang==='pt'?'Menos lag e melhor experiência em jogos':'Less lag, smoother gaming';if(/creao|appy pie/.test(s))return lang==='pt'?'Crie e automatize com IA':'Build and automate with AI';if(/riibase|crm/.test(s))return lang==='pt'?'Organize clientes e acelere vendas':'Organize customers and accelerate sales';if(/gamsgo/.test(s))return lang==='pt'?'Assinaturas digitais com economia':'Save on digital subscriptions';if(/asimov/.test(s))return lang==='pt'?'Python, dados e automação em projetos reais':'Python, data and automation with real projects';return lang==='pt'?'Parceiro selecionado pelo VantaCart':'VantaCart selected partner';}
function categoryOf(c:Campaign):Category{const explicit=(c.category||'').toLowerCase();if(['ai','business','home','creators','productivity','technology','gaming'].includes(explicit))return explicit as Category;const s=`${c.name} ${c.advertiser} ${c.description||''}`.toLowerCase();if(/gearup|game booster|gaming|games|ping|packet loss|lag/.test(s))return 'gaming';if(/protoarc|keyboard|mouse|ergonomic|workspace|desk|home office/.test(s))return 'home';if(/pixverse|vidu|wizstar|movavi|domoai|video|image|creator|creative|design|film|audio|multimedia/.test(s))return 'creators';if(/leadlovers|riibase|crm|sales|business|marketing|customer|accio|supplier|ecommerce|e-commerce/.test(s))return 'business';if(/gamsgo|productivity|workflow|organize|subscription/.test(s))return 'productivity';if(/base44|creao|lorka|verdent|medo|appy pie|presentation intelligence|deepvinci|artificial intelligence|\bai\b|automation|agent|app builder/.test(s))return 'ai';return 'technology';}
function score(c:Campaign){const n=`${c.name} ${c.advertiser}`.toLowerCase();const idx=editorialRank.findIndex(k=>n.includes(k));return idx<0?0:100-idx*7;}
function categoryLabel(cat:Category,lang:Lang){const pt:{[K in Category]:string}={all:'Todas',ai:'IA & Software',business:'Negócios',home:'Home office',creators:'Criadores',productivity:'Produtividade',technology:'Tecnologia',gaming:'Gaming'};const en:{[K in Category]:string}={all:'All',ai:'AI & Software',business:'Business',home:'Home office',creators:'Creators',productivity:'Productivity',technology:'Technology',gaming:'Gaming'};return (lang==='pt'?pt:en)[cat];}
function money(value:number,currency='BRL',lang:Lang='pt'){try{return new Intl.NumberFormat(lang==='pt'?'pt-BR':'en-US',{style:'currency',currency}).format(value);}catch{return `${currency} ${value.toFixed(2)}`;}}
function pricingLabel(c:Campaign,lang:Lang){const currency=c.currency||'BRL';if(c.pricingType==='fixed'&&typeof c.price==='number')return money(c.price,currency,lang);if(c.pricingType==='from'&&typeof c.priceFrom==='number')return `${lang==='pt'?'A partir de':'From'} ${money(c.priceFrom,currency,lang)}`;if(c.pricingType==='range'&&typeof c.priceFrom==='number'&&typeof c.priceMax==='number')return `${money(c.priceFrom,currency,lang)} – ${money(c.priceMax,currency,lang)}`;if(c.pricingType==='plans')return lang==='pt'?'Planos disponíveis':'Plans available';return lang==='pt'?'Ver preço oficial':'See official pricing';}
function OfferCard({campaign,index,lang}:{campaign:Campaign;index:number;lang:Lang}){
  const ref=useRef<HTMLAnchorElement|null>(null);
  useEffect(()=>{const el=ref.current;if(!el)return;let sent=false;const obs=new IntersectionObserver(entries=>{if(!sent&&entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.45)){sent=true;trackEvent('view_offer',{offer_id:campaign.id,offer_name:campaign.name,partner:campaign.advertiser,network:campaign.network||'impact',category:categoryOf(campaign),language:lang,rank_position:index+1});obs.disconnect();}},{threshold:[.45]});obs.observe(el);return()=>obs.disconnect();},[campaign,index,lang]);
  const href=landingUrl(campaign,lang);const featured=score(campaign)>=65;const logo=brandLogo(campaign);const advertiserVisible=showAdvertiser(campaign);
  return <a ref={ref} className="cleanProduct" href={href} onClick={()=>trackEvent('select_offer',{offer_id:campaign.id,partner:campaign.advertiser,offer_name:campaign.name,network:campaign.network||'impact',language:lang,destination:'landing_page'})} style={{textDecoration:'none',color:'inherit',overflow:'hidden'}}>
    <div className="cleanProductImage" style={{minHeight:190,position:'relative',overflow:'hidden',background:'#f8faf9',padding:18,color:'#111827',borderBottom:'1px solid #e7ece8'}}>
      <div style={{height:154,width:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
        <div style={{display:'flex',justifyContent:'space-between',gap:14,alignItems:'flex-start'}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',minWidth:0,paddingRight:4}}>
            <span style={{fontSize:10,fontWeight:900,letterSpacing:1.3,color:'#64748b'}}>{categoryLabel(categoryOf(campaign),lang).toUpperCase()}</span>
            <span className="cleanBadge" style={{position:'static',inset:'auto',transform:'none',marginTop:8,maxWidth:'100%',whiteSpace:'nowrap'}}>{featured?(lang==='pt'?'Destaque':'Featured'):(campaign.type||'Partner')}</span>
          </div>
          <div style={{width:68,height:68,flex:'0 0 68px',borderRadius:16,display:'grid',placeItems:'center',background:'#fff',border:'1px solid #dfe6e1',boxShadow:'0 5px 18px rgba(15,23,42,.07)'}}>{logo?<img src={logo} alt={`${campaign.advertiser} logo`} style={{width:48,height:48,objectFit:'contain'}}/>:<strong style={{fontSize:25,color:'#159447'}}>{campaign.advertiser.slice(0,1).toUpperCase()}</strong>}</div>
        </div>
        <div><div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:'#159447'}}>VANTACART • {(campaign.network||'impact').toUpperCase()}</div><strong style={{display:'block',fontSize:20,lineHeight:1.12,marginTop:6,overflowWrap:'anywhere'}}>{campaign.name}</strong></div>
      </div>
    </div>
    <div className="cleanProductBody">
      {advertiserVisible&&<div style={{fontSize:10,fontWeight:800,color:'#64748b',marginBottom:7}}>{campaign.advertiser}</div>}
      <div style={{fontSize:11,fontWeight:800,color:'#334155',padding:'8px 9px',background:'#f4f8f5',borderRadius:6}}>✓ {quickBenefit(campaign,lang)}</div>
      <div style={{display:'flex',justifyContent:'space-between',gap:8,alignItems:'center',marginTop:8,padding:'9px 10px',border:'1px solid #e3eae5',borderRadius:8,background:'#fff'}}><span style={{fontSize:10,color:'#64748b',fontWeight:800}}>{lang==='pt'?'PREÇO':'PRICE'}</span><strong style={{fontSize:12,color:'#0f5132',textAlign:'right'}}>{pricingLabel(campaign,lang)}</strong></div>
      <p style={{fontSize:11,lineHeight:1.45,color:'#64748b',margin:'8px 0 10px',minHeight:32}}>{conciseDescription(campaign,lang)}</p>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,marginTop:11}}><span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:10,color:'#64748b',fontWeight:700}}><i style={{width:7,height:7,borderRadius:999,background:'#16a34a',display:'inline-block'}}/>{lang==='pt'?'Ativo':'Active'}</span><span style={{display:'flex',alignItems:'center',gap:7,fontWeight:800,color:'#166534',fontSize:12,textAlign:'right'}}>{lang==='pt'?'Ver oferta e condições':'View offer & details'} <ArrowRight size={14}/></span></div>
    </div>
  </a>;
}
export default function ImpactCampaignGrid({lang,initialQuery='',initialCategory='all'}:{lang:Lang;initialQuery?:string;initialCategory?:string}){
  const[campaigns,setCampaigns]=useState<Campaign[]>([]);const[loading,setLoading]=useState(true);const[query,setQuery]=useState(initialQuery);const[category,setCategory]=useState<Category>((['all','ai','business','home','creators','productivity','technology','gaming'].includes(initialCategory)?initialCategory:'all') as Category);
  useEffect(()=>{
    let cancelled=false;
    let cachedCampaigns:Campaign[]=[];
    try{
      const cached=localStorage.getItem(CACHE_KEY);
      if(cached){
        cachedCampaigns=JSON.parse(cached);
        setCampaigns(cachedCampaigns);
        window.dispatchEvent(new CustomEvent('vantacart:campaign-count',{detail:cachedCampaigns.length}));
      }
    }catch{}
    Promise.allSettled([
      fetch('/api/impact/campaigns',{cache:'no-store'}).then(r=>r.json()),
      fetch('/api/hotmart/offers',{cache:'no-store'}).then(r=>r.json())
    ]).then(results=>{
      if(cancelled)return;
      const impactOk=results[0].status==='fulfilled'&&results[0].value?.ok;
      const hotmartOk=results[1].status==='fulfilled'&&results[1].value?.ok;
      const cachedImpact=cachedCampaigns.filter(c=>c.network==='impact');
      const cachedHotmart=cachedCampaigns.filter(c=>c.network==='hotmart');
      const impact=impactOk
        ? results[0].value.campaigns.filter((c:Campaign)=>c.status==='Active'&&c.trackingLink).map((c:Campaign)=>({...c,network:'impact' as const}))
        : cachedImpact;
      const hotmart=hotmartOk
        ? results[1].value.offers.filter((o:any)=>o.active&&o.hotlink).map((o:any)=>({id:`hotmart-${o.id}`,name:o.name,advertiser:o.producer||o.name,description:o.description,trackingLink:o.hotlink,status:'Active',type:'Hotmart',network:'hotmart' as const,category:o.category,price:o.price,priceFrom:o.priceFrom,priceMax:o.priceMax,currency:o.currency,pricingType:o.pricingType,lastPriceCheck:o.lastPriceCheck,priceNote:o.priceNote}))
        : cachedHotmart;
      const merged=[...impact,...hotmart];
      if(merged.length){
        setCampaigns(merged);
        try{localStorage.setItem(CACHE_KEY,JSON.stringify(merged));}catch{}
        window.dispatchEvent(new CustomEvent('vantacart:campaign-count',{detail:merged.length}));
      }
    }).finally(()=>{if(!cancelled)setLoading(false)});
    return()=>{cancelled=true};
  },[]);
  const ranked=useMemo(()=>[...campaigns].sort((a,b)=>score(b)-score(a)||a.name.localeCompare(b.name)),[campaigns]);
  const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return ranked.filter(c=>(category==='all'||categoryOf(c)===category)&&(!q||`${c.name} ${c.advertiser} ${c.description||''}`.toLowerCase().includes(q)))},[ranked,query,category]);
  return <><div style={{display:'grid',gridTemplateColumns:'minmax(220px,1fr) auto',gap:10,margin:'0 0 14px'}}><label style={{height:42,display:'flex',alignItems:'center',gap:9,background:'#fff',border:'1px solid #dce4de',borderRadius:8,padding:'0 12px'}}><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={lang==='pt'?'Buscar dentro das ofertas...':'Search within offers...'} style={{border:0,outline:0,width:'100%',fontSize:13,background:'transparent'}}/></label><div style={{display:'flex',alignItems:'center',gap:7,color:'#64748b',fontSize:11}}><SlidersHorizontal size={15}/>{filtered.length} {lang==='pt'?'resultados':'results'}</div></div><div style={{display:'flex',gap:7,overflowX:'auto',paddingBottom:10}}>{(['all','ai','business','gaming','home','creators','productivity','technology'] as Category[]).map(cat=><button key={cat} onClick={()=>setCategory(cat)} style={{whiteSpace:'nowrap',border:`1px solid ${category===cat?'#159447':'#dfe6e1'}`,background:category===cat?'#eaf8ef':'#fff',borderRadius:999,padding:'8px 11px',fontSize:11,fontWeight:800}}>{categoryLabel(cat,lang)}</button>)}</div>{loading&&!campaigns.length?<div style={{padding:30}}>Carregando ofertas...</div>:filtered.length?<div className="cleanProducts">{filtered.map((c,i)=><OfferCard key={`${c.network}-${c.id}`} campaign={c} index={i} lang={lang}/>)}</div>:<div style={{padding:30,background:'#fff'}}>{lang==='pt'?'Nenhuma oferta encontrada.':'No offers found.'}</div>}<div style={{display:'flex',alignItems:'center',gap:6,marginTop:14,fontSize:11,color:'#64748b'}}><ExternalLink size={12}/>{lang==='pt'?'Impact + Hotmart em uma única vitrine. Preços podem variar e a contratação é finalizada no site oficial do parceiro.':'Impact + Hotmart in one storefront. Pricing may vary and purchase is completed on the partner official site.'}</div></>;
}
