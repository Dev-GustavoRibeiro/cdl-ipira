'use client';

import React from 'react';
import { FaBullhorn, FaPhoneAlt } from 'react-icons/fa';
import { SectionHeader, cardSurface } from '../../_components/ProductUI';
import { CONTACT } from '@/app/components/navigation/navItems';

const IntroSection = () => {
  return (
    <section aria-labelledby="midia-sobre" className="bg-white py-16 md:py-24">
      <div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <SectionHeader
          id="midia-sobre"
          align="left"
          eyebrow="CDL Mídia"
          icon={FaBullhorn}
          title="Voz e protagonismo para os associados"
          className="lg:col-span-5"
        />

        <div className="space-y-6 lg:col-span-7 lg:pt-11">
          <p className="max-w-[62ch] text-base leading-relaxed text-gray-700 sm:text-lg">
            A <strong className="text-[#003f7f]">CDL Ipirá</strong> divulga empresas associadas nos seus perfis no Facebook, Instagram e YouTube,
            conforme a programação de conteúdo.
          </p>
          <p className="max-w-[62ch] text-base leading-relaxed text-gray-700 sm:text-lg">
            Posts, vídeos, entrevistas e histórias de empresas mostram quem faz o comércio de Ipirá e aproximam os negócios da comunidade.
          </p>

          <div className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${cardSurface}`}>
            <p className="font-semibold text-gray-800">Quer destacar sua empresa? Entre em contato conosco.</p>
            <a
              href={CONTACT.phone.href}
              className="group inline-flex shrink-0 items-center gap-3 rounded-2xl text-[#003f7f] transition-colors hover:text-[#0052a3]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#003f7f] text-white transition-[scale] duration-200 group-hover:scale-105 motion-reduce:transition-none">
                <FaPhoneAlt aria-hidden="true" className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-xs font-semibold text-gray-600">Central de Atendimento CDL Ipirá</span>
                <span className="block text-lg font-black">{CONTACT.phone.label}</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
