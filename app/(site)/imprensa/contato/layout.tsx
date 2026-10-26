import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/imprensa/contato';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'Contato e Endereço',
  description:
    'Fale com a CDL Ipirá: telefone, WhatsApp, e-mail e endereço no Passarela Center, Centro de Ipirá-BA. Atendimento de segunda a sexta e aos sábados.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['Contato', PATH])]} />
    </>
  );
}
