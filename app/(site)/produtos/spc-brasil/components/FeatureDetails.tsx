'use client';

import React from 'react';
import { FaArrowRight, FaCheck, FaExternalLinkAlt, FaInfoCircle, FaStar, FaUsers } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { ACCENTS, SectionHeader, anchorOffset, btnBlue, cardSurface } from '../../_components/ProductUI';
import { features } from './FeaturesData';

// Título de cada cartão com ícone em bloco suave
function CardTitle({ icon: Icon, children, soft }: { icon: IconType; children: React.ReactNode; soft: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${soft}`}>
        <Icon aria-hidden="true" className="h-4 w-4" />
      </span>
      <h3 className="text-lg font-black tracking-tight text-[#003f7f] sm:text-xl">{children}</h3>
    </div>
  );
}

const FeatureDetails = () => {
  return (
    <>
      {features.map((feature, featureIndex) => {
        const accent = ACCENTS[feature.accent];
        return (
          <section
            key={feature.id}
            id={`detalhes-${feature.id}`}
            aria-labelledby={`detalhes-${feature.id}-titulo`}
            className={`py-16 md:py-24 ${anchorOffset} ${featureIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <SectionHeader
                  id={`detalhes-${feature.id}-titulo`}
                  align="left"
                  eyebrow={`Solução ${featureIndex + 1} de ${features.length}`}
                  icon={feature.icon}
                  title={feature.title}
                  subtitle={feature.description}
                />
                <a
                  href="https://www.spcbrasil.org.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btnBlue} shrink-0 self-start md:self-auto`}
                >
                  Acessar {feature.title}
                  <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5" />
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </div>

              <div className="mt-10 grid gap-5 sm:gap-6 md:mt-14 lg:grid-cols-3 lg:gap-8">
                {/* Benefícios */}
                <div className={`p-6 sm:p-8 ${cardSurface}`}>
                  <CardTitle icon={FaStar} soft={accent.soft}>Benefícios</CardTitle>
                  <ul className="mt-6 space-y-3.5">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3 text-gray-700">
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${accent.tile}`}>
                          <FaCheck aria-hidden="true" className="h-2.5 w-2.5" />
                        </span>
                        <span className="leading-snug">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Como Funciona: passos numerados ligados por uma linha */}
                <div className={`p-6 sm:p-8 ${cardSurface}`}>
                  <CardTitle icon={FaInfoCircle} soft={accent.soft}>Como Funciona</CardTitle>
                  <ol className="mt-6">
                    {feature.howItWorks.map((step, index) => (
                      <li key={step} className="relative flex gap-4 pb-5 last:pb-0">
                        {index < feature.howItWorks.length - 1 && (
                          <span aria-hidden="true" className="absolute top-9 bottom-1 left-4 w-0.5 -translate-x-1/2 rounded-full bg-[#003f7f]/15" />
                        )}
                        <span className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${accent.tile}`}>
                          {index + 1}
                        </span>
                        <span className="pt-1 leading-snug text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Para Quem é Indicado */}
                <div className={`p-6 sm:p-8 ${cardSurface}`}>
                  <CardTitle icon={FaUsers} soft={accent.soft}>Para Quem é Indicado</CardTitle>
                  <ul className="mt-6 space-y-3">
                    {feature.useCases.map((useCase) => (
                      <li key={useCase} className="flex items-start gap-3 rounded-2xl bg-gray-50 p-3.5 text-gray-700 ring-1 ring-gray-100">
                        <FaArrowRight aria-hidden="true" className="mt-1 h-3 w-3 shrink-0 text-[#003f7f]" />
                        <span className="leading-snug">{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
};

export default FeatureDetails;
