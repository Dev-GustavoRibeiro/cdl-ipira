import type { Metadata } from 'next';
import NotFoundScreen from '../components/NotFoundScreen';

export const metadata: Metadata = {
  title: 'Página não encontrada | CDL Ipirá',
  description: 'O endereço que você acessou não existe ou foi removido.',
  robots: { index: false, follow: true },
};

/** Cobre header/footer quando o 404 é disparado dentro das rotas públicas. */
export default function SiteNotFound() {
  return <NotFoundScreen />;
}
