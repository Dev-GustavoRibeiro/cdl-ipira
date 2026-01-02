'use client';

import React from 'react';
import { FaChartLine, FaDollarSign } from 'react-icons/fa';

const InfoSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#003f7f] mb-3">
              Compromisso com a Transparência
            </h2>
            <div className="w-20 h-1.5 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
            <div className="bg-linear-to-br from-[#003f7f] to-[#0052a3] rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 text-white shadow-xl">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <FaChartLine className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
                Indicadores de Gestão
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed text-justify">
                Acompanhe os principais indicadores de gestão e desempenho da CDL Ipirá. Nosso compromisso é manter você informado sobre todas as atividades.
              </p>
            </div>

            <div className="bg-linear-to-br from-[#00a859] to-[#00d670] rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 text-white shadow-xl">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <FaDollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
                Prestação de Contas
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed text-justify">
                Acesse os demonstrativos financeiros e relatórios de prestação de contas. Transparência total na gestão dos recursos da entidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;



