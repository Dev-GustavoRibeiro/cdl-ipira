'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaEye, FaBook, FaUserCircle, FaUsers, FaFileAlt } from 'react-icons/fa';
import { EASE, MOTION_OK, gsap, useGSAP } from '@/lib/motion';

const services = [
  { icon: FaCalendarAlt, title: 'Eventos', link: '/imprensa/eventos' },
  { icon: FaEye, title: 'Portal Transparência', link: '/institucional/portal-transparencia' },
  { icon: FaBook, title: 'Revista CDL', link: '/imprensa/revista-cdl' },
  { icon: FaUserCircle, title: 'Portal do Associado', link: 'https://app.higestor.com.br/portal/cdl-ipira' },
  { icon: FaUsers, title: 'Cadastre Seu Currículo', link: '/produtos/balcao-empregos' },
  { icon: FaFileAlt, title: 'Compromisso da CDL', link: '/institucional/compromisso-cdl' },
];

const ServicesCards = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Cartões "se levantam" em cascata (dobradiça no rodapé, com perspectiva), uma vez
      mm.add({ motion: MOTION_OK, wide: '(min-width: 768px)' }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        const wide = ctx.conditions.wide;
        gsap.from('[data-tile]', {
          rotationX: wide ? -35 : -24,
          y: wide ? 60 : 36,
          opacity: 0,
          transformPerspective: 900,
          transformOrigin: '50% 100%',
          duration: 0.9,
          ease: EASE.enter,
          stagger: { each: 0.08, grid: 'auto', from: 'start' },
          scrollTrigger: { trigger: '[data-tiles]', start: 'top 95%', once: true },
        });
      });

      // Inclinação sutil seguindo o ponteiro (só mouse; toque não depende de hover)
      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        const offs = gsap.utils.toArray<HTMLElement>('[data-tilt]').map((card) => {
          gsap.set(card, { transformPerspective: 700 });
          const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: EASE.enter });
          const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: EASE.enter });
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            rx(((e.clientY - r.top) / r.height - 0.5) * -10);
            ry(((e.clientX - r.left) / r.width - 0.5) * 12);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener('pointermove', move);
          card.addEventListener('pointerleave', leave);
          return () => {
            card.removeEventListener('pointermove', move);
            card.removeEventListener('pointerleave', leave);
          };
        });
        return () => offs.forEach((off) => off());
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    // A partir de md os atalhos sobem sobre a base do banner (--services-overlap, globals.css; o hero reserva esse
    // espaço embaixo para os controles não ficarem por baixo). flow-root impede que a margem negativa "vaze" e leve o
    // fundo branco junto para cima do banner.
    <section ref={root} aria-label="Acesso rápido" className="relative z-10 flow-root bg-white pb-6 pt-5 sm:pb-8 md:pt-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Texto ampliado ou espaçado no celular: 2 colunas (com 3, "Transparência" quebrava a cada 3 ou 4 letras) */}
        <div
          data-tiles
          className="grid grid-cols-3 gap-2 max-md:[html:is(.a11y-text,.a11y-spacing)_&]:grid-cols-2 sm:gap-4 md:-mt-[var(--services-overlap)] lg:grid-cols-6 lg:gap-5"
        >
          {services.map(({ icon: Icon, title, link }) => {
            const isExternal = link.startsWith('http');
            const Component = isExternal ? 'a' : Link;
            const props = isExternal
              ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
              : { href: link };

            return (
              // Invólucro recebe a entrada; o cartão recebe a inclinação (as duas não disputam o mesmo transform)
              <div key={title} data-tile>
                <Component
                  {...props}
                  data-tilt
                  suppressHydrationWarning
                  className="group relative flex h-full flex-col items-center gap-2 overflow-hidden rounded-2xl bg-white px-1.5 pb-4 pt-5 text-center ring-1 ring-[#003f7f]/[0.06] shadow-[0_20px_50px_-20px_rgba(0,63,127,0.35)] transition-[translate,scale,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(0,63,127,0.5)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:gap-3 sm:px-3 md:gap-4 md:pb-5 md:pt-7"
                >
                  {/* Barra de destaque nas cores da marca, aparece no hover/foco */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                  />
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[#00a859]/10 text-[#00a859] ring-1 ring-[#00a859]/15 transition-colors duration-300 group-hover:bg-[#00a859] group-hover:text-white group-focus-visible:bg-[#00a859] group-focus-visible:text-white sm:size-14 sm:rounded-2xl md:size-16">
                    <Icon aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none sm:size-6 md:size-7" />
                  </span>
                  <h3 suppressHydrationWarning className="text-xs font-bold leading-tight text-balance text-gray-800 transition-colors group-hover:text-[#003f7f] sm:text-sm sm:leading-snug">
                    {title}
                    {isExternal && <span className="sr-only"> (abre em nova aba)</span>}
                  </h3>
                </Component>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesCards;
