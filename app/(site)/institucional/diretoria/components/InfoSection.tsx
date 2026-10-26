'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import { btnPrimary, btnSecondary, shadowCard } from '../../_components/ui';

const InfoSection = () => {
  return (
    <section className="bg-white pt-4 pb-16 sm:pt-6 sm:pb-20 lg:pt-8 lg:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-linear-to-br from-[#003f7f]/[0.04] via-white to-[#ffd000]/[0.08] px-6 py-10 text-center ring-1 ring-[#003f7f]/[0.07] sm:px-12 sm:py-14 ${shadowCard}`}>
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
          <span className="inline-flex items-center gap-2 rounded-full bg-[#003f7f] px-4 py-1.5 text-xs font-bold tracking-[0.14em] text-white uppercase">
            <FaCalendarAlt aria-hidden="true" className="text-[#ffd000]" />
            Mandato 2024-2027
          </span>
          <h2 className="mt-5 text-2xl leading-tight font-black tracking-tight text-balance text-[#003f7f] sm:text-4xl">Compromisso com o Futuro</h2>
          <p className="mx-auto mt-4 max-w-[60ch] text-base leading-relaxed text-pretty text-gray-700 sm:text-lg">
            A atual diretoria da CDL Ipirá foi eleita para o mandato 2024-2027, com o compromisso de continuar fortalecendo o comércio local e
            oferecendo serviços de excelência aos associados.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/institucional/historia" className={btnPrimary}>
              Conheça Nossa História
              <FaArrowRight aria-hidden="true" className="text-xs transition-[translate] duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
            <Link href="/institucional/missao-visao-valores" className={btnSecondary}>
              Missão, Visão e Valores
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
