import { NextResponse } from 'next/server';
import { getHotmartAccessToken } from '../../../../lib/hotmart';

export const dynamic = 'force-dynamic';

type Probe = { name: string; endpoint: string };

const probes: Probe[] = [
  { name: 'products', endpoint: 'https://developers.hotmart.com/products/api/v1/products?max_results=10' },
  { name: 'sales', endpoint: 'https://developers.hotmart.com/payments/api/v1/sales/history?max_results=10' },
  { name: 'subscriptions', endpoint: 'https://developers.hotmart.com/payments/api/v1/subscriptions?max_results=10' },
];

export async function GET() {
  try {
    const token = await getHotmartAccessToken();
    const results = [];

    for (const probe of probes) {
      const response = await fetch(probe.endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      const body = await response.json().catch(() => null);
      results.push({
        name: probe.name,
        status: response.status,
        available: response.ok,
        count: Array.isArray(body?.items) ? body.items.length : null,
        pageInfo: body?.page_info || null,
        error: response.ok ? null : (body?.error_description || body?.error || body?.message || null),
      });
    }

    return NextResponse.json({ ok: true, network: 'hotmart', results });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, network: 'hotmart', error: error?.message || 'Hotmart capability probe failed' },
      { status: 500 },
    );
  }
}
