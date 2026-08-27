import Link from 'next/link';
import ImpactCampaignGrid from './components/ImpactCampaignGrid';
import AffiliateContentHub from './components/AffiliateContentHub';
import ActivePartnerCount from './components/ActivePartnerCount';
import { Languages, Search, ShieldCheck, Sparkles, Tag, Zap, ChevronRight } from 'lucide-react';

export const dynamic='force-dynamic';

type Lang='pt'|'en';
type SearchParams={lang?:string;q?:string;category?:string};

const copy={
  pt:{search:'Buscar produtos, marcas ou ferramentas',all:'Todos',deals:'Ofertas',ai:'IA & Software',business:'Negócios',home:'Home office',creators:'Criadores',video:'Vídeo & Design',heroBadge:'OFERTAS SELECIONADAS',heroTitle:'Encontre ferramentas digitais que realmente valem a pena.',heroText:'Software, IA e assinaturas de parceiros aprovados para comparar e escolher mais rápido.',heroCta:'Ver ofertas',featured:'Ofertas em destaque',featuredSub:'Programas ativos sincronizados diretamente com nossos parceiros.',categories:'Explore por categoria',disclosure:'Alguns links são de afiliados. Podemos receber comissão sem custo adicional para você.'},
  en:{search:'Search products, brands or tools',all:'All',deals:'Deals',ai:'AI & Software',business:'Business',home:'Home office',creators:'Creators',video:'Video & Design',heroBadge:'CURATED DEALS',heroTitle:'Find digital tools that are actually worth it.',heroText:'Software, AI and subscriptions from approved partners, organized for faster comparison.',heroCta:'See deals',featured:'Featured deals',featuredSub:'Active programs synchronized directly with our partners.',categories:'Explore by category',disclosure:'Some links are affiliate links. We may earn a commission at no extra cost to you.'}
} as const;

const catsPt=[['🤖','IA & Automação','ai'],['📈','Vendas & Negócios','business'],['🎬','Criadores & Vídeo','creators'],['✨','Assinaturas digitais','productivity']];
const catsEn=[['🤖','AI & Automation','ai'],['📈','Sales & Business','business'],['🎬','Creators & Video','creators'],['✨','Digital subscriptions','productivity']];

