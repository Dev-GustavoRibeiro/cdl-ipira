'use client';

import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchSection = ({ searchTerm, setSearchTerm }: SearchSectionProps) => {
  return (
    <section className="py-6 sm:py-8 border-b border-gray-200 sticky top-[73px] sm:top-[81px] z-40 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Buscar associado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;



