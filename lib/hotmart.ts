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
 * Hotmart Developers OAuth credentials are supplied as:
 * HOTMART_CLIENT_ID, HOTMART_CLIENT_SECRET and HOTMART_BASIC.
 * Affiliate HotLinks are intentionally stored separately because the public
 * Developers APIs are focused on account/business data and do not guarantee
 * discovery of the affiliate marketplace or automatic extraction of every
 * affiliate HotLink.
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

function getBasicCredential(){
  const raw=(process.env.HOTMART_BASIC||process.env.HOTMART_BASIC_TOKEN)?.trim();
  if(!raw)return '';
  return raw.replace(/^Basic\s+/i,'').trim();
}

export function hotmartConfigured(){
  return Boolean(process.env.HOTMART_CLIENT_ID?.trim()&&process.env.HOTMART_CLIENT_SECRET?.trim()&&getBasicCredential());
}

export async function getHotmartAccessToken(){
  const clientId=process.env.HOTMART_CLIENT_ID?.trim();
  const clientSecret=process.env.HOTMART_CLIENT_SECRET?.trim();
  const basic=getBasicCredential();
  if(!clientId||!clientSecret||!basic)throw new Error('Hotmart Developers credentials are not configured');
  const endpoint=`https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`;
  const response=await fetch(endpoint,{method:'POST',headers:{Authorization:`Basic ${basic}`,'Content-Type':'application/json'},cache:'no-store'});
  const data=await response.json().catch(()=>null);
  if(!response.ok||!data?.access_token)throw new Error(data?.error_description||data?.error||`Unable to authenticate with Hotmart (${response.status})`);
  return data.access_token as string;
}
