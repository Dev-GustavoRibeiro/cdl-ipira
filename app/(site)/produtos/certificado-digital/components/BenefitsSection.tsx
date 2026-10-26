'use client';

import React from 'react';
import { FaShieldAlt, FaFileSignature, FaLock, FaVideo, FaThumbsUp } from 'react-icons/fa';
import { SectionHeader, cardLift, cardSurface } from '../../_components/ProductUI';

const benefits = [
  {
    icon: FaShieldAlt,
    title: 'Segurança',
    description: 'Criptografia e validade jurídica dos certificados ICP-Brasil (MP 2.200-2/2001)'
  },
  {
    icon: FaFileSignature,
    title: 'Assinatura Digital',
    description: 'Assine documentos online com a mesma validade de uma assinatura física'
  },
  {
    icon: FaLock,
    title: 'Autenticidade',
    description: 'Permite comprovar a autoria e a integridade dos documentos assinados'
  },
  {
    icon: FaVideo,
    title: 'Atendimento Online',
    description: 'Atendimento por videoconferência, conforme as regras da ICP-Brasil'
  }
];

const BenefitsSection = () => {
  return (
    <section aria-labelledby="certificado-beneficios" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="certificado-beneficios"
          eyebrow="Vantagens"
          icon={FaThumbsUp}
          title="Por que escolher o Certificado Digital?"
          subtitle="Vantagens que fazem a diferença no seu dia a dia"
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 md:mt-14 lg:gap-8 xl:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <li key={benefit.title} className={`group flex h-full items-start gap-4 p-5 sm:block sm:p-7 ${cardSurface} ${cardLift}`}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#00a859]/10 text-[#00a859] ring-1 ring-[#00a859]/15 transition-colors duration-300 group-hover:bg-[#00a859] group-hover:text-white motion-reduce:transition-none sm:h-14 sm:w-14">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-[#003f7f] sm:mt-5">{benefit.title}</h3>
                  <p className="mt-1 leading-relaxed text-gray-600 sm:mt-2">{benefit.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default BenefitsSection;
