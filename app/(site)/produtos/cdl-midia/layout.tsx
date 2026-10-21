import type { Metadata } from 'next';

// A página é client component; o metadata da rota fica neste layout de servidor
export const metadata: Metadata = {
  title: 'CDL Mídia',
  description: 'Divulgue sua empresa nos canais da CDL Ipirá no Facebook, Instagram e YouTube.',
  alternates: { canonical: '/produtos/cdl-midia' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
