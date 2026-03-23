'use client';

import React from 'react';
import { FaBriefcase, FaUser, FaFileAlt, FaSearch } from 'react-icons/fa';

interface HeroSectionProps {
  onOpenModal: () => void;
}

const HeroSection = ({ onOpenModal }: HeroSectionProps) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Imagem à Esquerda */}
          <div className="order-2 lg:order-1 animate-blur-fade-in">
            <div className="relative w-full h-[400px] xs:h-[450px] sm:h-[500px] md:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl bg-linear-to-br from-[#003f7f] to-[#0066cc]">
              <div className="absolute inset-0 bg-linear-to-br from-[#003f7f] to-[#0066cc] opacity-90">
                {/* Placeholder para imagem da carteira de trabalho */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/20">
                    <FaFileAlt className="w-48 h-48 sm:w-64 sm:h-64" />
                  </div>
                </div>
              </div>
              
              {/* Overlay com texto */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 z-10">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#ffd000] mb-4 sm:mb-6 drop-shadow-2xl text-center">
                  BALCÃO DE EMPREGOS
                </h2>
                <p className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-center drop-shadow-lg">
                  Oportunidades de emprego, você encontra no site da CDL.
                </p>
                <p className="text-white/90 text-sm sm:text-base md:text-lg text-center">
                  www.cdlipira.com.br
                </p>
              </div>

              {/* Ícone de lupa decorativo */}
              <div className="absolute top-1/4 right-1/4 z-10">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 sm:p-6">
                  <FaSearch className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Texto à Direita */}
          <div className="order-1 lg:order-2 animate-blur-fade-in">
            <div className="sticky top-24">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-4 sm:mb-6 leading-tight">
                Contrate agora!
              </h1>
              
              <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mb-6 sm:mb-8"></div>

              <p className="text-gray-700 text-sm xs:text-base sm:text-lg leading-relaxed text-justify mb-6 sm:mb-8">
                Com o CDL Balcão de Empregos, você terá acesso aos currículos dos melhores profissionais da cidade!
              </p>

              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00a859] rounded-full flex items-center justify-center shrink-0">
                    <FaBriefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-1">
                      Acesso a Talentos
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 text-justify">
                      Encontre profissionais qualificados e prontos para contribuir com seu negócio.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#003f7f] rounded-full flex items-center justify-center shrink-0">
                    <FaUser className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-1">
                      Processo Simplificado
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 text-justify">
                      Cadastre suas vagas e receba currículos de candidatos interessados.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ffd000] rounded-full flex items-center justify-center shrink-0">
                    <FaFileAlt className="w-5 h-5 sm:w-6 sm:h-6 text-[#003f7f]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-1">
                      Gratuito para Associados
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 text-justify">
                      Serviço exclusivo e gratuito para associados da CDL Ipirá.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <button
                  onClick={onOpenModal}
                  className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  Cadastre sua vaga
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



