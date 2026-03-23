'use client';

import React from 'react';
import Link from 'next/link';
import { FaShieldAlt, FaRocket } from 'react-icons/fa';

const CTASection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ffd000] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
            <FaShieldAlt className="text-[#ffd000] text-3xl sm:text-4xl" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Faça Parte Desta
            <span className="block text-[#ffd000]">História de Sucesso</span>
          </h2>
          
          <p className="text-white/90 text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
            Junte-se a mais de 100 empresários que confiam na CDL Ipirá para impulsionar seus negócios.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.higestor.com.br/inscricao/empresa/cdl-ipira"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#ffd000] text-[#003f7f] px-8 sm:px-10 py-4 sm:py-5 rounded-full font-black text-base sm:text-lg hover:bg-white transition-all duration-300 hover:scale-105 shadow-2xl group"
            >
              <span>Associe-se Agora</span>
              <FaRocket className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
            <Link
              href="/institucional/diretoria"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg border-2 border-white/30 hover:bg-white hover:text-[#003f7f] transition-all duration-300"
            >
              Conheça a Diretoria
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;



