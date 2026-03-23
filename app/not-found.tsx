import type { Metadata } from 'next';
import NotFoundScreen from './components/NotFoundScreen';

export const metadata: Metadata = {
  title: 'Página não encontrada | CDL Ipirá',
  description: 'O endereço que você acessou não existe ou foi removido.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundScreen />;
}
