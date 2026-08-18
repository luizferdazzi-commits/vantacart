import Link from 'next/link';
import {notFound} from 'next/navigation';
import {products,money} from '@/lib/demo';

export default async function Product({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const p=products.find(x=>x.slug===slug);
  if(!p) notFound();
  return <main><div className="shell"><nav className="nav"><Link href="/" className="brand" style={{textDecoration:'none',color:'inherit'}}>Vanta<span>Cart</span></Link><div className="actions"><span className="demo">DEMO MODE</span></div></nav><div className="productPage"><div className="bigVisual">{p.emoji}</div><div className="productInfo"><div className="eyebrow" style={{color:'#1f5147'}}>{p.category} · OPPORTUNITY {p.score}/100</div><h1>{p.name}</h1><div className="meta">★ {p.rating} · {p.orders.toLocaleString()} supplier orders</div><div className="priceBig">{money(p.price)}</div><p style={{lineHeight:1.7,color:'#555'}}>A curated demo product prepared for global fulfillment. Product facts, materials, certifications and supplier claims must be verified before live publication.</p><div className="infoBox"><b>Estimated delivery</b><div className="meta" style={{marginTop:6}}>6–12 business days · final rate depends on destination and supplier connector.</div></div><div className="infoBox"><b>Margin protection</b><div className="meta" style={{marginTop:6}}>Supplier cost {money(p.cost)} + demo shipping {money(p.shipping)}. Live pricing remains locked until a supplier integration is verified.</div></div><button className="btn dark full">Add to demo cart</button><button className="btn light full">Buy now — simulation only</button></div></div></div></main>
}
