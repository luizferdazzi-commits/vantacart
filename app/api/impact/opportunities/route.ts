import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 100;
const TARGET_CATEGORIES = [
  "Software > Computer Software",
  "Electronics > Computers > Laptops",
  "Electronics > Computers > Computer Accessories",
  "Home & Garden > Household Supplies",
];

const BRAND_PATTERNS: Array<[string, RegExp]> = [
  ["Apple", /\bapple\b|\bmacbook\b|\bimac\b/i],
  ["Lenovo", /\blenovo\b/i],
  ["Logitech", /\blogitech\b/i],
  ["ESET", /\beset\b/i],
  ["Norton", /\bnorton\b/i],
  ["Bitdefender", /\bbitdefender\b/i],
  ["McAfee", /\bmcafee\b/i],
  ["Microsoft", /\bmicrosoft\b|\bwindows\b|\boffice 365\b/i],
  ["Adobe", /\badobe\b/i],
  ["Dell", /\bdell\b/i],
  ["HP", /\bhewlett[- ]packard\b|\bHP\b/i],
  ["ASUS", /\basus\b/i],
  ["Anker", /\banker\b/i],
  ["BISSELL", /\bbissell\b/i],
];

function authHeader(accountSid: string, authToken: string) {
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;
}

function listOf(data: any) {
  for (const key of ["Products", "MarketplaceProducts", "Items", "Results"]) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
}

export async function GET() {
  const accountSid = process.env.IMPACT_ACCOUNT_SID;
  const authToken = process.env.IMPACT_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return NextResponse.json({ ok: false, error: "Impact credentials are not configured" }, { status: 500 });
  }

  try {
    const scans = await Promise.all(TARGET_CATEGORIES.map(async (category) => {
      const params = new URLSearchParams({ PageSize: String(PAGE_SIZE), Category: category });
      const endpoint = `https://api.impact.com/Mediapartners/${encodeURIComponent(accountSid)}/Marketplace/Products?${params}`;
      const response = await fetch(endpoint, {
        headers: { Authorization: authHeader(accountSid, authToken), Accept: "application/json" },
        cache: "no-store",
      });
      const data = await response.json();
      return { category, products: response.ok ? listOf(data) : [] };
    }));

    const candidates = new Map<string, { score: number; products: Set<string>; categories: Set<string> }>();
    for (const scan of scans) {
      for (const product of scan.products) {
        const name = String(product.ProductName ?? product.Name ?? product.Title ?? "");
        for (const [brand, pattern] of BRAND_PATTERNS) {
          if (!pattern.test(name)) continue;
          const current = candidates.get(brand) ?? { score: 0, products: new Set(), categories: new Set() };
          current.products.add(name);
          current.categories.add(scan.category);
          current.score += scan.category.includes("Laptops") ? 7 : scan.category.includes("Software") ? 6 : 4;
          candidates.set(brand, current);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      scannedCategories: TARGET_CATEGORIES,
      candidates: [...candidates.entries()]
        .map(([brand, data]) => ({
          brand,
          score: data.score + data.categories.size * 5,
          productCount: data.products.size,
          categories: [...data.categories],
          sampleProducts: [...data.products].slice(0, 4),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 20),
      note: "Candidates are ranked from Marketplace product demand signals. Affiliate application remains subject to each Impact program's acceptance flow.",
    }, {
      headers: { "Cache-Control": "s-maxage=21600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Unexpected Impact API error",
    }, { status: 500 });
  }
}
