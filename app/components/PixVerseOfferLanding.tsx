'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Film, Image as ImageIcon, Sparkles, WandSparkles, ShieldCheck, Play, Volume2, ChevronDown } from 'lucide-react';

type Lang='pt'|'en';
type Campaign={id:string;name:string;advertiser:string;status?:string;trackingLink?:string};

const copy={
  pt:{
    eyebrow:'IA • VÍDEO • CRIAÇÃO',
    title:'Transforme ideias e imagens em vídeos com IA.',
    accent:'Crie mais. Produza mais rápido.',
    sub:'Use o PixVerse para transformar prompts e imagens em vídeos, explorar estilos, movimento, lip sync e recursos criativos em um único ambiente.',
    cta:'Criar vídeos no PixVerse',
    benefits:'Benefícios',how:'Como funciona',other:'Outras ofertas',watch:'Ver como funciona',
    official:'Acesso pelo parceiro oficial',tracked:'Link rastreado • sem custo adicional',
    why:'POR QUE CONHECER',simplicity:'Da ideia ao vídeo',complexity:'sem um fluxo de produção pesado.',
    f1:'Texto para vídeo',f1t:'Descreva uma cena e transforme o prompt em um clipe gerado por IA.',
    f2:'Imagem para vídeo',f2t:'Anime fotos, produtos, personagens e conceitos com movimento e atmosfera.',
    f3:'Recursos criativos',f3t:'Explore templates, transições, extensão de vídeo, efeitos e ferramentas de edição com IA.',
    f4:'Áudio e lip sync',f4t:'Adicione som, voz e sincronização labial para enriquecer seus conteúdos.',
    simple:'EXPERIÊNCIA SEM COMPLICAÇÃO',few:'Da ideia ao resultado em poucos passos.',fewText:'Conheça a proposta aqui e continue no ambiente oficial do PixVerse quando quiser começar a criar.',
    discover:'Descreva',discoverText:'Comece com um prompt ou uma imagem.',
    explore:'Gere',exploreText:'Escolha o modelo e transforme sua ideia em vídeo.',
    start:'Refine',startText:'Ajuste movimento, estilo, áudio e outros recursos conforme sua necessidade.',
    before:'Antes de continuar',
    q1:'O vídeo é criado na VantaCart?',a1:'Não. A VantaCart apresenta a solução e direciona você ao ambiente oficial do PixVerse.',
    q2:'Existe custo adicional pela indicação?',a2:'Não. O uso do link de afiliado não acrescenta custo adicional ao preço apresentado pelo parceiro.',
    q3:'O link é rastreado?',a3:'Sim. Utilizamos o link oficial do programa de afiliados para registrar a indicação.',
    ready:'PRONTO PARA CRIAR?',final:'Transforme uma ideia simples em conteúdo visual que chama atenção.',
    loading:'Carregando oferta...',unavailable:'Oferta indisponível',footer:'Descubra. Compare. Escolha melhor.',disclosure:'Alguns links são de afiliados. Podemos receber comissão sem custo adicional para você.'
  },
  en:{
    eyebrow:'AI • VIDEO • CREATION',
    title:'Turn ideas and images into AI-generated videos.',
    accent:'Create more. Produce faster.',
    sub:'Use PixVerse to turn prompts and images into videos and explore styles, motion, lip sync and creative tools in one workspace.',
    cta:'Create videos with PixVerse',
    benefits:'Benefits',how:'How it works',other:'More offers',watch:'See how it works',
    official:'Official partner access',tracked:'Tracked link • no extra cost',
    why:'WHY EXPLORE IT',simplicity:'From idea to video',complexity:'without a heavy production workflow.',
    f1:'Text to video',f1t:'Describe a scene and turn your prompt into an AI-generated clip.',
    f2:'Image to video',f2t:'Animate photos, products, characters and concepts with motion and atmosphere.',
    f3:'Creative tools',f3t:'Explore templates, transitions, video extension, effects and AI editing tools.',
    f4:'Audio and lip sync',f4t:'Add sound, voice and lip synchronization to enrich your content.',
    simple:'A SIMPLE EXPERIENCE',few:'From idea to result in just a few steps.',fewText:'Learn what PixVerse offers here and continue to its official website when you are ready to create.',
    discover:'Describe',discoverText:'Start with a prompt or an image.',
    explore:'Generate',exploreText:'Choose a model and turn your idea into video.',
    start:'Refine',startText:'Adjust motion, style, audio and other tools to match your goal.',
    before:'Before you continue',
    q1:'Is the video created on VantaCart?',a1:'No. VantaCart presents the solution and redirects you to the official PixVerse environment.',
    q2:'Is there any extra cost for the referral?',a2:'No. Using the affiliate link does not add any extra cost to the price shown by the partner.',
    q3:'Is the link tracked?',a3:'Yes. We use the official affiliate-program link to record the referral.',
    ready:'READY TO CREATE?',final:'Turn a simple idea into visual content designed to get attention.',
    loading:'Loading offer...',unavailable:'Offer unavailable',footer:'Discover. Compare. Choose better.',disclosure:'Some links are affiliate links. We may earn a commission at no extra cost to you.'
  }
} as const;

