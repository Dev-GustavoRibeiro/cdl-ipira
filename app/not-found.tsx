import type { Metadata } from 'next';
import ConditionalLayout from './components/ConditionalLayout';
import NotFoundScreen from './components/NotFoundScreen';

export const metadata: Metadata = {
  title: 'Página não encontrada',
  description: 'O endereço que você acessou não existe ou foi removido.',
  robots: { index: false, follow: true },
};

/** URLs que não casam com nenhuma rota caem aqui, fora do grupo (site): o layout público (header/rodapé) entra explicitamente. */
export default function NotFound() {
  return (
    <ConditionalLayout>
      <NotFoundScreen />
    </ConditionalLayout>
  );
}
