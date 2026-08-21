import Link from 'next/link';
import ImpactCampaignGrid from './components/ImpactCampaignGrid';
import { ArrowRight, BadgePercent, CheckCircle2, ChevronRight, ExternalLink, Globe2, Languages, Search, ShieldCheck, Sparkles, Star, Tag, Zap } from 'lucide-react';

export const dynamic='force-dynamic';

type Lang='pt'|'en';
type SearchParams={lang?:string};

const copy={
  pt:{
    navDeals:'Ofertas', navHow:'Como funciona', navTrust:'Por que VantaCart',
    badge:'OFERTAS SELECIONADAS • BRASIL + GLOBAL',
    hero1:'Descubra produtos e ferramentas', hero2:'que valem o clique.',
    heroText:'A VantaCart encontra, organiza e apresenta ofertas de parceiros confiáveis para você comparar melhor e comprar direto no site oficial.',
    primary:'Explorar oportunidades', secondary:'Entender como funciona',
    live:'Ofertas ativas agora', liveSub:'Campanhas sincronizadas com parceiros aprovados e prontas para você explorar.',
    categories:'Explore do seu jeito', categoriesSub:'Escolha pelo que você precisa — nós cuidamos da curadoria.',
    why:'Comprar melhor começa antes do checkout.',
    whySub:'Menos páginas aleatórias. Mais contexto, confiança e decisão.',
    final:'Seu próximo bom negócio pode estar aqui.', finalSub:'Explore as campanhas ativas e descubra novas soluções antes de todo mundo.', finalCta:'Ver ofertas agora',
    disclosure:'Alguns links são de afiliados. Podemos receber comissão sem custo adicional para você.'
  },
  en:{
    navDeals:'Deals', navHow:'How it works', navTrust:'Why VantaCart',
    badge:'CURATED DEALS • BRAZIL + GLOBAL',
    hero1:'Discover products and tools', hero2:'worth the click.',
    heroText:'VantaCart finds, organizes and presents offers from trusted partners so you can compare better and buy directly from the official website.',
    primary:'Explore opportunities', secondary:'See how it works',
    live:'Live offers now', liveSub:'Campaigns synchronized with approved partners and ready for you to explore.',
    categories:'Explore your way', categoriesSub:'Choose what you need — we take care of the curation.',
    why:'Better shopping starts before checkout.', whySub:'Fewer random pages. More context, trust and confident decisions.',
    final:'Your next great deal may be here.', finalSub:'Explore active campaigns and discover new solutions before everyone else.', finalCta:'See deals now',
    disclosure:'Some links are affiliate links. We may earn a commission at no extra cost to you.'
  }
} as const;

const categoriesPt=[['🤖','IA & Software','Ferramentas que economizam tempo'],['📈','Negócios','Soluções para vender e organizar'],['💻','Tecnologia','Produtos e serviços digitais'],['✈️','Viagens','Serviços e experiências'],['🏠','Casa & Estilo','Achados para o dia a dia'],['❤️','Bem-estar','Produtos para sua rotina']];
const categoriesEn=[['🤖','AI & Software','Tools that save you time'],['📈','Business','Solutions to sell and organize'],['💻','Technology','Digital products and services'],['✈️','Travel','Services and experiences'],['🏠','Home & Living','Everyday discoveries'],['❤️','Wellness','Products for your routine']];

