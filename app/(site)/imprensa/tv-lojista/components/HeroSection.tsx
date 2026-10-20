'use client';

import React from 'react';
import { FaTv } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="py-10 sm:py-14 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center animate-blur-fade-in">
          <span className="inline-flex items-center gap-2 bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-[0_12px_30px_-12px_rgba(0,63,127,0.8)]">
            <FaTv className="w-3.5 h-3.5" aria-hidden="true" />
            TV Lojista
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#003f7f] mb-4 leading-[1.05]">
            TV Lojista
          </h1>
          <div className="h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] mx-auto mb-5" aria-hidden="true"></div>
          <p className="text-gray-700 text-base md:text-lg">
            Acompanhe vídeos, entrevistas, tutoriais e coberturas de eventos da CDL Ipirá
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
