import type { Metadata } from 'next';
import NotFoundScreen from '../components/NotFoundScreen';

export const metadata: Metadata = {
  title: 'Página não encontrada',
  description: 'O endereço que você acessou não existe ou foi removido.',
  robots: { index: false, follow: true },
};

/** notFound() dentro das rotas públicas: o layout (site) já traz header e rodapé. */
export default function SiteNotFound() {
  return <NotFoundScreen />;
}
