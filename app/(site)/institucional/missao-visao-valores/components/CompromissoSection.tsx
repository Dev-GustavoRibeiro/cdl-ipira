'use client';

import React from 'react';
import { FaAward, FaShieldAlt, FaRocket, FaHeart } from 'react-icons/fa';
import { SectionHeader } from '../../_components/ui';

const itens = [
  { icon: FaShieldAlt, text: 'Proteção e segurança' },
  { icon: FaRocket, text: 'Crescimento contínuo' },
  { icon: FaHeart, text: 'Atendimento humanizado' },
];

const CompromissoSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-linear-to-br from-[#001a3d] via-[#003f7f] to-[#0052a3] py-16 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="absolute -top-32 left-1/2 -z-10 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-[#0066cc]/30 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-20 -bottom-24 -z-10 h-72 w-72 rounded-full bg-[#ffd000]/10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tone="dark"
          icon={FaAward}
          eyebrow="Compromisso CDL"
          title="Nosso Compromisso"
          description={
            <>
              Trabalhamos todos os dias para sermos mais do que uma entidade — somos{' '}
              <span className="font-bold text-[#ffd000]">parceiros reais</span> no crescimento de cada associado.
            </>
          }
        />

        <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {itens.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-4 rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/10 sm:flex-col sm:p-7 sm:text-center"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffd000] text-[#003f7f] shadow-[0_12px_24px_-12px_rgba(255,208,0,0.8)]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="text-base font-bold text-white">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CompromissoSection;
