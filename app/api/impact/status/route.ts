import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const accountSid = process.env.IMPACT_ACCOUNT_SID;
  const authToken = process.env.IMPACT_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return NextResponse.json(
      { ok: false, error: "Impact credentials are not configured" },
      { status: 500 }
    );
  }

  const endpoint = `https://api.impact.com/Mediapartners/${encodeURIComponent(accountSid)}/Campaigns.json?PageSize=1`;
  const authorization = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Basic ${authorization}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const body = await response.text();
    let parsed: unknown = null;
    try {
      parsed = body ? JSON.parse(body) : null;
    } catch {
      parsed = body.slice(0, 500);
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: response.status,
          statusText: response.statusText,
          error: "Impact API request failed",
          details: parsed,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      ok: true,
      connected: true,
      accountSidSuffix: accountSid.slice(-6),
      sample: parsed,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected Impact API error",
      },
      { status: 500 }
    );
  }
}
