export type ProviderId='cj'|'supliful'|'rapid'|'specialist'|'chance2brand'|'hypersku';

export type ProviderStatus={
  id:ProviderId;
  name:string;
  category:string;
  mode:'LIVE'|'READY_FOR_CREDENTIALS'|'MANUAL_BRIDGE';
  connected:boolean;
  automatedOrders:boolean;
  automatedCatalog:boolean;
  notes:string;
};

const has=(name:string)=>Boolean(process.env[name]?.trim());

export async function getProviderStatuses():Promise<ProviderStatus[]>{
  const suplifulReady=has('SHOPIFY_STORE_DOMAIN')&&has('SHOPIFY_ADMIN_ACCESS_TOKEN');
  const hyperskuReady=has('HYPERSKU_API_KEY')||has('HYPERSKU_ACCESS_TOKEN');
  return [
    {id:'cj',name:'CJ Dropshipping',category:'General / fallback',mode:has('CJ_API_KEY')?'LIVE':'READY_FOR_CREDENTIALS',connected:has('CJ_API_KEY'),automatedOrders:has('CJ_API_KEY'),automatedCatalog:has('CJ_API_KEY'),notes:'Existing fallback connector. Live ordering remains available for legacy products.'},
    {id:'supliful',name:'Supliful',category:'Supplements / wellness',mode:suplifulReady?'LIVE':'READY_FOR_CREDENTIALS',connected:suplifulReady,automatedOrders:suplifulReady,automatedCatalog:suplifulReady,notes:'Official custom-store path uses Shopify Admin API as a headless bridge to Supliful.'},
    {id:'rapid',name:'Rapid Fulfillment',category:'Supplements / 3PL',mode:'MANUAL_BRIDGE',connected:false,automatedOrders:false,automatedCatalog:false,notes:'Public materials expose store/platform integrations but not an open self-service API credential flow. Connector boundary is prepared; account onboarding/API access is required.'},
    {id:'specialist',name:'Specialist Supplements',category:'Supplements / UK-EU',mode:'MANUAL_BRIDGE',connected:false,automatedOrders:false,automatedCatalog:false,notes:'Supplier connector boundary prepared. Public API credentials/documentation are not exposed for unattended setup.'},
    {id:'chance2brand',name:'Chance2Brand',category:'Supplements / EU',mode:'MANUAL_BRIDGE',connected:false,automatedOrders:false,automatedCatalog:false,notes:'Shop integrations are advertised, but unattended public API onboarding is not available from the public site.'},
    {id:'hypersku',name:'HyperSKU',category:'Global sourcing / backup',mode:hyperskuReady?'LIVE':'READY_FOR_CREDENTIALS',connected:hyperskuReady,automatedOrders:hyperskuReady,automatedCatalog:hyperskuReady,notes:'Adapter is credential-gated. Add the HyperSKU API credential supplied by the merchant account to activate.'}
  ];
}

export async function shopifyGraphql<T=any>(query:string,variables:Record<string,unknown>={}):Promise<T>{
  const domain=process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//,'').replace(/\/$/,'');
  const token=process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if(!domain||!token)throw new Error('Supliful/Shopify bridge is not configured');
  const res=await fetch(`https://${domain}/admin/api/2025-07/graphql.json`,{method:'POST',headers:{'Content-Type':'application/json','X-Shopify-Access-Token':token},body:JSON.stringify({query,variables}),cache:'no-store'});
  const json=await res.json();
  if(!res.ok||json?.errors)throw new Error(json?.errors?.[0]?.message||'Shopify Admin API request failed');
  return json.data as T;
}

export async function listSuplifulBridgeProducts(){
  const data=await shopifyGraphql<any>(`query VantaProducts($first:Int!){products(first:$first){edges{node{id title descriptionHtml vendor productType status images(first:4){edges{node{url altText}}} variants(first:50){edges{node{id title sku price availableForSale}}}}}}}`,{first:100});
  return (data?.products?.edges||[]).map((e:any)=>e.node);
}
