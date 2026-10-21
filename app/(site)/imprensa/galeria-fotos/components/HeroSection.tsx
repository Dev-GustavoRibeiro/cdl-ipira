'use client';

import React from 'react';
import { FaCamera } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#003f7f] py-14 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white animate-blur-fade-in">
          <span className="inline-flex items-center gap-2 bg-[#ffd000] text-[#003f7f] px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-[0_12px_30px_-12px_rgba(255,208,0,0.9)]">
            <FaCamera className="w-3.5 h-3.5" aria-hidden="true" />
            Galeria de Fotos
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-4 drop-shadow-lg">
            Momentos CDL Ipirá
          </h1>
          <div className="h-1.5 w-24 rounded-full bg-linear-to-r from-[#ffd000] via-[#00d670] to-[#ffd000] mx-auto mb-5" aria-hidden="true"></div>
          <p className="text-lg md:text-xl text-white/90">
            Reviva os melhores momentos dos nossos eventos, encontros e celebrações
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
