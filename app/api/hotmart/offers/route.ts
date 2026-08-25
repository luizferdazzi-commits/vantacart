import { NextResponse } from 'next/server';
import { getHotmartAffiliateOffers,hotmartConfigured } from '../../../../lib/hotmart';

export const dynamic='force-dynamic';

export async function GET(){
  const offers=getHotmartAffiliateOffers();
  return NextResponse.json({
    ok:true,
    network:'hotmart',
    developersConfigured:hotmartConfigured(),
    total:offers.length,
    offers,
  });
}