export default async function Home({searchParams}:{searchParams:Promise<SearchParams>}){
  const sp=await searchParams;
  const lang:Lang=sp?.lang==='en'?'en':'pt';
  const t=copy[lang];const other=lang==='pt'?'en':'pt';const cats=lang==='pt'?catsPt:catsEn;
  const q=sp?.q||'';const category=sp?.category||'all';
  const linkFor=(cat:string)=>`/collections/${cat}?lang=${lang}`;

  return <main className="cleanMarket marketHomeV2">
    <style>{`
      .marketHomeV2{min-height:100vh;background:#f6f7f6}.marketHomeV2 .mainHeader{position:sticky;top:0;z-index:50;border-bottom:1px solid #e4e8e5;box-shadow:0 3px 14px rgba(15,23,42,.04)}
      .marketHomeV2 .mainHeaderInner{padding:13px 26px;grid-template-columns:auto minmax(360px,1fr) auto}.marketHomeV2 .cleanSearch{height:44px}.marketHomeV2 .cleanNav{position:sticky;top:70px;z-index:45}.marketHomeV2 .cleanNavInner{padding:10px 26px;gap:26px;overflow:auto}.marketHeroCompact{max-width:1540px;margin:14px auto 12px;padding:0 26px}.marketHeroCompactInner{min-height:205px;border-radius:12px;background:linear-gradient(105deg,#07130d 0%,#10331f 64%,#1e603e 100%);color:#fff;padding:28px 34px;display:grid;grid-template-columns:1.1fr .9fr;align-items:center;overflow:hidden;position:relative}.marketHeroCompactInner:after{content:'';width:420px;height:420px;border-radius:50%;background:rgba(71,236,132,.17);position:absolute;right:-120px;top:-220px}.heroCompactCopy{position:relative;z-index:2;max-width:740px}.heroCompactBadge{display:inline-flex;align-items:center;gap:7px;color:#86efac;font-size:11px;font-weight:900;letter-spacing:1px}.heroCompactCopy h1{font-size:clamp(30px,3.5vw,48px);line-height:1.02;letter-spacing:-2.2px;margin:9px 0 9px}.heroCompactCopy p{font-size:14px;line-height:1.55;color:#c7d8cf;margin:0;max-width:680px}.heroCompactCta{display:inline-flex;align-items:center;gap:7px;margin-top:16px;padding:11px 15px;border-radius:8px;background:#54ed91;color:#07130d;text-decoration:none;font-weight:900;font-size:12px}.heroCompactVisual{justify-self:end;position:relative;z-index:2;display:grid;grid-template-columns:repeat(2,150px);gap:10px}.heroCompactVisual div{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:15px}.heroCompactVisual b{display:block;font-size:20px}.heroCompactVisual span{font-size:10px;color:#b8ccbf}.marketSection{max-width:1540px;margin:0 auto;padding:0 26px}.marketSectionHead{display:flex;align-items:end;justify-content:space-between;gap:20px;margin:18px 0 12px}.marketSectionHead h2{font-size:24px;margin:0;letter-spacing:-.8px}.marketSectionHead p{font-size:12px;color:#64748b;margin:4px 0 0}.marketCategoryBar{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:16px 0}.marketCategoryBar a{display:flex;align-items:center;gap:10px;padding:13px 14px;border-radius:9px;background:#fff;border:1px solid #e2e7e3;color:#111827;text-decoration:none;font-size:12px;font-weight:800}.marketCategoryBar a:hover{border-color:#159447;background:#f0faf3}.marketCategoryBar span{font-size:21px}.marketTrust{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:28px 0}.marketTrust div{background:#fff;border:1px solid #e2e7e3;border-radius:10px;padding:18px;display:flex;gap:12px;align-items:flex-start}.marketTrust svg{color:#159447}.marketTrust b{display:block;font-size:12px}.marketTrust p{font-size:11px;color:#64748b;margin:4px 0 0;line-height:1.45}.marketFooter{border-top:1px solid #e2e7e3;background:#fff;margin-top:34px}.marketFooterIn{max-width:1540px;margin:auto;padding:28px 26px;display:flex;justify-content:space-between;gap:25px;align-items:center;flex-wrap:wrap;font-size:11px;color:#64748b}.marketFooter .cleanLogo{font-size:24px}@media(max-width:980px){.marketHomeV2 .mainHeaderInner{grid-template-columns:auto 1fr}.headerActions{display:none}.marketHeroCompactInner{grid-template-columns:1fr}.heroCompactVisual{display:none}.marketCategoryBar{grid-template-columns:repeat(3,1fr)}}@media(max-width:640px){.marketHomeV2 .mainHeaderInner{grid-template-columns:1fr;padding:10px 14px;gap:9px}.marketHomeV2 .cleanLogo{font-size:25px}.marketHomeV2 .cleanNav{top:108px}.marketHeroCompact,.marketSection{padding:0 14px}.marketHeroCompactInner{padding:24px 20px;min-height:185px}.heroCompactCopy h1{font-size:34px;letter-spacing:-1.5px}.marketCategoryBar{display:flex;overflow:auto}.marketCategoryBar a{min-width:145px}.marketSectionHead{align-items:flex-start;flex-direction:column}.cleanProducts{grid-template-columns:repeat(2,1fr)!important;gap:9px}.cleanProductImage{height:145px!important;min-height:145px!important}}
    `}</style>

    <header className="mainHeader"><div className="mainHeaderInner">
      <Link className="cleanLogo" href={`/?lang=${lang}`}>Vanta<span>Cart</span></Link>
      <form className="cleanSearch" action="/" method="get">
        <input type="hidden" name="lang" value={lang}/>
        <select aria-label="Categoria" name="category" defaultValue={category}><option value="all">{t.all}</option><option value="ai">{lang==='pt'?'IA & Automação':'AI & Automation'}</option><option value="business">{lang==='pt'?'Vendas & Negócios':'Sales & Business'}</option><option value="creators">{lang==='pt'?'Criadores & Vídeo':'Creators & Video'}</option><option value="productivity">{lang==='pt'?'Assinaturas digitais':'Digital subscriptions'}</option></select>
        <input name="q" aria-label={t.search} placeholder={t.search} defaultValue={q}/>
        <button type="submit" aria-label={t.search}><Search size={19}/></button>
      </form>
      <div className="headerActions"><Link href={`/?lang=${other}`}><Languages size={19}/><span><small>{lang==='pt'?'Idioma':'Language'}</small><b>{lang==='pt'?'Português • EN':'English • PT'}</b></span></Link></div>
    </div></header>

    <nav className="cleanNav"><div className="cleanNavInner">
      <span><Tag size={15}/> {t.deals}</span><Link href={linkFor('ai')}>{lang==='pt'?'IA & Automação':'AI & Automation'}</Link><Link href={linkFor('business')}>{lang==='pt'?'Vendas & Negócios':'Sales & Business'}</Link><Link href={linkFor('creators')}>{lang==='pt'?'Criadores & Vídeo':'Creators & Video'}</Link><Link href={linkFor('productivity')}>{lang==='pt'?'Assinaturas digitais':'Digital subscriptions'}</Link>
    </div></nav>

    <section className="marketHeroCompact"><div className="marketHeroCompactInner">
      <div className="heroCompactCopy"><div className="heroCompactBadge"><Sparkles size={14}/>{t.heroBadge}</div><h1>{t.heroTitle}</h1><p>{t.heroText}</p><a className="heroCompactCta" href="#deals">{t.heroCta}<ChevronRight size={15}/></a></div>
      <div className="heroCompactVisual"><ActivePartnerCount lang={lang}/><div><b>24/7</b><span>{lang==='pt'?'vitrine online':'online storefront'}</span></div><div><b>↗</b><span>{lang==='pt'?'links rastreados':'tracked links'}</span></div><div><b>PT/EN</b><span>{lang==='pt'?'experiência bilíngue':'bilingual experience'}</span></div></div>
    </div></section>

    <section className="marketSection" id="deals">
      <div className="marketSectionHead"><div><h2>🔥 {t.featured}</h2><p>{t.featuredSub}</p></div></div>
      <ImpactCampaignGrid lang={lang} initialQuery={q} initialCategory={category}/>
      <AffiliateContentHub lang={lang}/>
      <div className="marketSectionHead"><div><h2>{t.categories}</h2></div></div>
      <div className="marketCategoryBar">{cats.map(([icon,name,cat])=><Link href={linkFor(cat)} key={name}><span>{icon}</span>{name}</Link>)}</div>
      <div className="marketTrust"><div><ShieldCheck size={22}/><span><b>{lang==='pt'?'Parceiros verificados':'Verified partners'}</b><p>{lang==='pt'?'Só mostramos programas ativos e aprovados.':'We only surface active, approved programs.'}</p></span></div><div><Zap size={22}/><span><b>{lang==='pt'?'Acesso direto':'Direct access'}</b><p>{lang==='pt'?'Você continua no site oficial do parceiro.':'You continue on the partner’s official website.'}</p></span></div><div><Tag size={22}/><span><b>{lang==='pt'?'Sem taxa adicional':'No extra fee'}</b><p>{lang==='pt'?'A indicação não aumenta o preço para você.':'Our referral does not increase your price.'}</p></span></div></div>
    </section>

    <footer className="marketFooter"><div className="marketFooterIn"><Link className="cleanLogo" href={`/?lang=${lang}`}>Vanta<span>Cart</span></Link><span>{t.disclosure}</span><span>© 2026 VantaCart</span></div></footer>
  </main>;
}
