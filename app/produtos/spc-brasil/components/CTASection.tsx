'use client';

import React from 'react';

const CTASection = () => {
  return (
    <section className="py-20 bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#003f7f] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Comece a Usar o SPC Brasil Hoje
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Todas as funcionalidades são gratuitas e podem ser acessadas diretamente no site do SPC Brasil.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.spcbrasil.org.br"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#ffd000] text-[#003f7f] px-8 py-4 rounded-full font-bold hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Acessar SPC Brasil
            </a>
            <a
              href="/imprensa/contato"
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#003f7f] transition-all duration-300"
            >
              Falar com Especialista
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;



