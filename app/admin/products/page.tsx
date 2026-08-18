import Link from 'next/link';
import {listCatalog} from '@/lib/db';

export const dynamic='force-dynamic';

export default async function Products(){
  let products=[] as Awaited<ReturnType<typeof listCatalog>>;
  let error='';
  try{products=await listCatalog();}catch(e){error=e instanceof Error?e.message:'Database unavailable';}
  return <div className="main"><div className="topline"><div><div className="eyebrow" style={{color:'#1f5147'}}>CATALOG · NEON POSTGRES</div><h1>Products</h1><p className="meta">Persistent products saved from CJdropshipping. Orders and supplier payments remain locked.</p></div><Link className="btn dark" href="/admin/discover">Find products</Link></div>
  {error?<div className="panel"><h3>Database connection needs attention</h3><p className="meta">{error}</p></div>:products.length===0?<div className="panel"><h3>No catalog products yet</h3><p className="meta">Import a CJ product and save it as a draft.</p></div>:<section className="grid hunterGrid">{products.map(p=><article className="card" key={p.id}><div className="visual liveVisual">{p.image_url?<img src={p.image_url} alt={p.name}/>:<span>📦</span>}<span className="tag">{p.status}</span></div><h3>{p.name}</h3><div className="meta">CJ ID: {p.cj_product_id}</div><div className="metrics"><div><span>CJ cost</span><b>${Number(p.cj_cost).toFixed(2)}</b></div><div><span>Sale price</span><b>${Number(p.sale_price).toFixed(2)}</b></div><div><span>Status</span><b>{p.status}</b></div><div><span>Saved</span><b>{new Date(p.created_at).toLocaleDateString('en-US')}</b></div></div></article>)}</section>}</div>
}
