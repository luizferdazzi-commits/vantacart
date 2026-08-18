import Link from 'next/link';

export const dynamic='force-dynamic';

type Params={pid?:string;name?:string;image?:string;cost?:string;price?:string};

export default async function ImportDraft({searchParams}:{searchParams:Promise<Params>}){
 const p=await searchParams;
 const cost=Number(p.cost||0), price=Number(p.price||0), profit=Math.max(0,price-cost), margin=price?profit/price*100:0;
 return <div className="main"><div className="topline"><div><div className="eyebrow" style={{color:'#1f5147'}}>CATALOG · SAFE IMPORT</div><h1>Import Draft</h1><p className="meta">Review a CJ product before adding it to the VantaCart catalog. This does not place a supplier order or charge anything.</p></div><span className="demo">DRAFT ONLY</span></div>
 {!p.pid?<div className="panel"><h3>No product selected</h3><p className="meta">Choose a product in Product Hunter and click Import Draft.</p><Link className="btn dark" href="/admin/discover">Open Product Hunter</Link></div>:
 <div className="panel"><div style={{display:'grid',gridTemplateColumns:'minmax(180px,280px) 1fr',gap:28,alignItems:'start'}}>{p.image?<img src={p.image} alt={p.name||'CJ product'} style={{width:'100%',borderRadius:18}}/>:<div className="visual">📦</div>}<div><span className="tag">CJ PRODUCT</span><h2>{p.name||'Imported product'}</h2><p className="meta">CJ product ID: {p.pid}</p><div className="metrics"><div><span>CJ catalog cost</span><b>${cost.toFixed(2)}</b></div><div><span>Suggested price</span><b>${price.toFixed(2)}</b></div><div><span>Gross profit*</span><b>${profit.toFixed(2)}</b></div><div><span>Margin*</span><b>{margin.toFixed(0)}%</b></div></div><div className="roadSteps" style={{marginTop:18}}><span className="pill ok">✓ Product captured</span><span className="pill ok">✓ Supplier CJ</span><span className="pill warn">Freight reviewed separately</span><span className="pill">Orders locked</span></div><p className="meta" style={{marginTop:18}}>Draft preview is active. Persistent catalog storage will be connected next; until then this screen is a safe staging area and creates no real order.</p><div className="buttons"><Link className="btn light" href="/admin/discover">Back to Hunter</Link><Link className="btn dark" href={`/admin/discover/freight?pid=${encodeURIComponent(p.pid)}&country=US`}>Review freight</Link></div></div></div><p className="meta" style={{marginTop:20}}>*Before freight, taxes, payment fees and advertising costs.</p></div>}
 </div>
}
