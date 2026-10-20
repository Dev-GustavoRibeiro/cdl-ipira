import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'Orientação Jurídica',
  description: 'Orientação jurídica especializada, exclusiva e gratuita para associados da CDL Ipirá. Solicite atendimento pelo site.',
  alternates: { canonical: '/beneficios/orientacao-juridica' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
