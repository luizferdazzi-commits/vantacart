const CJ_BASE='https://developers.cjdropshipping.com/api2.0/v1';

let cachedToken:string|undefined;
let cachedUntil=0;

async function getAccessToken():Promise<string>{
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
  const accessToken=String(json.data.accessToken);
  cachedToken=accessToken;
  const expiry=Date.parse(json.data.accessTokenExpiryDate || '');
  cachedUntil=Number.isFinite(expiry)?Math.max(now+60_000,expiry-5*60_000):now+60*60*1000;
  return accessToken;
}

async function cjJson(url:string|URL,init:RequestInit={}){
  const token=await getAccessToken();
  const headers=new Headers(init.headers||{});
  headers.set('CJ-Access-Token',token);
  const res=await fetch(url,{...init,headers,cache:'no-store'});
  const json=await res.json();
  if(!res.ok || !json?.result) throw new Error(json?.message || 'CJ API request failed');
  return json;
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

export type CjFreightOption={
  logisticName:string;
  logisticAging:string;
  logisticPrice:number;
  taxesFee?:number;
  clearanceOperationFee?:number;
  totalPostageFee?:number;
};

export async function searchCjProducts(keyword='trending',size=20){
  const url=new URL(`${CJ_BASE}/product/listV2`);
  url.searchParams.set('page','1');
  url.searchParams.set('size',String(Math.min(Math.max(size,1),50)));
  if(keyword.trim()) url.searchParams.set('keyWord',keyword.trim());
  url.searchParams.set('features','enable_category');
  url.searchParams.set('sort','desc');
  url.searchParams.set('orderBy','1');

  const json=await cjJson(url);
  const groups=Array.isArray(json?.data?.content)?json.data.content:[];
  const products:CjProduct[]=groups.flatMap((g:any)=>Array.isArray(g?.productList)?g.productList:[]);
  return {products,totalRecords:Number(json?.data?.totalRecords||products.length)};
}

export async function getCjProductDetails(pid:string){
  const url=new URL(`${CJ_BASE}/product/query`);
  url.searchParams.set('pid',pid);
  return (await cjJson(url)).data;
}

export async function quoteCjFreight(pid:string,endCountryCode='US'){
  const details=await getCjProductDetails(pid);
  const variants=Array.isArray(details?.variants)?details.variants:[];
  if(!variants.length) throw new Error('No shippable CJ variant found for this product');

  const variant=variants[0];
  const inventories=Array.isArray(variant?.inventories)?variant.inventories:[];
  const origin=String(inventories.find((x:any)=>Number(x?.totalInventory||0)>0)?.countryCode || inventories[0]?.countryCode || 'CN').toUpperCase();
  const destination=endCountryCode.trim().toUpperCase();
  if(!/^[A-Z]{2}$/.test(destination)) throw new Error('Destination country must be a 2-letter code');

  const json=await cjJson(`${CJ_BASE}/logistic/freightCalculate`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      startCountryCode:origin,
      endCountryCode:destination,
      products:[{quantity:1,vid:String(variant.vid)}]
    })
  });

  const options:CjFreightOption[]=Array.isArray(json?.data)?json.data.map((x:any)=>({
    logisticName:String(x?.logisticName||'CJ Logistics'),
    logisticAging:String(x?.logisticAging||''),
    logisticPrice:Number(x?.logisticPrice||0),
    taxesFee:x?.taxesFee==null?undefined:Number(x.taxesFee),
    clearanceOperationFee:x?.clearanceOperationFee==null?undefined:Number(x.clearanceOperationFee),
    totalPostageFee:x?.totalPostageFee==null?undefined:Number(x.totalPostageFee)
  })):[];

  options.sort((a,b)=>(a.totalPostageFee??a.logisticPrice)-(b.totalPostageFee??b.logisticPrice));
  return {details,variant,origin,destination,options};
}
