import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'Nossa História',
  description: 'Mais de três décadas dedicadas ao fortalecimento do comércio de Ipirá e ao sucesso de cada associado.',
  alternates: { canonical: '/institucional/historia' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
