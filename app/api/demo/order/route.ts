import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));

  return NextResponse.json({
    demo: true,
    orderId: `DEMO-${Date.now()}`,
    status: "SIMULATED_ONLY",
    externalOrderCreated: false,
    externalChargeCreated: false,
    tracking: "DEMO-TRACK-0001",
    received: payload,
  });
}
