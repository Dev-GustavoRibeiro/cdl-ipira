import React from 'react';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

const CTASection = () => {
  return (
    <section aria-labelledby="ajuda-titulo" className="bg-gray-50 pb-16 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] px-6 py-10 text-white shadow-[0_30px_60px_-30px_rgba(0,63,127,0.7)] sm:px-10 md:px-14 md:py-14">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#ffd000]/20 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#00a859]/20 blur-3xl" />

          <div className="relative flex flex-col gap-8 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#ffd000]">Atendimento direto</p>
              <h2 id="ajuda-titulo" className="mt-3 text-3xl font-black leading-tight tracking-tight text-balance sm:text-4xl">
                Precisa de Ajuda Imediata?
              </h2>
              <p className="mt-3 text-base text-white/85 md:text-lg">
                Entre em contato conosco através dos canais abaixo para atendimento rápido.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:shrink-0">
              <a
                href="tel:+5575999145061"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#003f7f] shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] transition-[translate,scale,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#ffd000] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <FaPhone aria-hidden="true" className="h-4 w-4" />
                Ligar Agora
              </a>
              <a
                href="mailto:cdlipira@ipiratech.com.br"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/70 px-7 py-3 text-sm font-bold text-white transition-[background-color,color,border-color,scale] duration-300 hover:border-white hover:bg-white hover:text-[#003f7f] active:scale-[0.98]"
              >
                <FaEnvelope aria-hidden="true" className="h-4 w-4" />
                Enviar E-mail
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
