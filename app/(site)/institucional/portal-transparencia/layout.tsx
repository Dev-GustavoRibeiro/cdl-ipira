import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'Portal da Transparência',
  description: 'Documentos de transparência, prestação de contas e gestão da CDL Ipirá para os associados.',
  alternates: { canonical: '/institucional/portal-transparencia' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
