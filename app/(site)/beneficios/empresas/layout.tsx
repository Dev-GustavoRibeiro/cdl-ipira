import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'Empresas Associadas',
  description: 'Conheça as empresas associadas à CDL Ipirá que fortalecem o comércio local e oferecem produtos e serviços para a comunidade.',
  alternates: { canonical: '/beneficios/empresas' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
