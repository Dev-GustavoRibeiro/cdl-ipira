import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/institucional/portal-transparencia';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'Portal da Transparência',
  description:
    'Portal da Transparência da CDL Ipirá: aqui são publicados os demonstrativos e relatórios de prestação de contas da Câmara de Dirigentes Lojistas de Ipirá-BA.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['Portal da Transparência', PATH])]} />
    </>
  );
}
