'use client';

import React from 'react';

const HeroSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
          <div className="inline-block bg-linear-to-r from-[#00a859] to-[#00d670] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
            🤝 Associados CDL
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-3 sm:mb-4 leading-tight">
            Nossos Associados
          </h1>
          <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4 text-justify">
            Conheça as empresas parceiras da CDL Ipirá. Juntos, fortalecemos o comércio local e oferecemos os melhores produtos e serviços para nossa comunidade.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



