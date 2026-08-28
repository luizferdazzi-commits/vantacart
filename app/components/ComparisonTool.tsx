'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, GitCompareArrows, X } from 'lucide-react';
import { trackEvent } from './Analytics';

type Lang='pt'|'en';
type PricingType='fixed'|'from'|'range'|'plans'|'unknown';
type Offer={id:string;name:string;advertiser:string;description?:string;trackingLink?:string;status?:string;network?:'impact'|'hotmart';category?:string;price?:number;priceFrom?:number;priceMax?:number;currency?:string;pricingType?:PricingType;type?:string};

function slugify(value:string){return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function landingUrl(o:Offer,lang:Lang){return `/offers/${slugify(o.name)}?lang=${lang}`;}
function text(o:Offer){return `${o.name} ${o.advertiser} ${o.description||''}`.toLowerCase();}
function categoryOf(o:Offer,lang:Lang){const s=text(o);let pt='Tecnologia';let en='Technology';if(/video|creator|pixverse|vidu|movavi|domoai|wizstar|design/.test(s)){pt='Criadores & Vídeo';en='Creators & Video';}else if(/crm|sales|business|marketing|riibase|leadlovers|customer/.test(s)){pt='Vendas & Negócios';en='Sales & Business';}else if(/subscription|gamsgo|productivity/.test(s)){pt='Assinaturas digitais';en='Digital subscriptions';}else if(/ai|automation|agent|base44|creao|appy pie|medo|verdent|lorka/.test(s)){pt='IA & Automação';en='AI & Automation';}return lang==='pt'?pt:en;}
function bestFor(o:Offer,lang:Lang){const s=text(o);if(/leadlovers/.test(s))return lang==='pt'?'Automação de marketing e vendas':'Marketing and sales automation';if(/base44|appy pie|medo|verdent|creao/.test(s))return lang==='pt'?'Criar apps e automações com IA':'Building apps and automations with AI';if(/domoai|pixverse|vidu|wizstar/.test(s))return lang==='pt'?'Criação de vídeo e conteúdo com IA':'AI video and content creation';if(/movavi/.test(s))return lang==='pt'?'Edição de vídeo com curva de aprendizado baixa':'Easy-to-learn video editing';if(/riibase|crm/.test(s))return lang==='pt'?'Organizar clientes, pipeline e vendas':'Customer, pipeline and sales management';if(/gearup/.test(s))return lang==='pt'?'Jogos com menor latência':'Lower-latency gaming';if(/gamsgo/.test(s))return lang==='pt'?'Economizar em assinaturas digitais':'Saving on digital subscriptions';return lang==='pt'?'Avaliar uma solução digital específica':'Evaluating a specific digital solution';}
function money(value:number,currency='BRL',lang:Lang='pt'){try{return new Intl.NumberFormat(lang==='pt'?'pt-BR':'en-US',{style:'currency',currency}).format(value);}catch{return `${currency} ${value.toFixed(2)}`;}}
function priceOf(o:Offer,lang:Lang){const currency=o.currency||'BRL';if(o.pricingType==='fixed'&&typeof o.price==='number')return money(o.price,currency,lang);if((o.pricingType==='from'||o.pricingType==='range')&&typeof o.priceFrom==='number'){if(o.pricingType==='range'&&typeof o.priceMax==='number')return `${money(o.priceFrom,currency,lang)} – ${money(o.priceMax,currency,lang)}`;return `${lang==='pt'?'A partir de':'From'} ${money(o.priceFrom,currency,lang)}`;}return lang==='pt'?'Consultar preço oficial':'See official pricing';}

export default function ComparisonTool({lang}:{lang:Lang}){
  const[offers,setOffers]=useState<Offer[]>([]);const[selected,setSelected]=useState<string[]>([]);const[loading,setLoading]=useState(true);
  useEffect(()=>{let cancelled=false;Promise.allSettled([fetch('/api/impact/campaigns',{cache:'no-store'}).then(r=>r.json()),fetch('/api/hotmart/offers',{cache:'no-store'}).then(r=>r.json())]).then(results=>{if(cancelled)return;const impact=results[0].status==='fulfilled'&&results[0].value?.ok?results[0].value.campaigns.filter((o:Offer)=>o.status==='Active'&&o.trackingLink).map((o:Offer)=>({...o,network:'impact' as const})):[];const hotmart=results[1].status==='fulfilled'&&results[1].value?.ok?results[1].value.offers.filter((o:any)=>o.active&&o.hotlink).map((o:any)=>({id:`hotmart-${o.id}`,name:o.name,advertiser:o.producer||o.name,description:o.description,trackingLink:o.hotlink,status:'Active',network:'hotmart' as const,category:o.category,price:o.price,priceFrom:o.priceFrom,priceMax:o.priceMax,currency:o.currency,pricingType:o.pricingType,type:'Hotmart'})):[];setOffers([...impact,...hotmart]);}).finally(()=>!cancelled&&setLoading(false));return()=>{cancelled=true};},[]);
  const chosen=useMemo(()=>selected.map(id=>offers.find(o=>o.id===id)).filter(Boolean) as Offer[],[selected,offers]);
  const toggle=(id:string)=>setSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):prev.length<3?[...prev,id]:prev);
  if(loading)return <div className="compareTool"><div className="compareIntro"><span><GitCompareArrows size={16}/>{lang==='pt'?'COMPARADOR':'COMPARISON'}</span><h3>{lang==='pt'?'Carregando ofertas para comparação…':'Loading offers to compare…'}</h3></div></div>;
  return <section className="compareTool" aria-label={lang==='pt'?'Comparador de ofertas':'Offer comparison'}>
    <div className="compareIntro"><span><GitCompareArrows size={16}/>{lang==='pt'?'COMPARE ANTES DE DECIDIR':'COMPARE BEFORE YOU CHOOSE'}</span><h3>{lang==='pt'?'Compare até 3 ferramentas lado a lado.':'Compare up to 3 tools side by side.'}</h3><p>{lang==='pt'?'Veja categoria, melhor uso, preço disponível e acesso ao parceiro oficial sem abrir vários cards.':'See category, best use, available pricing and official partner access without opening multiple cards.'}</p></div>
    <div className="comparePicker">{offers.slice(0,24).map(o=>{const active=selected.includes(o.id);const blocked=!active&&selected.length>=3;return <button key={o.id} disabled={blocked} className={active?'isSelected':''} onClick={()=>toggle(o.id)}><span>{active?<Check size={14}/>:<span className="compareDot"/>}</span><b>{o.name}</b><small>{categoryOf(o,lang)}</small></button>})}</div>
    {chosen.length>0&&<div className="compareTableWrap"><div className="compareTable" style={{gridTemplateColumns:`150px repeat(${chosen.length},minmax(190px,1fr))`}}>
      <div className="compareLabel">{lang==='pt'?'Ferramenta':'Tool'}</div>{chosen.map(o=><div className="compareHead" key={`h-${o.id}`}><button aria-label={lang==='pt'?'Remover da comparação':'Remove from comparison'} onClick={()=>toggle(o.id)}><X size={14}/></button><strong>{o.name}</strong><small>{o.advertiser}</small></div>)}
      <div className="compareLabel">{lang==='pt'?'Categoria':'Category'}</div>{chosen.map(o=><div key={`c-${o.id}`}>{categoryOf(o,lang)}</div>)}
      <div className="compareLabel">{lang==='pt'?'Melhor para':'Best for'}</div>{chosen.map(o=><div key={`b-${o.id}`}>{bestFor(o,lang)}</div>)}
      <div className="compareLabel">{lang==='pt'?'Preço':'Price'}</div>{chosen.map(o=><div key={`p-${o.id}`}><strong>{priceOf(o,lang)}</strong></div>)}
      <div className="compareLabel">{lang==='pt'?'Status':'Status'}</div>{chosen.map(o=><div key={`s-${o.id}`}><span className="compareActive">● {lang==='pt'?'Ativo':'Active'}</span></div>)}
      <div className="compareLabel">{lang==='pt'?'Próximo passo':'Next step'}</div>{chosen.map(o=><div key={`a-${o.id}`}><a href={landingUrl(o,lang)} onClick={()=>trackEvent('compare_offer_click',{offer_id:o.id,offer_name:o.name,partner:o.advertiser,network:o.network||'impact',language:lang})}>{lang==='pt'?'Ver oferta':'View offer'}<ArrowRight size={14}/></a></div>)}
    </div></div>}
    {selected.length===0&&<p className="compareHint">{lang==='pt'?'Selecione 2 ou 3 ferramentas acima para iniciar a comparação.':'Select 2 or 3 tools above to start comparing.'}</p>}
  </section>;
}
