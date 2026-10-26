'use client';

import type { RefObject } from 'react';
import { EASE, MOTION_OK, ScrollTrigger, SplitText, gsap, useGSAP } from '@/lib/motion';

/**
 * Entrada das seções ao rolar, guiada por atributos no markup (dentro de `scope`):
 *  - data-reveal="eyebrow" → selo/pílula: sobe e cresce levemente
 *  - data-reveal="title"   → título: palavras sobem de dentro de uma máscara, uma a uma
 *  - data-reveal="bar"     → barra tricolor: desenha da esquerda (ou do centro com data-reveal-origin="center")
 *  - data-reveal="fade"    → parágrafos/ações: sobem com fade
 *  - data-reveal="item"    → cartões/itens de grade: entram em cascata conforme aparecem
 * Roda uma vez por elemento. Com movimento reduzido nada é animado e o conteúdo fica como no HTML.
 * Só opacity, nunca autoAlpha: visibility:hidden tiraria links e botões ainda não revelados do Tab e do leitor de
 * tela. Com opacity eles seguem focáveis; o foco rola até o elemento e a entrada dispara.
 * `dependencies`: passe o que muda o conteúdo (ex.: itens carregados da API) para reprocessar.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, dependencies: unknown[] = []) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const once = (el: Element, start = 'top 88%') => ({ trigger: el, start, once: true });

        q('[data-reveal="eyebrow"]').forEach((el) =>
          gsap.from(el, { y: 14, scale: 0.92, opacity: 0, duration: 0.6, ease: EASE.enter, scrollTrigger: once(el) }),
        );

        q('[data-reveal="title"]').forEach((el) => {
          // autoSplit refaz a divisão quando a fonte carrega ou a largura muda; a animação devolvida é recriada junto
          SplitText.create(el, {
            type: 'words',
            mask: 'words',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                yPercent: 110,
                duration: 0.9,
                ease: EASE.expo,
                stagger: 0.06,
                scrollTrigger: once(el),
              }),
          });
        });

        q('[data-reveal="bar"]').forEach((el) =>
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: (el as HTMLElement).dataset.revealOrigin === 'center' ? '50% 50%' : '0% 50%',
            duration: 0.9,
            ease: EASE.inOut,
            delay: 0.15,
            scrollTrigger: once(el),
          }),
        );

        q('[data-reveal="fade"]').forEach((el) =>
          gsap.from(el, { y: 24, opacity: 0, duration: 0.8, ease: EASE.enter, delay: 0.1, scrollTrigger: once(el) }),
        );

        // Cartões que aparecem juntos entram juntos, em cascata (um gatilho por item, callbacks agrupados)
        const items = q('[data-reveal="item"]');
        if (items.length) {
          gsap.set(items, { y: 48, opacity: 0 });
          ScrollTrigger.batch(items, {
            start: 'top 90%',
            once: true,
            onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 0.8, ease: EASE.enter, stagger: 0.08, overwrite: true }),
          });
        }
      });
      return () => mm.revert();
    },
    { scope, dependencies, revertOnUpdate: true },
  );
}
