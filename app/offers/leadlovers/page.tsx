import { notFound } from 'next/navigation';
import GenericImpactOfferLanding from '../../components/GenericImpactOfferLanding';
import { getHotmartAffiliateOffers } from '../../../lib/hotmart';
export const dynamic='force-dynamic';
type Lang='pt'|'en';
export default async function LeadloversOffer({searchParams}:{searchParams:Promise<{lang?:string}>}){
 const sp=await searchParams;const lang:Lang=sp?.lang==='en'?'en':'pt';
 const offer=getHotmartAffiliateOffers().find(o=>o.active&&/leadlovers/i.test(o.name));if(!offer)notFound();
 const campaign={id:`hotmart-${offer.id}`,name:offer.name,advertiser:offer.producer||offer.name,description:offer.description|| (lang==='pt'?'Plataforma de automação de marketing, relacionamento, vendas e gestão de leads.':'Marketing automation, relationship, sales and lead management platform.'),status:'Active',trackingLink:offer.hotlink,type:'Hotmart'};
 return <GenericImpactOfferLanding campaign={campaign} lang={lang} slug="leadlovers"/>;
}
