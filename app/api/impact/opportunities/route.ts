import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function authHeader(accountSid: string, authToken: string) {
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;
}

function isDigitalCampaign(campaign: any) {
  const text = `${campaign?.CampaignName ?? ""} ${campaign?.AdvertiserName ?? ""} ${campaign?.CampaignDescription ?? ""}`.toLowerCase();
  return !/protoarc|keyboard|mouse|ergonomic|workspace|desk|home office/.test(text);
}

function digitalCategory(campaign: any) {
  const text = `${campaign?.CampaignName ?? ""} ${campaign?.AdvertiserName ?? ""} ${campaign?.CampaignDescription ?? ""}`.toLowerCase();
  if (/video|creator|pixverse|vidu|creao|lorka|movavi|domoai|wizstar/.test(text)) return "IA e criação";
  if (/crm|riibase|appy pie|business|presentation|deepvinci|base44|wegic|medo|verdent/.test(text)) return "SaaS e negócios";
  if (/gamsgo|subscription/.test(text)) return "Assinaturas digitais";
  return "Tecnologia digital";
}

export async function GET() {
  const accountSid = process.env.IMPACT_ACCOUNT_SID;
  const authToken = process.env.IMPACT_AUTH_TOKEN;
  if (!accountSid || !authToken) return NextResponse.json({ ok:false,error:"Impact credentials are not configured" },{status:500});

  const endpoint = `https://api.impact.com/Mediapartners/${encodeURIComponent(accountSid)}/Campaigns.json?PageSize=100`;
  try {
    const response = await fetch(endpoint,{headers:{Authorization:authHeader(accountSid,authToken),Accept:"application/json"},cache:"no-store"});
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ok:false,status:response.status,error:"Impact campaign request failed"},{status:response.status});

    const campaigns=Array.isArray(data?.Campaigns)?data.Campaigns:[];
    const active=campaigns.filter((c:any)=>c.ContractStatus==="Active"&&c.TrackingLink);
    const candidates=active.filter(isDigitalCampaign).map((c:any)=>({
      id:c.CampaignId,partner:c.AdvertiserName,program:c.CampaignName,category:digitalCategory(c),
      trackingReady:true,status:c.ContractStatus,trackingLink:c.TrackingLink
    })).sort((a:any,b:any)=>a.category.localeCompare(b.category));

    return NextResponse.json({
      ok:true,
      model:"active-partners-publication-queue",
      activeProgramCount:active.length,
      publicationEligible:candidates.length,
      targetActivePartners:100,
      remainingToTarget:Math.max(0,100-active.length),
      candidates,
      note:"This endpoint is the publication queue for already-active Impact programs. Discovery/application to new marketplace brands is a separate workflow because the joined-programs API does not enumerate uncontracted marketplace brands."
    },{headers:{"Cache-Control":"s-maxage=900, stale-while-revalidate=3600"}});
  } catch(error) {
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Unexpected Impact API error"},{status:500});
  }
}
