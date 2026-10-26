import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/produtos/spc-brasil';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata = pageMetadata({
  title: 'Consulta SPC Brasil em Ipirá',
  description:
    'Consulta SPC Brasil em Ipirá-BA na CDL: consulte CPF e CNPJ antes de vender a prazo, use o SPC Avisa, o SPC Conciliador e o Cadastro Positivo na sua empresa.',
  path: PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={[breadcrumbJsonLd(['SPC Brasil', PATH])]} />
    </>
  );
}
