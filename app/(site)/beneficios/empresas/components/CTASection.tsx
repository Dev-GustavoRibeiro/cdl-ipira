'use client';

import React from 'react';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center animate-blur-fade-in">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black mb-4 sm:mb-6">
            Seja Nosso Associado
          </h2>
          <p className="text-white/90 text-sm sm:text-base mb-6 sm:mb-8 text-justify">
            Faça parte desta rede de empresas que movimentam a economia de Ipirá. Entre em contato conosco e descubra as vantagens de ser um associado CDL.
          </p>
          <Link
            href="/imprensa/contato"
            className="inline-flex items-center justify-center gap-2 bg-[#ffd000] text-[#003f7f] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-[#ffed4e] transition-all duration-300 hover:scale-105 shadow-xl text-sm sm:text-base group"
          >
            Entre em Contato
            <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;



