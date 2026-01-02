'use client';

import React from 'react';
import Image from 'next/image';
import { FaStore, FaGlobe, FaExternalLinkAlt } from 'react-icons/fa';
import { Parceiro } from './types';

interface PartnersGridProps {
  parceiros: Parceiro[];
  isLoading: boolean;
  searchTerm: string;
  totalCount: number;
}

const PartnersGrid = ({ parceiros, isLoading, searchTerm, totalCount }: PartnersGridProps) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg sm:text-xl">Carregando associados...</p>
          </div>
        ) : parceiros.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl">
            <FaStore className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg sm:text-xl">
              {searchTerm ? 'Nenhum associado encontrado com esse nome.' : 'Nenhum associado cadastrado ainda.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {parceiros.map((parceiro, index) => (
              <article
                key={parceiro.id}
                className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#003f7f] transition-all duration-300 hover:-translate-y-2 group animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Logo */}
                <div className="h-28 sm:h-32 bg-gray-50 flex items-center justify-center p-4 group-hover:bg-gray-100 transition-colors">
                  <div className="relative w-full h-full">
                    <Image
                      src={parceiro.logo}
                      alt={parceiro.name}
                      fill
                      className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-3 sm:p-4 text-center">
                  <h3 className="text-sm sm:text-base font-bold text-[#003f7f] mb-2 line-clamp-2">
                    {parceiro.name}
                  </h3>

                  {parceiro.website ? (
                    <a
                      href={parceiro.website.startsWith('http') ? parceiro.website : `https://${parceiro.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm text-[#00a859] hover:text-[#008f4c] font-semibold transition-colors"
                    >
                      <FaGlobe className="w-3 h-3" />
                      Visitar Site
                      <FaExternalLinkAlt className="w-2.5 h-2.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">Associado CDL</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Estatísticas */}
        <div className="mt-8 sm:mt-12 bg-linear-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f] mb-2">
                {totalCount}+
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-semibold">
                Empresas Associadas
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00a859] mb-2">
                30+
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-semibold">
                Anos de Parceria
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#ffd000] mb-2">
                100%
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-semibold">
                Comprometidos com o Comércio
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersGrid;



