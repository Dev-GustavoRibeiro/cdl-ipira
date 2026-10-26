import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/produtos/certificado-digital';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'Certificado Digital em Ipirá (e-CPF e e-CNPJ)',
  description:
    'Certificado digital ICP-Brasil em Ipirá-BA (e-CPF, e-CNPJ, e-Jurídico e e-Saúde) com atendimento na CDL Ipirá, inclusive por videoconferência.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['Certificado Digital', PATH])]} />
    </>
  );
}
