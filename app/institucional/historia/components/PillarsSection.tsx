'use client';

import React from 'react';
import Link from 'next/link';
import { FaRocket, FaChartLine, FaHeart } from 'react-icons/fa';

const PillarsSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f] mb-4">
            Nossos Pilares
          </h2>
          <div className="w-24 sm:w-32 h-1.5 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Os fundamentos que guiam nossa atuação desde o primeiro dia.
          </p>
        </div>

        {/* Cards de Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Missão */}
          <Link href="/institucional/missao-visao-valores" className="group">
            <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100 hover:border-[#003f7f]/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#003f7f] to-[#0066cc] rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-[#003f7f] to-[#0066cc] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg relative z-10">
                <FaRocket className="text-white text-2xl sm:text-3xl" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-black text-[#003f7f] mb-4 group-hover:text-[#0066cc] transition-colors">
                Missão
              </h3>
              
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                Promover o fortalecimento dos nossos associados através da representatividade e entrega de soluções para o desenvolvimento de Ipirá.
              </p>
              
              <div className="flex items-center gap-2 text-[#003f7f] font-bold text-sm group-hover:gap-3 transition-all">
                <span>Saiba mais</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Visão */}
          <Link href="/institucional/missao-visao-valores" className="group">
            <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100 hover:border-[#00a859]/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#00a859] to-[#00d670] rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-[#00a859] to-[#00d670] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg relative z-10">
                <FaChartLine className="text-white text-2xl sm:text-3xl" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-black text-[#003f7f] mb-4 group-hover:text-[#00a859] transition-colors">
                Visão
              </h3>
              
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                Ser reconhecida como a melhor entidade da Bahia até 2030, destacando-se em excelência e soluções inovadoras.
              </p>
              
              <div className="flex items-center gap-2 text-[#00a859] font-bold text-sm group-hover:gap-3 transition-all">
                <span>Saiba mais</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Valores */}
          <Link href="/institucional/missao-visao-valores" className="group">
            <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100 hover:border-[#ffd000]/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#ffd000] to-[#ffed4e] rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-[#ffd000] to-[#ffed4e] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg relative z-10">
                <FaHeart className="text-[#003f7f] text-2xl sm:text-3xl" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-black text-[#003f7f] mb-4 group-hover:text-[#ffd000] transition-colors">
                Valores
              </h3>
              
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                Foco no associado, comprometimento, eficiência, ética, inovação e excelência em tudo o que fazemos.
              </p>
              
              <div className="flex items-center gap-2 text-[#003f7f] font-bold text-sm group-hover:gap-3 transition-all">
                <span>Saiba mais</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;



