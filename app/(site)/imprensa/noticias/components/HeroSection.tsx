'use client';

import React from 'react';
import { FaNewspaper } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="py-10 sm:py-14 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center animate-blur-fade-in">
          <span className="inline-flex items-center gap-2 bg-[#ffd000] text-[#003f7f] px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-[0_12px_30px_-12px_rgba(255,208,0,0.9)]">
            <FaNewspaper className="w-3.5 h-3.5" aria-hidden="true" />
            Últimas Notícias
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#003f7f] mb-4 leading-[1.05]">
            Fique por Dentro
          </h1>
          <div className="h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] mx-auto mb-5" aria-hidden="true"></div>
          <p className="text-gray-700 text-base md:text-lg">
            Acompanhe as principais notícias sobre economia, comércio, eventos e muito mais
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
