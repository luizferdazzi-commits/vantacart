'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window { dataLayer: unknown[]; gtag?: (...args: any[]) => void; }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', name, params);
}

function inferPartner(pathname: string, href: string) {
  const source = `${pathname} ${href}`.toLowerCase();
  if (source.includes('riibase')) return 'riibase';
  if (source.includes('creao')) return 'creao';
  if (source.includes('protoarc')) return 'protoarc';
  return 'other';
}

export function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.('a') as HTMLAnchorElement | null;
      if (!anchor?.href) return;

      let url: URL;
      try { url = new URL(anchor.href, window.location.href); } catch { return; }

      const current = new URL(window.location.href);
      const isExternal = url.hostname !== current.hostname;
      const isOfferPage = current.pathname.startsWith('/offers/');
      const isOfferLink = url.pathname.startsWith('/offers/');
      const lang = current.searchParams.get('lang') || document.documentElement.lang || 'unknown';

      if (isOfferLink && !isExternal) {
        trackEvent('offer_click', {
          offer_path: url.pathname,
          source_path: current.pathname,
          language: lang,
        });
      }

      if (isExternal && isOfferPage) {
        const partner = inferPartner(current.pathname, url.href);
        trackEvent('affiliate_outbound_click', {
          partner,
          source_path: current.pathname,
          destination_host: url.hostname,
          destination_url: url.href,
          language: lang,
          link_text: (anchor.textContent || '').trim().slice(0, 100),
          transport_type: 'beacon',
        });
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  if (!GA_ID) return null;
  return <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    <Script id="ga4" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', '${GA_ID}', { send_page_view: true });
    `}</Script>
  </>;
}
