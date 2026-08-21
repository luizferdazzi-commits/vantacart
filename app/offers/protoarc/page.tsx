import AffiliateOfferLanding from '../../components/AffiliateOfferLanding';

export const dynamic = 'force-dynamic';

export default async function ProtoArcOffer({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const sp = await searchParams;
  const lang = sp?.lang === 'en' ? 'en' : 'pt';
  return <AffiliateOfferLanding slug="protoarc" lang={lang} />;
}
