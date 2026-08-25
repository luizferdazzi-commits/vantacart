export type HotmartAffiliateOffer={
  id:string;
  name:string;
  producer?:string;
  description?:string;
  hotlink:string;
  category?:string;
  active:boolean;
};

/**
 * Hotmart affiliate catalog boundary.
 * Kept completely separate from Impact so an unavailable Hotmart integration
 * can never hide or break existing Impact offers.
 *
 * Hotmart Developers OAuth credentials can later be supplied as:
 * HOTMART_CLIENT_ID, HOTMART_CLIENT_SECRET and HOTMART_BASIC_TOKEN.
 * Affiliate HotLinks are intentionally stored separately because the public
 * Products API documents creator products, not discovery of the affiliate
 * marketplace/automatic extraction of every affiliate HotLink.
 */
export function getHotmartAffiliateOffers():HotmartAffiliateOffer[]{
  const raw=process.env.HOTMART_AFFILIATE_OFFERS_JSON?.trim();
  if(!raw)return [];
  try{
    const parsed=JSON.parse(raw);
    if(!Array.isArray(parsed))return [];
    return parsed.filter((offer:any)=>
      offer&&offer.active!==false&&typeof offer.id==='string'&&typeof offer.name==='string'&&
      typeof offer.hotlink==='string'&&/^https:\/\//i.test(offer.hotlink)
    );
  }catch{return [];}
}

export function hotmartConfigured(){
  return Boolean(process.env.HOTMART_CLIENT_ID?.trim()&&process.env.HOTMART_CLIENT_SECRET?.trim()&&process.env.HOTMART_BASIC_TOKEN?.trim());
}

export async function getHotmartAccessToken(){
  const clientId=process.env.HOTMART_CLIENT_ID?.trim();
  const clientSecret=process.env.HOTMART_CLIENT_SECRET?.trim();
  const basic=process.env.HOTMART_BASIC_TOKEN?.trim();
  if(!clientId||!clientSecret||!basic)throw new Error('Hotmart Developers credentials are not configured');
  const endpoint=`https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`;
  const response=await fetch(endpoint,{method:'POST',headers:{Authorization:`Basic ${basic}`,'Content-Type':'application/json'},cache:'no-store'});
  const data=await response.json();
  if(!response.ok||!data?.access_token)throw new Error(data?.error_description||'Unable to authenticate with Hotmart');
  return data.access_token as string;
}
