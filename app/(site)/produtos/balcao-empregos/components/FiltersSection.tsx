'use client';

import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { cardSurface } from '../../_components/ProductUI';

interface FiltersSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const FiltersSection = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories
}: FiltersSectionProps) => {
  return (
    <div role="search" aria-label="Filtrar vagas" className={`p-5 sm:p-6 ${cardSurface}`}>
      <label htmlFor="busca-vagas" className="text-xs font-bold uppercase tracking-[0.12em] text-gray-600">
        Buscar vagas
      </label>
      <div className="relative mt-2.5">
        <FaSearch aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          id="busca-vagas"
          type="search"
          placeholder="Cargo ou empresa"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pr-11 pl-11 text-base text-gray-900 placeholder:text-gray-500 transition-[border-color,background-color,box-shadow] duration-200 hover:border-gray-300 focus:border-[#0066cc] focus:bg-white focus:ring-4 focus:ring-[#0066cc]/15 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Limpar busca"
            className="absolute top-1/2 right-2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
          >
            <FaTimes aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <p id="categorias-vagas" className="mt-6 text-xs font-bold uppercase tracking-[0.12em] text-gray-600">
        Categorias
      </p>
      {/* No celular as categorias rolam na horizontal; a partir do tablet, quebram em linhas */}
      <div
        role="group"
        aria-labelledby="categorias-vagas"
        className="scrollbar-hide -mx-5 mt-1.5 flex gap-2 overflow-x-auto px-5 py-1.5 sm:mx-0 sm:mt-2.5 sm:flex-wrap sm:overflow-visible sm:px-0 sm:py-0"
      >
        {categories.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={active}
              onClick={() => onCategoryChange(category)}
              className={`touch-target inline-flex min-h-9 shrink-0 items-center rounded-full px-4 text-sm font-bold transition-[background-color,color,box-shadow,scale] duration-200 active:scale-[0.98] motion-reduce:transition-none ${
                active
                  ? 'bg-[#003f7f] text-white shadow-[0_8px_20px_-8px_rgba(0,63,127,0.7)]'
                  : 'bg-gray-100 text-gray-700 hover:bg-[#003f7f]/10 hover:text-[#003f7f]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FiltersSection;
