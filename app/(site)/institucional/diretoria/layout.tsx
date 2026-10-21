import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'Diretoria',
  description: 'Conheça a diretoria e a equipe que lideram a CDL Ipirá e trabalham pelo fortalecimento do comércio local.',
  alternates: { canonical: '/institucional/diretoria' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
