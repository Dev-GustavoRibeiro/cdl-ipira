import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/produtos/cdl-midia';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'CDL Mídia',
  description:
    'CDL Mídia: divulgue sua empresa nos canais da CDL Ipirá no Facebook, Instagram e YouTube e alcance os consumidores e lojistas do comércio de Ipirá-BA.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['CDL Mídia', PATH])]} />
    </>
  );
}
