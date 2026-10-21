'use client';

import React from 'react';
import { FaChartLine, FaDollarSign, FaShieldAlt } from 'react-icons/fa';
import { SectionHeader, shadowCard } from '../../_components/ui';

const cards = [
  {
    icon: FaChartLine,
    title: 'Indicadores de Gestão',
    text: 'Acompanhe os principais indicadores de gestão e desempenho da CDL Ipirá. Nosso compromisso é manter você informado sobre todas as atividades.',
    tile: 'bg-linear-to-br from-[#003f7f] to-[#0066cc]',
    bar: 'from-[#003f7f] to-[#0066cc]',
  },
  {
    icon: FaDollarSign,
    title: 'Prestação de Contas',
    text: 'Acesse os demonstrativos financeiros e relatórios de prestação de contas. Transparência total na gestão dos recursos da entidade.',
    tile: 'bg-linear-to-br from-[#00a859] to-[#00d670]',
    bar: 'from-[#00a859] to-[#00d670]',
  },
];

const InfoSection = () => {
  return (
    <section className="bg-white pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader icon={FaShieldAlt} eyebrow="Gestão aberta" title="Compromisso com a Transparência" />
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {cards.map(({ icon: Icon, title, text, tile, bar }) => (
            <article key={title} className={`relative overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-[#003f7f]/[0.07] sm:p-9 ${shadowCard}`}>
              <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${bar}`} />
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[0_12px_24px_-12px_rgba(0,63,127,0.6)] ${tile}`}>
                <Icon aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-black tracking-tight text-[#003f7f] sm:text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-pretty text-gray-600 sm:text-base">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
