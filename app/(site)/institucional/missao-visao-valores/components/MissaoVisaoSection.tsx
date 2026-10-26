'use client';

import React from 'react';
import { FaBullseye, FaEye, FaCheck } from 'react-icons/fa';
import { shadowCard } from '../../_components/ui';

const cardClass = `relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-[#003f7f]/[0.07] sm:p-10 ${shadowCard}`;

const MissaoVisaoSection = () => {
  return (
    <section className="bg-linear-to-b from-gray-50 to-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Missão */}
          <article className={cardClass}>
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#003f7f] to-[#0066cc]" />
            <div className="flex items-center gap-4 sm:gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#003f7f] to-[#0066cc] text-white shadow-[0_12px_24px_-12px_rgba(0,63,127,0.7)] sm:h-16 sm:w-16">
                <FaBullseye aria-hidden="true" className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-gray-500 uppercase">Propósito</p>
                <h2 className="text-3xl font-black tracking-tight text-[#003f7f] sm:text-4xl">Missão</h2>
              </div>
            </div>

            <p className="mt-7 text-base leading-relaxed text-pretty text-gray-700 sm:text-lg">
              Promover o <strong className="text-[#003f7f]">fortalecimento de nossos associados</strong> através da representatividade e entrega
              de soluções, defendendo, orientando e contribuindo para o{' '}
              <strong className="text-[#003f7f]">desenvolvimento econômico e social</strong> de Ipirá e região.
            </p>

            <ul className="mt-auto flex flex-wrap gap-2 pt-8">
              {['Representatividade', 'Soluções eficazes', 'Desenvolvimento regional'].map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full bg-[#003f7f]/[0.06] px-3.5 py-1.5 text-sm font-semibold text-[#003f7f]"
                >
                  <FaCheck aria-hidden="true" className="h-3 w-3 text-[#00a859]" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          {/* Visão */}
          <article className={cardClass}>
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#00a859] to-[#00d670]" />
            <div className="flex items-center gap-4 sm:gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#00a859] to-[#00d670] text-white shadow-[0_12px_24px_-12px_rgba(0,168,89,0.7)] sm:h-16 sm:w-16">
                <FaEye aria-hidden="true" className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-gray-500 uppercase">Futuro</p>
                <h2 className="text-3xl font-black tracking-tight text-[#003f7f] sm:text-4xl">Visão</h2>
              </div>
            </div>

            <p className="mt-7 text-base leading-relaxed text-pretty text-gray-700 sm:text-lg">
              Ser reconhecida como a <strong className="text-[#003f7f]">melhor entidade da Bahia até 2030</strong>, destacando-se em práticas de
              compliance, excelência na fidelização e na entrega de <strong className="text-[#003f7f]">soluções inovadoras e eficazes</strong>.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default MissaoVisaoSection;
