import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function authHeader(accountSid: string, authToken: string) {
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;
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
      return NextResponse.json({ ok: false, status: response.status, details: data }, { status: response.status });
    }

    const campaigns = Array.isArray(data?.Campaigns) ? data.Campaigns : [];
    return NextResponse.json({
      ok: true,
      total: Number(data?.["@total"] ?? campaigns.length),
      campaigns: campaigns.map((campaign: any) => ({
        id: campaign.CampaignId,
        name: campaign.CampaignName,
        advertiser: campaign.AdvertiserName,
        description: campaign.CampaignDescription,
        url: campaign.CampaignUrl,
        status: campaign.ContractStatus,
        trackingLink: campaign.TrackingLink,
        allowsDeeplinking: campaign.AllowsDeeplinking,
        type: campaign.Type,
      })),
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unexpected Impact API error" }, { status: 500 });
  }
}