export default async function Home({searchParams}:{searchParams:Promise<SearchParams>}){
  const sp=await searchParams;
  const lang:Lang=sp?.lang==='en'?'en':'pt';
  const t=copy[lang];
  const other=lang==='pt'?'en':'pt';
  const categories=lang==='pt'?categoriesPt:categoriesEn;

  return <main className="vantaHome">
    <style>{`
      .vantaHome{min-height:100vh;background:#f6f8f5;color:#0b1711;font-family:Arial,Helvetica,sans-serif;overflow:hidden}.vhShell{max-width:1240px;margin:0 auto;padding:0 24px}.vhTop{background:#07130d;color:#d8e8df;font-size:12px}.vhTopIn{max-width:1240px;margin:auto;padding:9px 24px;display:flex;justify-content:space-between;gap:20px}.vhNav{position:sticky;top:0;z-index:30;background:rgba(246,248,245,.88);backdrop-filter:blur(18px);border-bottom:1px solid rgba(11,23,17,.08)}.vhNavIn{max-width:1240px;margin:auto;padding:17px 24px;display:flex;align-items:center;justify-content:space-between;gap:24px}.vhLogo{font-size:27px;font-weight:900;color:#07130d;text-decoration:none;letter-spacing:-1.5px}.vhLogo span{color:#23d56f}.vhLinks{display:flex;gap:28px;align-items:center}.vhLinks a{color:#34483d;text-decoration:none;font-size:14px;font-weight:800}.vhLang{display:flex!important;gap:8px!important;align-items:center;padding:10px 14px;border:1px solid #d8e2dc;border-radius:999px;background:#fff}.vhHero{position:relative;margin:30px auto 22px;min-height:660px;border-radius:38px;overflow:hidden;background:radial-gradient(circle at 80% 15%,rgba(67,255,142,.3),transparent 26%),linear-gradient(125deg,#07130d 0%,#0b2116 55%,#163d29 100%);color:#fff;box-shadow:0 34px 90px rgba(4,24,14,.2)}.vhHero:before{content:'';position:absolute;width:520px;height:520px;border:1px solid rgba(255,255,255,.08);border-radius:50%;right:-130px;top:-150px}.vhHeroGrid{display:grid;grid-template-columns:1.08fr .92fr;gap:44px;padding:74px 70px 64px;align-items:center;position:relative;z-index:2}.vhBadge{display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(89,255,153,.28);background:rgba(47,213,111,.09);padding:9px 13px;border-radius:999px;color:#9ef8be;font-size:12px;font-weight:900;letter-spacing:.8px}.vhBadge i{width:7px;height:7px;border-radius:50%;background:#45f087;box-shadow:0 0 18px #45f087}.vhHero h1{font-size:clamp(54px,6vw,88px);line-height:.96;letter-spacing:-5px;margin:20px 0 24px;max-width:760px}.vhHero h1 em{font-style:normal;color:#53ec8f}.vhHero p{font-size:18px;line-height:1.68;color:#c8d9cf;max-width:650px}.vhCtas{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.vhPrimary,.vhSecondary{display:inline-flex;align-items:center;gap:9px;padding:15px 19px;border-radius:13px;font-weight:900;text-decoration:none}.vhPrimary{background:#54ed91;color:#06140c;box-shadow:0 14px 40px rgba(84,237,145,.2)}.vhSecondary{color:#fff;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.05)}.vhTrustMini{display:flex;gap:18px;flex-wrap:wrap;margin-top:28px;color:#a8beb2;font-size:12px;font-weight:700}.vhTrustMini span{display:flex;align-items:center;gap:7px}.vhVisual{position:relative;min-height:480px}.floatCard{position:absolute;border:1px solid rgba(255,255,255,.1);background:rgba(8,26,17,.76);backdrop-filter:blur(16px);border-radius:24px;box-shadow:0 24px 70px rgba(0,0,0,.23);animation:float 5s ease-in-out infinite}.fcMain{left:9%;right:5%;top:8%;padding:26px}.fcMain .small{font-size:11px;color:#79e9a4;font-weight:900;letter-spacing:1px}.fcMain h3{font-size:28px;margin:12px 0 6px}.fcMain p{font-size:13px;color:#9fb7aa;margin:0}.miniGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:20px}.miniGrid div{background:#0b1c13;border-radius:14px;padding:15px}.miniGrid b{display:block;font-size:20px}.miniGrid span{font-size:10px;color:#799084}.fcDeal{left:0;bottom:10%;padding:17px 19px;animation-delay:-1.4s}.fcDeal b,.fcProof b{display:block}.fcDeal small,.fcProof small{color:#8fa99b}.fcProof{right:-2%;bottom:2%;padding:16px 18px;animation-delay:-2.8s}.vhTicker{position:absolute;left:0;right:0;bottom:0;border-top:1px solid rgba(255,255,255,.09);background:rgba(2,14,8,.5);overflow:hidden;white-space:nowrap;padding:14px 0;color:#b9cdc1;font-size:12px;font-weight:800}.tickerTrack{display:inline-block;animation:ticker 24s linear infinite}.tickerTrack span{margin-right:44px}.vhStats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px auto 66px}.vhStats div{background:#fff;border:1px solid #e2e9e4;border-radius:19px;padding:19px 20px;box-shadow:0 12px 30px rgba(9,35,20,.04)}.vhStats b{font-size:17px}.vhStats p{font-size:12px;line-height:1.45;color:#6f8177;margin:7px 0 0}.sectionHead{display:flex;justify-content:space-between;gap:20px;align-items:end;margin-bottom:22px}.sectionHead span{font-size:11px;font-weight:900;letter-spacing:1.2px;color:#15904b}.sectionHead h2{font-size:42px;line-height:1.05;letter-spacing:-2.4px;margin:6px 0 0}.sectionHead p{max-width:580px;color:#6c7d73;line-height:1.55}.vhCategories{margin:66px 0}.catGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.catCard{min-height:160px;padding:22px;border-radius:22px;background:#fff;border:1px solid #e0e8e2;text-decoration:none;color:inherit;transition:.25s;position:relative;overflow:hidden}.catCard:after{content:'→';position:absolute;right:18px;bottom:15px;font-size:24px;color:#1aad5b;transition:.25s}.catCard:hover{transform:translateY(-6px);box-shadow:0 22px 50px rgba(8,38,20,.09);border-color:#bde8cb}.catCard:hover:after{transform:translateX(5px)}.catIcon{font-size:32px}.catCard b{display:block;font-size:18px;margin-top:18px}.catCard p{font-size:12px;color:#718178;margin:6px 0}.vhDeals{margin:68px 0;padding:34px;border-radius:30px;background:#fff;border:1px solid #e1e8e3;box-shadow:0 18px 45px rgba(8,35,19,.05)}.vhWhy{margin:76px 0;display:grid;grid-template-columns:.9fr 1.1fr;gap:26px;align-items:stretch}.whyIntro{border-radius:30px;padding:42px;background:#0a1c12;color:#fff;position:relative;overflow:hidden}.whyIntro:after{content:'';position:absolute;width:240px;height:240px;border-radius:50%;background:#25d66f;filter:blur(90px);opacity:.18;right:-60px;bottom:-70px}.whyIntro h2{font-size:45px;line-height:1.04;letter-spacing:-2.8px;margin:12px 0 16px}.whyIntro p{color:#a9beb2;line-height:1.6}.whyCards{display:grid;grid-template-columns:1fr 1fr;gap:14px}.whyCard{background:#fff;border:1px solid #e1e8e3;border-radius:23px;padding:24px;transition:.22s}.whyCard:hover{transform:translateY(-4px);box-shadow:0 18px 45px rgba(9,35,20,.07)}.whyCard svg{color:#19a956}.whyCard b{display:block;font-size:17px;margin:18px 0 8px}.whyCard p{font-size:12px;color:#6f8177;line-height:1.55}.vhFinal{margin:80px 0 30px;padding:48px;border-radius:32px;background:linear-gradient(120deg,#0b1c13,#143a27);color:#fff;display:flex;justify-content:space-between;gap:30px;align-items:center;position:relative;overflow:hidden}.vhFinal:after{content:'';position:absolute;width:300px;height:300px;border-radius:50%;background:#36e27c;filter:blur(100px);opacity:.16;right:-40px}.vhFinal h2{font-size:43px;letter-spacing:-2.2px;margin:5px 0 9px}.vhFinal p{color:#a7bbae;max-width:650px}.vhFooter{border-top:1px solid #dfe7e1;padding:34px 0 50px;color:#6e8176;font-size:12px}.vhFooterIn{display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap}.vhDisclosure{max-width:620px;line-height:1.5}.pulse{animation:pulse 2.2s ease-in-out infinite}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.58}}@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media(max-width:900px){.vhLinks{display:none}.vhHeroGrid,.vhWhy{grid-template-columns:1fr}.vhHeroGrid{padding:54px 32px 80px}.vhHero h1{letter-spacing:-3px}.vhVisual{min-height:390px}.vhStats{grid-template-columns:1fr 1fr}.catGrid{grid-template-columns:1fr 1fr}.vhFinal{align-items:flex-start;flex-direction:column}}@media(max-width:560px){.vhTopIn{font-size:10px}.vhNavIn{padding:14px 16px}.vhShell{padding:0 16px}.vhHero{border-radius:26px}.vhHeroGrid{padding:42px 22px 78px}.vhHero h1{font-size:48px;letter-spacing:-2.5px}.vhVisual{min-height:330px}.fcMain{left:0;right:0}.fcProof{right:0}.vhStats,.catGrid,.whyCards{grid-template-columns:1fr}.sectionHead{align-items:flex-start;flex-direction:column}.sectionHead h2,.whyIntro h2,.vhFinal h2{font-size:35px}.vhDeals{padding:20px}.vhFinal{padding:30px}}
    `}</style>

    <div className="vhTop"><div className="vhTopIn"><span>✦ {lang==='pt'?'Curadoria inteligente de ofertas e ferramentas':'Smart curation of deals and tools'}</span><span>{lang==='pt'?'Compra finalizada no parceiro oficial':'Checkout completed with the official partner'}</span></div></div>

    <header className="vhNav"><div className="vhNavIn">
      <Link href={`/?lang=${lang}`} className="vhLogo">Vanta<span>Cart</span></Link>
      <nav className="vhLinks"><a href="#deals">{t.navDeals}</a><a href="#how">{t.navHow}</a><a href="#why">{t.navTrust}</a></nav>
      <div className="vhLinks" style={{display:'flex'}}><Link className="vhLang" href={`/?lang=${other}`}><Languages size={17}/>{lang==='pt'?'EN':'PT'}</Link></div>
    </div></header>

    <div className="vhShell">
      <section className="vhHero">
        <div className="vhHeroGrid">
          <div>
            <div className="vhBadge"><i className="pulse"/>{t.badge}</div>
            <h1>{t.hero1}<br/><em>{t.hero2}</em></h1>
            <p>{t.heroText}</p>
            <div className="vhCtas"><a href="#deals" className="vhPrimary">{t.primary}<ArrowRight size={18}/></a><a href="#how" className="vhSecondary">{t.secondary}<ChevronRight size={18}/></a></div>
            <div className="vhTrustMini"><span><ShieldCheck size={16}/> {lang==='pt'?'Parceiros oficiais':'Official partners'}</span><span><CheckCircle2 size={16}/> {lang==='pt'?'Sem custo extra':'No extra cost'}</span><span><Globe2 size={16}/> {lang==='pt'?'Brasil + mundo':'Brazil + worldwide'}</span></div>
          </div>
          <div className="vhVisual">
            <div className="floatCard fcMain"><div className="small">VANTACART • LIVE DISCOVERY</div><h3>{lang==='pt'?'Ofertas que fazem sentido.':'Deals that make sense.'}</h3><p>{lang==='pt'?'Tecnologia, IA, negócios e serviços selecionados.':'Selected technology, AI, business and services.'}</p><div className="miniGrid"><div><b>2</b><span>{lang==='pt'?'parceiros ativos':'active partners'}</span></div><div><b>24/7</b><span>{lang==='pt'?'vitrine online':'online storefront'}</span></div><div><b>↗</b><span>{lang==='pt'?'novas aprovações':'new approvals'}</span></div></div></div>
            <div className="floatCard fcDeal"><Tag size={18}/><b>{lang==='pt'?'Oferta rastreada':'Tracked offer'}</b><small>{lang==='pt'?'Link oficial do parceiro':'Official partner link'}</small></div>
            <div className="floatCard fcProof"><Sparkles size={18}/><b>{lang==='pt'?'Curadoria Vanta':'Vanta curation'}</b><small>{lang==='pt'?'Menos ruído. Mais escolha.':'Less noise. Better choice.'}</small></div>
          </div>
        </div>
        <div className="vhTicker"><div className="tickerTrack"><span>AI • CRM • SOFTWARE • BUSINESS • GLOBAL DEALS • SMART SHOPPING</span><span>AI • CRM • SOFTWARE • BUSINESS • GLOBAL DEALS • SMART SHOPPING</span><span>AI • CRM • SOFTWARE • BUSINESS • GLOBAL DEALS • SMART SHOPPING</span></div></div>
      </section>

      <section className="vhStats" id="how">
        <div><Search size={20}/><b>{lang==='pt'?'Descubra':'Discover'}</b><p>{lang==='pt'?'Encontre soluções sem navegar por dezenas de sites.':'Find solutions without browsing dozens of sites.'}</p></div>
        <div><Tag size={20}/><b>{lang==='pt'?'Compare':'Compare'}</b><p>{lang==='pt'?'Veja a proposta de valor antes de sair da VantaCart.':'Understand the value before leaving VantaCart.'}</p></div>
        <div><ExternalLink size={20}/><b>{lang==='pt'?'Acesse':'Access'}</b><p>{lang==='pt'?'Continue direto no ambiente oficial do parceiro.':'Continue directly on the official partner website.'}</p></div>
        <div><ShieldCheck size={20}/><b>{lang==='pt'?'Decida melhor':'Decide better'}</b><p>{lang==='pt'?'Mais contexto para comprar com confiança.':'More context to buy with confidence.'}</p></div>
      </section>

      <section className="vhCategories"><div className="sectionHead"><div><span>EXPLORE</span><h2>{t.categories}</h2></div><p>{t.categoriesSub}</p></div><div className="catGrid">{categories.map(([icon,name,text])=><a className="catCard" href="#deals" key={name}><div className="catIcon">{icon}</div><b>{name}</b><p>{text}</p></a>)}</div></section>

      <section className="vhDeals" id="deals"><div className="sectionHead"><div><span>LIVE NOW</span><h2>{t.live}</h2></div><p>{t.liveSub}</p></div><ImpactCampaignGrid lang={lang}/></section>

      <section className="vhWhy" id="why">
        <div className="whyIntro"><div className="vhBadge"><i/>VANTACART</div><h2>{t.why}</h2><p>{t.whySub}</p></div>
        <div className="whyCards">
          <div className="whyCard"><Star/><b>{lang==='pt'?'Curadoria antes da vitrine':'Curation before display'}</b><p>{lang==='pt'?'Não queremos ser um catálogo infinito. Queremos destacar o que realmente merece atenção.':'We do not want to be an endless catalog. We want to highlight what deserves attention.'}</p></div>
          <div className="whyCard"><ShieldCheck/><b>{lang==='pt'?'Compra no parceiro oficial':'Official partner checkout'}</b><p>{lang==='pt'?'Pagamento, assinatura e suporte continuam com a empresa responsável pelo produto.':'Payment, subscription and support remain with the company responsible for the product.'}</p></div>
          <div className="whyCard"><Zap/><b>{lang==='pt'?'Novas ofertas automaticamente':'New offers automatically'}</b><p>{lang==='pt'?'Novos parceiros aprovados podem entrar na vitrine conforme a integração é atualizada.':'New approved partners can enter the storefront as integrations update.'}</p></div>
          <div className="whyCard"><BadgePercent/><b>{lang==='pt'?'Sem custo extra pela indicação':'No extra referral cost'}</b><p>{lang==='pt'?'A comissão de afiliado não adiciona uma taxa ao valor mostrado pelo parceiro.':'Affiliate commission does not add a fee to the partner price.'}</p></div>
        </div>
      </section>

      <section className="vhFinal"><div><span style={{fontSize:11,fontWeight:900,color:'#6ff0a3',letterSpacing:1.1}}>READY TO DISCOVER</span><h2>{t.final}</h2><p>{t.finalSub}</p></div><a className="vhPrimary" href="#deals">{t.finalCta}<ArrowRight size={18}/></a></section>
    </div>

    <footer className="vhFooter"><div className="vhShell vhFooterIn"><Link href={`/?lang=${lang}`} className="vhLogo">Vanta<span>Cart</span></Link><div className="vhDisclosure">{t.disclosure}</div><div>© 2026 VantaCart</div></div></footer>
  </main>;
}
