import type { Metadata } from 'next';
import './globals.css';
import './marketplace.css';
import './cart.css';
import './responsive.css';
import './whatsapp.css';
import { Analytics } from './components/Analytics';

export const metadata: Metadata = {
  title: 'VantaCart — Curadoria de Software, IA e Serviços Digitais',
  description: 'Curadoria de software, IA, SaaS e serviços digitais de parceiros aprovados. Compare opções e finalize a contratação diretamente no site oficial do parceiro.',
};

const whatsappHref = 'https://wa.me/5555984572523?text=Ol%C3%A1%21%20Vim%20pela%20VantaCart%20e%20gostaria%20de%20falar%20sobre%20publicidade%20ou%20parceria.';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <a
          className="vcWhatsapp"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com a VantaCart pelo WhatsApp"
          title="Falar com a VantaCart pelo WhatsApp"
        >
          <span className="vcWhatsappIcon" aria-hidden="true">
            <svg viewBox="0 0 32 32" role="img">
              <path d="M19.11 17.31c-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.59.13-.17.26-.67.85-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.09-.4-2.08-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.46.13-.15.17-.26.26-.43.09-.17.04-.33-.02-.46-.07-.13-.59-1.41-.8-1.93-.21-.51-.43-.44-.59-.45h-.5c-.17 0-.46.07-.7.33-.24.26-.91.89-.91 2.17s.93 2.52 1.06 2.69c.13.17 1.83 2.79 4.43 3.91.62.27 1.1.43 1.48.55.62.2 1.19.17 1.64.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.06-.11-.24-.17-.5-.3z"/>
              <path d="M16.04 3C8.86 3 3.04 8.77 3.04 15.89c0 2.27.6 4.49 1.73 6.44L3 29l6.86-1.78a13.04 13.04 0 0 0 6.17 1.56h.01C23.2 28.78 29 23 29 15.89 29 8.77 23.2 3 16.04 3zm0 23.59a10.84 10.84 0 0 1-5.53-1.51l-.4-.24-4.07 1.05 1.09-3.95-.26-.41a10.64 10.64 0 0 1-1.64-5.64c0-5.91 4.85-10.71 10.81-10.71 5.95 0 10.79 4.8 10.79 10.71 0 5.9-4.84 10.7-10.79 10.7z"/>
            </svg>
          </span>
          <span className="vcWhatsappText">Fale no WhatsApp<small>Publicidade e parcerias</small></span>
        </a>
        <Analytics />
      </body>
    </html>
  );
}
