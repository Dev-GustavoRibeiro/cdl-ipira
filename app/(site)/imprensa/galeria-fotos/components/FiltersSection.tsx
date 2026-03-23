'use client';

import React from 'react';
import { FaSearch } from 'react-icons/fa';

const categories = ['Todos', 'Eventos', 'Networking', 'Capacitação', 'Institucional', 'Comercial', 'Política', 'Outros'];

interface FiltersSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const FiltersSection = ({ searchTerm, setSearchTerm, activeCategory, setActiveCategory }: FiltersSectionProps) => {
  return (
    <section className="py-8 bg-white border-b border-gray-200 sticky top-[73px] z-40 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Busca */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar álbuns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Categorias */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#003f7f] text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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



