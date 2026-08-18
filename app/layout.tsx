import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VantaCart — Global Finds',
  description: 'Curated global products with automated fulfillment.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
