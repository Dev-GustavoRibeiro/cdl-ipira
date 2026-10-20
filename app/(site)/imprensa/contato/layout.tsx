import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'Contato',
  description: 'Fale com a CDL Ipirá: telefone, WhatsApp, e-mail, endereço e formulário de contato.',
  alternates: { canonical: '/imprensa/contato' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
