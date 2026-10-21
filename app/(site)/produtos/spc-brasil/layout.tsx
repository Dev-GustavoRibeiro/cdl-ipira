import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'SPC Brasil',
  description: 'Consultas SPC Brasil na CDL Ipirá: proteção, negociação e construção de crédito em um só lugar.',
  alternates: { canonical: '/produtos/spc-brasil' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
