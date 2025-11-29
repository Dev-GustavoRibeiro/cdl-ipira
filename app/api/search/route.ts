import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Conteúdo estático para páginas institucionais e de produtos
const staticPages = [
  {
    type: 'page',
    title: 'História da CDL Ipirá',
    description: 'Conheça a trajetória da Câmara de Dirigentes Lojistas de Ipirá, fundada para fortalecer o comércio local.',
    url: '/institucional/historia',
    keywords: ['história', 'fundação', 'cdl', 'ipira', 'comércio', 'lojistas', 'trajetória']
  },
  {
    type: 'page',
    title: 'Diretoria CDL Ipirá',
    description: 'Conheça os membros da diretoria da CDL Ipirá, profissionais comprometidos com o desenvolvimento do comércio.',
    url: '/institucional/diretoria',
    keywords: ['diretoria', 'presidente', 'vice', 'tesoureiro', 'conselho', 'membros', 'gestão']
  },
  {
    type: 'page',
    title: 'Missão, Visão e Valores',
    description: 'Nossa missão é fortalecer o comércio de Ipirá através de serviços, capacitação e representatividade.',
    url: '/institucional/missao-visao-valores',
    keywords: ['missão', 'visão', 'valores', 'princípios', 'objetivos', 'compromisso']
  },
  {
    type: 'page',
    title: 'Compromisso CDL',
    description: 'O compromisso da CDL Ipirá com o desenvolvimento sustentável do comércio local.',
    url: '/institucional/compromisso-cdl',
    keywords: ['compromisso', 'sustentabilidade', 'desenvolvimento', 'comunidade']
  },
  {
    type: 'page',
    title: 'Portal da Transparência',
    description: 'Acesse documentos, relatórios e informações sobre a gestão da CDL Ipirá.',
    url: '/institucional/portal-transparencia',
    keywords: ['transparência', 'documentos', 'relatórios', 'gestão', 'prestação de contas']
  },
  {
    type: 'page',
    title: 'SPC Brasil',
    description: 'Consultas de CPF/CNPJ, negativação, proteção ao crédito e mais serviços do SPC Brasil.',
    url: '/produtos/spc-brasil',
    keywords: ['spc', 'consulta', 'cpf', 'cnpj', 'crédito', 'negativação', 'score', 'serasa']
  },
  {
    type: 'page',
    title: 'Certificado Digital',
    description: 'Emissão de certificados digitais e-CPF e e-CNPJ com atendimento na CDL Ipirá.',
    url: '/produtos/certificado-digital',
    keywords: ['certificado digital', 'e-cpf', 'e-cnpj', 'assinatura digital', 'token']
  },
  {
    type: 'page',
    title: 'CDL Mídia',
    description: 'Divulgue sua empresa através dos canais de comunicação da CDL Ipirá.',
    url: '/produtos/cdl-midia',
    keywords: ['mídia', 'publicidade', 'propaganda', 'marketing', 'divulgação']
  },
  {
    type: 'page',
    title: 'Balcão de Empregos',
    description: 'Encontre vagas de emprego em Ipirá ou cadastre vagas da sua empresa.',
    url: '/balcao-empregos',
    keywords: ['emprego', 'vagas', 'trabalho', 'currículo', 'oportunidade', 'contratação']
  },
  {
    type: 'page',
    title: 'Orientação Jurídica',
    description: 'Assessoria jurídica gratuita para associados CDL em questões trabalhistas e empresariais.',
    url: '/beneficios/orientacao-juridica',
    keywords: ['jurídica', 'advogado', 'orientação', 'trabalhista', 'empresarial', 'assessoria']
  },
  {
    type: 'page',
    title: 'Projeto Conduz',
    description: 'Projeto social de educação musical para crianças e jovens de Ipirá.',
    url: '/beneficios/projeto-conduz',
    keywords: ['conduz', 'música', 'social', 'educação', 'crianças', 'jovens', 'orquestra']
  },
  {
    type: 'page',
    title: 'Empresas Parceiras',
    description: 'Conheça as empresas parceiras e conveniadas à CDL Ipirá.',
    url: '/beneficios/empresas',
    keywords: ['empresas', 'parceiros', 'convênios', 'descontos', 'benefícios']
  },
  {
    type: 'page',
    title: 'Notícias',
    description: 'Acompanhe as últimas notícias do comércio de Ipirá e região.',
    url: '/imprensa/noticias',
    keywords: ['notícias', 'novidades', 'imprensa', 'informações', 'atualidades']
  },
  {
    type: 'page',
    title: 'TV Lojista',
    description: 'Assista aos vídeos e conteúdos da TV Lojista CDL Ipirá.',
    url: '/imprensa/tv-lojista',
    keywords: ['tv', 'vídeos', 'lojista', 'entrevistas', 'programas']
  },
  {
    type: 'page',
    title: 'Galeria de Fotos',
    description: 'Veja as fotos dos eventos e ações realizadas pela CDL Ipirá.',
    url: '/imprensa/galeria-fotos',
    keywords: ['galeria', 'fotos', 'imagens', 'eventos', 'álbum']
  },
  {
    type: 'page',
    title: 'Eventos',
    description: 'Confira os próximos eventos e ações promovidas pela CDL Ipirá.',
    url: '/imprensa/eventos',
    keywords: ['eventos', 'agenda', 'palestras', 'workshops', 'encontros']
  },
  {
    type: 'page',
    title: 'Revista CDL',
    description: 'Leia as edições da Revista CDL Ipirá com conteúdo exclusivo para lojistas.',
    url: '/imprensa/revista-cdl',
    keywords: ['revista', 'publicação', 'edição', 'leitura', 'matérias']
  },
  {
    type: 'page',
    title: 'Contato',
    description: 'Entre em contato com a CDL Ipirá. Atendimento ao associado e imprensa.',
    url: '/imprensa/contato',
    keywords: ['contato', 'telefone', 'email', 'endereço', 'atendimento', 'whatsapp']
  },
  {
    type: 'page',
    title: 'Filie-se à CDL',
    description: 'Associe-se à CDL Ipirá e aproveite todos os benefícios exclusivos para lojistas.',
    url: 'https://app.higestor.com.br/inscricao/empresa/cdl-ipira',
    keywords: ['filiação', 'associação', 'cadastro', 'membro', 'associado', 'inscrição']
  }
];

