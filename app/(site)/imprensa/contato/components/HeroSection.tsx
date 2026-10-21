import React from 'react';
import { FaHeadset } from 'react-icons/fa';

const HeroSection = () => {
  return (
    // pb maior: os cartões de canais (ContactInfoSection) sobem sobre a base do banner
    <section className="relative overflow-hidden bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] pt-14 pb-32 sm:pt-16 md:pt-20 md:pb-36">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#ffd000]/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#00a859]/20 blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center text-white animate-blur-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#003f7f] shadow-sm">
            <FaHeadset aria-hidden="true" className="h-3.5 w-3.5" />
            Entre em contato
          </span>
          <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Fale Conosco
          </h1>
          <div aria-hidden="true" className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-white via-[#00d670] to-[#ffd000]" />
          <p className="mx-auto mt-5 max-w-[50ch] text-base text-white/85 md:text-lg">
            Estamos prontos para ajudar você. Entre em contato e tire suas dúvidas!
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
