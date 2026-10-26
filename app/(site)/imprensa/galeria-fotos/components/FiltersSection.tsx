'use client';

import React from 'react';
import { useStickyBar } from '@/app/components/useStickyBar';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface FiltersSectionProps {
  /** 'Todos' + as categorias presentes nos álbuns carregados */
  categories: string[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const FiltersSection = ({ categories, searchTerm, setSearchTerm, activeCategory, setActiveCategory }: FiltersSectionProps) => {
  // Barra fixa sob o header: o foco do teclado desconta a altura dela (WCAG 2.4.11)
  const barRef = useStickyBar<HTMLElement>();
  return (
    <section ref={barRef} className="py-3 sm:py-5 bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-[var(--header-height,0px)] z-40 short-landscape:static">
      <div className="container mx-auto px-4 flex flex-col gap-2 sm:gap-4">
        {/* Busca */}
        <div className="relative w-full max-w-md mx-auto">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar álbuns..."
            aria-label="Buscar álbuns"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-h-11 pl-11 pr-12 py-2.5 sm:py-3 rounded-full border border-gray-200 bg-gray-50 text-base transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent [&::-webkit-search-cancel-button]:hidden"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Limpar busca"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-[#003f7f] transition-colors"
            >
              <FaTimes className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Categorias: no celular rolam na horizontal */}
        <div
          role="group"
          aria-label="Filtrar álbuns por categoria"
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 py-1.5 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap sm:justify-center sm:gap-3"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={`touch-target inline-flex min-h-9 shrink-0 items-center px-4 sm:px-5 rounded-full font-bold text-[13px] sm:text-sm transition-[background-color,color,box-shadow,scale] duration-200 active:scale-[0.98] ${
                activeCategory === category
                  ? 'bg-[#003f7f] text-white shadow-[0_8px_20px_-8px_rgba(0,63,127,0.7)]'
                  : 'bg-gray-100 text-gray-700 hover:bg-[#003f7f]/10 hover:text-[#003f7f]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FiltersSection;
