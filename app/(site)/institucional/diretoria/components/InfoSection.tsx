'use client';

import React from 'react';
import Link from 'next/link';

const InfoSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-blur-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl border border-gray-200">
            <div className="inline-block bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6">
              📅 Mandato 2024-2027
            </div>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-[#003f7f] mb-3 sm:mb-4">
              Compromisso com o Futuro
            </h2>
            <p className="text-gray-700 text-sm xs:text-base sm:text-lg mb-5 sm:mb-6 leading-relaxed px-2 text-justify">
              A atual diretoria da CDL Ipirá foi eleita para o mandato 2024-2027, com o compromisso de continuar fortalecendo o comércio local e oferecendo serviços de excelência aos associados.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/historia"
                className="inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-[#0066cc] transition-all duration-300 hover:scale-105 shadow-lg group"
              >
                Conheça Nossa História
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                href="/missao-visao-valores"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#003f7f] text-[#003f7f] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-[#003f7f] hover:text-white transition-all duration-300"
              >
                Missão, Visão e Valores
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;



