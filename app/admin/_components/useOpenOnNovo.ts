'use client';

import { useEffect, useEffectEvent } from 'react';

/**
 * Atalhos do painel ("Nova notícia", "Novo evento"...) apontam para `?novo=1`: ao abrir a página com esse
 * parâmetro, chama `open` (o formulário de criação) uma vez e limpa a URL, para o voltar/recarregar não reabrir.
 */
export function useOpenOnNovo(open: () => void) {
  const onNovo = useEffectEvent(open);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('novo') !== '1') return;
    url.searchParams.delete('novo');
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    onNovo();
  }, []);
}
