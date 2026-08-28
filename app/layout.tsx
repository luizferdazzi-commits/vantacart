import type { Metadata } from 'next';
import './globals.css';
import './marketplace.css';
import './cart.css';
import './responsive.css';
import { Analytics } from './components/Analytics';

export const metadata: Metadata = {
  title: 'VantaCart — Curadoria de Software, IA e Serviços Digitais',
  description: 'Curadoria de software, IA, SaaS e serviços digitais de parceiros aprovados. Compare opções e finalize a contratação diretamente no site oficial do parceiro.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}<Analytics /></body>
    </html>
  );
}
