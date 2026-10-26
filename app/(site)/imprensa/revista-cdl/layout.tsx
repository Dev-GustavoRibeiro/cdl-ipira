import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/imprensa/revista-cdl';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'Revista CDL',
  description:
    'Revista CDL Ipirá: as edições, com notícias, artigos e entrevistas sobre o comércio de Ipirá-BA e da região, são publicadas nesta página.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['Revista CDL', PATH])]} />
    </>
  );
}
