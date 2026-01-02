'use client';

import React from 'react';

const categories = ['Todas', 'Institucional', 'Capacitação', 'Dicas', 'Tutorial', 'Eventos', 'Entrevista'];

interface CategoriesFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  hasSelectedVideo: boolean;
}

const CategoriesFilter = ({ selectedCategory, setSelectedCategory, hasSelectedVideo }: CategoriesFilterProps) => {
  return (
    <section className={`py-4 sm:py-6 bg-white border-b border-gray-200 ${hasSelectedVideo ? '' : 'sticky top-[73px] sm:top-[81px] z-40 backdrop-blur-sm bg-white/95'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-[#003f7f] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-[#003f7f] hover:text-white'
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



