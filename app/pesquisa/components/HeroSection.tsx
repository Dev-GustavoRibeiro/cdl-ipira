'use client';

import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface HeroSectionProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
}

const HeroSection = ({ searchTerm, onSearchTermChange, onSubmit, onClear }: HeroSectionProps) => {
  return (
    <section className="relative bg-gradient-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#ffd000]/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6">
            Pesquisa
          </h1>
          <p className="text-white/80 text-base sm:text-lg mb-8">
            Encontre notícias, eventos, vagas, vídeos e informações do site CDL Ipirá
          </p>
          
          {/* Campo de pesquisa */}
          <form onSubmit={onSubmit} className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <FaSearch className="absolute left-5 text-gray-400 w-5 h-5 pointer-events-none z-10" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                placeholder="O que você está procurando?"
                className="w-full pl-14 pr-32 py-4 sm:py-5 rounded-full text-gray-800 bg-white shadow-2xl outline-none text-base sm:text-lg placeholder:text-gray-400 focus:ring-4 focus:ring-[#ffd000]/50 transition-all"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={onClear}
                  className="absolute right-28 text-gray-400 hover:text-gray-600 transition-colors p-2"
                  aria-label="Limpar"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 bg-[#003f7f] hover:bg-[#002a54] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



