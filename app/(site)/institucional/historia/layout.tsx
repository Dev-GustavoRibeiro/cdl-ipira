import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/institucional/historia';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'Nossa História',
  description:
    'Conheça a história da CDL Ipirá, a Câmara de Dirigentes Lojistas de Ipirá-BA: representação dos lojistas e apoio a cada empresa associada.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['Nossa História', PATH])]} />
    </>
  );
}
