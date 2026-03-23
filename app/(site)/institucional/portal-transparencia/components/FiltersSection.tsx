'use client';

import React from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

interface FiltersSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  categorias: string[];
}

const FiltersSection = ({ 
  searchTerm, 
  setSearchTerm, 
  filterCategory, 
  setFilterCategory, 
  categorias 
}: FiltersSectionProps) => {
  return (
    <section className="py-6 sm:py-8 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent transition-all"
              />
            </div>
            {categorias.length > 0 && (
              <div className="relative">
                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full sm:w-auto pl-11 pr-8 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent bg-white appearance-none cursor-pointer"
                >
                  <option value="all">Todas as categorias</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiltersSection;



