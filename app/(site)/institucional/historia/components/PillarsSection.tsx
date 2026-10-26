'use client';

import React from 'react';
import Link from 'next/link';
import { FaRocket, FaChartLine, FaHeart, FaArrowRight, FaCompass } from 'react-icons/fa';
import { SectionHeader, liftCard } from '../../_components/ui';

const pilares = [
  {
    title: 'Missão',
    description: 'Promover o fortalecimento dos nossos associados através da representatividade e entrega de soluções para o desenvolvimento de Ipirá.',
    icon: FaRocket,
    tile: 'bg-linear-to-br from-[#003f7f] to-[#0066cc] text-white',
  },
  {
    title: 'Visão',
    description: 'Ser reconhecida como a melhor entidade da Bahia até 2030, destacando-se em excelência e soluções inovadoras.',
    icon: FaChartLine,
    tile: 'bg-linear-to-br from-[#00a859] to-[#00d670] text-white',
  },
  {
    title: 'Valores',
    description: 'Foco no associado, comprometimento, eficiência, ética, inovação e excelência em tudo o que fazemos.',
    icon: FaHeart,
    tile: 'bg-linear-to-br from-[#ffd000] to-[#ffed4e] text-[#003f7f]',
  },
];

const PillarsSection = () => {
  return (
    <section className="bg-white pt-4 pb-16 sm:pt-6 sm:pb-20 lg:pt-8 lg:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={FaCompass}
          eyebrow="O que nos guia"
          title="Nossos Pilares"
          description="Os fundamentos que guiam a atuação da CDL Ipirá."
        />

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {pilares.map(({ title, description, icon: Icon, tile }) => (
            <Link
              key={title}
              href="/institucional/missao-visao-valores"
              className={`group relative flex h-full flex-col overflow-hidden p-7 active:scale-[0.98] sm:p-8 ${liftCard}`}
            >
              {/* Barra nas cores da marca, aparece no hover/foco */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] transition-[scale] duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
              />
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-[0_12px_24px_-12px_rgba(0,63,127,0.6)] sm:h-16 sm:w-16 ${tile}`}>
                <Icon aria-hidden="true" className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <h3 className="mt-6 text-2xl font-black tracking-tight text-[#003f7f] sm:text-3xl">{title}</h3>
              <p className="mt-3 text-base leading-relaxed text-pretty text-gray-600">{description}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[#003f7f]">
                Saiba mais<span className="sr-only"> sobre {title.toLowerCase()}</span>
                <FaArrowRight aria-hidden="true" className="h-3 w-3 transition-[translate] duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
