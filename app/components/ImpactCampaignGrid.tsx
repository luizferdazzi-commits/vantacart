'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Bot, BriefcaseBusiness, CheckCircle2, ExternalLink, Sparkles, Workflow } from 'lucide-react';

type Lang = 'pt' | 'en';
type Campaign = {
  id: string;
  name: string;
  advertiser: string;
  description?: string;
  url?: string;
  status?: string;
  trackingLink?: string;
  allowsDeeplinking?: string;
  type?: string;
};

type Offer = {
  key: string;
  campaign: Campaign;
  titlePt: string;
  titleEn: string;
  textPt: string;
  textEn: string;
  icon: 'bot' | 'workflow' | 'business' | 'briefcase' | 'sparkles';
  badgePt: string;
  badgeEn: string;
};

const iconMap = {
  bot: Bot,
  workflow: Workflow,
  business: BriefcaseBusiness,
  briefcase: BriefcaseBusiness,
  sparkles: Sparkles,
};

function landingUrl(campaign: Campaign, lang: Lang) {
  const n = `${campaign.name} ${campaign.advertiser}`.toLowerCase();
  if (n.includes('creao')) return `/offers/creao?lang=${lang}`;
  if (n.includes('riibase')) return `/offers/riibase?lang=${lang}`;
  return campaign.trackingLink || '#';
}

function expandCampaign(campaign: Campaign): Offer[] {
  const n = `${campaign.name} ${campaign.advertiser}`.toLowerCase();

  if (n.includes('creao')) {
    return [
      {
        key: `${campaign.id}-agents`, campaign, icon: 'bot', badgePt: 'IA', badgeEn: 'AI',
        titlePt: 'Crie agentes de IA para trabalhar por você', titleEn: 'Build AI agents that work for you',
        textPt: 'Automatize tarefas, conecte ferramentas e transforme conversas em trabalho concluído.', textEn: 'Automate tasks, connect tools and turn conversations into finished work.'
      },
      {
        key: `${campaign.id}-automation`, campaign, icon: 'workflow', badgePt: 'Automação', badgeEn: 'Automation',
        titlePt: 'Automatize fluxos sem complicação', titleEn: 'Automate workflows without the complexity',
        textPt: 'Integre Gmail, Slack, GitHub e dezenas de ferramentas em fluxos inteligentes.', textEn: 'Connect Gmail, Slack, GitHub and dozens of tools into intelligent workflows.'
      },
      {
        key: `${campaign.id}-content`, campaign, icon: 'sparkles', badgePt: 'Conteúdo', badgeEn: 'Content',
        titlePt: 'Produza documentos, imagens e conteúdo com IA', titleEn: 'Create documents, images and content with AI',
        textPt: 'Use um único ambiente para acelerar criação, pesquisa e execução.', textEn: 'Use one workspace to speed up creation, research and execution.'
      },
      {
        key: `${campaign.id}-productivity`, campaign, icon: 'briefcase', badgePt: 'Produtividade', badgeEn: 'Productivity',
        titlePt: 'Centralize sua produtividade com IA', titleEn: 'Centralize your AI productivity',
        textPt: 'Reúna automações, apps reutilizáveis e tarefas agendadas em uma única plataforma.', textEn: 'Bring automations, reusable apps and scheduled tasks into one platform.'
      },
    ];
  }

  if (n.includes('riibase')) {
    return [
      {
        key: `${campaign.id}-crm`, campaign, icon: 'business', badgePt: 'CRM', badgeEn: 'CRM',
        titlePt: 'CRM completo para organizar vendas e clientes', titleEn: 'All-in-one CRM for sales and customers',
        textPt: 'Centralize contatos, oportunidades e processos comerciais em um só sistema.', textEn: 'Centralize contacts, opportunities and sales processes in one system.'
      },
      {
        key: `${campaign.id}-sales`, campaign, icon: 'workflow', badgePt: 'Vendas', badgeEn: 'Sales',
        titlePt: 'Automatize seu processo comercial', titleEn: 'Automate your sales process',
        textPt: 'Estruture etapas, acompanhamento e rotinas para não perder oportunidades.', textEn: 'Structure stages, follow-ups and routines so opportunities do not get lost.'
      },
      {
        key: `${campaign.id}-ai`, campaign, icon: 'bot', badgePt: 'IA + CRM', badgeEn: 'AI + CRM',
        titlePt: 'Use IA dentro do seu CRM', titleEn: 'Use AI inside your CRM',
        textPt: 'Aproveite recursos inteligentes para ganhar velocidade no atendimento e na gestão.', textEn: 'Use intelligent features to speed up customer service and management.'
      },
      {
        key: `${campaign.id}-growth`, campaign, icon: 'sparkles', badgePt: 'Negócios', badgeEn: 'Business',
        titlePt: 'Uma base única para crescer seu negócio', titleEn: 'One platform to grow your business',
        textPt: 'Organize relacionamento, vendas e operação com uma visão centralizada.', textEn: 'Organize relationships, sales and operations with a centralized view.'
      },
    ];
  }

  return [{
    key: `${campaign.id}-default`, campaign, icon: 'sparkles', badgePt: 'Parceiro', badgeEn: 'Partner',
    titlePt: campaign.name, titleEn: campaign.name,
    textPt: campaign.description || 'Oferta ativa de parceiro VantaCart.', textEn: campaign.description || 'Active VantaCart partner offer.'
  }];
}

