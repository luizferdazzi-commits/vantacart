import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PRICE_REVALIDATE=60*60*6;
const fetchHeaders={
  'User-Agent':'Mozilla/5.0 (compatible; VantaCartPriceBot/1.0; +https://vantacart.vercel.app)',
  'Accept':'text/html,application/xhtml+xml'
};

function authHeader(accountSid: string, authToken: string) {
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;
}
function listOf(data:any){for(const key of ["Items","Products","MarketplaceProducts","Results"]){if(Array.isArray(data?.[key]))return data[key];}return [];}
function numberOf(v:any){if(typeof v==='number'&&Number.isFinite(v))return v;if(typeof v==='string'){const cleaned=v.replace(/\s/g,'').replace(/[^0-9.,-]/g,'');const normalized=cleaned.includes(',')&&cleaned.includes('.')?cleaned.replace(/,/g,''):cleaned.replace(',','.');const n=Number(normalized);if(Number.isFinite(n))return n;}return undefined;}
function currencyOf(v:any){const s=String(v??'').trim().toUpperCase();return /^[A-Z]{3}$/.test(s)?s:undefined;}

type Pricing={price?:number;priceFrom?:number;priceMax?:number;currency?:string;pricingType:'fixed'|'from'|'range'|'unknown';lastPriceCheck?:string;priceNote?:string;priceSource?:'impact_catalog_api'|'structured_data'|'page_data';priceConfidence?:'high'|'medium'};

