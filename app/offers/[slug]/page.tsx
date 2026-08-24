import { notFound } from 'next/navigation';
import GenericImpactOfferLanding, { GenericImpactCampaign } from '../../components/GenericImpactOfferLanding';

export const dynamic='force-dynamic';

type Lang='pt'|'en';

function authHeader(accountSid:string,authToken:string){
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`;
}

function slugify(value:string){
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

async function getCampaigns():Promise<GenericImpactCampaign[]>{
  const accountSid=process.env.IMPACT_ACCOUNT_SID;
  const authToken=process.env.IMPACT_AUTH_TOKEN;
  if(!accountSid||!authToken)return [];
  const endpoint=`https://api.impact.com/Mediapartners/${encodeURIComponent(accountSid)}/Campaigns.json?PageSize=100`;
  const response=await fetch(endpoint,{headers:{Authorization:authHeader(accountSid,authToken),Accept:'application/json'},cache:'no-store'});
  if(!response.ok)return [];
  const data=await response.json();
  const campaigns=Array.isArray(data?.Campaigns)?data.Campaigns:[];
  return campaigns.map((campaign:any)=>({
    id:campaign.CampaignId,
    name:campaign.CampaignName,
    advertiser:campaign.AdvertiserName,
    description:campaign.CampaignDescription,
    url:campaign.CampaignUrl,
    status:campaign.ContractStatus,
    trackingLink:campaign.TrackingLink,
    allowsDeeplinking:campaign.AllowsDeeplinking,
    type:campaign.Type,
  }));
}

export default async function AutomaticImpactOffer({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{lang?:string}>}){
  const [{slug},sp,campaigns]=await Promise.all([params,searchParams,getCampaigns()]);
  const lang:Lang=sp?.lang==='en'?'en':'pt';
  const campaign=campaigns.find(c=>c.status==='Active'&&c.trackingLink&&slugify(c.name)===slug);
  if(!campaign)notFound();
  return <GenericImpactOfferLanding campaign={campaign} lang={lang} slug={slug}/>;
}
