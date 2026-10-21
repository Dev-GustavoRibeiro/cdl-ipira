import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'Certificado Digital',
  description: 'Certificados digitais ICP-Brasil para pessoa física e jurídica emitidos pela CDL Ipirá, com segurança para transações online.',
  alternates: { canonical: '/produtos/certificado-digital' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
