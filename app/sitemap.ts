import type { MetadataRoute } from 'next';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vantacart.vercel.app').replace(/\/$/, '');

const staticPaths = [
  '/',
  '/advertise',
  '/collections/ai',
  '/collections/business',
  '/collections/creators',
  '/collections/productivity',
  '/offers/creao',
  '/offers/leadlovers',
  '/offers/pixverse',
  '/offers/protoarc',
  '/offers/riibase',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return staticPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : path.startsWith('/offers/') ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path.startsWith('/collections/') ? 0.8 : path.startsWith('/offers/') ? 0.9 : 0.6,
  }));
}
