import Link from 'next/link';
import {listOrders} from '../../../lib/orders';

export const dynamic='force-dynamic';

function money(v:any,c='usd'){
  return new Intl.NumberFormat('en-US',{style:'currency',currency:String(c||'usd').toUpperCase()}).format(Number(v||0));
}

export default async function OrdersPage(){
  const orders=await listOrders(100);
  return <div className="adminWrap"><aside className="side"><div className="brand">Vanta<span>Cart</span></div><div className="menu"><Link href="/admin">Overview</Link><Link href="/admin/discover">Discover Products</Link><Link className="active" href="/admin/orders">Orders</Link></div></aside><main className="main"><div className="topline"><div><div className="eyebrow" style={{color:'#1f5147'}}>OPERATIONS</div><h1>Orders</h1><div className="meta">Live order records from checkout and Stripe webhook confirmation.</div></div><span className="pill ok">{orders.filter(o=>o.payment_status==='PAID').length} PAID</span></div><section className="panel" style={{marginTop:18}}>{orders.length===0?<p className="meta">No orders yet.</p>:<table className="table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Fulfillment</th><th>Destination</th><th>Created</th></tr></thead><tbody>{orders.map(o=><tr key={o.public_id}><td><b>{o.public_id}</b></td><td>{o.customer_email||'—'}</td><td>{Array.isArray(o.items)?o.items.map((i:any)=><div key={`${i.cj_variant_id}-${i.product_name}`}><b>{i.quantity}×</b> {i.product_name}{i.variant_name?` — ${i.variant_name}`:''}</div>):'—'}</td><td>{money(o.total_amount,o.currency)}</td><td><span className={`pill ${o.payment_status==='PAID'?'ok':'warn'}`}>{o.payment_status}</span></td><td><span className={`pill ${o.fulfillment_status==='READY_FOR_FULFILLMENT'?'ok':'warn'}`}>{o.fulfillment_status}</span></td><td>{[o.destination_country,o.destination_postal_code].filter(Boolean).join(' / ')||'—'}<div className="meta">{o.shipping_method||''}</div></td><td>{o.created_at?new Date(o.created_at).toLocaleString('pt-BR'):'—'}</td></tr>)}</tbody></table>}</section></main></div>;
}
