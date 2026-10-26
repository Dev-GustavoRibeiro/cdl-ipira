import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/institucional/diretoria';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'Diretoria',
  description:
    'Conheça a diretoria e a equipe da CDL Ipirá, a Câmara de Dirigentes Lojistas de Ipirá-BA, que trabalham todos os dias pelo fortalecimento do comércio local.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['Diretoria', PATH])]} />
    </>
  );
}
