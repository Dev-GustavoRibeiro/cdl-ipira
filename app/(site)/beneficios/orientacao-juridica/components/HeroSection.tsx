import React from 'react';
import { FaArrowRight, FaBalanceScale, FaCheckCircle } from 'react-icons/fa';

const highlights = [
  'Gratuito para associados em dia',
  'Atendimento presencial, por telefone ou online',
  'Advogados especializados em direito empresarial',
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-white via-gray-50 to-gray-100 py-12 sm:py-16 lg:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#003f7f]/5 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#00a859]/5 blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="text-center lg:text-left animate-blur-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#003f7f] shadow-sm">
              <FaBalanceScale aria-hidden="true" className="h-3.5 w-3.5" />
              Benefício exclusivo
            </span>
            <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-balance text-[#003f7f] sm:text-5xl lg:text-6xl">
              Orientação Jurídica
            </h1>
            <div aria-hidden="true" className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] lg:mx-0" />
            <p className="mx-auto mt-5 max-w-[60ch] text-base text-gray-600 md:text-lg lg:mx-0">
              Proteja seu negócio com orientações jurídicas especializadas. Serviço exclusivo e gratuito para associados da CDL Ipirá.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="#solicitar"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#003f7f] to-[#0066cc] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Solicitar orientação
                <FaArrowRight aria-hidden="true" className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
              </a>
              <a
                href="#duvidas"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#003f7f] bg-white px-7 py-3 text-sm font-bold text-[#003f7f] transition-[background-color,color,scale] duration-200 hover:bg-[#003f7f] hover:text-white active:scale-[0.98]"
              >
                Dúvidas frequentes
              </a>
            </div>
          </div>

          {/* Cartão-resumo do benefício */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none animate-scale-in">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] p-7 text-white shadow-[0_30px_60px_-25px_rgba(0,63,127,0.65)] sm:p-9">
              <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#ffd000]/20 blur-3xl" />
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[#00a859]/25 blur-3xl" />
              <div className="relative">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                  <FaBalanceScale aria-hidden="true" className="h-6 w-6 text-[#ffd000]" />
                </span>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-[#ffd000]">Para associados CDL Ipirá</p>
                <p className="mt-2 text-2xl font-black leading-tight tracking-tight text-balance sm:text-3xl">
                  Segurança jurídica para o dia a dia do seu negócio
                </p>
                <ul className="mt-6 space-y-3">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/90 sm:text-base">
                      <FaCheckCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#00d670]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
