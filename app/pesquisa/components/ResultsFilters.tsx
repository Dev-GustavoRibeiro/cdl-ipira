'use client';

import React from 'react';
import { typeConfig } from './types';

interface ResultsFiltersProps {
  typeCounts: Record<string, number>;
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
  totalResults: number;
}

const ResultsFilters = ({ typeCounts, activeFilter, onFilterChange, totalResults }: ResultsFiltersProps) => {
  if (Object.keys(typeCounts).length <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onFilterChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          !activeFilter 
            ? 'bg-[#003f7f] text-white shadow-lg' 
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        Todos ({totalResults})
      </button>
      {Object.entries(typeCounts).map(([type, count]) => {
        const config = typeConfig[type] || typeConfig.page;
        const Icon = config.icon;
        return (
          <button
            key={type}
            onClick={() => onFilterChange(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeFilter === type 
                ? `${config.bgColor} ${config.color} shadow-lg` 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {config.label}s ({count})
          </button>
        );
      })}
    </div>
  );
};

export default ResultsFilters;



