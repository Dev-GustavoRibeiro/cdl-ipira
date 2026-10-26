import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/imprensa/eventos';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'Eventos',
  description:
    'Agenda de eventos da CDL Ipirá: palestras, capacitações, sorteios e encontros de networking para lojistas, empreendedores e consumidores de Ipirá-BA.',
  path: PATH,
});

// Sem marcação Event aqui: o Google só aceita Event em página de um evento só, com URL própria
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['Eventos', PATH])]} />
    </>
  );
}
