'use client';

import React from 'react';

const categories = ['Todas', 'Economia', 'Comércio', 'Agronegócio', 'Dicas', 'Eventos', 'Serviços'];

interface CategoriesFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoriesFilter = ({ selectedCategory, setSelectedCategory }: CategoriesFilterProps) => {
  return (
    <section className="py-3 sm:py-4 border-b border-gray-200 sticky top-[var(--header-height,0px)] z-40 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* No celular os filtros rolam na horizontal: a barra fixa continua baixa */}
        <div
          role="group"
          aria-label="Filtrar notícias por categoria"
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 py-1.5 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap sm:justify-center sm:gap-3"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-[background-color,color,box-shadow,transform] duration-200 active:scale-[0.98] ${
                selectedCategory === category
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

export default CategoriesFilter;
