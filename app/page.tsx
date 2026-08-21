import Link from 'next/link';
import {Search,MapPin,Menu,ShieldCheck,ArrowRight,Globe2,Sparkles,Tag,CheckCircle2,Plane,HeartPulse,Laptop,House,Palette,Activity,TicketPercent,BriefcaseBusiness,Languages,BadgePercent,ExternalLink} from 'lucide-react';

export const dynamic='force-dynamic';

type Lang='pt'|'en';

type SearchParams={lang?:string};

const copy={
  pt:{
    badge:'SHOPPING INTELIGENTE • BRASIL + GLOBAL',
    heroTitle:'As melhores ofertas,',
    heroAccent:'em um só lugar.',
    heroText:'Compare produtos, descubra oportunidades e compre diretamente em lojas parceiras confiáveis. A VantaCart seleciona ofertas no Brasil e no exterior para você economizar tempo e dinheiro.',
    cta:'Explorar ofertas',
    secondary:'Como funciona',
    search:'Busque produtos, marcas, viagens, software...',
    all:'Todas as categorias',
    best:'Ofertas em destaque',
    brazil:'Ofertas Brasil',
    global:'Ofertas Globais',
    how:'Como funciona',
    deals:'Promoções',
    trust:'Compra na loja oficial',
    trustSub:'Você finaliza diretamente com o parceiro',
    compare:'Compare antes de comprar',
    compareSub:'Preço, benefício e disponibilidade em um só lugar',
    globalReach:'Brasil + mundo',
    globalReachSub:'Parceiros nacionais e internacionais',
    categories:'Explore por categoria',
    categoriesSub:'Um marketplace de recomendações para compras do dia a dia e serviços digitais.',
    featured:'Ofertas selecionadas',
    featuredSub:'Os primeiros feeds de parceiros estão sendo conectados. Em breve esta área será atualizada automaticamente com preços, disponibilidade e links rastreáveis.',
    network:'Rede de parceiros',
    networkSub:'A VantaCart está sendo preparada para integrar redes de afiliados do Brasil e do exterior, com atualização automática de catálogo.',
    disclosure:'Transparência: alguns links da VantaCart são links de afiliado. Podemos receber uma comissão quando uma compra é concluída, sem custo adicional para você.',
    footer:'Ofertas, comparações e recomendações para comprar melhor no Brasil e no mundo.',
    view:'Ver ofertas',
  },
  en:{
    badge:'SMART SHOPPING • BRAZIL + GLOBAL',
    heroTitle:'Better deals,',
    heroAccent:'all in one place.',
    heroText:'Compare products, discover opportunities and buy directly from trusted partner stores. VantaCart curates offers from Brazil and worldwide so you can save time and money.',
    cta:'Explore deals',
    secondary:'How it works',
    search:'Search products, brands, travel, software...',
    all:'All categories',
    best:'Featured deals',
    brazil:'Brazil deals',
    global:'Global deals',
    how:'How it works',
    deals:'Promotions',
    trust:'Buy from the official store',
    trustSub:'You complete your purchase directly with the partner',
    compare:'Compare before buying',
    compareSub:'Price, benefits and availability in one place',
    globalReach:'Brazil + worldwide',
    globalReachSub:'Domestic and international partners',
    categories:'Browse by category',
    categoriesSub:'A recommendation marketplace for everyday purchases and digital services.',
    featured:'Curated deals',
    featuredSub:'Our first partner feeds are being connected. Soon this section will update automatically with prices, availability and trackable links.',
    network:'Partner network',
    networkSub:'VantaCart is being prepared to connect affiliate networks from Brazil and abroad with automated catalog updates.',
    disclosure:'Transparency: some VantaCart links are affiliate links. We may earn a commission when a purchase is completed, at no extra cost to you.',
    footer:'Deals, comparisons and recommendations to help you shop smarter in Brazil and worldwide.',
    view:'View deals',
  }
} as const;

const categoryData={
  pt:[
    ['❤️','Saúde & Bem-estar',HeartPulse],['💻','Tecnologia',Laptop],['🏠','Casa & Estilo',House],['✨','Beleza',Palette],
    ['🏃','Fitness',Activity],['✈️','Viagens',Plane],['🤖','Software & IA',BriefcaseBusiness],['🔥','Ofertas',BadgePercent]
  ],
  en:[
    ['❤️','Health & Wellness',HeartPulse],['💻','Technology',Laptop],['🏠','Home & Living',House],['✨','Beauty',Palette],
    ['🏃','Fitness',Activity],['✈️','Travel',Plane],['🤖','Software & AI',BriefcaseBusiness],['🔥','Deals',BadgePercent]
  ]
};

const partnerCards=[
  {name:'Brasil',items:'Amazon • Lomadee • varejistas nacionais',status:'EM INTEGRAÇÃO'},
  {name:'Global',items:'Awin • impact.com • CJ Affiliate • Rakuten',status:'EM INTEGRAÇÃO'},
  {name:'Software & IA',items:'SaaS • produtividade • automação • recorrência',status:'PRÓXIMA FASE'}
];

