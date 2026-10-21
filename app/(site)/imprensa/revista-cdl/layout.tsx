import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'Revista CDL',
  description: 'Edições da Revista CDL Ipirá com notícias, artigos, entrevistas e informações sobre o comércio local e regional.',
  alternates: { canonical: '/imprensa/revista-cdl' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
