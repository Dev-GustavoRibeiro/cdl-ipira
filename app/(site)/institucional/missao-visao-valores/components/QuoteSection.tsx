'use client';

import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const QuoteSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          <FaQuoteLeft className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 text-[#003f7f]/10 text-5xl sm:text-7xl" />
          <blockquote className="text-center px-8 sm:px-12">
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-700 italic leading-relaxed mb-6">
              &quot;Construímos diariamente uma entidade forte, comprometida com o <span className="text-[#003f7f] font-semibold">sucesso de cada associado</span> e com o <span className="text-[#00a859] font-semibold">desenvolvimento</span> de toda nossa comunidade.&quot;
            </p>
            <footer className="text-gray-500 text-sm sm:text-base">
              <cite className="not-italic font-bold text-[#003f7f]">— Diretoria CDL Ipirá</cite>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;



