'use client';

import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchSection = ({ searchTerm, onSearchChange }: SearchSectionProps) => {
  return (
    // Centralizado como a grade das edições (e como os demais títulos de seção)
    <div className="flex flex-col items-center text-center gap-5 mb-8 sm:mb-10">
      <div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.015em] text-[#003f7f]">
          {searchTerm ? 'Resultados da Busca' : 'Todas as Edições'}
        </h2>
        <div className="h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] mx-auto mt-4" aria-hidden="true"></div>
      </div>
      <div className="relative max-w-md w-full">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" aria-hidden="true" />
        <input
          type="search"
          aria-label="Buscar edições da Revista CDL"
          placeholder="Buscar edições..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-gray-50 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default SearchSection;



