'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: any[]) => void;
    __vantaGaConfigured?: boolean;
  }
}

function ensureGtagQueue() {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args: any[]) => {
      window.dataLayer.push(args);
    };
  }
}

function ensureGaConfigured() {
  if (typeof window === 'undefined' || !GA_ID) return;
  ensureGtagQueue();
  if (window.__vantaGaConfigured) return;
  window.gtag?.('js', new Date());
  window.gtag?.('config', GA_ID, { send_page_view: true });
  window.__vantaGaConfigured = true;
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !GA_ID) return;
  ensureGaConfigured();
  window.gtag?.('event', name, { ...params, send_to: GA_ID });
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
    ensureGaConfigured();

    const current = new URL(window.location.href);

    // Deterministic production probe. It only fires when explicitly requested.
    if (current.searchParams.get('tracking_test') === '1') {
      trackEvent('tracking_probe', {
        source_path: current.pathname,
        diagnostic: 'vantacart_ga4',
      });
    }

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
        const common = {
          partner,
          source_path: here.pathname,
          destination_host: url.hostname,
          destination_url: url.href,
          language: lang,
          link_text: (anchor.textContent || '').trim().slice(0, 100),
          transport_type: 'beacon',
        };

        // For same-tab affiliate exits, briefly hold navigation so GA4 can flush the beacon.
        const sameTab = !anchor.target || anchor.target === '_self';
        if (sameTab && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          let navigated = false;
          const go = () => {
            if (navigated) return;
            navigated = true;
            window.location.href = url.href;
          };

          ensureGaConfigured();
          window.gtag?.('event', 'affiliate_click', {
            ...common,
            send_to: GA_ID,
            event_callback: go,
            event_timeout: 700,
          });
          window.gtag?.('event', 'affiliate_outbound_click', { ...common, send_to: GA_ID });
          window.setTimeout(go, 750);
          return;
        }

        trackEvent('affiliate_click', common);
        trackEvent('affiliate_outbound_click', common);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  if (!GA_ID) return null;

  return <>
    <Script id="ga4-bootstrap" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function(){dataLayer.push(arguments);};
    `}</Script>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
  </>;
}
