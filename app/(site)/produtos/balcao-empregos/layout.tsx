import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/produtos/balcao-empregos';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'Balcão de Empregos: vagas em Ipirá',
  description:
    'Vagas de emprego em Ipirá-BA no Balcão de Empregos da CDL Ipirá: veja as oportunidades abertas no comércio local e cadastre as vagas da sua empresa.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['Balcão de Empregos', PATH])]} />
    </>
  );
}
