import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'TV Lojista',
  description: 'Vídeos, entrevistas, dicas e coberturas de eventos da CDL Ipirá para impulsionar o seu negócio.',
  alternates: { canonical: '/imprensa/tv-lojista' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
