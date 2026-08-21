'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

type Campaign = {
  id: string;
  name: string;
  advertiser: string;
  description?: string;
  status?: string;
  trackingLink?: string;
};

type Config = {
  slug: 'creao' | 'riibase';
  match: string;
  name: string;
  kickerPt: string;
  kickerEn: string;
  titlePt: string;
  titleEn: string;
  subtitlePt: string;
  subtitleEn: string;
  bulletsPt: string[];
  bulletsEn: string[];
  ctaPt: string;
  ctaEn: string;
};

const configs: Record<'creao' | 'riibase', Config> = {
  creao: {
    slug: 'creao', match: 'creao', name: 'Creao AI',
    kickerPt: 'IA • AUTOMAÇÃO • PRODUTIVIDADE', kickerEn: 'AI • AUTOMATION • PRODUCTIVITY',
    titlePt: 'Transforme conversas em trabalho concluído com IA',
    titleEn: 'Turn conversations into finished work with AI',
    subtitlePt: 'Uma plataforma para criar agentes de IA, conectar ferramentas, automatizar tarefas e gerar conteúdo em um único ambiente.',
    subtitleEn: 'A platform to build AI agents, connect tools, automate tasks and create content in one workspace.',
    bulletsPt: ['Crie agentes reutilizáveis para tarefas recorrentes', 'Conecte Gmail, Slack, GitHub e outras ferramentas', 'Automatize fluxos e tarefas agendadas', 'Produza documentos, imagens e conteúdo com IA'],
    bulletsEn: ['Build reusable agents for recurring work', 'Connect Gmail, Slack, GitHub and other tools', 'Automate workflows and scheduled tasks', 'Create documents, images and content with AI'],
    ctaPt: 'Conhecer Creao AI', ctaEn: 'Explore Creao AI'
  },
  riibase: {
    slug: 'riibase', match: 'riibase', name: 'Riibase',
    kickerPt: 'CRM • VENDAS • IA', kickerEn: 'CRM • SALES • AI',
    titlePt: 'Organize clientes, vendas e operação em um único CRM',
    titleEn: 'Run customers, sales and operations from one CRM',
    subtitlePt: 'Uma solução all-in-one para centralizar relacionamento com clientes, processos comerciais e recursos de IA para empresas de diferentes segmentos.',
    subtitleEn: 'An all-in-one solution to centralize customer relationships, sales processes and AI-powered business workflows.',
    bulletsPt: ['Centralize contatos, oportunidades e etapas comerciais', 'Estruture follow-ups e rotinas de vendas', 'Use recursos de IA dentro da operação', 'Tenha uma visão única do relacionamento com clientes'],
    bulletsEn: ['Centralize contacts, opportunities and sales stages', 'Structure sales follow-ups and routines', 'Use AI-powered features in your operation', 'Keep one unified view of customer relationships'],
    ctaPt: 'Conhecer Riibase', ctaEn: 'Explore Riibase'
  }
};

