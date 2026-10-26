'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaBullseye, FaEye, FaInfoCircle } from 'react-icons/fa';
import { SectionHeader, liftCard, shadowCard } from '../../_components/ui';

const links = [
  { href: '/institucional/missao-visao-valores', label: 'Missão, Visão e Valores', icon: FaBullseye },
  { href: '/institucional/portal-transparencia', label: 'Portal Transparência', icon: FaEye },
];

const ContentSection = () => {
  return (
    <section className="bg-linear-to-b from-gray-50 to-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div className="lg:sticky lg:top-[calc(var(--header-height,0px)+2rem)] lg:self-start">
            <SectionHeader icon={FaInfoCircle} eyebrow="Como atuamos" title="Nossa Atuação" align="left" className="mb-8" />

            {/* Atalhos para páginas relacionadas */}
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {links.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className={`group flex items-center gap-4 p-4 active:scale-[0.98] ${liftCard}`}>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#003f7f]/[0.07] text-[#003f7f] transition-colors group-hover:bg-[#003f7f] group-hover:text-white">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="grow text-sm font-bold text-gray-900 sm:text-base">{label}</span>
                    <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#003f7f] transition-[translate] duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <article className={`relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-[#003f7f]/[0.07] sm:p-10 ${shadowCard}`}>
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
            <div className="max-w-[65ch] space-y-5 text-base leading-relaxed text-gray-700 sm:text-lg">
              <p className="text-lg leading-relaxed font-medium text-gray-900 sm:text-xl">
                A <strong className="font-bold text-[#003f7f]">CDL Ipirá</strong> tem como compromisso fundamental representar, defender e fortalecer
                os interesses do comércio local, sempre trabalhando em prol do desenvolvimento econômico e social de nossa cidade.
              </p>
              <p>
                Nossa missão é oferecer serviços de excelência que contribuam para o crescimento e sucesso dos nossos associados, proporcionando
                ferramentas, orientações e suporte necessário para que possam prosperar em seus negócios.
              </p>
              <p>
                Estamos comprometidos em ser uma instituição transparente, ética e eficiente, sempre buscando inovações e melhorias que agreguem
                valor aos nossos associados e à comunidade como um todo.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
