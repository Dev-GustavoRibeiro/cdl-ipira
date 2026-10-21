import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'Notícias',
  description: 'Notícias da CDL Ipirá sobre economia, comércio, eventos e o dia a dia dos associados.',
  alternates: { canonical: '/imprensa/noticias' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
