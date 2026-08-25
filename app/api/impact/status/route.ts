import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function authHeader(accountSid: string, authToken: string) {
  return { Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`, Accept: "application/json" };
}

export async function GET() {
  const accountSid = process.env.IMPACT_ACCOUNT_SID;
  const authToken = process.env.IMPACT_AUTH_TOKEN;
  if (!accountSid || !authToken) return NextResponse.json({ ok: false, error: "Impact credentials are not configured" }, { status: 500 });

  try {
    const [campaignResponse, userResponse] = await Promise.all([
      fetch(`https://api.impact.com/Mediapartners/${encodeURIComponent(accountSid)}/Campaigns.json?PageSize=1`, { headers: authHeader(accountSid, authToken), cache: "no-store" }),
      fetch(`https://api.impact.com/Mediapartners/${encodeURIComponent(accountSid)}/Users.json?PageSize=1`, { headers: authHeader(accountSid, authToken), cache: "no-store" }),
    ]);
    const campaignSample = await campaignResponse.json().catch(() => null);
    const userData = await userResponse.json().catch(() => null);
    const user = Array.isArray(userData?.Users) ? userData.Users[0] : null;
    const permissions = (user?.AccessRights || []).flatMap((role: any) => role?.Permissions || []);
    return NextResponse.json({
      ok: campaignResponse.ok && userResponse.ok,
      connected: campaignResponse.ok,
      accountSidSuffix: accountSid.slice(-6),
      activeProgramCount: Number(campaignSample?.["@total"] ?? 0),
      canApplyToCampaign: permissions.includes("APPLY_TO_CAMPAIGN"),
      canNegotiateAgreements: permissions.includes("NEGOTIATE_AGREEMENTS"),
      userAccessCheck: userResponse.ok,
    }, { status: campaignResponse.ok && userResponse.ok ? 200 : 502 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unexpected Impact API error" }, { status: 500 });
  }
}
