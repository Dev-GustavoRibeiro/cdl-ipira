'use client';

import React from 'react';
import { FaListOl } from 'react-icons/fa';
import { SectionHeader } from '../../_components/ProductUI';

const steps = [
  { step: 1, title: 'Contato', desc: 'Entre em contato com a CDL Ipirá' },
  { step: 2, title: 'Documentação', desc: 'Envie os documentos necessários' },
  { step: 3, title: 'Videoconferência', desc: 'Realize a validação por vídeo' },
  { step: 4, title: 'Emissão', desc: 'Receba seu certificado digital' }
];

const EmissionProcessSection = () => {
  return (
    <section aria-labelledby="certificado-emissao" className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="certificado-emissao"
          eyebrow="Passo a passo"
          icon={FaListOl}
          title="Como Emitir seu Certificado Digital"
          subtitle="Processo simples, rápido e seguro"
        />

        {/* Celular: passos na vertical ligados por uma linha; a partir do tablet, na horizontal */}
        <div className="relative mx-auto mt-12 max-w-5xl md:mt-16">
          <span
            aria-hidden="true"
            className="absolute top-8 right-[12.5%] left-[12.5%] hidden h-1 -translate-y-1/2 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] md:block"
          />
          <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
            {steps.map((item, index) => (
              <li key={item.step} className="relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center">
                {index < steps.length - 1 && (
                  <span aria-hidden="true" className="absolute top-16 -bottom-8 left-8 w-0.5 -translate-x-1/2 bg-[#003f7f]/15 md:hidden" />
                )}
                <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#003f7f] text-2xl font-black text-white shadow-[0_14px_30px_-12px_rgba(0,63,127,0.7)] ring-4 ring-gray-50">
                  <span className="sr-only">Passo </span>
                  {item.step}
                </span>
                <div className="pt-2 md:mt-5 md:pt-0">
                  <h3 className="text-lg font-black tracking-tight text-[#003f7f]">{item.title}</h3>
                  <p className="mt-1 text-gray-600">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default EmissionProcessSection;
