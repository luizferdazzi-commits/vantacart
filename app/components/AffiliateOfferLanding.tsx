'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, ShieldCheck, Sparkles, Play, Zap, Users, BarChart3, Bot, Workflow, ChevronDown } from 'lucide-react';

type Campaign={id:string;name:string;advertiser:string;status?:string;trackingLink?:string};
type Slug='creao'|'riibase';
type Lang='pt'|'en';

type Localized={pt:string;en:string};
type Feature=[any,Localized,Localized];

type OfferData={
 name:string;match:string;eyebrow:Localized;title:Localized;accent:Localized;sub:Localized;cta:Localized;
 metrics:[Localized,Localized][];features:Feature[];
};

const L=(pt:string,en:string):Localized=>({pt,en});

const data:Record<Slug,OfferData>={
 riibase:{
  name:'Riibase',match:'riibase',
  eyebrow:L('CRM • VENDAS • AUTOMAÇÃO','CRM • SALES • AUTOMATION'),
  title:L('Pare de perder vendas por falta de organização.','Stop losing sales because your operation is disorganized.'),
  accent:L('Transforme contatos em clientes.','Turn contacts into customers.'),
  sub:L('Veja como uma operação comercial organizada pode centralizar leads, follow-ups, oportunidades e relacionamento em um único lugar.','See how an organized sales operation can centralize leads, follow-ups, opportunities and customer relationships in one place.'),
  cta:L('Quero conhecer o Riibase','Explore Riibase'),
  metrics:[[L('1 painel','1 dashboard'),L('para toda a operação','for your whole operation')],[L('24/7','24/7'),L('processos organizados','organized processes')],[L('360°','360°'),L('visão do cliente','customer view')]],
  features:[[Users,L('Clientes no lugar certo','Customers in one place'),L('Centralize contatos, histórico e oportunidades sem depender de planilhas espalhadas.','Centralize contacts, history and opportunities without scattered spreadsheets.')],[Workflow,L('Pipeline visual','Visual pipeline'),L('Acompanhe cada oportunidade e saiba exatamente qual é o próximo passo.','Track every opportunity and know exactly what the next step is.')],[Bot,L('IA na operação','AI in your operation'),L('Ganhe velocidade em tarefas repetitivas e rotinas comerciais.','Speed up repetitive tasks and sales routines.')],[BarChart3,L('Decisões mais claras','Clearer decisions'),L('Tenha uma visão organizada da operação para acompanhar seu crescimento.','Get an organized view of your operation to support growth.')]]
 },
 creao:{
  name:'Creao AI',match:'creao',
  eyebrow:L('IA • AUTOMAÇÃO • PRODUTIVIDADE','AI • AUTOMATION • PRODUCTIVITY'),
  title:L('Faça a IA trabalhar enquanto você foca no que importa.','Make AI work while you focus on what matters.'),
  accent:L('Menos tarefas. Mais resultado.','Fewer tasks. More results.'),
  sub:L('Crie agentes, conecte ferramentas e transforme processos repetitivos em fluxos inteligentes dentro de um único ambiente.','Build agents, connect tools and turn repetitive processes into intelligent workflows in one environment.'),
  cta:L('Quero conhecer a Creao AI','Explore Creao AI'),
  metrics:[[L('1 lugar','1 place'),L('para suas automações','for your automations')],[L('24/7','24/7'),L('agentes trabalhando','agents working')],[L('+ foco','+ focus'),L('no que gera valor','on what creates value')]],
  features:[[Bot,L('Agentes inteligentes','Intelligent agents'),L('Crie agentes reutilizáveis para executar tarefas e acelerar sua rotina.','Build reusable agents to execute tasks and speed up your routine.')],[Workflow,L('Fluxos conectados','Connected workflows'),L('Integre ferramentas e transforme etapas manuais em automações.','Connect tools and turn manual steps into automations.')],[Zap,L('Execução rápida','Faster execution'),L('Reduza tarefas repetitivas e ganhe tempo para decisões importantes.','Reduce repetitive work and save time for important decisions.')],[Sparkles,L('Criação com IA','AI creation'),L('Produza conteúdo e organize trabalho em um ambiente moderno.','Create content and organize work in a modern environment.')]]
 }
};

