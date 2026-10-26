'use client';

import React from 'react';
import { useStickyBar } from '@/app/components/useStickyBar';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchSection = ({ searchTerm, setSearchTerm }: SearchSectionProps) => {
  // Barra fixa sob o header: o foco do teclado desconta a altura dela (WCAG 2.4.11)
  const barRef = useStickyBar<HTMLElement>();
  return (
    <section ref={barRef} className="py-3 sm:py-5 border-b border-gray-200 sticky top-[var(--header-height,0px)] z-40 short-landscape:static backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-xl mx-auto">
          <FaSearch className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            aria-label="Buscar empresa associada"
            placeholder="Buscar associado pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 sm:pl-12 pr-12 py-3 rounded-full border border-gray-200 bg-gray-50 text-base shadow-[0_8px_24px_-18px_rgba(0,63,127,0.4)] transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent [&::-webkit-search-cancel-button]:hidden"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Limpar busca"
              className="absolute right-0.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-[#003f7f] transition-colors"
            >
              <FaTimes className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
