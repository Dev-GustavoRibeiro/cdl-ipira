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

interface FilterRowProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  /** Cor do filtro ativo (status em azul, categoria em verde) */
  activeClass: string;
}

// Uma linha de filtros: no celular rola na horizontal para a barra fixa continuar baixa
const FilterRow = ({ label, options, selected, onSelect, activeClass }: FilterRowProps) => (
  <div
    role="group"
    aria-label={`Filtrar eventos por ${label.toLowerCase()}`}
    className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 py-1.5 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap sm:justify-center"
  >
    <span className="shrink-0 text-[11px] font-black uppercase tracking-wider text-gray-500 mr-1">{label}</span>
    {options.map((option) => (
      <button
        key={option}
        type="button"
        aria-pressed={selected === option}
        onClick={() => onSelect(option)}
        className={`shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-[background-color,color,box-shadow,transform] duration-200 active:scale-[0.98] ${
          selected === option ? activeClass : 'bg-gray-100 text-gray-700 hover:bg-[#003f7f]/10 hover:text-[#003f7f]'
        }`}
      >
        {option}
      </button>
    ))}
  </div>
);

const FiltersSection = ({ selectedCategory, setSelectedCategory, selectedStatus, setSelectedStatus }: FiltersSectionProps) => {
  return (
    <section className="py-2.5 sm:py-4 border-b border-gray-200 sticky top-[var(--header-height,0px)] z-40 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-1 sm:gap-2">
        <FilterRow
          label="Status"
          options={statusFilters}
          selected={selectedStatus}
          onSelect={setSelectedStatus}
          activeClass="bg-[#003f7f] text-white shadow-[0_8px_20px_-8px_rgba(0,63,127,0.7)]"
        />
        <FilterRow
          label="Categoria"
          options={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          activeClass="bg-[#00a859] text-white shadow-[0_8px_20px_-8px_rgba(0,168,89,0.8)]"
        />
      </div>
    </section>
  );
};

export default FiltersSection;
