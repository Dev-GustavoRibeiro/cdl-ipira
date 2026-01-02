'use client';

import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const QuoteSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-linear-to-r from-[#003f7f] via-[#0052a3] to-[#003f7f]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          <FaQuoteLeft className="absolute -top-4 -left-2 sm:-top-6 sm:-left-4 text-white/10 text-5xl sm:text-7xl" />
          <blockquote className="text-center px-8 sm:px-12">
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-white italic leading-relaxed mb-6">
              &quot;Construímos nossa história com <span className="text-[#ffd000] font-semibold">trabalho</span>, <span className="text-[#ffd000] font-semibold">dedicação</span> e o compromisso inabalável de ver o comércio de Ipirá <span className="text-[#ffd000] font-semibold">prosperar</span>.&quot;
            </p>
            <footer className="text-white/70 text-sm sm:text-base">
              <cite className="not-italic font-bold text-white">— Fundadores da CDL Ipirá</cite>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;



