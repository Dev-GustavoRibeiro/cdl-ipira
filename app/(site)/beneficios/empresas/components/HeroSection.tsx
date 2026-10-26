'use client';

import React from 'react';
import { FaHandshake } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="py-10 sm:py-14 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center animate-blur-fade-in">
          {/* Texto navy: o branco no degradê verde fica entre 1,9 e 3,1:1; o navy, entre 5,5 e 8,9:1 */}
          <span className="inline-flex items-center gap-2 bg-linear-to-r from-[#00a859] to-[#00d670] text-[#001a3d] px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-[0_12px_30px_-12px_rgba(0,168,89,0.8)]">
            <FaHandshake className="w-3.5 h-3.5" aria-hidden="true" />
            Associados CDL
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#003f7f] mb-4 leading-[1.05]">
            Nossos Associados
          </h1>
          <div className="h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] mx-auto mb-5" aria-hidden="true"></div>
          <p className="text-gray-700 text-base md:text-lg">
            Conheça as empresas associadas à CDL Ipirá e valorize o comércio local.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
