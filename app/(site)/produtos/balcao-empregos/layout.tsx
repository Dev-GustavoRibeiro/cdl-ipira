import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'Balcão de Empregos',
  description: 'Vagas de emprego no comércio de Ipirá e cadastro de vagas para empresas no Balcão de Empregos da CDL Ipirá.',
  alternates: { canonical: '/produtos/balcao-empregos' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
