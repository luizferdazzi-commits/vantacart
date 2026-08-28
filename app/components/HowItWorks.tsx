import { ArrowRight, BadgeCheck, ExternalLink, Scale } from 'lucide-react';

type Lang = 'pt' | 'en';

export default function HowItWorks({ lang }: { lang: Lang }) {
  const pt = lang === 'pt';
  const steps = pt ? [
    { icon: Scale, title: 'Compare', text: 'Veja ferramentas selecionadas por categoria, necessidade e proposta de valor.' },
    { icon: BadgeCheck, title: 'Escolha', text: 'Entenda para quem cada solução faz mais sentido antes de decidir.' },
    { icon: ExternalLink, title: 'Finalize no parceiro', text: 'Preço, plano, pagamento e contratação são concluídos no site oficial do parceiro.' },
  ] : [
    { icon: Scale, title: 'Compare', text: 'Browse curated tools by category, need and value proposition.' },
    { icon: BadgeCheck, title: 'Choose', text: 'See who each solution is best for before making a decision.' },
    { icon: ExternalLink, title: 'Finish with the partner', text: 'Pricing, plan, payment and signup are completed on the partner’s official website.' },
  ];

  return <section className="howItWorks" aria-label={pt ? 'Como funciona a VantaCart' : 'How VantaCart works'}>
    <div className="howItWorksIntro">
      <span>{pt ? 'COMO FUNCIONA' : 'HOW IT WORKS'}</span>
      <h2>{pt ? 'Curadoria para decidir. Contratação no parceiro oficial.' : 'Curated to help you decide. Purchased from the official partner.'}</h2>
      <p>{pt ? 'A VantaCart não vende nem processa o pagamento dessas ofertas. Alguns links são de afiliados e podem gerar comissão para a VantaCart sem custo adicional para você.' : 'VantaCart does not sell or process payment for these offers. Some links are affiliate links and may earn VantaCart a commission at no extra cost to you.'}</p>
    </div>
    <div className="howItWorksSteps">{steps.map((step, index) => { const Icon = step.icon; return <article key={step.title}><div className="howStepNo">0{index + 1}</div><Icon size={20}/><div><h3>{step.title}</h3><p>{step.text}</p></div>{index < steps.length - 1 && <ArrowRight className="howArrow" size={18}/>}</article>; })}</div>
  </section>;
}
