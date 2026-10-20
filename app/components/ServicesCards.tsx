'use client';

import React from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaEye, FaBook, FaUserCircle, FaUsers, FaFileAlt } from 'react-icons/fa';

const services = [
  { icon: FaCalendarAlt, title: 'Eventos', link: '/imprensa/eventos' },
  { icon: FaEye, title: 'Portal Transparência', link: '/institucional/portal-transparencia' },
  { icon: FaBook, title: 'Revista CDL', link: '/imprensa/revista-cdl' },
  { icon: FaUserCircle, title: 'Portal do Associado', link: 'https://app.higestor.com.br/portal/cdl-ipira' },
  { icon: FaUsers, title: 'Cadastre Seu Currículo', link: '/produtos/balcao-empregos' },
  { icon: FaFileAlt, title: 'Compromisso da CDL', link: '/institucional/compromisso-cdl' },
];

const ServicesCards = () => {
  return (
    // Em telas médias+ os cards sobem sobre a base do banner para dar profundidade
    // flow-root impede que a margem negativa "vaze" e leve o fundo branco junto para cima do banner
    <section aria-label="Acesso rápido" className="relative z-10 flow-root bg-white pb-6 pt-8 sm:pb-8 md:pt-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:-mt-16 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {services.map(({ icon: Icon, title, link }) => {
            const isExternal = link.startsWith('http');
            const Component = isExternal ? 'a' : Link;
            const props = isExternal
              ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
              : { href: link };

            return (
              <Component
                key={title}
                {...props}
                suppressHydrationWarning
                className="group relative flex h-full flex-col items-center gap-3 overflow-hidden rounded-2xl bg-white px-3 pb-5 pt-6 text-center ring-1 ring-[#003f7f]/[0.06] shadow-[0_20px_50px_-20px_rgba(0,63,127,0.35)] transition-[translate,scale,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(0,63,127,0.5)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:gap-4 sm:pt-7"
              >
                {/* Barra de destaque nas cores da marca, aparece no hover/foco */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                />
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00a859]/10 text-[#00a859] ring-1 ring-[#00a859]/15 transition-colors duration-300 group-hover:bg-[#00a859] group-hover:text-white group-focus-visible:bg-[#00a859] group-focus-visible:text-white sm:h-16 sm:w-16">
                  <Icon aria-hidden="true" className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none sm:h-7 sm:w-7" />
                </span>
                <h3 suppressHydrationWarning className="text-sm font-bold leading-snug text-balance text-gray-800 transition-colors group-hover:text-[#003f7f]">
                  {title}
                  {isExternal && <span className="sr-only"> (abre em nova aba)</span>}
                </h3>
              </Component>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesCards;
