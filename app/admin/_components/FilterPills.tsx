import React from 'react';
import { cx, focusRing } from './styles';

export interface FilterOption<V extends string = string> {
  value: V;
  label: string;
  /** Quantidade exibida ao lado do rótulo */
  count?: number;
}

interface FilterPillsProps<V extends string> {
  options: FilterOption<V>[];
  value: V;
  onChange: (value: V) => void;
  /** Nome do grupo para leitores de tela (ex.: "Filtrar por status") */
  label: string;
  className?: string;
}

/**
 * Filtros em pílulas (seleção única, aria-pressed).
 * No celular rolam na horizontal dentro do próprio contêiner (sem rolar a página).
 */
export function FilterPills<V extends string>({ options, value, onChange, label, className }: FilterPillsProps<V>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cx('-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cx(
              'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold whitespace-nowrap pointer-fine:min-h-9',
              'transition-[background-color,color,box-shadow] duration-200 motion-reduce:transition-none',
              focusRing,
              active
                ? 'bg-[#003f7f] text-white shadow-[0_8px_18px_-10px_rgba(0,63,127,0.8)]'
                : 'bg-white text-gray-600 ring-1 ring-inset ring-gray-300 hover:text-[#003f7f] hover:ring-[#003f7f]/40'
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span
                className={cx(
                  'rounded-full px-1.5 py-px text-xs tabular-nums',
                  active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
