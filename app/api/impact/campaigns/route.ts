import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function authHeader(accountSid: string, authToken: string) {
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;
}
function listOf(data:any){for(const key of ["Products","MarketplaceProducts","Items","Results"]){if(Array.isArray(data?.[key]))return data[key];}return [];}
function numberOf(v:any){if(typeof v==='number'&&Number.isFinite(v))return v;if(typeof v==='string'){const n=Number(v.replace(/[^0-9.,-]/g,'').replace(',','.'));if(Number.isFinite(n))return n;}return undefined;}

export async function GET() {
  const accountSid = process.env.IMPACT_ACCOUNT_SID;
  const authToken = process.env.IMPACT_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return NextResponse.json({ ok: false, error: "Impact credentials are not configured" }, { status: 500 });
  }

  const endpoint = `https://api.impact.com/Mediapartners/${encodeURIComponent(accountSid)}/Campaigns.json?PageSize=100`;
  const productEndpoint=`https://api.impact.com/Mediapartners/${encodeURIComponent(accountSid)}/Marketplace/Products?PageSize=100`;
  const headers={ Authorization: authHeader(accountSid, authToken), Accept: "application/json" };

  try {
    const [response,productResponse] = await Promise.all([
      fetch(endpoint,{headers,cache:"no-store"}),
      fetch(productEndpoint,{headers,next:{revalidate:1800}}).catch(()=>null),
    ]);

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ ok: false, status: response.status, details: data }, { status: response.status });
    }

    const productData=productResponse?.ok?await productResponse.json().catch(()=>null):null;
    const products=listOf(productData);
    const pricesByProgram=new Map<string,{values:number[];currency?:string}>();
    for(const product of products){
      const program=String(product.ProgramId??product.ProgramID??product.CampaignId??product.CampaignID??'');
      const price=numberOf(product.CurrentPrice??product.Price);
      const curr=String(product.Currency??product.CurrencyCode??'').trim().toUpperCase()||undefined;
      if(!program||price===undefined)continue;
      const current=pricesByProgram.get(program)||{values:[],currency:curr};
      current.values.push(price);if(!current.currency&&curr)current.currency=curr;pricesByProgram.set(program,current);
    }

    const campaigns = Array.isArray(data?.Campaigns) ? data.Campaigns : [];
    return NextResponse.json({
      ok: true,
      total: Number(data?.["@total"] ?? campaigns.length),
      pricingResolver: products.length?'impact_product_feed':'unavailable',
      campaigns: campaigns.map((campaign: any) => {
        const bucket=pricesByProgram.get(String(campaign.CampaignId));
        const values=bucket?[...new Set(bucket.values)].sort((a,b)=>a-b):[];
        const pricing=values.length===1?{price:values[0],pricingType:'fixed'}:values.length>1?{priceFrom:values[0],priceMax:values[values.length-1],pricingType:'range'}:{pricingType:'unknown'};
        return {
          id: campaign.CampaignId,
          name: campaign.CampaignName,
          advertiser: campaign.AdvertiserName,
          description: campaign.CampaignDescription,
          url: campaign.CampaignUrl,
          status: campaign.ContractStatus,
          trackingLink: campaign.TrackingLink,
          allowsDeeplinking: campaign.AllowsDeeplinking,
          type: campaign.Type,
          ...pricing,
          currency:bucket?.currency,
          lastPriceCheck:values.length?new Date().toISOString():undefined,
          priceNote:values.length?'Preço obtido do feed de produtos da Impact. O valor final é confirmado no site do parceiro.':undefined,
        };
      }),
    },{headers:{'Cache-Control':'s-maxage=900, stale-while-revalidate=3600'}});
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unexpected Impact API error" }, { status: 500 });
  }
}
