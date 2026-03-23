'use client';

import React from 'react';
import { FaBullseye, FaEye, FaCheck, FaStar } from 'react-icons/fa';

const MissaoVisaoSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-linear-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Missão */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-linear-to-r from-[#003f7f] to-[#0066cc] rounded-3xl sm:rounded-4xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 shadow-xl h-full">
              {/* Header com ícone */}
              <div className="flex items-start gap-5 mb-8">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-[#003f7f] to-[#0066cc] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <FaBullseye className="text-white text-2xl sm:text-3xl" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#ffd000] rounded-full flex items-center justify-center shadow-md">
                    <FaCheck className="text-[#003f7f] text-xs" />
                  </div>
                </div>
                <div>
                  <span className="text-[#003f7f]/60 text-xs sm:text-sm font-bold uppercase tracking-widest">Propósito</span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f]">
                    Missão
                  </h2>
                </div>
              </div>

              <div className="w-full h-1 bg-linear-to-r from-[#003f7f] via-[#0066cc] to-transparent rounded-full mb-8"></div>
              
              <p className="text-gray-700 text-lg sm:text-xl leading-relaxed text-justify">
                Promover o <strong className="text-[#003f7f]">fortalecimento de nossos associados</strong> através da representatividade e entrega de soluções, defendendo, orientando e contribuindo para o <strong className="text-[#003f7f]">desenvolvimento econômico e social</strong> de Ipirá e região.
              </p>

              {/* Lista de pontos */}
              <div className="mt-8 space-y-3">
                {['Representatividade', 'Soluções eficazes', 'Desenvolvimento regional'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-600">
                    <div className="w-2 h-2 bg-[#003f7f] rounded-full"></div>
                    <span className="text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visão */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-linear-to-r from-[#00a859] to-[#00d670] rounded-3xl sm:rounded-4xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 shadow-xl h-full">
              {/* Header com ícone */}
              <div className="flex items-start gap-5 mb-8">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-[#00a859] to-[#00d670] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <FaEye className="text-white text-2xl sm:text-3xl" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#ffd000] rounded-full flex items-center justify-center shadow-md">
                    <FaStar className="text-[#003f7f] text-xs" />
                  </div>
                </div>
                <div>
                  <span className="text-[#00a859]/60 text-xs sm:text-sm font-bold uppercase tracking-widest">Futuro</span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f]">
                    Visão
                  </h2>
                </div>
              </div>

              <div className="w-full h-1 bg-linear-to-r from-[#00a859] via-[#00d670] to-transparent rounded-full mb-8"></div>
              
              <p className="text-gray-700 text-lg sm:text-xl leading-relaxed text-justify">
                Ser reconhecida como a <strong className="text-[#00a859]">melhor entidade da Bahia até 2030</strong>, destacando-se em práticas de compliance, excelência na fidelização e na entrega de <strong className="text-[#00a859]">soluções inovadoras e eficazes</strong>.
              </p>

              {/* Barra de progresso para 2030 */}
              <div className="mt-8 bg-gray-100 rounded-full p-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-[#00a859] to-[#00d670] rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm font-bold text-[#00a859]">2030</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissaoVisaoSection;



