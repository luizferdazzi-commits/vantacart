import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function authHeader(accountSid: string, authToken: string) {
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;
}

function isDigitalCampaign(campaign: any) {\n  const text = \`${campaign?.CampaignName ?? ''} ${campaign?.AdvertiserName ?? ''} ${campaign?.CampaignDescription ?? ''}\`.toLowerCase();\n  return !/protoarc|keyboard|mouse|ergonomic|workspace|desk|home office/.test(text);\n}\n\nfunction digitalCategory(campaign: any) {
  const text = `${campaign?.CampaignName ?? ""} ${campaign?.AdvertiserName ?? ""} ${campaign?.CampaignDescription ?? ""}`.toLowerCase();
  if (/video|creator|pixverse|vidu|creao|lorka/.test(text)) return "IA e criação";
  if (/crm|riibase|appy pie|business|presentation|deepvinci/.test(text)) return "SaaS e negócios";
  if (/gamsgo/.test(text)) return "Assinaturas digitais";
  return "Tecnologia digital";
}

export async function GET() {
  const accountSid = process.env.IMPACT_ACCOUNT_SID;
  const authToken = process.env.IMPACT_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return NextResponse.json({ ok: false, error: "Impact credentials are not configured" }, { status: 500 });
  }

  const endpoint = `https://api.impact.com/Mediapartners/${encodeURIComponent(accountSid)}/Campaigns.json?PageSize=100`;

  try {
    const response = await fetch(endpoint, {
      headers: { Authorization: authHeader(accountSid, authToken), Accept: "application/json" },
      cache: "no-store",
    });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ ok: false, status: response.status, error: "Impact campaign request failed" }, { status: response.status });
    }

    const campaigns = Array.isArray(data?.Campaigns) ? data.Campaigns : [];
    const candidates = campaigns
      .filter((campaign: any) => campaign.ContractStatus === "Active" && campaign.TrackingLink && isDigitalCampaign(campaign))
      .map((campaign: any) => ({
        id: campaign.CampaignId,
        partner: campaign.AdvertiserName,
        program: campaign.CampaignName,
        category: digitalCategory(campaign),
        trackingReady: true,
        status: campaign.ContractStatus,
      }))
      .sort((a: any, b: any) => a.category.localeCompare(b.category));

    return NextResponse.json({
      ok: true,
      model: "digital-affiliate-only",
      excludes: ["physical products", "inventory", "shipping", "merchant-of-record sales"],
      total: candidates.length,
      candidates,
      note: "Only active digital programs with an Impact tracking link are eligible for VantaCart publication.",
    }, {
      headers: { "Cache-Control": "s-maxage=900, stale-while-revalidate=3600" },
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Unexpected Impact API error",
    }, { status: 500 });
  }
}
