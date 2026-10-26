import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/imprensa/tv-lojista';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'TV Lojista',
  description:
    'TV Lojista da CDL Ipirá: vídeos com dicas para o comércio de Ipirá-BA, selecionados pela CDL.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['TV Lojista', PATH])]} />
    </>
  );
}
