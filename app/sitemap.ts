import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { SITE_URL } from '@/lib/seo';

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
  '/politica-de-privacidade',
  '/termos-de-uso',
];

// O Next não escapa as URLs no XML: o '&' das fotos (?w=800&q=80) quebraria o sitemap inteiro
const xmlUrl = (url: string) => url.replace(/&/g, '&amp;');

/** Data mais recente da lista (ISO), para o lastModified das páginas que mostram esse conteúdo. */
const latest = (dates: (string | null | undefined)[]) =>
  dates.filter(Boolean).sort().at(-1) || undefined;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Falha no banco (ou tabela ainda não migrada) não derruba o sitemap: ficam só as rotas fixas
  const [campaigns, news, events] = await Promise.all([
    supabase.from('campaigns').select('slug, cover_image, updated_at').eq('is_active', true),
    supabase.from('news').select('id, image, date, updated_at').eq('is_published', true),
    supabase.from('events').select('updated_at').eq('is_active', true),
  ]);

  const newsUpdated = latest((news.data || []).map((n) => n.updated_at || n.date));
  // Páginas fixas não têm data de edição; só as listas que mudam com o conteúdo do banco recebem lastModified
  const lastModifiedByPath: Record<string, string | undefined> = {
    '': newsUpdated,
    '/imprensa/noticias': newsUpdated,
    '/imprensa/campanhas': latest((campaigns.data || []).map((c) => c.updated_at)),
    '/imprensa/eventos': latest((events.data || []).map((e) => e.updated_at)),
  };

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: lastModifiedByPath[path],
    changeFrequency: path.startsWith('/imprensa') || path === '' ? 'daily' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));

  for (const campaign of campaigns.data || []) {
    entries.push({
      url: `${SITE_URL}/imprensa/campanhas/${encodeURIComponent(campaign.slug)}`,
      lastModified: campaign.updated_at || undefined,
      changeFrequency: 'weekly',
      priority: 0.6,
      // Sitemap de imagens: a capa entra no Google Imagens
      images: campaign.cover_image ? [xmlUrl(campaign.cover_image)] : undefined,
    });
  }

  for (const item of news.data || []) {
    entries.push({
      url: `${SITE_URL}/imprensa/noticias/${item.id}`,
      lastModified: item.updated_at || item.date || undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
      images: item.image ? [xmlUrl(item.image)] : undefined,
    });
  }

  return entries;
}
