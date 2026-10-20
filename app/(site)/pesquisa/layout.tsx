import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'Pesquisa',
  description: 'Pesquise notícias, eventos, vagas, vídeos e páginas do site da CDL Ipirá.',
  // Resultados de busca interna não devem ser indexados
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
