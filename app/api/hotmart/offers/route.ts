import { NextResponse } from 'next/server';
import { getHotmartAffiliateOffers,hotmartConfigured } from '../../../../lib/hotmart';
import { resolveHotmartPricing } from '../../../../lib/affiliate-pricing';

export const dynamic='force-dynamic';

export async function GET(){
  const baseOffers=getHotmartAffiliateOffers();
  const offers=await Promise.all(baseOffers.map(async offer=>{
    const pricing=await resolveHotmartPricing(offer);
    return {...offer,...pricing};
  }));
  return NextResponse.json({
    ok:true,
    network:'hotmart',
    developersConfigured:hotmartConfigured(),
    pricingResolver:'automatic',
    pricingRefreshHours:6,
    total:offers.length,
    offers,
  },{headers:{'Cache-Control':'s-maxage=900, stale-while-revalidate=21600'}});
}
