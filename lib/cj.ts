const CJ_BASE='https://developers.cjdropshipping.com/api2.0/v1';

let cachedToken:string|undefined;
let cachedUntil=0;

async function getAccessToken(){
  const now=Date.now();
  if(cachedToken && now<cachedUntil) return cachedToken;
  const apiKey=process.env.CJ_API_KEY;
  if(!apiKey) throw new Error('CJ_API_KEY is not configured');

  const res=await fetch(`${CJ_BASE}/authentication/getAccessToken`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({apiKey}),
    cache:'no-store'
  });
  const json=await res.json();
  if(!res.ok || !json?.result || !json?.data?.accessToken){
    throw new Error(json?.message || 'Unable to obtain CJ access token');
  }
  cachedToken=json.data.accessToken;
  const expiry=Date.parse(json.data.accessTokenExpiryDate || '');
  cachedUntil=Number.isFinite(expiry)?Math.max(now+60_000,expiry-5*60_000):now+60*60*1000;
  return cachedToken;
}

export type CjProduct={
  id:string;
  nameEn:string;
  sku?:string;
  spu?:string;
  bigImage?:string;
  sellPrice?:string;
  nowPrice?:string;
  listedNum?:number;
  oneCategoryName?:string;
  twoCategoryName?:string;
  threeCategoryName?:string;
  warehouseInventoryNum?:number;
  totalVerifiedInventory?:number;
  supplierName?:string;
  deliveryCycle?:string;
  addMarkStatus?:number;
};

export async function searchCjProducts(keyword='trending',size=20){
  const token=await getAccessToken();
  const url=new URL(`${CJ_BASE}/product/listV2`);
  url.searchParams.set('page','1');
  url.searchParams.set('size',String(Math.min(Math.max(size,1),50)));
  if(keyword.trim()) url.searchParams.set('keyWord',keyword.trim());
  url.searchParams.set('features','enable_category');
  url.searchParams.set('sort','desc');
  url.searchParams.set('orderBy','1');

  const res=await fetch(url,{headers:{'CJ-Access-Token':token},cache:'no-store'});
  const json=await res.json();
  if(!res.ok || !json?.result){
    throw new Error(json?.message || 'CJ product search failed');
  }
  const groups=Array.isArray(json?.data?.content)?json.data.content:[];
  const products:CjProduct[]=groups.flatMap((g:any)=>Array.isArray(g?.productList)?g.productList:[]);
  return {products,totalRecords:Number(json?.data?.totalRecords||products.length)};
}
