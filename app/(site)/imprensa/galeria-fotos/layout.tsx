import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/imprensa/galeria-fotos';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'Galeria de Fotos',
  description:
    'Galeria de fotos da CDL Ipirá: registros dos eventos, campanhas, encontros e celebrações do comércio de Ipirá-BA e das empresas associadas à CDL.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['Galeria de Fotos', PATH])]} />
    </>
  );
}
