'use client';

import React from 'react';
import { FaPlus, FaQuestionCircle, FaWhatsapp } from 'react-icons/fa';
import { FAQ } from './types';
import SectionHeader from './SectionHeader';

interface FAQSectionProps {
  faqs: FAQ[];
  selectedFaq: number | null;
  onFaqToggle: (id: number) => void;
}

const FAQSection = ({ faqs, selectedFaq, onFaqToggle }: FAQSectionProps) => {
  return (
    <section
      id="duvidas"
      aria-labelledby="duvidas-titulo"
      className="scroll-mt-[calc(var(--header-height,0px)+1rem)] bg-gray-50 py-16 md:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          {/* contents no celular: o atalho do WhatsApp vai para depois das perguntas (order-last) */}
          <div className="contents lg:sticky lg:top-[calc(var(--header-height,0px)+2rem)] lg:block">
            <SectionHeader
              id="duvidas-titulo"
              align="left"
              eyebrow="Dúvidas"
              icon={FaQuestionCircle}
              title="Perguntas Frequentes"
              subtitle="Tudo o que você precisa saber antes de solicitar sua orientação."
            />
            <div className="order-last mx-auto w-full max-w-xl rounded-2xl bg-white p-5 text-center ring-1 ring-gray-100 shadow-[0_10px_30px_-18px_rgba(0,63,127,0.35)] lg:order-none lg:mx-0 lg:mt-8 lg:text-left">
              <p className="font-bold text-[#003f7f]">Não encontrou sua dúvida?</p>
              <p className="mt-1 text-sm text-gray-600">Fale com a nossa equipe pelo WhatsApp.</p>
              <a
                href="https://wa.me/557532541599"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#003f7f] underline-offset-4 hover:underline"
              >
                <FaWhatsapp aria-hidden="true" className="h-4 w-4 text-[#00a859]" />
                Conversar no WhatsApp
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq) => {
              const isOpen = selectedFaq === faq.id;
              const buttonId = `faq-pergunta-${faq.id}`;
              const panelId = `faq-resposta-${faq.id}`;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl bg-white ring-1 transition-[box-shadow] duration-300 ${
                    isOpen
                      ? 'ring-[#003f7f]/15 shadow-[0_20px_50px_-24px_rgba(0,63,127,0.45)]'
                      : 'ring-gray-200/80 shadow-[0_6px_20px_-16px_rgba(0,63,127,0.3)] hover:ring-[#003f7f]/20'
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => onFaqToggle(faq.id)}
                      className="flex w-full items-center gap-4 rounded-2xl p-5 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#003f7f] sm:p-6"
                    >
                      <span className="flex-1 text-base font-bold leading-snug text-[#003f7f] sm:text-lg">
                        {faq.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-[rotate,background-color,color] duration-300 motion-reduce:transition-none ${
                          isOpen ? 'rotate-45 bg-[#003f7f] text-white' : 'bg-[#003f7f]/10 text-[#003f7f]'
                        }`}
                      >
                        <FaPlus className="h-3 w-3" />
                      </span>
                    </button>
                  </h3>
                  {/* grid 0fr -> 1fr anima a altura real da resposta; inert tira a resposta fechada do teclado e leitores */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    inert={!isOpen}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[65ch] px-5 pb-6 text-[15px] leading-relaxed text-gray-600 sm:px-6 sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
