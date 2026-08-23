import PixVerseOfferLanding from '../../components/PixVerseOfferLanding';

export const dynamic = 'force-dynamic';

export default async function PixVerseOffer({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const sp = await searchParams;
  const lang = sp?.lang === 'en' ? 'en' : 'pt';
  return <PixVerseOfferLanding lang={lang} />;
}
