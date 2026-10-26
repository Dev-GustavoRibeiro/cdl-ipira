import { pageMetadata } from '@/lib/seo';

const PATH = '/imprensa/noticias';

// A página é client component; o metadata da rota fica neste layout de servidor
// Sem trilha (BreadcrumbList) aqui: cada notícia ([id]) publica a sua, com o título
export const metadata = pageMetadata({
  title: 'Notícias',
  description:
    'Notícias da CDL Ipirá sobre o comércio de Ipirá-BA: campanhas, eventos, economia local, dicas para lojistas e novidades para as empresas associadas.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
