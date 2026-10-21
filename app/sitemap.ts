import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cdlipira.com.br';

// Regera o sitemap a cada hora (novas notícias e campanhas entram sem novo deploy)
export const revalidate = 3600;

const STATIC_ROUTES = [
  '',
  '/institucional/historia',
  '/institucional/diretoria',
  '/institucional/compromisso-cdl',
  '/institucional/missao-visao-valores',
  '/institucional/portal-transparencia',
  '/produtos/spc-brasil',
  '/produtos/cdl-midia',
  '/produtos/certificado-digital',
  '/produtos/balcao-empregos',
  '/beneficios/empresas',
  '/beneficios/orientacao-juridica',
  '/imprensa/noticias',
  '/imprensa/campanhas',
  '/imprensa/eventos',
  '/imprensa/galeria-fotos',
  '/imprensa/tv-lojista',
  '/imprensa/revista-cdl',
  '/imprensa/contato',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path.startsWith('/imprensa') || path === '' ? 'daily' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));

  // Falha no banco (ou tabela ainda não migrada) não derruba o sitemap: ficam só as rotas fixas
  const [campaigns, news] = await Promise.all([
    supabase.from('campaigns').select('slug, updated_at').eq('is_active', true),
    supabase.from('news').select('id, date, updated_at').eq('is_published', true),
  ]);

  for (const campaign of campaigns.data || []) {
    entries.push({
      url: `${SITE_URL}/imprensa/campanhas/${encodeURIComponent(campaign.slug)}`,
      lastModified: campaign.updated_at || undefined,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  for (const item of news.data || []) {
    entries.push({
      url: `${SITE_URL}/imprensa/noticias/${item.id}`,
      lastModified: item.updated_at || item.date || undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}
