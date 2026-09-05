import type { MetadataRoute } from 'next';
import { editorial } from '../lib/editorial';
const BASE_URL=(process.env.NEXT_PUBLIC_SITE_URL||'https://vantacart.vercel.app').replace(/\/$/,'');
const staticPaths=['/','/advertise','/guides','/reviews','/compare','/collections/ai','/collections/business','/collections/creators','/collections/productivity','/offers/creao','/offers/leadlovers','/offers/pixverse','/offers/protoarc','/offers/riibase'];
function priorityFor(path:string){if(path==='/')return 1;if(path.startsWith('/offers/'))return .9;if(path.startsWith('/collections/'))return .8;if(path.startsWith('/guides/')||path.startsWith('/reviews/')||path.startsWith('/compare/'))return .75;return .6}
function frequencyFor(path:string):MetadataRoute.Sitemap[number]['changeFrequency']{if(path==='/')return'daily';if(path.startsWith('/offers/'))return'weekly';if(path.startsWith('/guides/')||path.startsWith('/reviews/')||path.startsWith('/compare/'))return'monthly';return'weekly'}
export default function sitemap():MetadataRoute.Sitemap{const now=new Date();const editorialPaths=editorial.map(e=>`/${e.kind==='compare'?'compare':`${e.kind}s`}/${e.slug}`);return[...staticPaths,...editorialPaths].map(path=>({url:`${BASE_URL}${path}`,lastModified:now,changeFrequency:frequencyFor(path),priority:priorityFor(path)}))}
