import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/beneficios/orientacao-juridica';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'Orientação Jurídica para Associados',
  description:
    'Orientação jurídica gratuita para associados em dia com a CDL Ipirá: tire dúvidas jurídicas do dia a dia da sua empresa em Ipirá-BA.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['Orientação Jurídica', PATH])]} />
    </>
  );
}
