import { pageMetadata } from '@/lib/seo';

const PATH = '/pesquisa';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'Pesquisa',
  description:
    'Pesquise notícias, eventos, campanhas, vagas de emprego, vídeos e páginas no site da CDL Ipirá, a Câmara de Dirigentes Lojistas de Ipirá-BA.',
  path: PATH,
  // Resultados de busca interna não devem ser indexados
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
