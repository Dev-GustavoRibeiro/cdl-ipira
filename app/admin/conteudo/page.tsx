'use client';

import React from 'react';
import Link from 'next/link';
import { FaImages, FaHandshake, FaArrowRight } from 'react-icons/fa';
import { AdminPageHeader, cx, focusRing } from '../_components';

const SECTIONS = [
  {
    title: 'Hero Carousel',
    description: 'Slides do banner principal da página inicial: título, texto, botão e imagem.',
    href: '/admin/conteudo/hero-carousel',
    icon: FaImages,
    tile: 'bg-[#003f7f] text-white',
  },
  {
    title: 'Associados',
    description: 'Logos e links das empresas associadas exibidas no carrossel do site.',
    href: '/admin/conteudo/parceiros',
    icon: FaHandshake,
    tile: 'bg-[#ffd000] text-[#003f7f]',
  },
];

export default function AdminConteudoPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Conteúdo do site"
        description="Escolha o que deseja editar na página inicial."
      />

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6 2xl:max-w-5xl">
        {SECTIONS.map(({ title, description, href, icon: Icon, tile }) => (
          <li key={href}>
            <Link
              href={href}
              className={cx(
                'group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-gray-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-7',
                'transition-[translate,scale,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-28px_rgba(0,63,127,0.55)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                focusRing
              )}
            >
              {/* Faixa da marca aparece no hover/foco */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] transition-[scale] duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
              />
              <span className={cx('mb-5 flex size-12 items-center justify-center rounded-2xl', tile)}>
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#003f7f]">{title}</h2>
              <p className="mt-1.5 flex-1 text-sm text-gray-600">{description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0052a3]">
                Gerenciar
                <FaArrowRight
                  aria-hidden="true"
                  className="h-3 w-3 transition-[translate] duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
