'use client';

import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { ACCENTS, anchorOffset, cardLift, cardSurface } from '../../_components/ProductUI';
import { features } from './FeaturesData';

const FeaturesCards = () => {
  return (
    <section aria-label="Soluções do SPC Brasil" className="bg-white pt-10 pb-16 md:pt-14 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Três colunas só a partir do desktop; no tablet, uma coluna com largura confortável de leitura */}
        <ul className="mx-auto grid max-w-2xl gap-5 sm:gap-6 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            const accent = ACCENTS[feature.accent];
            return (
              <li key={feature.id} id={feature.anchor} className={anchorOffset}>
                <article className={`group relative flex h-full flex-col overflow-hidden p-6 sm:p-8 ${cardSurface} ${cardLift}`}>
                  <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 ${accent.bar}`} />
                  <div className="flex items-center justify-between gap-4">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accent.tile} shadow-[0_12px_24px_-12px_rgba(0,63,127,0.6)]`}>
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">{feature.type}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-black tracking-tight text-[#003f7f] sm:text-2xl">{feature.title}</h3>
                  <p className="mt-3 leading-relaxed text-gray-600">{feature.description}</p>

                  {/* Link "esticado": o cartão inteiro leva aos detalhes */}
                  <div className="mt-auto pt-8">
                    <a
                      href={`#detalhes-${feature.id}`}
                      className="flex items-center gap-2 border-t border-gray-100 pt-5 font-bold text-[#003f7f] transition-[gap] duration-300 group-hover:gap-3 after:absolute after:inset-0 after:content-[''] motion-reduce:transition-none"
                    >
                      Saiba mais
                      <span className="sr-only"> sobre {feature.title}</span>
                      <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default FeaturesCards;
