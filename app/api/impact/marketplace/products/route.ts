import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const MARKETPLACE_PAGE_SIZE = 100;
const MAX_CATEGORY_LENGTH = 180;

function authHeader(accountSid: string, authToken: string) {
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;
}

function listOf(data: any) {
  for (const key of ["Products", "MarketplaceProducts", "Items", "Results"]) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
}

export async function GET(request: NextRequest) {
  const accountSid = process.env.IMPACT_ACCOUNT_SID;
  const authToken = process.env.IMPACT_AUTH_TOKEN;
  const category = request.nextUrl.searchParams.get("category")?.trim().slice(0, MAX_CATEGORY_LENGTH);

  if (!accountSid || !authToken) {
    return NextResponse.json({ ok: false, error: "Impact credentials are not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({ PageSize: String(MARKETPLACE_PAGE_SIZE) });
  if (category) params.set("Category", category);
  const endpoint = `https://api.impact.com/Mediapartners/${encodeURIComponent(accountSid)}/Marketplace/Products?${params}`;

  try {
    const response = await fetch(endpoint, {
      headers: { Authorization: authHeader(accountSid, authToken), Accept: "application/json" },
      cache: "no-store",
    });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        ok: false,
        status: response.status,
        error: "Impact Marketplace request failed",
        details: data,
      }, { status: response.status });
    }

    const products = listOf(data);
    return NextResponse.json({
      ok: true,
      category: category ?? null,
      total: Number(data?.["@total"] ?? products.length),
      products: products.map((product: any) => ({
        id: product.ProductId ?? product.Id ?? product.ProductID,
        name: product.ProductName ?? product.Name ?? product.Title,
        brand: product.BrandName ?? product.AdvertiserName ?? product.Brand,
        description: product.Description ?? product.ProductDescription,
        category: product.Category ?? product.CategoryName,
        image: product.ImageUrl ?? product.ImageURL ?? product.Image,
        url: product.Url ?? product.URL ?? product.ProductUrl,
        price: product.CurrentPrice ?? product.Price,
        currency: product.Currency ?? product.CurrencyCode,
      })),
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
