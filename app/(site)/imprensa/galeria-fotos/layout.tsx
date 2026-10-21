import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'Galeria de Fotos',
  description: 'Registros fotográficos dos eventos, encontros e celebrações da CDL Ipirá.',
  alternates: { canonical: '/imprensa/galeria-fotos' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
