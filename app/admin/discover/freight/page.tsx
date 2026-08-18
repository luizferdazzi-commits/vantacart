import Link from 'next/link';
import {quoteCjFreight} from '@/lib/cj';
import {money} from '@/lib/demo';

export const dynamic='force-dynamic';

function priceNumber(value:unknown){
  const match=String(value??'').match(/\d+(?:\.\d+)?/);
  return match?Number(match[0]):0;
}

export default async function FreightPage({searchParams}:{searchParams:Promise<{pid?:string;country?:string}>}){
  const {pid='',country='US'}=await searchParams;
  let data:Awaited<ReturnType<typeof quoteCjFreight>>|null=null;
  let error='';
  if(pid){
    try{data=await quoteCjFreight(pid,country);}catch(e){error=e instanceof Error?e.message:'Freight calculation failed';}
  }

  const productCost=data?priceNumber(data.variant?.variantSellPrice):0;
  const cheapest=data?.options?.[0];
  const freight=cheapest?(cheapest.totalPostageFee??cheapest.logisticPrice):0;
  const landed=productCost+freight;
  const suggested=landed?Math.ceil(Math.max(landed*2.25,landed+14))-0.10:0;
  const profit=suggested-landed;
  const margin=suggested?profit/suggested*100:0;

  return <div className="main">
    <div className="topline"><div><div className="eyebrow" style={{color:'#1f5147'}}>CJ FREIGHT ANALYZER</div><h1>Estimate landed cost</h1><p className="meta">Live CJ freight quote for one variant. No orders or payments are created.</p></div><Link className="btn light" href="/admin/discover">← Product Hunter</Link></div>

    <form className="hunterFilters" action="/admin/discover/freight">
      <input name="pid" defaultValue={pid} placeholder="CJ Product ID" required/>
      <select name="country" defaultValue={country}>
        <option value="US">United States</option><option value="CA">Canada</option><option value="GB">United Kingdom</option><option value="DE">Germany</option><option value="FR">France</option><option value="IT">Italy</option><option value="ES">Spain</option><option value="PT">Portugal</option><option value="AU">Australia</option>
      </select>
      <button className="btn dark" type="submit">Calculate freight</button>
    </form>

    {error&&<div className="panel"><h3>Freight quote unavailable</h3><p className="meta">{error}</p></div>}

    {data&&<>
      <section className="panel freightProduct"><div className="freightHead">{data.details?.bigImage?<img src={data.details.bigImage} alt={data.details?.productNameEn||'CJ product'}/>:null}<div><div className="meta">{data.details?.productSku}</div><h2>{data.details?.productNameEn||'CJ product'}</h2><div className="meta">Variant: {data.variant?.variantNameEn||data.variant?.variantSku} · Origin {data.origin} → {data.destination}</div></div></div></section>
      <div className="adminGrid"><div className="panel"><div className="meta">Product cost</div><h2>{money(productCost)}</h2></div><div className="panel"><div className="meta">Cheapest freight</div><h2>{money(freight)}</h2></div><div className="panel"><div className="meta">Landed cost*</div><h2>{money(landed)}</h2></div><div className="panel"><div className="meta">Suggested sell</div><h2>{money(suggested)}</h2></div></div>
      <section className="panel"><h3>Available shipping methods</h3><table className="table"><thead><tr><th>Method</th><th>Delivery</th><th>Freight</th><th>Taxes</th><th>Clearance</th><th>Total postage</th></tr></thead><tbody>{data.options.map((o,i)=><tr key={`${o.logisticName}-${i}`}><td><b>{o.logisticName}</b>{i===0?<span className="pill ok" style={{marginLeft:8}}>CHEAPEST</span>:null}</td><td>{o.logisticAging||'—'} days</td><td>{money(o.logisticPrice)}</td><td>{o.taxesFee==null?'—':money(o.taxesFee)}</td><td>{o.clearanceOperationFee==null?'—':money(o.clearanceOperationFee)}</td><td><b>{money(o.totalPostageFee??o.logisticPrice)}</b></td></tr>)}</tbody></table></section>
      <section className="panel roadmap"><h3>Commercial estimate</h3><div className="roadSteps"><span className="pill ok">Landed {money(landed)}</span><span className="pill ok">Suggested {money(suggested)}</span><span className="pill ok">Gross profit {money(profit)}</span><span className="pill ok">Margin {margin.toFixed(0)}%</span><span className="pill warn">Ads & payment fees excluded</span></div><p className="meta" style={{marginTop:14}}>*Landed cost shown here includes the selected CJ product variant and the cheapest live freight quote returned by CJ. Advertising, payment fees, refunds and business taxes are not included.</p></section>
    </>}
  </div>;
}
