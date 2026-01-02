'use client';

import React from 'react';

const HeroSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
          <div className="inline-block bg-[#ffd000] text-[#003f7f] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
            📰 Últimas Notícias
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-3 sm:mb-4 leading-tight">
            Fique por Dentro
          </h1>
          <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4 text-justify">
            Acompanhe as principais notícias sobre economia, comércio, eventos e muito mais
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



