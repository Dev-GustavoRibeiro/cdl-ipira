'use client';

import React from 'react';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center animate-blur-fade-in">
          <h2 className="text-3xl sm:text-4xl font-black tracking-[-0.015em] mb-4">
            Seja Nosso Associado
          </h2>
          <div className="h-1.5 w-24 rounded-full bg-linear-to-r from-[#ffd000] via-[#00d670] to-[#ffd000] mx-auto mb-5" aria-hidden="true"></div>
          <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Faça parte desta rede de empresas que movimentam a economia de Ipirá. Entre em contato conosco e descubra as vantagens de ser um associado CDL.
          </p>
          <Link
            href="/imprensa/contato"
            className="inline-flex items-center justify-center gap-2 bg-[#ffd000] text-[#003f7f] px-7 sm:px-8 py-3.5 rounded-full font-bold shadow-[0_14px_30px_-12px_rgba(255,208,0,0.8)] hover:bg-[#ffed4e] hover:-translate-y-0.5 active:scale-[0.98] transition-[transform,background-color] duration-200 text-sm sm:text-base group"
          >
            Entre em Contato
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;