const ui={
 pt:{benefits:'Benefícios',how:'Como funciona',other:'Outras ofertas',loading:'Carregando oferta...',unavailable:'Oferta indisponível',watch:'Ver como funciona',official:'Acesso pelo parceiro oficial',tracked:'Link rastreado • sem custo adicional',why:'POR QUE USAR',simplicity:'Uma experiência feita para transformar',complexity:'complexidade em simplicidade.',explore:'Explorar',simple:'EXPERIÊNCIA SEM COMPLICAÇÃO',few:'Do interesse à ação em poucos passos.',fewText:'Você conhece a solução aqui e, quando estiver pronto, continua diretamente no ambiente oficial do parceiro.',discover:'Descubra',discoverText:'Entenda rapidamente como a solução pode ajudar sua rotina.',exploreStep:'Explore',exploreText:'Acesse recursos, demonstrações e condições no site oficial.',start:'Comece',startText:'Escolha o plano adequado e coloque a solução para trabalhar.',before:'Antes de continuar',q1:'A compra acontece na VantaCart?',a1:'Não. Você é direcionado ao ambiente oficial do parceiro para contratação e pagamento.',q2:'Existe custo adicional pela indicação?',a2:'Não. A indicação não acrescenta custo ao preço apresentado pelo parceiro.',q3:'O link é rastreado?',a3:'Sim. Quando disponível, utilizamos o link oficial do programa de afiliados para registrar a indicação.',ready:'PRONTO PARA EXPLORAR?',finalRiibase:'Dê ao seu comercial uma operação à altura do seu crescimento.',finalCreao:'Coloque a IA para trabalhar a favor da sua produtividade.',footer:'Descubra. Compare. Escolha melhor.',disclosure:'Alguns links são de afiliados. Podemos receber comissão sem custo adicional para você.',officialPlatform:'Plataforma oficial',simpleProcess:'Processo simples',professional:'Ambiente profissional',secure:'Acesso seguro',commercial:'VISÃO COMERCIAL',automation:'AUTOMAÇÃO INTELIGENTE',organized:'Seu negócio, organizado.',accelerated:'Seu trabalho, acelerado.',leads:'Novos leads',negotiation:'Em negociação',closed:'Fechados',input:'Entrada',agent:'Agente IA',done:'Concluído',control:'Tudo sob controle',active:'Automação ativa',pipeline:'pipeline atualizado',executing:'executando tarefas'},
 en:{benefits:'Benefits',how:'How it works',other:'More offers',loading:'Loading offer...',unavailable:'Offer unavailable',watch:'See how it works',official:'Official partner access',tracked:'Tracked link • no extra cost',why:'WHY USE IT',simplicity:'An experience designed to turn',complexity:'complexity into simplicity.',explore:'Explore',simple:'A SIMPLE EXPERIENCE',few:'From interest to action in just a few steps.',fewText:'Learn about the solution here and, when you are ready, continue directly on the partner’s official website.',discover:'Discover',discoverText:'Quickly understand how the solution can help your workflow.',exploreStep:'Explore',exploreText:'Review features, demos and terms on the official website.',start:'Get started',startText:'Choose the right plan and put the solution to work.',before:'Before you continue',q1:'Does the purchase happen on VantaCart?',a1:'No. You are redirected to the partner’s official environment for purchase and payment.',q2:'Is there any extra cost for the referral?',a2:'No. The referral does not add any cost to the price shown by the partner.',q3:'Is the link tracked?',a3:'Yes. When available, we use the official affiliate program link to record the referral.',ready:'READY TO EXPLORE?',finalRiibase:'Give your sales team an operation built for growth.',finalCreao:'Put AI to work for your productivity.',footer:'Discover. Compare. Choose better.',disclosure:'Some links are affiliate links. We may earn a commission at no extra cost to you.',officialPlatform:'Official platform',simpleProcess:'Simple process',professional:'Professional environment',secure:'Secure access',commercial:'SALES OVERVIEW',automation:'SMART AUTOMATION',organized:'Your business, organized.',accelerated:'Your work, accelerated.',leads:'New leads',negotiation:'In negotiation',closed:'Closed',input:'Input',agent:'AI Agent',done:'Done',control:'Everything under control',active:'Automation active',pipeline:'pipeline updated',executing:'running tasks'}
} as const;

