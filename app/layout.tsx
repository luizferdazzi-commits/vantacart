import type { Metadata } from 'next';
import './globals.css';
import './marketplace.css';
import './cart.css';
import './responsive.css';
import { Analytics } from './components/Analytics';

export const metadata: Metadata = {
  title: 'VantaCart — Global Marketplace',
  description: 'A curated global marketplace with transparent pricing, tracked fulfillment and secure commerce infrastructure.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}<Analytics /></body>
    </html>
  );
}
