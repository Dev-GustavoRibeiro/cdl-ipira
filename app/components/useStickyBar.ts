'use client';

import { useEffect, useRef } from 'react';

/**
 * Barra sticky colada sob o header (filtros, busca): publica a própria altura em --sticky-bar no <html>, para o foco
 * do teclado não parar embaixo dela (o :focus de globals.css soma no scroll-margin). Igual ao --header-height do
 * Header; volta a 0 ao desmontar. Parada no lugar (short-landscape:static) conta 0.
 * ponytail: uma barra por página (com duas, vale a última medida) e só remede quando o tamanho muda; trocar sticky por
 * static só pela classe (vídeo aberto na TV Lojista) deixa a folga antiga, que só faz o foco parar um pouco mais baixo.
 */
export function useStickyBar<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    // iOS < 13.4 não tem ResizeObserver: fica sem a folga (o header continua descontado)
    if (!el || typeof ResizeObserver === 'undefined') return;
    const root = document.documentElement;
    const update = () =>
      root.style.setProperty('--sticky-bar', getComputedStyle(el).position === 'sticky' ? `${el.offsetHeight}px` : '0px');
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--sticky-bar');
    };
  }, []);

  return ref;
}
