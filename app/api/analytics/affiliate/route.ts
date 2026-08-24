import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // Beacon payload can be empty/invalid without breaking navigation.
  }

  const event = {
    type: 'affiliate_conversion',
    partner: typeof body.partner === 'string' ? body.partner.slice(0, 80) : 'unknown',
    sourcePath: typeof body.sourcePath === 'string' ? body.sourcePath.slice(0, 200) : 'unknown',
    destinationHost: typeof body.destinationHost === 'string' ? body.destinationHost.slice(0, 160) : 'unknown',
    diagnostic: body.diagnostic === true,
    recordedAt: new Date().toISOString(),
  };

  // Deliberately excludes IP, cookies, email and full destination URLs.
  console.info('[vantacart-affiliate-conversion]', JSON.stringify(event));

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
