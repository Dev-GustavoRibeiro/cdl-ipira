'use client';

import React from 'react';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import { TeamMember } from './types';

interface DiretoresSectionProps {
  diretores: TeamMember[];
}

const DiretoresSection = ({ diretores }: DiretoresSectionProps) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-linear-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f] mb-3 sm:mb-4">
            Diretores
          </h2>
          <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
        </div>

        {diretores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum diretor cadastrado no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {diretores.map((diretor, index) => (
              <div
                key={diretor.id}
                className="group bg-white rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Foto do Diretor */}
                <div className="relative h-80 overflow-hidden">
                  <div className="absolute inset-0 bg-gray-100">
                    {diretor.photo_url ? (
                      <Image
                        src={diretor.photo_url}
                        alt={diretor.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={100}
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200">
                        <FaUser className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {/* Overlay gradiente suave para legibilidade do texto */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Badge Cargo */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                    <div className="bg-[#ffd000] text-[#003f7f] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-black text-[10px] xs:text-xs shadow-lg">
                      {diretor.position}
                    </div>
                  </div>

                  {/* Nome no overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 z-10">
                    <h3 className="text-white text-lg xs:text-xl sm:text-2xl font-black mb-1 drop-shadow-lg line-clamp-2">
                      {diretor.name}
                    </h3>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-4 sm:p-6 md:p-8">
                  {/* Função */}
                  {diretor.function_description && (
                    <div className="mb-3 sm:mb-4">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00a859] rounded-full shrink-0"></div>
                        <span className="text-[10px] xs:text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Função
                        </span>
                      </div>
                      <p className="text-gray-700 text-xs xs:text-sm sm:text-base font-medium leading-snug text-justify">
                        {diretor.function_description}
                      </p>
                    </div>
                  )}

                  {/* Contribuição */}
                  {diretor.contribution && (
                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#003f7f] rounded-full shrink-0"></div>
                        <span className="text-[10px] xs:text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Contribuição
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs xs:text-sm leading-relaxed text-justify">
                        {diretor.contribution}
                      </p>
                    </div>
                  )}
                </div>

                {/* Barra colorida inferior */}
                <div className="h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DiretoresSection;


