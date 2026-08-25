import { notFound } from 'next/navigation';
import GenericHotmartOfferLanding from '../../components/GenericHotmartOfferLanding';
import { getHotmartAffiliateOffers } from '../../../lib/hotmart';
export const dynamic='force-dynamic';
type Lang='pt'|'en';
export default async function LeadloversOffer({searchParams}:{searchParams:Promise<{lang?:string}>}){
 const sp=await searchParams;const lang:Lang=sp?.lang==='en'?'en':'pt';
 const offer=getHotmartAffiliateOffers().find(o=>o.active&&/leadlovers/i.test(o.name));if(!offer)notFound();
 return <GenericHotmartOfferLanding campaign={{id:`hotmart-${offer.id}`,name:offer.name,advertiser:offer.producer||offer.name,description:offer.description,trackingLink:offer.hotlink,category:offer.category}} lang={lang} slug="leadlovers"/>;
}