export default function AffiliateOfferLanding({ slug, lang }: { slug: 'creao' | 'riibase'; lang: 'pt' | 'en' }) {
  const config = configs[slug];
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/impact/campaigns', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data?.ok || !Array.isArray(data.campaigns)) return;
        const found = data.campaigns.find((c: Campaign) => `${c.name} ${c.advertiser}`.toLowerCase().includes(config.match) && c.status === 'Active' && c.trackingLink);
        setCampaign(found || null);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [config.match]);

  const bullets = lang === 'pt' ? config.bulletsPt : config.bulletsEn;
  const cta = lang === 'pt' ? config.ctaPt : config.ctaEn;

  return <main style={{minHeight:'100vh',background:'linear-gradient(180deg,#f8fafc 0%,#ffffff 42%,#f0fdf4 100%)',color:'#0f172a'}}>
    <div style={{maxWidth:1120,margin:'0 auto',padding:'24px 22px 64px'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:20,marginBottom:48}}>
        <Link href={`/?lang=${lang}`} style={{fontSize:28,fontWeight:900,textDecoration:'none',color:'#0f172a'}}>Vanta<span style={{color:'#15803d'}}>Cart</span></Link>
        <div style={{display:'flex',gap:16,alignItems:'center'}}>
          <Link href={`/offers/${slug}?lang=${lang === 'pt' ? 'en' : 'pt'}`} style={{textDecoration:'none',fontWeight:800,color:'#334155'}}>{lang === 'pt' ? 'English' : 'Português'}</Link>
          <Link href={`/?lang=${lang}`} style={{textDecoration:'none',fontWeight:800,color:'#166534'}}>{lang === 'pt' ? '← Voltar às ofertas' : '← Back to deals'}</Link>
        </div>
      </header>

      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:36,alignItems:'center',padding:'42px',border:'1px solid #dcfce7',borderRadius:30,background:'#fff',boxShadow:'0 24px 60px rgba(15,23,42,.08)'}}>
        <div>
          <div style={{fontSize:13,fontWeight:900,letterSpacing:1.2,color:'#15803d',marginBottom:14}}>{lang === 'pt' ? config.kickerPt : config.kickerEn}</div>
          <h1 style={{fontSize:'clamp(38px,5vw,64px)',lineHeight:1.02,margin:'0 0 20px'}}>{lang === 'pt' ? config.titlePt : config.titleEn}</h1>
          <p style={{fontSize:19,lineHeight:1.65,color:'#475569',margin:'0 0 28px'}}>{lang === 'pt' ? config.subtitlePt : config.subtitleEn}</p>
          <div style={{display:'grid',gap:12,marginBottom:30}}>{bullets.map((b)=><div key={b} style={{display:'flex',gap:10,alignItems:'flex-start',fontWeight:700,color:'#334155'}}><CheckCircle2 size={20} style={{color:'#15803d',flex:'0 0 auto',marginTop:1}}/>{b}</div>)}</div>

          {loading ? <div style={{padding:'14px 18px',borderRadius:14,background:'#f1f5f9',fontWeight:800}}>{lang === 'pt' ? 'Validando oferta ativa...' : 'Validating active offer...'}</div> : campaign?.trackingLink ? <a href={campaign.trackingLink} target="_blank" rel="sponsored noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:10,padding:'16px 22px',borderRadius:14,background:'#15803d',color:'#fff',fontWeight:900,textDecoration:'none',fontSize:17}}>{cta}<ArrowRight size={20}/><ExternalLink size={16}/></a> : <div style={{padding:'14px 18px',borderRadius:14,background:'#fff7ed',border:'1px solid #fed7aa',fontWeight:800,color:'#9a3412'}}>{lang === 'pt' ? 'Esta oferta está temporariamente indisponível.' : 'This offer is temporarily unavailable.'}</div>}

          <p style={{fontSize:12,color:'#64748b',marginTop:16,lineHeight:1.5}}>{lang === 'pt' ? 'Você será direcionado para o site oficial do parceiro. A VantaCart pode receber comissão pela indicação, sem custo adicional para você.' : 'You will be redirected to the partner’s official website. VantaCart may earn a commission from your purchase at no extra cost to you.'}</p>
        </div>

        <div style={{minHeight:430,borderRadius:28,background:'radial-gradient(circle at 30% 25%,#dcfce7,#f8fafc 48%,#e0f2fe)',display:'grid',placeItems:'center',position:'relative',overflow:'hidden'}}>
          <div style={{width:220,height:220,borderRadius:48,background:'#fff',display:'grid',placeItems:'center',boxShadow:'0 20px 50px rgba(15,23,42,.14)',transform:'rotate(-4deg)'}}><Sparkles size={96} style={{color:'#15803d'}}/></div>
          <div style={{position:'absolute',left:24,bottom:24,right:24,padding:18,borderRadius:18,background:'rgba(255,255,255,.92)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,.75)'}}><div style={{display:'flex',alignItems:'center',gap:10,fontWeight:900}}><ShieldCheck size={20} style={{color:'#15803d'}}/>{lang === 'pt' ? 'Programa afiliado ativo e rastreado' : 'Active tracked affiliate program'}</div><div style={{fontSize:13,color:'#64748b',marginTop:7}}>{campaign?.advertiser || config.name}</div></div>
        </div>
      </section>

      <section style={{marginTop:30,padding:24,borderRadius:22,background:'#0f172a',color:'#fff',display:'flex',gap:18,alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
        <div><div style={{fontWeight:900,fontSize:20}}>{lang === 'pt' ? 'Compra direta no parceiro oficial' : 'Purchase directly from the official partner'}</div><div style={{color:'#cbd5e1',marginTop:5}}>{lang === 'pt' ? 'Sem intermediário no pagamento. O parceiro cuida do checkout, assinatura e suporte do produto.' : 'No payment middleman. The partner handles checkout, subscription and product support.'}</div></div>
        {campaign?.trackingLink && <a href={campaign.trackingLink} target="_blank" rel="sponsored noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'13px 18px',borderRadius:12,background:'#fff',color:'#0f172a',fontWeight:900,textDecoration:'none'}}>{cta}<ArrowRight size={18}/></a>}
      </section>
    </div>
  </main>;
}