export default function ImpactCampaignGrid({ lang }: { lang: Lang }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/impact/campaigns', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.ok && Array.isArray(data.campaigns)) {
          setCampaigns(data.campaigns.filter((c: Campaign) => c.status === 'Active' && c.trackingLink));
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const offers = useMemo(() => campaigns.flatMap(expandCampaign), [campaigns]);

  if (loading) {
    return <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:18,background:'#fff'}}>{lang === 'pt' ? 'Carregando ofertas ativas...' : 'Loading active offers...'}</div>;
  }

  if (!offers.length) {
    return <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:18,background:'#fff'}}>{lang === 'pt' ? 'Novas ofertas estão sendo sincronizadas.' : 'New offers are being synchronized.'}</div>;
  }

  return <>
    <div style={{display:'flex',alignItems:'center',gap:8,margin:'0 0 16px',fontSize:13,color:'#166534',fontWeight:800}}>
      <CheckCircle2 size={17}/> {lang === 'pt' ? `${campaigns.length} parceiros ativos • ${offers.length} ofertas comerciais no ar` : `${campaigns.length} active partners • ${offers.length} commercial offers live`}
    </div>
    <div className="cleanProducts">
      {offers.map((offer) => {
        const Icon = iconMap[offer.icon];
        const href = landingUrl(offer.campaign, lang);
        const internal = href.startsWith('/');
        return <a key={offer.key} className="cleanProduct" href={href} target={internal ? undefined : '_blank'} rel={internal ? undefined : 'sponsored noopener noreferrer'} style={{textDecoration:'none',color:'inherit'}}>
          <div className="cleanProductImage" style={{display:'grid',placeItems:'center',background:'linear-gradient(145deg,#f8fafc,#eef6f2)',minHeight:190,position:'relative'}}>
            <Icon size={70}/>
            <span className="cleanBadge">{lang === 'pt' ? offer.badgePt : offer.badgeEn}</span>
          </div>
          <div className="cleanProductBody">
            <div style={{fontSize:12,fontWeight:800,color:'#166534',marginBottom:6}}>{offer.campaign.advertiser}</div>
            <div className="cleanProductTitle">{lang === 'pt' ? offer.titlePt : offer.titleEn}</div>
            <p style={{fontSize:13,lineHeight:1.5,color:'#64748b',margin:'8px 0 12px'}}>{lang === 'pt' ? offer.textPt : offer.textEn}</p>
            <div className="deliveryHint"><CheckCircle2 size={13}/> {lang === 'pt' ? 'Programa afiliado ativo' : 'Active affiliate program'}</div>
            <div style={{display:'flex',alignItems:'center',gap:7,marginTop:14,fontWeight:800,color:'#166534'}}>{lang === 'pt' ? 'Ver detalhes e oferta' : 'View details and offer'} <ArrowRight size={15}/>{!internal && <ExternalLink size={13}/>}</div>
          </div>
        </a>;
      })}
    </div>
  </>;
}
