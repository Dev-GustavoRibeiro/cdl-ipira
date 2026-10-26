'use client';

import React from 'react';
import { FaCertificate, FaPhoneAlt, FaVideo } from 'react-icons/fa';
import { SectionHeader, cardSurface } from '../../_components/ProductUI';
import { CONTACT } from '@/app/components/navigation/navItems';

const IntroSection = () => {
  return (
    <section aria-labelledby="certificado-sobre" className="bg-white py-16 md:py-24">
      <div className="container mx-auto grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <SectionHeader
          id="certificado-sobre"
          align="left"
          eyebrow="Certificado Digital"
          icon={FaCertificate}
          title="Segurança e praticidade na palma da sua mão"
          subtitle="O Certificado Digital é um documento eletrônico que funciona como uma identidade virtual, com validade jurídica (MP 2.200-2/2001) para assinar documentos e acessar serviços online."
          className="lg:col-span-7"
        />

        <div className={`overflow-hidden lg:col-span-5 ${cardSurface}`}>
          <div className="p-6 sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00a859]/10 text-[#00a859] ring-1 ring-[#00a859]/15">
              <FaVideo aria-hidden="true" className="h-5 w-5" />
            </span>
            <p className="mt-5 text-base leading-relaxed text-gray-700 sm:text-lg">
              Atendimento na CDL Ipirá e também por videoconferência, conforme as regras da ICP-Brasil.
            </p>
            <p className="mt-3 font-bold leading-relaxed text-[#003f7f] sm:text-lg">
              Simplifique sua rotina com tecnologia, confiança e credibilidade.
            </p>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 p-6 sm:px-8">
            <p className="text-sm font-semibold text-gray-700">Quer saber mais? Entre em contato conosco.</p>
            <a
              href={CONTACT.phone.href}
              className="group mt-3 inline-flex items-center gap-3 rounded-2xl text-[#003f7f] transition-colors hover:text-[#0052a3]"
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
