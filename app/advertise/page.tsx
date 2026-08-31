import Link from 'next/link';
import { CheckCircle2, Megaphone, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

const plans = [
  {
    name: 'Featured',
    price: '$49',
    cadence: '/month',
    description: 'Higher visibility for brands that want more qualified discovery inside VantaCart.',
    features: ['Featured placement in relevant categories', 'Sponsored label', 'Priority visibility'],
    href: 'https://buy.stripe.com/4gM6oJ3Xx9OAgO8dnD2wU00',
    cta: 'Start Featured',
  },
  {
    name: 'Growth',
    price: '$99',
    cadence: '/month',
    description: 'More exposure across comparison and decision pages for software and SaaS vendors.',
    features: ['Featured placement', 'Comparison exposure', 'Dedicated enriched vendor page'],
    href: 'https://buy.stripe.com/6oU28teCb4ugbtOgzP2wU01',
    cta: 'Start Growth',
    recommended: true,
  },
  {
    name: 'Category Sponsor',
    price: '$249',
    cadence: '/month',
    description: 'Premium sponsored position for vendors that want category-level visibility.',
    features: ['Top sponsored category placement', 'Prominent contextual CTA', 'Maximum category visibility'],
    href: 'https://buy.stripe.com/8x214pdy78Kw8hC4R72wU02',
    cta: 'Sponsor a category',
  },
  {
    name: 'Launch Spotlight',
    price: '$149',
    cadence: 'one-time',
    description: 'A focused 30-day launch push for a new product, feature, offer, or campaign.',
    features: ['30-day launch spotlight', 'Homepage/category exposure', 'One-time payment'],
    href: 'https://buy.stripe.com/cNi3cxdy74ugdBWfvL2wU03',
    cta: 'Launch now',
  },
];

export const metadata = {
  title: 'Advertise on VantaCart | Vendor Plans',
  description: 'Reach software, AI and SaaS buyers through sponsored placements, comparison visibility and launch campaigns on VantaCart.',
};

export default function AdvertisePage() {
  return <main className="vendorPage">
    <style>{`
      .vendorPage{min-height:100vh;background:#f6f7f6;color:#0f172a}.vendorTop{border-bottom:1px solid #e4e8e5;background:#fff}.vendorTopIn{max-width:1240px;margin:auto;padding:18px 24px;display:flex;align-items:center;justify-content:space-between;gap:20px}.vendorLogo{font-size:26px;font-weight:950;text-decoration:none;color:#0f172a}.vendorLogo span{color:#159447}.vendorBack{font-size:13px;font-weight:800;text-decoration:none;color:#475569}.vendorHero{max-width:1240px;margin:24px auto 0;padding:0 24px}.vendorHeroBox{padding:54px 46px;border-radius:18px;background:linear-gradient(115deg,#07130d,#113621 62%,#1e603e);color:white;position:relative;overflow:hidden}.vendorHeroBox:after{content:'';position:absolute;width:420px;height:420px;border-radius:50%;right:-170px;top:-190px;background:rgba(84,237,145,.16)}.vendorHeroCopy{max-width:780px;position:relative;z-index:2}.vendorEyebrow{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:900;letter-spacing:1.1px;color:#86efac}.vendorHero h1{font-size:clamp(38px,6vw,68px);line-height:.98;letter-spacing:-3px;margin:13px 0 16px}.vendorHero p{font-size:17px;line-height:1.65;color:#d4e3da;max-width:720px}.vendorProof{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.vendorProof span{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);padding:9px 11px;border-radius:999px;font-size:12px;font-weight:800}.vendorSection{max-width:1240px;margin:0 auto;padding:42px 24px}.vendorHead{text-align:center;max-width:760px;margin:0 auto 26px}.vendorHead h2{font-size:34px;letter-spacing:-1.3px;margin:0 0 8px}.vendorHead p{color:#64748b;line-height:1.6;margin:0}.vendorGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.vendorPlan{background:#fff;border:1px solid #dfe5e1;border-radius:16px;padding:24px;display:flex;flex-direction:column;position:relative;box-shadow:0 8px 30px rgba(15,23,42,.04)}.vendorPlan.recommended{border:2px solid #159447}.vendorPlanBadge{position:absolute;right:16px;top:14px;background:#e8f9ee;color:#0f7a3b;border-radius:999px;padding:6px 9px;font-size:10px;font-weight:950}.vendorPlan h3{font-size:21px;margin:0 0 6px}.vendorPrice{display:flex;align-items:end;gap:5px;margin:10px 0 12px}.vendorPrice b{font-size:34px;letter-spacing:-1.2px}.vendorPrice span{color:#64748b;font-size:12px;padding-bottom:6px}.vendorPlan>p{font-size:13px;line-height:1.55;color:#64748b;min-height:80px}.vendorPlan ul{list-style:none;padding:0;margin:16px 0 22px;display:grid;gap:10px}.vendorPlan li{display:flex;gap:8px;font-size:12px;line-height:1.4}.vendorPlan li svg{color:#159447;flex:0 0 auto;margin-top:1px}.vendorCta{margin-top:auto;display:flex;justify-content:center;padding:13px 14px;border-radius:9px;text-decoration:none;font-weight:900;font-size:12px;background:#0f172a;color:white}.vendorPlan.recommended .vendorCta{background:#159447}.vendorInfo{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:34px}.vendorInfo article{background:white;border:1px solid #dfe5e1;border-radius:14px;padding:22px}.vendorInfo svg{color:#159447}.vendorInfo h3{font-size:15px;margin:10px 0 6px}.vendorInfo p{font-size:12px;line-height:1.6;color:#64748b;margin:0}.vendorDisclosure{max-width:900px;margin:6px auto 0;text-align:center;font-size:11px;line-height:1.6;color:#64748b}.vendorDisclosure b{color:#334155}.vendorFooter{border-top:1px solid #e4e8e5;background:#fff}.vendorFooterIn{max-width:1240px;margin:auto;padding:25px 24px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;color:#64748b;font-size:11px}@media(max-width:1000px){.vendorGrid{grid-template-columns:repeat(2,1fr)}.vendorInfo{grid-template-columns:1fr}}@media(max-width:640px){.vendorHeroBox{padding:38px 24px}.vendorHero h1{letter-spacing:-2px}.vendorGrid{grid-template-columns:1fr}.vendorPlan>p{min-height:auto}.vendorTopIn,.vendorHero,.vendorSection{padding-left:14px;padding-right:14px}}
    `}</style>
    <header className="vendorTop"><div className="vendorTopIn"><Link href="/" className="vendorLogo">Vanta<span>Cart</span></Link><Link className="vendorBack" href="/">← Back to marketplace</Link></div></header>
    <section className="vendorHero"><div className="vendorHeroBox"><div className="vendorHeroCopy"><span className="vendorEyebrow"><Megaphone size={15}/> VANTACART FOR VENDORS</span><h1>Reach buyers already comparing software and AI.</h1><p>Promote your product inside a curated marketplace built around discovery, comparison and purchase intent. Sponsored exposure is clearly labeled and remains separate from VantaCart editorial recommendations.</p><div className="vendorProof"><span><ShieldCheck size={14}/> Transparent sponsored labeling</span><span><TrendingUp size={14}/> Buyer-intent placement</span><span><Sparkles size={14}/> Software, AI & SaaS focused</span></div></div></div></section>
    <section className="vendorSection"><div className="vendorHead"><h2>Choose your visibility plan</h2><p>Start small, measure qualified traffic, and scale visibility as VantaCart grows. All paid placements remain clearly identified as sponsored.</p></div><div className="vendorGrid">{plans.map(plan=><article key={plan.name} className={`vendorPlan${plan.recommended?' recommended':''}`}>{plan.recommended&&<span className="vendorPlanBadge">RECOMMENDED</span>}<h3>{plan.name}</h3><div className="vendorPrice"><b>{plan.price}</b><span>{plan.cadence}</span></div><p>{plan.description}</p><ul>{plan.features.map(feature=><li key={feature}><CheckCircle2 size={15}/>{feature}</li>)}</ul><a className="vendorCta" href={plan.href} target="_blank" rel="noopener noreferrer sponsored">{plan.cta}</a></article>)}</div><div className="vendorInfo"><article><Megaphone size={22}/><h3>Sponsored visibility</h3><p>Paid placements are labeled Sponsored so buyers can distinguish commercial exposure from editorial recommendations.</p></article><article><TrendingUp size={22}/><h3>High-intent surfaces</h3><p>Plans are designed for category pages, comparisons, launch exposure and other decision-stage experiences.</p></article><article><ShieldCheck size={22}/><h3>Affiliate-compatible</h3><p>Where program terms allow it, vendor sponsorship and affiliate tracking can coexist as separate commercial relationships.</p></article></div><p className="vendorDisclosure"><b>Important:</b> purchasing a placement does not guarantee a positive editorial recommendation, sales volume or ranking permanence. VantaCart may refuse or remove promotions that do not fit marketplace quality standards.</p></section>
    <footer className="vendorFooter"><div className="vendorFooterIn"><span>© 2026 VantaCart</span><span>Vendor advertising program · Payments processed securely by Stripe</span></div></footer>
  </main>;
}
