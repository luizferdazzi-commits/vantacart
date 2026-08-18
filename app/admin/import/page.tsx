import Link from 'next/link';
import SaveDraftButton from './SaveDraftButton';

export const dynamic='force-dynamic';

type Params={pid?:string;name?:string;image?:string;cost?:string;price?:string};

export default async function ImportDraft({searchParams}:{searchParams:Promise<Params>}){
 const p=await searchParams;
 const cost=Number(p.cost||0), price=Number(p.price||0), profit=Math.max(0,price-cost), margin=price?profit/price*100:0;
 return <div className="main"><div className="topline"><div><div className="eyebrow" style={{color:'#1f5147'}}>CATALOG · SAFE IMPORT</div><h1>Import Draft</h1><p className="meta">Review a CJ product before adding it to the persistent VantaCart catalog. This does not place a supplier order or charge anything.</p></div><span className="demo">DRAFT ONLY</span></div>
 {!p.pid?<div className="panel"><h3>No product selected</h3><p className="meta">Choose a product in Product Hunter and click Import Draft.</p><Link className="btn dark" href="/admin/discover">Open Product Hunter</Link></div>:
 <div className="panel"><div style={{display:'grid',gridTemplateColumns:'minmax(180px,280px) 1fr',gap:28,alignItems:'start'}}>{p.image?<img src={p.image} alt={p.name||'CJ product'} style={{width:'100%',borderRadius:18}}/>:<div className="visual">📦</div>}<div><span className="tag">CJ PRODUCT</span><h2>{p.name||'Imported product'}</h2><p className="meta">CJ product ID: {p.pid}</p><div className="metrics"><div><span>CJ catalog cost</span><b>${cost.toFixed(2)}</b></div><div><span>Suggested price</span><b>${price.toFixed(2)}</b></div><div><span>Gross profit*</span><b>${profit.toFixed(2)}</b></div><div><span>Margin*</span><b>{margin.toFixed(0)}%</b></div></div><div className="roadSteps" style={{marginTop:18}}><span className="pill ok">✓ Product captured</span><span className="pill ok">✓ Supplier CJ</span><span className="pill ok">✓ Neon catalog ready</span><span className="pill">Orders locked</span></div><p className="meta" style={{marginTop:18}}>Saving creates or updates a DRAFT product in Neon Postgres. The same CJ product cannot be duplicated.</p><div className="buttons"><Link className="btn light" href="/admin/discover">Back to Hunter</Link><Link className="btn light" href={`/admin/discover/freight?pid=${encodeURIComponent(p.pid)}&country=US`}>Review freight</Link><SaveDraftButton cjProductId={p.pid} name={p.name||'Imported product'} imageUrl={p.image||''} cost={cost} price={price}/></div></div></div><p className="meta" style={{marginTop:20}}>*Before freight, taxes, payment fees and advertising costs.</p></div>}
 </div>
}
