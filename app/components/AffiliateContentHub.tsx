import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';

type Lang = 'pt' | 'en';

const guides = {
  pt: [
    { category: 'ai', kicker: 'IA & AUTOMAÇÃO', title: 'Ferramentas que reduzem trabalho manual', text: 'Selecione IA, agentes e plataformas no-code pelo problema que você precisa resolver — sem estoque e sem complexidade.', points: ['Automação de rotinas', 'Aplicações sem código', 'Fluxos com IA'] },
    { category: 'creators', kicker: 'CRIADORES & VÍDEO', title: 'Crie mais conteúdo sem aumentar a equipe', text: 'Encontre vídeo com IA, criação visual e recursos para campanhas, redes sociais e páginas de venda.', points: ['Vídeo com IA', 'Conteúdo para campanhas', 'Produção mais rápida'] },
    { category: 'business', kicker: 'VENDAS & NEGÓCIOS', title: 'Transforme contatos em processo comercial', text: 'Soluções digitais para CRM, atendimento, pipeline e organização da operação de pequenas equipes.', points: ['CRM e clientes', 'Pipeline comercial', 'Processos centralizados'] },
    { category: 'productivity', kicker: 'ASSINATURAS DIGITAIS', title: 'Assinaturas que deixam sua operação mais leve', text: 'Compare serviços digitais e soluções de produtividade antes de contratar diretamente com o parceiro oficial.', points: ['Serviços digitais', 'Uso pessoal ou profissional', 'Acesso online imediato'] },
  ],
  en: [
    { category: 'ai', kicker: 'AI & AUTOMATION', title: 'Tools that reduce manual work', text: 'Choose AI, agents and no-code platforms by the problem you need to solve — no inventory and no operational overhead.', points: ['Automate routines', 'Build without code', 'AI workflows'] },
    { category: 'creators', kicker: 'CREATORS & VIDEO', title: 'Create more content without growing the team', text: 'Find AI video, visual creation and resources for campaigns, social media and sales pages.', points: ['AI video', 'Campaign content', 'Faster production'] },
    { category: 'business', kicker: 'SALES & BUSINESS', title: 'Turn contacts into a sales process', text: 'Digital solutions for CRM, customer management, pipeline visibility and small-team operations.', points: ['CRM and customers', 'Sales pipeline', 'Centralized processes'] },
    { category: 'productivity', kicker: 'DIGITAL SUBSCRIPTIONS', title: 'Subscriptions that keep operations lighter', text: 'Compare digital services and productivity solutions before you subscribe with the official partner.', points: ['Digital services', 'Personal or business use', 'Immediate online access'] },
  ],
} as const;

export default function AffiliateContentHub({ lang }: { lang: Lang }) {
  const pt = lang === 'pt';
  return <section className="affiliateHub" aria-label={pt ? 'Setores digitais da VantaCart' : 'VantaCart digital sectors'}>
    <div className="affiliateHubHead"><div><span><BookOpen size={15}/>{pt ? 'ESCOLHA POR NECESSIDADE' : 'CHOOSE BY NEED'}</span><h2>{pt ? 'Quatro setores para vender soluções digitais.' : 'Four sectors for digital solutions.'}</h2><p>{pt ? 'A VantaCart é uma curadoria de links de afiliados para software e assinaturas. Sem produto físico, estoque ou entrega: a contratação é concluída no parceiro oficial.' : 'VantaCart curates affiliate links for software and subscriptions. No physical product, inventory or shipping: signup is completed with the official partner.'}</p></div><Link href={`/collections/ai?lang=${lang}`}>{pt ? 'Explorar soluções' : 'Explore solutions'}<ArrowRight size={15}/></Link></div>
    <div className="affiliateGuideGrid">{guides[lang].map((guide, index) => <article key={guide.category} className={`affiliateGuide guideTone${index + 1}`}><div className="guideIcon"><Sparkles size={19}/></div><span>{guide.kicker}</span><h3>{guide.title}</h3><p>{guide.text}</p><ul>{guide.points.map(point => <li key={point}><CheckCircle2 size={14}/>{point}</li>)}</ul><Link href={`/collections/${guide.category}?lang=${lang}`}>{pt ? 'Ver parceiros ativos' : 'View active partners'}<ArrowRight size={15}/></Link></article>)}</div>
  </section>;
}
