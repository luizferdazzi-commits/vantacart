'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global { interface Window { dataLayer: unknown[]; gtag?: (...args: any[]) => void; } }

function ensureGtagQueue() {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args: any[]) => {
      window.dataLayer.push(args);
    };
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  ensureGtagQueue();
  window.gtag?.('event', name, params);
}

function inferPartner(pathname: string, href: string) {
  const slug = pathname.startsWith('/offers/') ? pathname.split('/').filter(Boolean)[1] : '';
  if (slug) return slug;
  try { return new URL(href).hostname.replace(/^www\./, '').split('.')[0] || 'other'; }
  catch { return 'other'; }
}

export function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    ensureGtagQueue();

    const current = new URL(window.location.href);
    if (current.pathname.startsWith('/offers/')) {
      trackEvent('view_offer_page', {
        partner: inferPartner(current.pathname, current.href),
        offer_path: current.pathname,
        language: current.searchParams.get('lang') || 'unknown',
      });
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.('a') as HTMLAnchorElement | null;
      if (!anchor?.href) return;

      let url: URL;
      try { url = new URL(anchor.href, window.location.href); }
      catch { return; }

      const here = new URL(window.location.href);
      const isExternal = url.hostname !== here.hostname;
      const isOfferPage = here.pathname.startsWith('/offers/');
      const isOfferLink = url.pathname.startsWith('/offers/');
      const lang = here.searchParams.get('lang') || document.documentElement.lang || 'unknown';

      if (isOfferLink && !isExternal) {
        trackEvent('offer_click', {
          offer_path: url.pathname,
          source_path: here.pathname,
          language: lang,
          link_text: (anchor.textContent || '').trim().slice(0, 100),
        });
      }

      if (isExternal && isOfferPage) {
        const partner = inferPartner(here.pathname, url.href);
        const params = {
          partner,
          source_path: here.pathname,
          destination_host: url.hostname,
          destination_url: url.href,
          language: lang,
          link_text: (anchor.textContent || '').trim().slice(0, 100),
          transport_type: 'beacon',
        };
        trackEvent('affiliate_click', params);
        trackEvent('affiliate_outbound_click', params);
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
      window.gtag = window.gtag || function(){dataLayer.push(arguments);};
      gtag('js', new Date());
      gtag('config', '${GA_ID}', { send_page_view: true });
    `}</Script>
  </>;
}
