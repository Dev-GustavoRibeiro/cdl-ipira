import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// Rotas de leitura que as páginas buscam no navegador (listas de notícias, eventos, vagas...).
// O Googlebot respeita o robots.txt também nesses fetch: bloqueadas, as listas chegariam vazias para ele.
const PUBLIC_APIS = ['albums', 'eventos', 'hero', 'noticias', 'parceiros', 'vagas', 'videos'].map((name) => `/api/${name}`);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // A regra mais específica vence: /api/noticias liberada, o resto de /api/ bloqueado
      allow: ['/', ...PUBLIC_APIS],
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
