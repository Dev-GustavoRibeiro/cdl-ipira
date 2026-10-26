'use client';

import React from 'react';
import { FaLayerGroup } from 'react-icons/fa';
import { typeConfig } from './types';

interface ResultsFiltersProps {
  typeCounts: Record<string, number>;
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
  totalResults: number;
}

const pillClass = (active: boolean) =>
  `inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full py-1.5 pr-2 pl-4 text-sm font-bold transition-[background-color,color,box-shadow,scale] duration-200 active:scale-[0.98] ${
    active
      ? 'bg-[#003f7f] text-white shadow-[0_8px_20px_-8px_rgba(0,63,127,0.7)]'
      : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:text-[#003f7f] hover:ring-[#003f7f]/30'
  }`;

const countClass = (active: boolean) =>
  `min-w-6 rounded-full px-2 py-0.5 text-center text-xs tabular-nums ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`;

const ResultsFilters = ({ typeCounts, activeFilter, onFilterChange, totalResults }: ResultsFiltersProps) => {
  if (Object.keys(typeCounts).length <= 1) {
    return null;
  }

  return (
    // No celular os filtros rolam na horizontal
    <div
      role="group"
      aria-label="Filtrar resultados por tipo"
      className="-mx-4 mb-8 flex items-center gap-2 overflow-x-auto px-4 py-1.5 scrollbar-hide sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      <button type="button" aria-pressed={!activeFilter} onClick={() => onFilterChange(null)} className={pillClass(!activeFilter)}>
        <FaLayerGroup aria-hidden="true" className="h-3.5 w-3.5" />
        Todos
        <span className={countClass(!activeFilter)}>{totalResults}</span>
      </button>
      {Object.entries(typeCounts).map(([type, count]) => {
        const config = typeConfig[type] || typeConfig.page;
        const Icon = config.icon;
        const active = activeFilter === type;
        return (
          <button key={type} type="button" aria-pressed={active} onClick={() => onFilterChange(type)} className={pillClass(active)}>
            <span className={`grid h-6 w-6 place-items-center rounded-full ${active ? 'bg-white/15 text-white' : `${config.bgColor} ${config.color}`}`}>
              <Icon aria-hidden="true" className="h-3 w-3" />
            </span>
            {config.label}s
            <span className={countClass(active)}>{count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ResultsFilters;
