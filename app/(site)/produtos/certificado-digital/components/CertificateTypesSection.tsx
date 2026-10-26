'use client';

import React from 'react';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { FaArrowRight, FaBuilding, FaCertificate, FaCheck, FaGavel, FaUserMd } from 'react-icons/fa';
import { ACCENTS, type Accent, SectionHeader, anchorOffset, cardLift, cardSurface } from '../../_components/ProductUI';

const certificateTypes: {
  id: number;
  title: string;
  icon: IconType;
  audience: string;
  description: string;
  features: string[];
  accent: Accent;
}[] = [
  {
    id: 1,
    title: 'Pessoa Física e Jurídica',
    icon: FaBuilding,
    audience: 'Uso geral',
    description: 'Certificado digital ICP-Brasil para pessoas físicas e jurídicas. Indicado para assinar documentos, acessar serviços do governo e fazer transações online.',
    features: [
      'Assinatura digital de documentos',
      'Acesso a serviços governamentais',
      'Transações bancárias online',
      'Declaração de Imposto de Renda',
      'Validade jurídica (MP 2.200-2/2001)'
    ],
    accent: 'sky'
  },
  {
    id: 2,
    title: 'e-Jurídico',
    icon: FaGavel,
    audience: 'Advogados',
    description: 'Certificado digital para advogados. Permite assinar petições, acessar sistemas do Poder Judiciário e realizar atos processuais com validade jurídica.',
    features: [
      'Assinatura de petições digitais',
      'Acesso ao PJe (Processo Judicial Eletrônico)',
      'Validade jurídica em processos',
      'Agilidade em atos processuais'
    ],
    accent: 'green'
  },
  {
    id: 3,
    title: 'e-Saúde',
    icon: FaUserMd,
    audience: 'Profissionais da saúde',
    description: 'Certificado digital ideal para médicos, enfermeiros e profissionais da saúde. Permite assinar receitas digitais, prontuários eletrônicos e documentos médicos com segurança.',
    features: [
      'Assinatura de receitas digitais',
      'Prontuários eletrônicos',
      'Prescrições médicas digitais',
      'Validade jurídica (MP 2.200-2/2001)'
    ],
    accent: 'yellow'
  }
];

const CertificateTypesSection = () => {
  return (
    <section aria-labelledby="certificado-tipos" className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="certificado-tipos"
          eyebrow="Tipos de certificado"
          icon={FaCertificate}
          title="Tipos de Certificado Digital"
          subtitle="Escolha o certificado ideal para suas necessidades"
        />

        {/* Três colunas só a partir do desktop; no tablet, uma coluna com largura confortável de leitura */}
        <ul className="mx-auto mt-12 grid max-w-2xl gap-5 sm:gap-6 md:mt-14 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {certificateTypes.map((cert) => {
            const Icon = cert.icon;
            const accent = ACCENTS[cert.accent];
            return (
              <li key={cert.id} id={`certificado-${cert.id}`} className={anchorOffset}>
                <article className={`relative flex h-full flex-col overflow-hidden p-6 sm:p-8 ${cardSurface} ${cardLift}`}>
                  <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 ${accent.bar}`} />
                  <div className="flex items-center justify-between gap-4">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accent.tile} shadow-[0_12px_24px_-12px_rgba(0,63,127,0.6)]`}>
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">{cert.audience}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-black tracking-tight text-[#003f7f] sm:text-2xl">{cert.title}</h3>
                  <p className="mt-3 leading-relaxed text-gray-600">{cert.description}</p>

                  <h4 className="mt-6 border-t border-gray-100 pt-6 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                    Principais funcionalidades
                  </h4>
                  <ul className="mt-4 space-y-3">
                    {cert.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-gray-700 sm:text-[15px]">
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${accent.tile}`}>
                          <FaCheck aria-hidden="true" className="h-2.5 w-2.5" />
                        </span>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <Link
                      href="/imprensa/contato"
                      className="group flex items-center justify-center gap-2 rounded-full bg-[#003f7f]/[0.06] px-5 py-3 text-sm font-bold text-[#003f7f] transition-[background-color,color,scale] duration-200 hover:bg-[#003f7f] hover:text-white active:scale-[0.98] motion-reduce:transition-none"
                    >
                      {/* Texto visível curto para não quebrar em várias linhas; o leitor de tela ouve o tipo */}
                      Solicitar<span className="sr-only"> certificado {cert.title}</span>
                      <FaArrowRight aria-hidden="true" className="h-3 w-3 transition-[translate] duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
                    </Link>
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

export default CertificateTypesSection;
