'use client';

import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#003f7f] py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white">
          <div className="inline-block bg-[#ffd000] text-[#003f7f] px-6 py-3 rounded-full text-sm font-black mb-6 shadow-2xl">
            🛡️ SPC Brasil
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 drop-shadow-2xl">
            SPC Brasil
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Proteção, negociação e construção de crédito. Tudo em um só lugar.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#spc-avisa"
              className="bg-white text-[#003f7f] px-8 py-4 rounded-full font-bold hover:bg-[#ffd000] hover:text-[#003f7f] transition-all duration-300 hover:scale-105 shadow-lg"
            >
              SPC AVISA
            </a>
            <a
              href="#spc-conciliador"
              className="bg-white text-[#003f7f] px-8 py-4 rounded-full font-bold hover:bg-[#00a859] hover:text-white transition-all duration-300 hover:scale-105 shadow-lg"
            >
              SPC CONCILIADOR
            </a>
            <a
              href="#cadastro-positivo"
              className="bg-white text-[#003f7f] px-8 py-4 rounded-full font-bold hover:bg-[#ffd000] hover:text-[#003f7f] transition-all duration-300 hover:scale-105 shadow-lg"
            >
              CADASTRO POSITIVO
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



