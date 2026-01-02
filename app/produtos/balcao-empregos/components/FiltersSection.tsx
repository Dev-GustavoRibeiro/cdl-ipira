'use client';

import React from 'react';
import { FaSearch } from 'react-icons/fa';

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
    <section className="py-6 sm:py-8 bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Busca */}
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Buscar vagas..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-[#003f7f] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-[#003f7f] hover:text-white border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiltersSection;