export default function PixVerseOfferLanding({lang}:{lang:Lang}){
  const t=copy[lang];
  const[campaign,setCampaign]=useState<Campaign|null>(null);
  const[loading,setLoading]=useState(true);
  const[open,setOpen]=useState(0);
  useEffect(()=>{let cancelled=false;fetch('/api/impact/campaigns',{cache:'no-store'}).then(r=>r.json()).then(v=>{if(cancelled||!v?.ok)return;setCampaign(v.campaigns?.find((c:Campaign)=>`${c.name} ${c.advertiser}`.toLowerCase().includes('pixverse')&&c.status==='Active'&&c.trackingLink)||null)}).finally(()=>!cancelled&&setLoading(false));return()=>{cancelled=true}},[]);
  const href=campaign?.trackingLink;
  const features=[[Film,t.f1,t.f1t],[ImageIcon,t.f2,t.f2t],[WandSparkles,t.f3,t.f3t],[Volume2,t.f4,t.f4t]] as const;
  return <main className="offerExperience"><div className="offerGlow glowOne"/><div className="offerGlow glowTwo"/><header className="offerNav"><Link href={`/?lang=${lang}`} className="offerLogo">Vanta<span>Cart</span></Link><nav><a href="#beneficios">{t.benefits}</a><a href="#como">{t.how}</a><Link href={`/?lang=${lang}`}>{t.other}</Link></nav><Link className="offerLang" href={`/offers/pixverse?lang=${lang==='pt'?'en':'pt'}`}>{lang==='pt'?'EN':'PT'}</Link></header><section className="offerHero"><div className="offerHeroCopy"><div className="offerPill"><span/> {t.eyebrow}</div><h1>{t.title}<br/><em>{t.accent}</em></h1><p>{t.sub}</p><div className="offerCtas">{href?<a className="offerPrimary" href={href} target="_blank" rel="sponsored noopener noreferrer">{t.cta}<ArrowRight/></a>:<button className="offerPrimary" disabled>{loading?t.loading:t.unavailable}</button>}<a className="offerSecondary" href="#como"><Play/> {t.watch}</a></div><div className="offerTrust"><ShieldCheck/><span><b>{t.official}</b><small>{t.tracked}</small></span></div></div><div className="offerDemo"><div className="demoTop"><i/><i/><i/><span>PixVerse • AI video studio</span></div><div className="demoBody"><aside><div className="demoBrand">PV</div>{[1,2,3,4,5].map(i=><span key={i}/>)}</aside><div className="demoContent"><div className="demoHello"><small>AI VIDEO CREATION</small><b>{lang==='pt'?'Sua ideia, em movimento.':'Your idea, in motion.'}</b></div><div className="demoStats"><div><strong>Text</strong><span>{lang==='pt'?'para vídeo':'to video'}</span></div><div><strong>Image</strong><span>{lang==='pt'?'para vídeo':'to video'}</span></div><div><strong>AI</strong><span>{lang==='pt'?'edição criativa':'creative editing'}</span></div></div><div className="demoBoard"><div><span>01</span><b>Prompt</b><i/><i/><i/></div><div><span>02</span><b>{lang==='pt'?'Gerar':'Generate'}</b><i/><i/></div><div><span>03</span><b>{lang==='pt'?'Vídeo':'Video'}</b><i/></div></div></div></div><div className="floatingBadge"><Sparkles/><span><b>PixVerse AI</b><small>{lang==='pt'?'criação de vídeo com IA':'AI video creation'}</small></span></div></div></section><section className="socialStrip"><span>✓ {lang==='pt'?'Parceiro oficial':'Official partner'}</span><span>✓ {lang==='pt'?'Programa afiliado ativo':'Active affiliate program'}</span><span>✓ {lang==='pt'?'Link rastreado':'Tracked link'}</span><span>✓ {lang==='pt'?'Acesso seguro':'Secure access'}</span></section><section className="offerBenefits" id="beneficios"><div className="offerSectionHead"><span>{t.why}</span><h2>{t.simplicity}<br/><em>{t.complexity}</em></h2></div><div className="offerFeatureGrid">{features.map(([Icon,title,text],i)=><article key={title} className="offerFeature"><div className="featureNum">0{i+1}</div><Icon/><h3>{title}</h3><p>{text}</p><a href={href||'#'} target={href?'_blank':undefined}>{lang==='pt'?'Explorar':'Explore'}<ArrowRight/></a></article>)}</div></section><section className="offerHow" id="como"><div><span className="offerPill">{t.simple}</span><h2>{t.few}</h2><p>{t.fewText}</p></div><div className="steps">{[['01',t.discover,t.discoverText],['02',t.explore,t.exploreText],['03',t.start,t.startText]].map(x=><div key={x[0]}><b>{x[0]}</b><span><strong>{x[1]}</strong><small>{x[2]}</small></span></div>)}</div></section><section className="offerFaq"><h2>{t.before}</h2>{[[t.q1,t.a1],[t.q2,t.a2],[t.q3,t.a3]].map((q,i)=><button key={q[0]} onClick={()=>setOpen(open===i?-1:i)}><span><b>{q[0]}</b>{open===i&&<p>{q[1]}</p>}</span><ChevronDown/></button>)}</section><section className="offerFinal"><span>{t.ready}</span><h2>{t.final}</h2>{href&&<a className="offerPrimary" href={href} target="_blank" rel="sponsored noopener noreferrer">{t.cta}<ArrowRight/></a>}</section><footer className="offerFooter"><b>VantaCart</b><span>{t.footer}</span><small>{t.disclosure}</small></footer></main>;
}
