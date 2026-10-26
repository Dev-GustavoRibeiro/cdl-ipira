'use client';

import React from 'react';
import { useStickyBar } from '@/app/components/useStickyBar';

const categories = ['Todos', 'Networking', 'Capacitação', 'Feira', 'Palestra', 'Institucional', 'Reunião'];
const statusFilters = ['Todos', 'Próximos', 'Em Andamento', 'Realizados'];

interface FiltersSectionProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  /** Eventos de cada opção (combinada com o outro filtro); ausente enquanto carrega */
  countStatus?: (status: string) => number;
  countCategory?: (category: string) => number;
}

interface FilterRowProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  count?: (value: string) => number;
  /** Cor do filtro ativo (status em azul, categoria em verde) */
  activeClass: string;
}

// Uma linha de filtros: no celular rola na horizontal para a barra fixa continuar baixa
const FilterRow = ({ label, options, selected, onSelect, count, activeClass }: FilterRowProps) => (
  <div
    role="group"
    aria-label={`Filtrar eventos por ${label.toLowerCase()}`}
    className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 py-1.5 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap sm:justify-center"
  >
    <span className="shrink-0 text-[11px] font-black uppercase tracking-wider text-gray-500 mr-1">{label}</span>
    {options.map((option) => {
      const total = count?.(option);
      const isSelected = selected === option;
      // Opção sem eventos não leva ao estado vazio; a selecionada continua clicável
      const isEmpty = total === 0 && !isSelected;
      return (
        <button
          key={option}
          type="button"
          aria-pressed={isSelected}
          disabled={isEmpty}
          onClick={() => onSelect(option)}
          className={`touch-target inline-flex min-h-9 shrink-0 items-center gap-1.5 px-3.5 sm:px-4 rounded-full text-[13px] sm:text-sm font-bold transition-[background-color,color,box-shadow,scale] duration-200 active:scale-[0.98] ${
            isSelected
              ? activeClass
              : isEmpty
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-[#003f7f]/10 hover:text-[#003f7f]'
          }`}
        >
          {option}
          {total !== undefined && (
            <span className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-[11px] leading-none tabular-nums ${isSelected ? 'bg-white/20' : 'bg-black/5'}`}>
              {total}
              <span className="sr-only">{total === 1 ? ' evento' : ' eventos'}</span>
            </span>
          )}
        </button>
      );
    })}
  </div>
);

const FiltersSection = ({ selectedCategory, setSelectedCategory, selectedStatus, setSelectedStatus, countStatus, countCategory }: FiltersSectionProps) => {
  // Barra fixa sob o header: o foco do teclado desconta a altura dela (WCAG 2.4.11)
  const barRef = useStickyBar<HTMLElement>();
  return (
    <section ref={barRef} className="py-1.5 sm:py-4 border-b border-gray-200 sticky top-[var(--header-height,0px)] z-40 short-landscape:static backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:gap-2">
        <FilterRow
          label="Status"
          options={statusFilters}
          selected={selectedStatus}
          onSelect={setSelectedStatus}
          count={countStatus}
          activeClass="bg-[#003f7f] text-white shadow-[0_8px_20px_-8px_rgba(0,63,127,0.7)]"
        />
        <FilterRow
          label="Categoria"
          options={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          count={countCategory}
          // Texto escuro: branco sobre o verde da marca dá 3,1:1 (abaixo dos 4,5:1 do WCAG AA)
          activeClass="bg-[#00a859] text-[#001a3d] shadow-[0_8px_20px_-8px_rgba(0,168,89,0.8)]"
        />
      </div>
    </section>
  );
};

export default FiltersSection;
