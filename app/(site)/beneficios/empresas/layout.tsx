import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/beneficios/empresas';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'Empresas Associadas',
  description:
    'Empresas associadas à CDL Ipirá: conheça lojas e prestadores de serviço de Ipirá-BA que fortalecem o comércio local e valorize quem é daqui.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['Empresas Associadas', PATH])]} />
    </>
  );
}
