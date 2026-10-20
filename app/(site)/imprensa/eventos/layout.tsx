import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Agenda de eventos da CDL Ipirá: networking, capacitação e oportunidades de crescimento para o comércio local.',
  alternates: { canonical: '/imprensa/eventos' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