export default function AffiliateOfferLanding({slug,lang}:{slug:Slug;lang:Lang}){
 const d=data[slug], t=ui[lang];
 const tx=(v:Localized)=>v[lang];
 const [campaign,setCampaign]=useState<Campaign|null>(null); const [loading,setLoading]=useState(true); const [open,setOpen]=useState(0);
 useEffect(()=>{let x=false;fetch('/api/impact/campaigns',{cache:'no-store'}).then(r=>r.json()).then(v=>{if(x||!v?.ok)return;setCampaign(v.campaigns?.find((c:Campaign)=>`${c.name} ${c.advertiser}`.toLowerCase().includes(d.match)&&c.status==='Active'&&c.trackingLink)||null)}).finally(()=>!x&&setLoading(false));return()=>{x=true}},[d.match]);
 const href=campaign?.trackingLink;
 return <main className="offerExperience">
  <div className="offerGlow glowOne"/><div className="offerGlow glowTwo"/>
  <header className="offerNav"><Link href={`/?lang=${lang}`} className="offerLogo">Vanta<span>Cart</span></Link><nav><a href="#beneficios">{t.benefits}</a><a href="#como">{t.how}</a><Link href={`/?lang=${lang}`}>{t.other}</Link></nav><Link className="offerLang" href={`/offers/${slug}?lang=${lang==='pt'?'en':'pt'}`}>{lang==='pt'?'EN':'PT'}</Link></header>
  <section className="offerHero">
   <div className="offerHeroCopy"><div className="offerPill"><span/> {tx(d.eyebrow)}</div><h1>{tx(d.title)}<br/><em>{tx(d.accent)}</em></h1><p>{tx(d.sub)}</p><div className="offerCtas">{href?<a className="offerPrimary" href={href} target="_blank" rel="sponsored noopener noreferrer">{tx(d.cta)}<ArrowRight/></a>:<button className="offerPrimary" disabled>{loading?t.loading:t.unavailable}</button>}<a className="offerSecondary" href="#como"><Play/> {t.watch}</a></div><div className="offerTrust"><ShieldCheck/><span><b>{t.official}</b><small>{t.tracked}</small></span></div></div>
   <div className="offerDemo"><div className="demoTop"><i/><i/><i/><span>{d.name} • workspace</span></div><div className="demoBody"><aside><div className="demoBrand">{slug==='riibase'?'R':'AI'}</div>{[1,2,3,4,5].map(i=><span key={i}/>)}</aside><div className="demoContent"><div className="demoHello"><small>{slug==='riibase'?t.commercial:t.automation}</small><b>{slug==='riibase'?t.organized:t.accelerated}</b></div><div className="demoStats">{d.metrics.map(([a,b])=><div key={tx(a)}><strong>{tx(a)}</strong><span>{tx(b)}</span></div>)}</div><div className="demoBoard"><div><span>01</span><b>{slug==='riibase'?t.leads:t.input}</b><i/><i/><i/></div><div><span>02</span><b>{slug==='riibase'?t.negotiation:t.agent}</b><i/><i/></div><div><span>03</span><b>{slug==='riibase'?t.closed:t.done}</b><i/></div></div></div></div><div className="floatingBadge"><Sparkles/> <span><b>{slug==='riibase'?t.control:t.active}</b><small>{slug==='riibase'?t.pipeline:t.executing}</small></span></div></div>
  </section>
  <section className="socialStrip"><span>✓ {t.officialPlatform}</span><span>✓ {t.simpleProcess}</span><span>✓ {t.professional}</span><span>✓ {t.secure}</span></section>
  <section className="offerBenefits" id="beneficios"><div className="offerSectionHead"><span>{t.why}</span><h2>{t.simplicity}<br/><em>{t.complexity}</em></h2></div><div className="offerFeatureGrid">{d.features.map(([Icon,title,text],i)=><article key={tx(title)} className="offerFeature"><div className="featureNum">0{i+1}</div><Icon/><h3>{tx(title)}</h3><p>{tx(text)}</p><a href={href||'#'} target={href?'_blank':undefined}>{t.explore} <ArrowRight/></a></article>)}</div></section>
  <section className="offerHow" id="como"><div><span className="offerPill">{t.simple}</span><h2>{t.few}</h2><p>{t.fewText}</p></div><div className="steps">{[['01',t.discover,t.discoverText],['02',t.exploreStep,t.exploreText],['03',t.start,t.startText]].map(x=><div key={x[0]}><b>{x[0]}</b><span><strong>{x[1]}</strong><small>{x[2]}</small></span></div>)}</div></section>
  <section className="offerFaq"><h2>{t.before}</h2>{[[t.q1,t.a1],[t.q2,t.a2],[t.q3,t.a3]].map((q,i)=><button key={q[0]} onClick={()=>setOpen(open===i?-1:i)}><span><b>{q[0]}</b>{open===i&&<p>{q[1]}</p>}</span><ChevronDown className={open===i?'rot':''}/></button>)}</section>
  <section className="offerFinal"><div><span>{t.ready}</span><h2>{slug==='riibase'?t.finalRiibase:t.finalCreao}</h2></div>{href&&<a href={href} target="_blank" rel="sponsored noopener noreferrer">{tx(d.cta)}<ExternalLink/></a>}</section>
  <footer className="offerFooter"><Link href={`/?lang=${lang}`} className="offerLogo">Vanta<span>Cart</span></Link><p>{t.footer}</p><small>{t.disclosure}</small></footer>
 </main>
}
