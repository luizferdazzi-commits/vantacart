import Link from 'next/link';
import { ArrowRight, CheckCircle2, Globe2, Megaphone, Monitor, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const plans = [
  {
    number: '01',
    name: 'Featured',
    caption: 'Destaque dentro das categorias',
    tone: 'blue',
    type: 'card',
    price: '$49',
    cadence: '/month',
    annualPrice: '$588',
    annualCadence: '/year',
    description: 'Higher visibility for brands that want more qualified discovery inside VantaCart.',
    features: ['Featured placement in relevant categories', 'Sponsored label', 'Priority visibility'],
    href: 'https://buy.stripe.com/4gM6oJ3Xx9OAgO8dnD2wU00',
    annualHref: 'https://buy.stripe.com/eVqeVf51B4ugcxS0AR2wU09',
    cta: 'Start Featured',
  },
  {
    number: '02',
    name: 'Growth',
    caption: 'Página enriquecida e maior visibilidade',
    tone: 'teal',
    type: 'detail',
    price: '$99',
    cadence: '/month',
    annualPrice: '$1,188',
    annualCadence: '/year',
    description: 'More exposure across comparison and decision pages for software and SaaS vendors.',
    features: ['Featured placement', 'Comparison exposure', 'Dedicated enriched vendor page'],
    href: 'https://buy.stripe.com/6oU28teCb4ugbtOgzP2wU01',
    annualHref: 'https://buy.stripe.com/aFa14p3Xxf8UgO8gzP2wU0a',
    cta: 'Start Growth',
    recommended: true,
  },
  {
    number: '03',
    name: 'Category Sponsor',
    caption: 'Patrocínio premium da categoria',
    tone: 'purple',
    type: 'banner',
    price: '$249',
    cadence: '/month',
    annualPrice: '$2,988',
    annualCadence: '/year',
    description: 'Premium sponsored position for vendors that want category-level visibility.',
    features: ['Top sponsored category placement', 'Prominent contextual CTA', 'Maximum category visibility'],
    href: 'https://buy.stripe.com/8x214pdy78Kw8hC4R72wU02',
    annualHref: 'https://buy.stripe.com/fZudRb79J9OA7dy5Vb2wU0b',
    cta: 'Sponsor a category',
  },
  {
    number: '04',
    name: 'Launch Spotlight',
    caption: 'Destaque temporário para lançamentos',
    tone: 'orange',
    type: 'launch',
    price: '$149',
    cadence: 'one-time',
    annualPrice: null,
    annualCadence: null,
    description: 'A focused 30-day launch push for a new product, feature, offer, or campaign.',
    features: ['30-day launch spotlight', 'Homepage/category exposure', 'One-time payment'],
    href: 'https://buy.stripe.com/cNi3cxdy74ugdBWfvL2wU03',
    annualHref: null,
    cta: 'Launch now',
  },
];

export const metadata = {
  title: 'Advertise on VantaCart | Vendor Plans',
  description: 'Reach software, AI and SaaS buyers through sponsored placements, comparison visibility and launch campaigns on VantaCart.',
};

function PreviewMockup({ type }: { type: string }) {
  if (type === 'detail') return <div className="pvSurface pvDetail"><div className="pvBrowser"><span>VantaCart</span><i>Buscar ferramentas e recursos...</i></div><div className="pvDetailBody"><div className="pvLogo">S</div><div className="pvDetailCopy"><small>Patrocinado</small><strong>SUA MARCA AQUI</strong><span>★★★★★ 4,8</span><p>Plataforma completa para automação, crescimento e produtividade.</p><div className="pvTags"><b>Automação</b><b>CRM</b><b>Analytics</b></div></div><aside><em>Parceiro verificado</em><button>Visitar site oficial ↗</button><span>A partir de<br/><b>R$ 99/mês</b></span></aside></div></div>;
  if (type === 'banner') return <div className="pvSurface"><div className="pvBrowser"><span>VantaCart</span><i>Marketing & Growth</i></div><div className="pvCategoryTitle"><strong>Marketing & Growth</strong><span>128 ferramentas encontradas</span></div><div className="pvSponsorBanner"><div className="pvLogo">S</div><div><small>Patrocinado</small><strong>SUA MARCA AQUI</strong><p>A plataforma completa para crescer seu negócio.</p></div><button>Conhecer agora ↗</button></div><div className="pvMiniGrid"><i>RD Station</i><i>MailBiz</i><i>LeadPro</i><i>Conversio</i></div></div>;
  if (type === 'launch') return <div className="pvSurface pvLaunch"><div className="pvBrowser"><span>VantaCart</span><i>Ofertas selecionadas</i></div><div className="pvLaunchBody"><div><strong>Encontre as melhores ferramentas para impulsionar seu negócio</strong><p>Compare, avalie e escolha as ferramentas certas.</p><button>Explorar categorias</button></div><article><small>LANÇAMENTO EM DESTAQUE · Patrocinado</small><div className="pvLogo">S</div><strong>SUA MARCA AQUI</strong><p>Chegou para transformar a forma como você cresce e vende.</p><button>Conhecer lançamento ↗</button></article></div></div>;
  return <div className="pvSurface"><div className="pvBrowser"><span>VantaCart</span><i>Marketing & Growth</i></div><div className="pvCategoryTitle"><strong>Marketing & Growth</strong><span>Mais populares</span></div><div className="pvGrid"><article className="pvFeatured"><small>Patrocinado</small><div className="pvLogo">S</div><strong>SUA MARCA AQUI</strong><p>Plataforma completa para marketing e vendas.</p><span>★★★★★ 4,8</span></article><i>RD Station</i><i>MailBiz</i><i>LeadPro</i><i>Conversio</i></div></div>;
}

export default function AdvertisePage() {
  return <main className="vendorPage">
    <style>{`
      .vendorPage{min-height:100vh;background:#f6f7f6;color:#0f172a}.vendorTop{border-bottom:1px solid #e4e8e5;background:#fff}.vendorTopIn{max-width:1240px;margin:auto;padding:18px 24px;display:flex;align-items:center;justify-content:space-between;gap:20px}.vendorLogo{font-size:26px;font-weight:950;text-decoration:none;color:#0f172a}.vendorLogo span{color:#159447}.vendorBack{font-size:13px;font-weight:800;text-decoration:none;color:#475569}.vendorHero{max-width:1240px;margin:24px auto 0;padding:0 24px}.vendorHeroBox{padding:34px 38px;border-radius:18px;background:linear-gradient(115deg,#07130d,#10331f 62%,#1f6a44);color:white;position:relative;overflow:hidden;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(360px,.8fr);gap:30px;align-items:center}.vendorHeroBox:after{content:'';position:absolute;width:330px;height:330px;border-radius:50%;right:-115px;top:-175px;background:rgba(84,237,145,.13)}.vendorHeroCopy{max-width:700px;position:relative;z-index:2}.vendorEyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:900;letter-spacing:1.1px;color:#86efac}.vendorHero h1{font-size:clamp(34px,4.3vw,54px);line-height:1.02;letter-spacing:-2.5px;margin:10px 0 12px}.vendorHero h1 span{color:#48d67b}.vendorHero p{font-size:15px;line-height:1.55;color:#d4e3da;max-width:650px;margin:0}.vendorHeroActions{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:20px}.vendorHeroCta{display:inline-flex;align-items:center;gap:8px;background:#4ade80;color:#062612;text-decoration:none;padding:12px 18px;border-radius:9px;font-size:12px;font-weight:950}.vendorHeroHow{display:inline-flex;align-items:center;gap:7px;color:#fff;text-decoration:none;font-size:12px;font-weight:850}.heroStats{position:relative;z-index:2;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.heroStat{min-height:105px;border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.075);border-radius:13px;padding:16px;display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:start;backdrop-filter:blur(5px)}.heroStatIcon{width:42px;height:42px;border-radius:999px;display:grid;place-items:center;background:rgba(255,255,255,.09);color:#61e58d}.heroStat:nth-child(2) .heroStatIcon{color:#f7d84a}.heroStat:nth-child(4) .heroStatIcon{color:#d9ea4b}.heroStat strong{display:block;font-size:20px;line-height:1}.heroStat b{display:block;font-size:12px;margin-top:5px}.heroStat span{display:block;font-size:9px;color:#c7d8ce;margin-top:6px;line-height:1.35}.vendorSection{max-width:1240px;margin:0 auto;padding:36px 24px 42px}.vendorHead{text-align:center;max-width:820px;margin:0 auto 26px}.vendorHead h2{font-size:34px;letter-spacing:-1.3px;margin:0 0 8px}.vendorHead p{color:#64748b;line-height:1.6;margin:0}.annualNotice{margin:15px auto 0;display:inline-flex;align-items:center;gap:7px;padding:8px 12px;border-radius:999px;background:#e9f8ef;color:#0b7a38;font-size:11px;font-weight:900}.offerGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.offerCard{--accent:#2563eb;background:#fff;border:1px solid #dde5e1;border-radius:18px;padding:18px;box-shadow:0 10px 35px rgba(15,23,42,.05);display:flex;flex-direction:column;gap:15px}.offerCard.teal{--accent:#0f9f9a}.offerCard.purple{--accent:#6d45df}.offerCard.orange{--accent:#f59e0b}.offerCard.recommended{border:2px solid #159447}.offerTop{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}.offerIdentity{display:flex;gap:12px;align-items:flex-start}.offerNo{width:38px;height:38px;border-radius:999px;background:var(--accent);color:#fff;display:grid;place-items:center;font-size:12px;font-weight:950;flex:0 0 auto}.offerIdentity h3{font-size:21px;margin:0;color:var(--accent)}.offerIdentity p{font-size:12px;line-height:1.45;color:#64748b;margin:5px 0 0}.offerBadge{background:#e8f9ee;color:#0f7a3b;border-radius:999px;padding:6px 9px;font-size:10px;font-weight:950}.offerBody{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(230px,.82fr);gap:14px;align-items:stretch}.offerCommercial{border-left:1px solid #e7ece9;padding-left:14px;display:flex;flex-direction:column}.billingChoices{display:grid;gap:9px;margin-bottom:12px}.billingOption{border:1px solid #dfe6e2;border-radius:11px;padding:11px;background:#fff}.billingOption.annual{border-color:#9bdcb3;background:#f2fbf5}.billingLabel{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:5px}.billingLabel b{font-size:10px;text-transform:uppercase;letter-spacing:.6px;color:#475569}.billingLabel em{font-style:normal;font-size:8px;font-weight:950;background:#dff5e7;color:#0d7b3d;padding:4px 6px;border-radius:999px}.offerPrice{display:flex;align-items:end;gap:6px;margin:0}.offerPrice b{font-size:30px;letter-spacing:-1.2px}.offerPrice span{font-size:11px;color:#64748b;padding-bottom:5px}.billingHint{display:block;margin-top:5px;font-size:9px;line-height:1.4;color:#64748b}.billingCta{display:block;text-align:center;margin-top:9px;padding:10px 11px;border-radius:8px;text-decoration:none;font-weight:950;font-size:10px;background:#0f172a;color:#fff}.billingOption.annual .billingCta{background:#159447}.offerCommercial>p{font-size:12px;line-height:1.5;color:#64748b;margin:0}.offerCommercial ul{list-style:none;padding:0;margin:13px 0 0;display:grid;gap:8px}.offerCommercial li{display:flex;gap:7px;font-size:11px;line-height:1.35}.offerCommercial li svg{color:#159447;flex:0 0 auto}.pvSurface{border:1px solid #e3e8e5;border-radius:12px;background:#fbfcfb;overflow:hidden;min-height:230px;padding:12px}.pvBrowser{height:28px;border-bottom:1px solid #e5e9e6;display:flex;align-items:center;justify-content:space-between;font-size:9px;color:#64748b}.pvBrowser span{font-weight:950;color:#0f172a}.pvBrowser i{font-style:normal}.pvCategoryTitle{display:flex;justify-content:space-between;align-items:end;padding:13px 4px 10px}.pvCategoryTitle strong{font-size:13px}.pvCategoryTitle span{font-size:8px;color:#64748b}.pvGrid{display:grid;grid-template-columns:1.35fr 1fr 1fr;gap:7px}.pvGrid>i,.pvMiniGrid>i{font-style:normal;background:#fff;border:1px solid #e5e9e6;border-radius:8px;padding:14px 8px;font-size:9px;font-weight:800}.pvFeatured{grid-row:span 2;border:2px solid var(--accent);background:white;border-radius:9px;padding:10px;display:flex;flex-direction:column;gap:6px}.pvFeatured small,.pvDetailCopy small,.pvSponsorBanner small,.pvLaunch article small{font-size:7px;font-weight:950;color:var(--accent)}.pvFeatured strong,.pvDetailCopy strong,.pvSponsorBanner strong,.pvLaunch article strong{font-size:12px}.pvFeatured p,.pvDetailCopy p,.pvSponsorBanner p,.pvLaunch p{font-size:8px;line-height:1.4;color:#64748b;margin:0}.pvFeatured span{font-size:8px;color:#f59e0b}.pvLogo{width:38px;height:38px;border-radius:12px;background:linear-gradient(145deg,var(--accent),#0f766e);color:#fff;display:grid;place-items:center;font-size:20px;font-weight:950}.pvDetailBody{display:grid;grid-template-columns:auto 1fr 120px;gap:10px;padding:18px 4px}.pvDetailCopy{display:flex;flex-direction:column;gap:7px}.pvDetailCopy>span{font-size:8px;color:#f59e0b}.pvTags{display:flex;gap:5px;flex-wrap:wrap}.pvTags b{font-size:7px;background:#eef3f1;padding:4px 6px;border-radius:999px}.pvDetail aside{border-left:1px solid #e4e9e6;padding-left:10px;display:flex;flex-direction:column;gap:10px;font-size:8px}.pvDetail aside em{font-style:normal;font-weight:900}.pvDetail button,.pvSponsorBanner button,.pvLaunch button{border:0;border-radius:6px;background:var(--accent);color:#fff;padding:8px 10px;font-size:8px;font-weight:900}.pvSponsorBanner{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;border:2px solid var(--accent);background:#fff;border-radius:9px;padding:12px}.pvSponsorBanner div:nth-child(2){display:flex;flex-direction:column;gap:4px}.pvMiniGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}.pvLaunchBody{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:18px 4px}.pvLaunchBody>div{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:9px}.pvLaunchBody>div>strong{font-size:14px;line-height:1.2}.pvLaunch article{border:2px solid var(--accent);border-radius:10px;background:#fffdf8;padding:12px;display:flex;flex-direction:column;align-items:flex-start;gap:8px}.vendorInfo{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:34px}.vendorInfo article{background:white;border:1px solid #dfe5e1;border-radius:14px;padding:22px}.vendorInfo svg{color:#159447}.vendorInfo h3{font-size:15px;margin:10px 0 6px}.vendorInfo p{font-size:12px;line-height:1.6;color:#64748b;margin:0}.vendorDisclosure{max-width:900px;margin:20px auto 0;text-align:center;font-size:11px;line-height:1.6;color:#64748b}.vendorDisclosure b{color:#334155}.vendorFooter{border-top:1px solid #e4e8e5;background:#fff}.vendorFooterIn{max-width:1240px;margin:auto;padding:25px 24px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;color:#64748b;font-size:11px}@media(max-width:1000px){.vendorHeroBox{grid-template-columns:1fr}.heroStats{grid-template-columns:repeat(4,1fr)}.heroStat{grid-template-columns:1fr;min-height:0}.offerGrid{grid-template-columns:1fr}.vendorInfo{grid-template-columns:1fr}}@media(max-width:700px){.vendorHeroBox{padding:28px 22px}.vendorHero h1{letter-spacing:-1.8px}.vendorHero,.vendorSection{padding-left:14px;padding-right:14px}.heroStats{grid-template-columns:repeat(2,1fr)}.heroStat{padding:13px}.vendorHeroActions{align-items:stretch}.vendorHeroCta{justify-content:center}.offerBody{grid-template-columns:1fr}.offerCommercial{border-left:0;border-top:1px solid #e7ece9;padding-left:0;padding-top:14px}.pvDetailBody{grid-template-columns:auto 1fr}.pvDetail aside{grid-column:1/-1;border-left:0;border-top:1px solid #e4e9e6;padding:10px 0 0}.pvLaunchBody{grid-template-columns:1fr}.pvMiniGrid{grid-template-columns:repeat(2,1fr)}}
    `}</style>

    <header className="vendorTop"><div className="vendorTopIn"><Link href="/" className="vendorLogo">Vanta<span>Cart</span></Link><Link className="vendorBack" href="/">← Back to marketplace</Link></div></header>

    <section className="vendorHero"><div className="vendorHeroBox">
      <div className="vendorHeroCopy"><span className="vendorEyebrow"><Megaphone size={14}/> VANTACART FOR VENDORS</span><h1>Advertise on <span>VantaCart</span></h1><p>Promote your software, AI tools or SaaS offers to a curated audience of high-intent buyers comparing solutions on VantaCart. Transparent placements. Relevant exposure. Real results.</p><div className="vendorHeroActions"><a className="vendorHeroCta" href="#ad-formats"><ArrowRight size={15}/> View ad formats</a><a className="vendorHeroHow" href="#how-it-works"><Monitor size={14}/> How it works</a></div></div>
      <div className="heroStats"><div className="heroStat"><span className="heroStatIcon"><Users size={20}/></span><div><strong>59</strong><b>Active partners</b><span>Growing vendor network</span></div></div><div className="heroStat"><span className="heroStatIcon"><Globe2 size={20}/></span><div><strong>PT/EN</strong><b>Audience</b><span>Brazilian & global reach</span></div></div><div className="heroStat"><span className="heroStatIcon"><Monitor size={20}/></span><div><strong>Sponsored</strong><b>Placements</b><span>Listings, categories & more</span></div></div><div className="heroStat"><span className="heroStatIcon"><TrendingUp size={20}/></span><div><strong>High-intent</strong><b>Traffic</b><span>Buyers ready to compare</span></div></div></div>
    </div></section>

    <section id="ad-formats" className="vendorSection">
      <div className="vendorHead"><h2>Veja o formato, o preço e contrate no mesmo lugar</h2><p>Cada opção mostra como sua marca aparece na VantaCart e permite contratar direto pelo Stripe. Os planos recorrentes agora têm assinatura mensal ou anual.</p><span className="annualNotice"><CheckCircle2 size={13}/> Annual plans are billed every 12 months and renew automatically</span></div>
      <div className="offerGrid">{plans.map(plan=><article key={plan.name} className={`offerCard ${plan.tone}${plan.recommended?' recommended':''}`}>
        <div className="offerTop"><div className="offerIdentity"><span className="offerNo">{plan.number}</span><div><h3>{plan.name}</h3><p>{plan.caption}</p></div></div>{plan.recommended&&<span className="offerBadge">RECOMMENDED</span>}</div>
        <div className="offerBody"><PreviewMockup type={plan.type}/><div className="offerCommercial"><div className="billingChoices"><div className="billingOption"><div className="billingLabel"><b>{plan.annualHref ? 'Monthly subscription' : 'One-time payment'}</b></div><div className="offerPrice"><b>{plan.price}</b><span>{plan.cadence}</span></div><span className="billingHint">{plan.annualHref ? 'Recurring monthly billing. Cancel according to the subscription terms.' : 'Single payment for the 30-day launch spotlight.'}</span><a className="billingCta" href={plan.href} target="_blank" rel="noopener noreferrer sponsored">{plan.annualHref ? 'Choose monthly' : plan.cta}</a></div>{plan.annualHref&&<div className="billingOption annual"><div className="billingLabel"><b>Annual subscription</b><em>12 MONTHS</em></div><div className="offerPrice"><b>{plan.annualPrice}</b><span>{plan.annualCadence}</span></div><span className="billingHint">Billed once every 12 months and automatically renews annually until canceled.</span><a className="billingCta" href={plan.annualHref} target="_blank" rel="noopener noreferrer sponsored">Choose annual</a></div>}</div><p>{plan.description}</p><ul>{plan.features.map(feature=><li key={feature}><CheckCircle2 size={14}/>{feature}</li>)}</ul></div></div>
      </article>)}</div>
      <div id="how-it-works" className="vendorInfo"><article><Megaphone size={22}/><h3>Sponsored visibility</h3><p>Paid placements are labeled Sponsored so buyers can distinguish commercial exposure from editorial recommendations.</p></article><article><TrendingUp size={22}/><h3>High-intent surfaces</h3><p>Plans are designed for category pages, comparisons, launch exposure and other decision-stage experiences.</p></article><article><ShieldCheck size={22}/><h3>Affiliate-compatible</h3><p>Where program terms allow it, vendor sponsorship and affiliate tracking can coexist as separate commercial relationships.</p></article></div>
      <p className="vendorDisclosure"><b>Important:</b> purchasing a placement does not guarantee a positive editorial recommendation, sales volume or ranking permanence. VantaCart may refuse or remove promotions that do not fit marketplace quality standards.</p>
    </section>

    <footer className="vendorFooter"><div className="vendorFooterIn"><span>© 2026 VantaCart</span><span>Vendor advertising program · Payments processed securely by Stripe</span></div></footer>
  </main>;
}
