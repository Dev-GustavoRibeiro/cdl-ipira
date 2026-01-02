'use client';

import React from 'react';

const categories = ['Todos', 'Networking', 'Capacitação', 'Feira', 'Palestra', 'Institucional', 'Reunião'];
const statusFilters = ['Todos', 'Próximos', 'Em Andamento', 'Realizados'];

interface FiltersSectionProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

const FiltersSection = ({ selectedCategory, setSelectedCategory, selectedStatus, setSelectedStatus }: FiltersSectionProps) => {
  return (
    <section className="py-4 sm:py-6 border-b border-gray-200 sticky top-[73px] sm:top-[81px] z-40 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          {/* Filtro de Status */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-semibold text-gray-600 mr-2">Status:</span>
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 ${
                  selectedStatus === status
                    ? 'bg-[#003f7f] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-[#003f7f] hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Filtro de Categoria */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-semibold text-gray-600 mr-2">Categoria:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-[#00a859] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-[#00a859] hover:text-white'
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



