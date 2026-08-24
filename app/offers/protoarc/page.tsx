import { notFound } from 'next/navigation';
import GenericImpactOfferLanding, { GenericImpactCampaign } from '../../components/GenericImpactOfferLanding';

export const dynamic = 'force-dynamic';

type Lang = 'pt' | 'en';

function authHeader(accountSid: string, authToken: string) {
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`;
}

async function getProtoArcCampaign(): Promise<GenericImpactCampaign | null> {
  const accountSid = process.env.IMPACT_ACCOUNT_SID;
  const authToken = process.env.IMPACT_AUTH_TOKEN;
  if (!accountSid || !authToken) return null;

  const endpoint = `https://api.impact.com/Mediapartners/${encodeURIComponent(accountSid)}/Campaigns.json?PageSize=100`;
  const response = await fetch(endpoint, {
    headers: {
      Authorization: authHeader(accountSid, authToken),
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) return null;
  const data = await response.json();
  const campaigns = Array.isArray(data?.Campaigns) ? data.Campaigns : [];
  const campaign = campaigns.find((item: any) => {
    const name = `${item?.CampaignName || ''} ${item?.AdvertiserName || ''}`.toLowerCase();
    return name.includes('protoarc') && item?.ContractStatus === 'Active' && item?.TrackingLink;
  });

  if (!campaign) return null;

  return {
    id: campaign.CampaignId,
    name: campaign.CampaignName,
    advertiser: campaign.AdvertiserName,
    description: campaign.CampaignDescription,
    url: campaign.CampaignUrl,
    status: campaign.ContractStatus,
    trackingLink: campaign.TrackingLink,
    allowsDeeplinking: campaign.AllowsDeeplinking,
    type: campaign.Type,
  };
}

export default async function ProtoArcOffer({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const [sp, campaign] = await Promise.all([searchParams, getProtoArcCampaign()]);
  const lang: Lang = sp?.lang === 'en' ? 'en' : 'pt';

  if (!campaign) notFound();

  return <GenericImpactOfferLanding campaign={campaign} lang={lang} slug="protoarc" />;
}
