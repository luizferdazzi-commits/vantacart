import Link from 'next/link';
import {searchCjProducts,type CjProduct} from '@/lib/cj';
import {money} from '@/lib/demo';

export const dynamic='force-dynamic';

function parsePrice(value?:string){
  if(!value) return 0;
  const matches=value.match(/\d+(?:\.\d+)?/g);
  if(!matches?.length) return 0;
  return Number(matches[0]) || 0;
}

function scoreProduct(p:CjProduct){
  const cost=parsePrice(p.nowPrice||p.sellPrice);
  const listings=Math.max(Number(p.listedNum||0),0);
  const stock=Math.max(Number(p.totalVerifiedInventory||p.warehouseInventoryNum||0),0);
  const demand=Math.min(35,Math.log10(listings+1)*12);
  const inventory=Math.min(25,Math.log10(stock+1)*9);
  const price=cost>0 && cost<=25?22:cost<=50?15:8;
  const shipping=p.addMarkStatus===1?10:5;
  return Math.max(0,Math.min(100,Math.round(20+demand+inventory+price+shipping)));
}

function suggestedPrice(cost:number){
  if(cost<=0) return 0;
  const target=Math.max(cost*2.35,cost+14);
  return Math.ceil(target)-0.10;
}

export default async function Discover({searchParams}:{searchParams:Promise<{q?:string}>}){
  const {q='trending'}=await searchParams;
  let items:CjProduct[]=[];
  let total=0;
  let error='';
  try{
    const result=await searchCjProducts(q,18);
    items=result.products;
    total=result.totalRecords;
  }catch(e){error=e instanceof Error?e.message:'CJ connection failed';}

  return <div className="main"><div className="topline"><div><div className="eyebrow" style={{color:'#1f5147'}}>PRODUCT HUNTER · CJ LIVE</div><h1>Discover opportunities</h1><p className="meta">Live catalog search from CJdropshipping. No supplier orders or payments are enabled.</p></div><span className="demo">LIVE CATALOG · DEMO SALES</span></div>
  <form className="hunterFilters" action="/admin/discover"><input name="q" defaultValue={q} placeholder="Search CJ products, niches or keywords"/><select disabled><option>CJdropshipping</option></select><select disabled><option>Opportunity score</option></select><button className="btn dark" type="submit">Search CJ</button></form>
  {error?<div className="panel" style={{marginBottom:18}}><h3>CJ connection needs attention</h3><p className="meta">{error}</p><p className="meta">The API key stays server-side and is never exposed to the browser.</p></div>:<div className="liveSummary"><b>{items.length}</b> products shown · <b>{total.toLocaleString()}</b> matching CJ records for “{q}”</div>}
  <section className="grid hunterGrid">{items.map(p=>{const cost=parsePrice(p.nowPrice||p.sellPrice);const sell=suggestedPrice(cost);const profit=sell-cost;const margin=sell?profit/sell*100:0;const score=scoreProduct(p);return <article className="card" key={p.id}><div className="visual liveVisual"><span className="tag">CJ LIVE</span>{p.bigImage?<img src={p.bigImage} alt={p.nameEn}/>:<span>📦</span>}</div><div className="hunterScore">{score}<small>/100</small></div><h3>{p.nameEn}</h3><div className="meta">{p.threeCategoryName||p.twoCategoryName||p.oneCategoryName||'CJ Catalog'} · {Number(p.listedNum||0).toLocaleString()} listings</div><div className="metrics"><div><span>CJ cost</span><b>{money(cost)}</b></div><div><span>Suggested sell</span><b>{money(sell)}</b></div><div><span>Gross profit*</span><b>{money(profit)}</b></div><div><span>Margin*</span><b>{margin.toFixed(0)}%</b></div></div><div className="stockLine"><span>Verified stock: <b>{Number(p.totalVerifiedInventory||0).toLocaleString()}</b></span><span>{p.addMarkStatus===1?'Free shipping flag':'Freight not calculated'}</span></div><div className="buttons"><Link className="btn light" href={`/admin/discover?q=${encodeURIComponent(p.nameEn)}`}>Similar</Link><button className="btn dark" disabled>Import draft — next</button></div></article>})}</section>
  <div className="panel roadmap"><h3>Connector status</h3><p className="meta">Product search and CJ authentication are active. Suggested selling prices are internal estimates only; freight is not yet included, so Import Draft remains locked until freight calculation is connected.</p><div className="roadSteps"><span className="pill ok">✓ CJ authentication</span><span className="pill ok">✓ Live product search</span><span className="pill ok">✓ Secure server-side key</span><span className="pill warn">Freight calculator next</span><span className="pill">Live orders locked</span></div><p className="meta" style={{marginTop:14}}>*Gross profit and margin shown here exclude international freight, payment fees, taxes, refunds and advertising. For ranged CJ prices, the displayed cost uses the lowest listed variant price until variant selection is implemented.</p></div></div>
}
