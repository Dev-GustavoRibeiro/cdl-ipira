'use client';

import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { FAQ } from './types';

interface FAQSectionProps {
  faqs: FAQ[];
  selectedFaq: number | null;
  onFaqToggle: (id: number) => void;
}

const FAQSection = ({ faqs, selectedFaq, onFaqToggle }: FAQSectionProps) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
              Perguntas Frequentes
            </h2>
            <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <button
                  onClick={() => onFaqToggle(faq.id)}
                  className="w-full p-4 sm:p-5 md:p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#003f7f] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <FaQuestionCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#003f7f] flex-1">
                      {faq.question}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 sm:w-6 sm:h-6 text-[#003f7f] shrink-0 transition-transform ${selectedFaq === faq.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {selectedFaq === faq.id && (
                  <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 pl-12 sm:pl-14 md:pl-16">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;



