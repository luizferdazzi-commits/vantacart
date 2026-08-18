import Link from 'next/link';
import {Search,MapPin,ShoppingCart,Menu,ShieldCheck,PackageCheck,Headphones,Truck,RotateCcw,Star,ArrowRight,UserRound,Box,Tag,LockKeyhole,LifeBuoy,Globe2,Plane,CheckCircle2} from 'lucide-react';
import {listActiveCatalog} from '@/lib/db';

export const dynamic='force-dynamic';

const categories=[
  ['🎧','Electronics'],['🛋️','Home & Living'],['🧴','Beauty & Health'],['👜','Fashion'],['🐶','Pet Supplies'],['🏋️','Sports & Outdoors'],['🧸','Toys & Games'],['🚗','Automotive'],['•••','More Categories']
];

export default async function Home(){
 let products=[] as Awaited<ReturnType<typeof listActiveCatalog>>; let error='';
 try{products=await listActiveCatalog();}catch(e){error=e instanceof Error?e.message:'Catalog unavailable';}
 return <main className="storefront cleanMarket">
  <header className="cleanHeader">
   <div className="utilityBar"><div className="utilityInner">
    <div><MapPin size={17}/><span>Deliver to<br/><b>Worldwide</b></span></div>
    <div><ShieldCheck size={17}/><span><b>Secure payments</b><br/>SSL encrypted</span></div>
    <div><Truck size={17}/><span><b>Tracked delivery</b><br/>Real-time updates</span></div>
    <div><RotateCcw size={17}/><span><b>30-day returns</b><br/>Easy & hassle-free</span></div>
    <div><Headphones size={17}/><span><b>Customer support</b><br/>We’re here to help</span></div>
    <div className="utilityRight"><span>🇺🇸 English / USD</span><span>Help & Support</span></div>
   </div></div>
   <div className="mainHeader"><div className="mainHeaderInner">
    <Link href="/" className="cleanLogo"><span className="bagMark">⌑</span>Vanta<span>Cart</span></Link>
    <form className="cleanSearch" action="/#shop"><select aria-label="Category"><option>All categories</option><option>Electronics</option><option>Home & Living</option><option>Beauty & Health</option><option>Fashion</option></select><input placeholder="Search products..." aria-label="Search products"/><button type="submit" aria-label="Search"><Search size={21}/></button></form>
    <div className="headerActions"><div><UserRound size={25}/><span><small>Hello, sign in</small><b>Account & Lists</b></span></div><div><Box size={25}/><span><small>Orders</small><b>Track & Manage</b></span></div><Link href="/cart"><ShoppingCart size={27}/><span><small>Cart</small><b>View cart</b></span></Link></div>
   </div></div>
   <div className="cleanNav"><div className="cleanNavInner"><span><Menu size={18}/> All Categories</span><a href="#shop">Today’s Picks</a><span>New Arrivals</span><span>Best Sellers</span><span>Deals</span><span>Brands</span><span>Track Order</span><a href="#services">Customer Service</a></div></div>
  </header>

  <div className="cleanShell">
   <section className="cleanHero"><div className="heroMainClean"><div className="heroTextClean"><div className="cleanKicker">GLOBAL MARKETPLACE</div><h1>Shop smarter.<br/>Delivered <span>worldwide.</span></h1><p>Quality products from trusted suppliers.<br/>Clear pricing. Tracked delivery. Better shopping.</p><div className="heroButtons"><a href="#shop" className="greenButton">Shop all products <ArrowRight size={17}/></a><a href="#services" className="outlineButton">How it works</a></div><div className="ratingTrust"><div className="avatarStack"><i>JD</i><i>AM</i><i>LC</i></div><div><span>Trusted shopping experience</span><b>★★★★★ <em>Catalog reviewed before publishing</em></b></div></div></div><div className="heroVisualClean"><div className="globeVisual"><Globe2 size={150}/></div><Plane className="planeVisual" size={92}/><div className="parcelVisual"><Box size={70}/><b>VantaCart</b></div><div className="shieldVisual"><ShieldCheck size={62}/></div></div></div>
    <div className="heroCardsClean"><div><span className="roundIcon"><ShieldCheck/></span><div><b>Secure Shopping</b><p>Your data and payments are protected.</p></div><ArrowRight/></div><div><span className="roundIcon"><Truck/></span><div><b>Global Delivery</b><p>International shipping with tracking.</p></div><ArrowRight/></div><div><span className="roundIcon"><RotateCcw/></span><div><b>Easy Returns</b><p>Clear 30-day return target.</p></div><ArrowRight/></div></div>
   </section>

   <section className="benefitStrip" id="services"><div><Tag/><span><b>Clear pricing</b>No hidden product fees</span></div><div><PackageCheck/><span><b>Reviewed catalog</b>Products approved before sale</span></div><div><LockKeyhole/><span><b>Safe payments</b>Trusted payment providers</span></div><div><ShieldCheck/><span><b>Buyer protection</b>Shop with confidence</span></div><div><LifeBuoy/><span><b>Order support</b>Help when you need it</span></div></section>

   <section className="categorySection"><div className="sectionTitleRow"><h2>Shop by category</h2><a href="#shop">View all categories <ArrowRight size={15}/></a></div><div className="roundCategories">{categories.map(([icon,name])=><a href="#shop" key={name}><span>{icon}</span><b>{name}</b></a>)}</div></section>

   <section className="recommendSection" id="shop"><div className="sectionTitleRow"><h2>Recommended for you</h2><a href="#shop">View all <ArrowRight size={15}/></a></div>
    {error?<div className="panel"><h3>Catalog unavailable</h3><p className="meta">{error}</p></div>:products.length===0?<div className="panel"><h3>New products are being prepared</h3><p className="meta">Our catalog team is reviewing products for publication.</p></div>:<div className="cleanProducts">{products.map((p,i)=><Link href={`/products/${p.cj_product_id}`} key={p.id} className="cleanProduct"><div className="cleanProductImage">{p.image_url?<img src={p.image_url} alt={p.name}/>:<span>📦</span>}{i===0&&<span className="cleanBadge">Featured</span>}</div><div className="cleanProductBody"><div className="cleanProductTitle">{p.name}</div><div className="cleanPrice">${Number(p.sale_price).toFixed(2)}</div><div className="cleanStars"><span>★★★★★</span><small>New</small></div><div className="deliveryHint"><CheckCircle2 size={13}/> Tracked fulfillment available</div></div></Link>)}</div>}
   </section>

   <section className="paymentTrust"><div className="paymentMethods"><span>We accept</span><b>VISA</b><b>Mastercard</b><b>AMEX</b><b>PayPal</b><b>Apple Pay</b><b>G Pay</b></div><div><ShieldCheck size={22}/><span><b>Secure payments</b>Your information is protected</span></div></section>
  </div>

  <footer className="cleanFooter"><div className="cleanFooterInner"><div><div className="cleanLogo footerLogo">Vanta<span>Cart</span></div><p>Curated global products with transparent pricing, tracked fulfillment and customer-first support.</p></div><div><b>Customer care</b><span>Help center</span><span>Track order</span><span>Returns & refunds</span><span>Shipping information</span></div><div><b>About VantaCart</b><span>How we select products</span><span>Supplier network</span><span>Buyer protection</span></div><div><b>Policies</b><span>Privacy policy</span><span>Terms of service</span><span>Return policy</span></div></div><div className="footerCopyright">© 2026 VantaCart · English · USD · Global marketplace</div></footer>
 </main>;
}
