import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/institucional/missao-visao-valores';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'Missão, Visão e Valores',
  description:
    'Missão, visão e valores da CDL Ipirá: os princípios que orientam a Câmara de Dirigentes Lojistas no apoio aos lojistas e no desenvolvimento de Ipirá-BA.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['Missão, Visão e Valores', PATH])]} />
    </>
  );
}