// Função para normalizar texto (remover acentos e lowercase)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Função para verificar se o texto contém o termo de busca
function matchesSearch(text: string | null | undefined, searchTerm: string): boolean {
  if (!text) return false;
  const normalizedText = normalizeText(text);
  const normalizedSearch = normalizeText(searchTerm);
  return normalizedText.includes(normalizedSearch);
}

// Função para calcular relevância
function calculateRelevance(item: { title?: string; description?: string; content?: string; keywords?: string[] }, searchTerm: string): number {
  let score = 0;
  const normalizedSearch = normalizeText(searchTerm);
  
  // Título tem peso maior
  if (item.title && matchesSearch(item.title, searchTerm)) {
    score += 10;
    // Bonus se o termo está no início do título
    if (normalizeText(item.title).startsWith(normalizedSearch)) {
      score += 5;
    }
  }
  
  // Keywords têm peso médio
  if (item.keywords) {
    for (const keyword of item.keywords) {
      if (matchesSearch(keyword, searchTerm)) {
        score += 5;
      }
    }
  }
  
  // Descrição e conteúdo têm peso menor
  if (item.description && matchesSearch(item.description, searchTerm)) {
    score += 3;
  }
  
  if (item.content && matchesSearch(item.content, searchTerm)) {
    score += 2;
  }
  
  return score;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  if (!query || query.trim().length < 2) {
    return NextResponse.json({ 
      error: 'Termo de busca deve ter pelo menos 2 caracteres',
      results: [],
      total: 0 
    }, { status: 400 });
  }
  
  const searchTerm = query.trim();
  
  try {
    // Buscar em paralelo em todas as fontes
    const [newsResult, eventsResult, jobsResult, videosResult] = await Promise.all([
      // Buscar notícias
      supabase
        .from('news')
        .select('id, title, content, excerpt, image_url, date, category, author')
        .eq('is_published', true)
        .order('date', { ascending: false })
        .limit(50),
      
      // Buscar eventos
      supabase
        .from('events')
        .select('id, title, description, date, time, location, image_url, category')
        .eq('is_active', true)
        .order('date', { ascending: false })
        .limit(50),
      
      // Buscar vagas
      supabase
        .from('jobs')
        .select('id, title, description, company, location, salary, category, requirements, benefits')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50),
      
      // Buscar vídeos
      supabase
        .from('videos')
        .select('id, title, description, youtube_id, thumbnail, category, date')
        .eq('is_active', true)
        .order('date', { ascending: false })
        .limit(50)
    ]);
    
    const results: {
      type: string;
      id: string | number;
      title: string;
      description: string;
      url: string;
      image?: string;
      date?: string;
      category?: string;
      relevance: number;
    }[] = [];
    
    // Processar notícias
    if (newsResult.data) {
      for (const news of newsResult.data) {
        const relevance = calculateRelevance({
          title: news.title,
          description: news.excerpt,
          content: news.content
        }, searchTerm);
        
        if (relevance > 0) {
          results.push({
            type: 'noticia',
            id: news.id,
            title: news.title,
            description: news.excerpt || news.content?.substring(0, 200) || '',
            url: `/imprensa/noticias/${news.id}`,
            image: news.image_url,
            date: news.date,
            category: news.category,
            relevance
          });
        }
      }
    }
    
    // Processar eventos
    if (eventsResult.data) {
      for (const event of eventsResult.data) {
        const relevance = calculateRelevance({
          title: event.title,
          description: event.description
        }, searchTerm);
        
        if (relevance > 0) {
          results.push({
            type: 'evento',
            id: event.id,
            title: event.title,
            description: event.description || '',
            url: `/imprensa/eventos`,
            image: event.image_url,
            date: event.date,
            category: event.category,
            relevance
          });
        }
      }
    }
    
    // Processar vagas
    if (jobsResult.data) {
      for (const job of jobsResult.data) {
        const relevance = calculateRelevance({
          title: job.title,
          description: job.description,
          content: `${job.requirements || ''} ${job.benefits || ''}`
        }, searchTerm);
        
        if (relevance > 0) {
          results.push({
            type: 'vaga',
            id: job.id,
            title: job.title,
            description: job.description || `${job.company || ''} - ${job.location || 'Ipirá'}`,
            url: `/balcao-empregos`,
            category: job.category,
            relevance
          });
        }
      }
    }
    
    // Processar vídeos
    if (videosResult.data) {
      for (const video of videosResult.data) {
        const relevance = calculateRelevance({
          title: video.title,
          description: video.description
        }, searchTerm);
        
        if (relevance > 0) {
          results.push({
            type: 'video',
            id: video.id,
            title: video.title,
            description: video.description || '',
            url: `/imprensa/tv-lojista`,
            image: video.thumbnail || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`,
            date: video.date,
            category: video.category,
            relevance
          });
        }
      }
    }
    
    // Processar páginas estáticas
    for (const page of staticPages) {
      const relevance = calculateRelevance({
        title: page.title,
        description: page.description,
        keywords: page.keywords
      }, searchTerm);
      
      if (relevance > 0) {
        results.push({
          type: 'page',
          id: page.url,
          title: page.title,
          description: page.description,
          url: page.url,
          relevance
        });
      }
    }
    
    // Ordenar por relevância (maior primeiro)
    results.sort((a, b) => b.relevance - a.relevance);
    
    // Limitar a 30 resultados
    const limitedResults = results.slice(0, 30);
    
    return NextResponse.json({
      query: searchTerm,
      results: limitedResults,
      total: results.length
    });
    
  } catch (error) {
    console.error('Erro na pesquisa:', error);
    return NextResponse.json({ 
      error: 'Erro ao realizar a pesquisa',
      results: [],
      total: 0 
    }, { status: 500 });
  }
}


