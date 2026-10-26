'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Registro único dos plugins (só no navegador; no SSR o módulo é importado mas nada roda)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  // A barra de endereço do celular aparece/some e muda a altura da janela: não recalcula os gatilhos por isso
  // (sem isso as seções "pulam" ao rolar no celular)
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Animações só rodam para quem não pediu movimento reduzido (usar com gsap.matchMedia). */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** Vocabulário de movimento do site: entradas rápidas e firmes, transições de rolagem sem easing (scrub). */
export const EASE = {
  enter: 'power3.out',
  soft: 'power2.out',
  inOut: 'power2.inOut',
  expo: 'expo.out',
} as const;
