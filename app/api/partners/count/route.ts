import { NextResponse } from 'next/server';
import { getHotmartAffiliateOffers } from '../../../../lib/hotmart';

export const dynamic='force-dynamic';

function authHeader(accountSid:string,authToken:string){
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`;
}

export async function GET(){
  const accountSid=process.env.IMPACT_ACCOUNT_SID;
  const authToken=process.env.IMPACT_AUTH_TOKEN;

  let impact=0;
  let impactOk=false;

  if(accountSid&&authToken){
    try{
      const endpoint=`https://api.impact.com/Mediapartners/${encodeURIComponent(accountSid)}/Campaigns.json?PageSize=100`;
      const response=await fetch(endpoint,{
        headers:{Authorization:authHeader(accountSid,authToken),Accept:'application/json'},
        cache:'no-store'
      });
      if(response.ok){
        const data=await response.json();
        const campaigns=Array.isArray(data?.Campaigns)?data.Campaigns:[];
        impact=campaigns.filter((c:any)=>c.ContractStatus==='Active'&&c.TrackingLink).length;
        impactOk=true;
      }
    }catch{}
  }

  const hotmartOffers=getHotmartAffiliateOffers();
  const hotmart=hotmartOffers.filter((o:any)=>o.active&&o.hotlink).length;

  return NextResponse.json({
    ok:impactOk||hotmart>0,
    activePartners:impact+hotmart,
    sources:{impact,hotmart,impactOk}
  },{headers:{'Cache-Control':'s-maxage=300, stale-while-revalidate=1800'}});
}