function parseJsonLd(html:string):Pricing|null{
  const scripts=[...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
  const found:{value:number;currency:string}[]=[];
  const walk=(v:any)=>{
    if(!v||typeof v!=='object')return;
    if(Array.isArray(v)){v.forEach(walk);return;}
    const curr=currencyOf(v.priceCurrency||v.currency);
    const candidates=[v.price,v.lowPrice,v.highPrice];
    for(const candidate of candidates){const n=numberOf(candidate);if(n!==undefined&&n>0&&curr)found.push({value:n,currency:curr});}
    Object.values(v).forEach(walk);
  };
  for(const raw of scripts){try{walk(JSON.parse(raw));}catch{}}
  if(!found.length)return null;
  const curr=found[0].currency;
  const values=[...new Set(found.filter(x=>x.currency===curr).map(x=>x.value))].sort((a,b)=>a-b);
  const common={currency:curr,lastPriceCheck:new Date().toISOString(),priceSource:'structured_data' as const,priceConfidence:'high' as const,priceNote:'Preço confirmado automaticamente em dados estruturados da página oficial do parceiro; condições finais são verificadas no checkout.'};
  return values.length===1?{...common,price:values[0],pricingType:'fixed'}:{...common,priceFrom:values[0],priceMax:values[values.length-1],pricingType:'range'};
}

function parseMetaPrice(html:string):Pricing|null{
  const amount=html.match(/(?:property|itemprop)=["'](?:product:price:amount|price)["'][^>]*(?:content|value)=["']([0-9.,]+)["']/i)?.[1]
    ||html.match(/(?:content|value)=["']([0-9.,]+)["'][^>]*(?:property|itemprop)=["'](?:product:price:amount|price)["']/i)?.[1];
  const curr=html.match(/(?:property|itemprop)=["'](?:product:price:currency|priceCurrency)["'][^>]*content=["']([A-Za-z]{3})["']/i)?.[1]
    ||html.match(/content=["']([A-Za-z]{3})["'][^>]*(?:property|itemprop)=["'](?:product:price:currency|priceCurrency)["']/i)?.[1];
  const value=numberOf(amount),currency=currencyOf(curr);
  if(value===undefined||value<=0||!currency)return null;
  return {price:value,currency,pricingType:'fixed',lastPriceCheck:new Date().toISOString(),priceSource:'page_data',priceConfidence:'high',priceNote:'Preço confirmado automaticamente em metadados da página oficial do parceiro; condições finais são verificadas no checkout.'};
}

function parseVisiblePrices(html:string):Pricing|null{
  const text=html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/&nbsp;/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
  const patterns:[RegExp,string][]=[
    [/(?:US\$|\$)\s*([0-9]{1,5}(?:[.,][0-9]{1,2})?)(?:\s*\/\s*(?:mo|month|mês)|\s+per\s+month)?/gi,'USD'],
    [/€\s*([0-9]{1,5}(?:[.,][0-9]{1,2})?)/gi,'EUR'],
    [/R\$\s*([0-9]{1,6}(?:[.,][0-9]{1,2})?)/gi,'BRL'],
    [/£\s*([0-9]{1,5}(?:[.,][0-9]{1,2})?)/gi,'GBP'],
  ];
  for(const [re,curr] of patterns){
    const values=[...text.matchAll(re)].map(m=>numberOf(m[1])).filter((n):n is number=>n!==undefined&&n>0&&n<1_000_000);
    const unique=[...new Set(values)].sort((a,b)=>a-b);
    // Visible-text extraction is deliberately conservative: require pricing context and avoid noisy pages.
    if(unique.length&&/(pricing|price|plans?|assinatura|subscription|mensal|monthly|annual|yearly|comprar|buy)/i.test(text)){
      const common={currency:curr,lastPriceCheck:new Date().toISOString(),priceSource:'page_data' as const,priceConfidence:'medium' as const,priceNote:'Preço identificado automaticamente na página oficial do parceiro; confirme a condição final no checkout.'};
      return unique.length===1?{...common,price:unique[0],pricingType:'fixed'}:{...common,priceFrom:unique[0],priceMax:unique[unique.length-1],pricingType:'range'};
    }
  }
  return null;
}

function candidateLinks(html:string,baseUrl:string){
  const out:string[]=[];
  for(const match of html.matchAll(/href=["']([^"'#]+)["']/gi)){
    try{
      const u=new URL(match[1],baseUrl);
      if(!/^https?:$/.test(u.protocol))continue;
      const s=`${u.hostname}${u.pathname}${u.search}`.toLowerCase();
      if(/pricing|price|plans?|assinatura|subscription|comprar|buy|checkout/.test(s))out.push(u.toString());
    }catch{}
  }
  return [...new Set(out)].slice(0,3);
}
async function fetchHtml(url:string){
  try{
    const res=await fetch(url,{redirect:'follow',headers:fetchHeaders,next:{revalidate:PRICE_REVALIDATE}});
    if(!res.ok||!(res.headers.get('content-type')||'').includes('text/html'))return null;
    return {html:(await res.text()).slice(0,1_500_000),url:res.url||url};
  }catch{return null;}
}
async function resolveOfficialPagePricing(url?:string):Promise<Pricing|null>{
  if(!url||!/^https?:\/\//i.test(url))return null;
  const first=await fetchHtml(url);if(!first)return null;
  const direct=parseJsonLd(first.html)||parseMetaPrice(first.html);
  if(direct)return direct;
  for(const candidate of candidateLinks(first.html,first.url)){
    const page=await fetchHtml(candidate);if(!page)continue;
    const found=parseJsonLd(page.html)||parseMetaPrice(page.html)||parseVisiblePrices(page.html);
    if(found)return {...found,priceNote:`${found.priceNote||'Preço confirmado automaticamente.'} Fonte: página de preços vinculada ao site oficial.`};
  }
  return parseVisiblePrices(first.html);
}

async function mapWithConcurrency<T,R>(items:T[],limit:number,fn:(item:T,index:number)=>Promise<R>){
  const results=new Array<R>(items.length);let cursor=0;
  async function worker(){while(true){const index=cursor++;if(index>=items.length)return;results[index]=await fn(items[index],index);}}
  await Promise.all(Array.from({length:Math.min(limit,items.length)},()=>worker()));return results;
}

export async function GET() {
  const accountSid = process.env.IMPACT_ACCOUNT_SID;
  const authToken = process.env.IMPACT_AUTH_TOKEN;
  if (!accountSid || !authToken) return NextResponse.json({ ok:false,error:"Impact credentials are not configured" },{status:500});

  const endpoint=`https://api.impact.com/Mediapartners/${encodeURIComponent(accountSid)}/Campaigns.json?PageSize=100`;
  const catalogEndpoint=`https://api.impact.com/Mediapartners/${encodeURIComponent(accountSid)}/Catalogs/ItemSearch?PageSize=100`;
  const headers={Authorization:authHeader(accountSid,authToken),Accept:"application/json"};

  try{
    const [response,catalogResponse]=await Promise.all([
      fetch(endpoint,{headers,cache:"no-store"}),
      fetch(catalogEndpoint,{headers,next:{revalidate:1800}}).catch(()=>null),
    ]);
    const data=await response.json();
    if(!response.ok)return NextResponse.json({ok:false,status:response.status,details:data},{status:response.status});

    const catalogData=catalogResponse?.ok?await catalogResponse.json().catch(()=>null):null;
    const products=listOf(catalogData);
    const pricesByCampaign=new Map<string,{values:number[];currency?:string}>();
    for(const product of products){
      const campaignId=String(product.CampaignId??product.CampaignID??'');
      const price=numberOf(product.CurrentPrice??product.Price);
      const curr=currencyOf(product.Currency??product.CurrencyCode);
      if(!campaignId||price===undefined||price<=0)continue;
      const current=pricesByCampaign.get(campaignId)||{values:[],currency:curr};
      current.values.push(price);if(!current.currency&&curr)current.currency=curr;pricesByCampaign.set(campaignId,current);
    }

    const campaigns=Array.isArray(data?.Campaigns)?data.Campaigns:[];
    const enriched=await mapWithConcurrency(campaigns,5,async(campaign:any)=>{
      const bucket=pricesByCampaign.get(String(campaign.CampaignId));
      const values=bucket?[...new Set(bucket.values)].sort((a,b)=>a-b):[];
      let pricing:Pricing;
      if(values.length){
        pricing=values.length===1?{price:values[0],pricingType:'fixed'}:{priceFrom:values[0],priceMax:values[values.length-1],pricingType:'range'};
        pricing.currency=bucket?.currency;
        pricing.lastPriceCheck=new Date().toISOString();
        pricing.priceNote='Preço obtido do catálogo oficial da Impact; condições finais são confirmadas no site do parceiro.';
        pricing.priceSource='impact_catalog_api';pricing.priceConfidence='high';
      }else{
        pricing=(await resolveOfficialPagePricing(campaign.CampaignUrl))||{pricingType:'unknown'};
      }
      return {
        id:campaign.CampaignId,name:campaign.CampaignName,advertiser:campaign.AdvertiserName,
        description:campaign.CampaignDescription,url:campaign.CampaignUrl,status:campaign.ContractStatus,
        trackingLink:campaign.TrackingLink,allowsDeeplinking:campaign.AllowsDeeplinking,type:campaign.Type,
        ...pricing,
      };
    });

    const priced=enriched.filter((c:any)=>c.pricingType!=='unknown').length;
    return NextResponse.json({
      ok:true,total:Number(data?.["@total"]??campaigns.length),
      pricingResolver:'impact_catalog_api+official_pages',priced,unpriced:enriched.length-priced,
      pricingRefreshHours:6,campaigns:enriched,
    },{headers:{'Cache-Control':'s-maxage=900, stale-while-revalidate=21600'}});
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Unexpected Impact API error"},{status:500});
  }
}