export default async function Home({searchParams}:{searchParams:Promise<SearchParams>}){
  const sp=await searchParams;
  const lang:Lang=sp?.lang==='en'?'en':'pt';
  const t=copy[lang];
  const cats=categoryData[lang];
  const other=lang==='pt'?'en':'pt';
  const otherLabel=lang==='pt'?'English':'Português';

  return <main className="storefront cleanMarket">
    <header className="cleanHeader">
      <div className="utilityBar"><div className="utilityInner">
        <div><MapPin size={17}/><span><b>{lang==='pt'?'Brasil + Global':'Brazil + Global'}</b><br/>{lang==='pt'?'Ofertas selecionadas':'Curated offers'}</span></div>
        <div><ShieldCheck size={17}/><span><b>{t.trust}</b><br/>{lang==='pt'?'Checkout do parceiro':'Partner checkout'}</span></div>
        <div><Tag size={17}/><span><b>{lang==='pt'?'Comparação inteligente':'Smart comparison'}</b><br/>{lang==='pt'?'Preço e benefício':'Price and value'}</span></div>
        <div className="utilityRight"><span>{lang==='pt'?'Marketplace de recomendações':'Recommendation marketplace'}</span></div>
      </div></div>

      <div className="mainHeader"><div className="mainHeaderInner">
        <Link href={`/?lang=${lang}`} className="cleanLogo"><span className="bagMark">✦</span>Vanta<span>Cart</span></Link>
        <form className="cleanSearch" action="/" method="get"><input type="hidden" name="lang" value={lang}/><select aria-label="Category"><option>{t.all}</option>{cats.map(([,name])=><option key={String(name)}>{String(name)}</option>)}</select><input name="q" placeholder={t.search} aria-label={t.search}/><button type="submit" aria-label="Search"><Search size={21}/></button></form>
        <div className="headerActions"><Link href={`/?lang=${other}`} style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}><Languages size={25}/><span><small>{lang==='pt'?'Idioma':'Language'}</small><b>{otherLabel}</b></span></Link></div>
      </div></div>

      <div className="cleanNav"><div className="cleanNavInner"><span><Menu size={18}/> {t.all}</span><a href="#deals">{t.best}</a><a href="#brasil">{t.brazil}</a><a href="#global">{t.global}</a><a href="#how">{t.how}</a><a href="#deals">{t.deals}</a></div></div>
    </header>

    <div className="cleanShell">
      <section className="cleanHero">
        <div className="heroMainClean">
          <div className="heroTextClean"><div className="cleanKicker">{t.badge}</div><h1>{t.heroTitle}<br/><span>{t.heroAccent}</span></h1><p>{t.heroText}</p><div className="heroButtons"><a href="#deals" className="greenButton">{t.cta} <ArrowRight size={17}/></a><a href="#how" className="outlineButton">{t.secondary}</a></div><div className="ratingTrust"><div className="avatarStack"><i>🇧🇷</i><i>🌎</i><i>💸</i></div><div><span>{lang==='pt'?'Catálogo multi-parceiro':'Multi-partner catalog'}</span><b>{lang==='pt'?'Mais opções. Mais comparação.':'More choice. Better comparison.'}</b></div></div></div>
          <div className="heroVisualClean"><div className="globeVisual"><Globe2 size={150}/></div><Sparkles className="planeVisual" size={86}/><div className="parcelVisual"><TicketPercent size={65}/><b>{lang==='pt'?'Ofertas Vanta':'Vanta Deals'}</b></div><div className="shieldVisual"><CheckCircle2 size={62}/></div></div>
        </div>
        <div className="heroCardsClean">
          <div><span className="roundIcon"><ShieldCheck/></span><div><b>{t.trust}</b><p>{t.trustSub}</p></div><ArrowRight/></div>
          <div><span className="roundIcon"><Tag/></span><div><b>{t.compare}</b><p>{t.compareSub}</p></div><ArrowRight/></div>
          <div><span className="roundIcon"><Globe2/></span><div><b>{t.globalReach}</b><p>{t.globalReachSub}</p></div><ArrowRight/></div>
        </div>
      </section>

      <section className="benefitStrip" id="how">
        <div><Search/><span><b>{lang==='pt'?'Descubra':'Discover'}</b>{lang==='pt'?'Encontre opções em várias categorias':'Find options across categories'}</span></div>
        <div><Tag/><span><b>{lang==='pt'?'Compare':'Compare'}</b>{lang==='pt'?'Veja preço, benefício e parceiro':'Review price, value and partner'}</span></div>
        <div><ExternalLink/><span><b>{lang==='pt'?'Compre':'Buy'}</b>{lang==='pt'?'Finalize na loja oficial':'Checkout at the official store'}</span></div>
        <div><BadgePercent/><span><b>{lang==='pt'?'Economize':'Save'}</b>{lang==='pt'?'Aproveite ofertas selecionadas':'Use curated offers'}</span></div>
      </section>

      <section className="categorySection"><div className="sectionTitleRow"><div><h2>{t.categories}</h2><p className="meta">{t.categoriesSub}</p></div><a href="#deals">{t.view} <ArrowRight size={15}/></a></div><div className="roundCategories">{cats.map(([icon,name])=><a href="#deals" key={String(name)}><span>{String(icon)}</span><b>{String(name)}</b></a>)}</div></section>

      <section className="recommendSection" id="deals"><div className="sectionTitleRow"><div><h2>{t.featured}</h2><p className="meta">{t.featuredSub}</p></div></div><div className="cleanProducts">
        {cats.slice(0,4).map(([icon,name],i)=><div key={String(name)} className="cleanProduct"><div className="cleanProductImage" style={{display:'grid',placeItems:'center',fontSize:70,background:'linear-gradient(145deg,#f8fafc,#eef6f2)'}}><span>{String(icon)}</span>{i===0&&<span className="cleanBadge">{lang==='pt'?'Novo':'New'}</span>}</div><div className="cleanProductBody"><div className="cleanProductTitle">{String(name)}</div><div className="cleanStars"><span>★★★★★</span><small>{lang==='pt'?'Seleção VantaCart':'VantaCart pick'}</small></div><div className="deliveryHint"><CheckCircle2 size={13}/> {lang==='pt'?'Parceiros em conexão':'Partner feeds connecting'}</div></div></div>)}
      </div></section>

      <section id="brasil" style={{margin:'48px 0 18px',padding:'30px',borderRadius:24,background:'linear-gradient(135deg,#ecfdf5,#ffffff)',border:'1px solid #bbf7d0'}}><div className="sectionTitleRow"><div><h2>🇧🇷 {lang==='pt'?'Brasil primeiro, sem limitar o mundo':'Brazil first, without limiting the world'}</h2><p className="meta">{lang==='pt'?'Ofertas nacionais terão preços em reais e links de parceiros locais.':'Brazilian offers will use BRL pricing and local partner links.'}</p></div></div></section>

      <section id="global" style={{margin:'18px 0 48px',padding:'30px',borderRadius:24,background:'linear-gradient(135deg,#eff6ff,#ffffff)',border:'1px solid #bfdbfe'}}><div className="sectionTitleRow"><div><h2>🌎 {lang==='pt'?'Oportunidades globais':'Global opportunities'}</h2><p className="meta">{lang==='pt'?'Produtos, software, viagens e serviços internacionais com potencial de comissão e recorrência.':'Products, software, travel and global services with commission and recurring-revenue potential.'}</p></div></div></section>

      <section id="network" style={{margin:'48px 0',padding:'28px',borderRadius:22,background:'#f8fafc',border:'1px solid #e2e8f0'}}><div className="sectionTitleRow"><div><h2>{t.network}</h2><p className="meta">{t.networkSub}</p></div></div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:14}}>{partnerCards.map((p,i)=><div key={p.name} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:18,boxShadow:'0 8px 24px rgba(15,23,42,.05)'}}><b style={{fontSize:18}}>{i===0?'🇧🇷 ':i===1?'🌎 ':'💻 '}{p.name}</b><p style={{margin:'8px 0',fontSize:13,color:'#64748b'}}>{p.items}</p><span style={{fontSize:12,fontWeight:800,color:'#166534'}}>{p.status}</span></div>)}</div></section>

      <section className="paymentTrust"><div><ShieldCheck size={22}/><span><b>{lang==='pt'?'Compra transparente':'Transparent shopping'}</b>{t.disclosure}</span></div></section>
    </div>

    <footer className="cleanFooter"><div className="cleanFooterInner"><div><div className="cleanLogo footerLogo">Vanta<span>Cart</span></div><p>{t.footer}</p></div><div><b>{lang==='pt'?'Mercados':'Markets'}</b><span>Brasil</span><span>Global</span><span>Software & IA</span></div><div><b>{lang==='pt'?'Categorias':'Categories'}</b><span>{lang==='pt'?'Tecnologia':'Technology'}</span><span>{lang==='pt'?'Saúde & Bem-estar':'Health & Wellness'}</span><span>{lang==='pt'?'Viagens':'Travel'}</span></div><div><b>{lang==='pt'?'Transparência':'Transparency'}</b><span>{lang==='pt'?'Links de afiliados':'Affiliate links'}</span><span>{lang==='pt'?'Privacidade':'Privacy'}</span><span>{lang==='pt'?'Termos':'Terms'}</span></div></div><div className="footerCopyright">© 2026 VantaCart · {lang==='pt'?'Shopping inteligente Brasil + Global':'Smart shopping Brazil + Global'}</div></footer>
  </main>;
}
