import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';

type Lang = 'pt' | 'en';

const guides = {
  pt: [
    { category: 'ai', kicker: 'GUIA DE COMPRA', title: 'IA para transformar tarefas em resultado', text: 'Descubra ferramentas para criação, automação e fluxos inteligentes. Compare pelo caso de uso antes de contratar.', points: ['Criar conteúdo e imagens', 'Automatizar rotinas', 'Construir aplicações sem código'] },
    { category: 'creators', kicker: 'PARA CRIADORES', title: 'Seu próximo vídeo pode começar com uma ideia', text: 'Uma seleção para quem cria campanhas, conteúdo social e vídeos de produto com mais velocidade.', points: ['Vídeo com IA', 'Conteúdo para campanhas', 'Localização e adaptação criativa'] },
    { category: 'business', kicker: 'PARA NEGÓCIOS', title: 'Organize vendas, clientes e crescimento', text: 'Encontre soluções para centralizar relacionamento, acompanhar oportunidades e reduzir trabalho manual.', points: ['CRM e pipeline comercial', 'Automação de processos', 'Visão da operação em um só lugar'] },
    { category: 'home', kicker: 'HOME OFFICE', title: 'Mais conforto para produzir por mais tempo', text: 'Acessórios selecionados para uma estação de trabalho mais organizada, confortável e funcional.', points: ['Ergonomia no dia a dia', 'Periféricos para produtividade', 'Setup mais organizado'] },
  ],
  en: [
    { category: 'ai', kicker: 'BUYING GUIDE', title: 'AI that turns tasks into outcomes', text: 'Discover tools for creation, automation and intelligent workflows. Compare by use case before you subscribe.', points: ['Create content and images', 'Automate routines', 'Build apps without code'] },
    { category: 'creators', kicker: 'FOR CREATORS', title: 'Your next video can start with one idea', text: 'A selection for campaigns, social content and product videos made with more speed.', points: ['AI video', 'Campaign content', 'Creative localization'] },
    { category: 'business', kicker: 'FOR BUSINESS', title: 'Organize sales, customers and growth', text: 'Find solutions to centralize relationships, follow opportunities and reduce manual work.', points: ['CRM and sales pipeline', 'Process automation', 'One operating view'] },
    { category: 'home', kicker: 'HOME OFFICE', title: 'More comfort for focused work', text: 'Selected accessories for a more organized, comfortable and functional workstation.', points: ['Everyday ergonomics', 'Productivity peripherals', 'A better workspace setup'] },
  ],
} as const;

export default function AffiliateContentHub({ lang }: { lang: Lang }) {
  const pt = lang === 'pt';
  return <section className="affiliateHub" aria-label={pt ? 'Guias para escolher melhor' : 'Guides to choose better'}>
    <div className="affiliateHubHead"><div><span><BookOpen size={15}/>{pt ? 'ESCOLHA COM MAIS CLAREZA' : 'CHOOSE WITH MORE CLARITY'}</span><h2>{pt ? 'Conteúdo para encontrar a oferta certa.' : 'Content to find the right offer.'}</h2><p>{pt ? 'Comece pela sua necessidade. Cada guia reúne ofertas de parceiros ativos e leva você ao site oficial para comparar preços e condições.' : 'Start with your need. Each guide brings together active partner offers and takes you to the official site to compare pricing and terms.'}</p></div><Link href={`/collections/ai?lang=${lang}`}>{pt ? 'Ver todas as coleções' : 'View all collections'}<ArrowRight size={15}/></Link></div>
    <div className="affiliateGuideGrid">{guides[lang].map((guide, index) => <article key={guide.category} className={`affiliateGuide guideTone${index + 1}`}><div className="guideIcon"><Sparkles size={19}/></div><span>{guide.kicker}</span><h3>{guide.title}</h3><p>{guide.text}</p><ul>{guide.points.map(point => <li key={point}><CheckCircle2 size={14}/>{point}</li>)}</ul><Link href={`/collections/${guide.category}?lang=${lang}`}>{pt ? 'Explorar ofertas' : 'Explore offers'}<ArrowRight size={15}/></Link></article>)}</div>
  </section>;
}
