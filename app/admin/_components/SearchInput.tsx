'use client';

import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { cx, focusRing } from './styles';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: string;
  onChange: (value: string) => void;
  /** Rótulo para leitores de tela (o campo não tem rótulo visível) */
  label: string;
  className?: string;
}

/** Campo de busca com ícone e botão de limpar. `<SearchInput label="Buscar notícias" value={q} onChange={setQ} />` */
export function SearchInput({ value, onChange, label, placeholder, className, ...props }: SearchInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className={cx('relative min-w-0', className)}>
      <FaSearch aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
      <input
        ref={inputRef}
        type="search"
        aria-label={label}
        placeholder={placeholder ?? label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 w-full rounded-xl border border-gray-300 bg-white py-2 pr-11 pl-10 text-base text-gray-900 placeholder:text-gray-400 transition-[border-color,box-shadow] duration-200 hover:border-gray-400 focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/15 focus:outline-none sm:text-sm [&::-webkit-search-cancel-button]:appearance-none"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          aria-label="Limpar busca"
          className={cx(
            'absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 pointer-fine:right-1 pointer-fine:size-9',
            focusRing
          )}
        >
          <FaTimes aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
