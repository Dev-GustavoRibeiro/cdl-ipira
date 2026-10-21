import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'Missão, Visão e Valores',
  description: 'Os pilares que sustentam a atuação da CDL Ipirá e impulsionam o comércio de Ipirá rumo ao futuro.',
  alternates: { canonical: '/institucional/missao-visao-valores' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
