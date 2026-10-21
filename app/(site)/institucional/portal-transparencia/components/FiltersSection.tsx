'use client';

import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface FiltersSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  categorias: string[];
}

const chipClass = (active: boolean) =>
  `shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-[background-color,color,box-shadow,scale] duration-200 active:scale-[0.98] sm:text-sm ${
    active
      ? 'bg-[#003f7f] text-white shadow-[0_8px_20px_-8px_rgba(0,63,127,0.7)]'
      : 'bg-gray-100 text-gray-700 hover:bg-[#003f7f]/10 hover:text-[#003f7f]'
  }`;

const FiltersSection = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  categorias
}: FiltersSectionProps) => {
  return (
    <section
      aria-label="Filtrar documentos"
      className="sticky top-[var(--header-height,0px)] z-30 border-b border-gray-200 bg-white/95 py-4 backdrop-blur-sm sm:py-5"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:gap-5">
          <div className={`relative ${categorias.length > 0 ? 'md:w-80 md:shrink-0' : 'md:flex-1'}`}>
            <label htmlFor="busca-documentos" className="sr-only">
              Buscar documentos
            </label>
            <FaSearch aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="busca-documentos"
              type="search"
              placeholder="Buscar por título ou descrição"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pr-11 pl-11 text-sm text-gray-900 transition-[border-color,background-color,box-shadow] placeholder:text-gray-500 focus:border-[#003f7f] focus:bg-white focus:ring-4 focus:ring-[#003f7f]/10 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Limpar busca"
                className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200 hover:text-[#003f7f]"
              >
                <FaTimes aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {categorias.length > 0 && (
            // No celular as categorias rolam na horizontal
            <div
              role="group"
              aria-label="Filtrar por categoria"
              className="scrollbar-hide -mx-4 flex items-center gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
            >
              <button type="button" aria-pressed={filterCategory === 'all'} onClick={() => setFilterCategory('all')} className={chipClass(filterCategory === 'all')}>
                Todas
              </button>
              {categorias.map((cat) => (
                <button key={cat} type="button" aria-pressed={filterCategory === cat} onClick={() => setFilterCategory(cat)} className={chipClass(filterCategory === cat)}>
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FiltersSection;
