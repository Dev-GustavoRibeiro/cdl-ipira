'use client';

import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchSection = ({ searchTerm, onSearchChange }: SearchSectionProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#003f7f]">
          {searchTerm ? 'Resultados da Busca' : 'Todas as Edições'}
        </h2>
        <div className="w-16 h-1.5 bg-linear-to-r from-[#003f7f] to-[#00a859] rounded-full mt-2"></div>
      </div>
      <div className="relative max-w-sm w-full">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar edições..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
};

export default SearchSection;



