'use client';

import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface HeroSectionProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
}

const HeroSection = ({ searchTerm, onSearchTermChange, onSubmit, onClear }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] py-14 sm:py-16 md:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[#ffd000]/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[#00a859]/20 blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#003f7f] shadow-sm">
            <FaSearch aria-hidden="true" className="h-3 w-3" />
            Busca no site
          </span>
          <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Pesquisa
          </h1>
          <div aria-hidden="true" className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-white via-[#00d670] to-[#ffd000]" />
          <p className="mx-auto mt-5 max-w-[52ch] text-base text-white/85 md:text-lg">
            Encontre notícias, eventos, vagas, vídeos e informações do site CDL Ipirá
          </p>

          {/* Campo de pesquisa */}
          <form role="search" onSubmit={onSubmit} className="mx-auto mt-8 max-w-2xl md:mt-10">
            <div className="flex items-center gap-1 rounded-2xl bg-white p-2 shadow-[0_30px_60px_-20px_rgba(0,26,61,0.65)] ring-4 ring-white/15 transition-[box-shadow] duration-200 focus-within:ring-[#ffd000]">
              <FaSearch aria-hidden="true" className="ml-3 h-5 w-5 shrink-0 text-gray-400 sm:ml-4" />
              <label htmlFor="pesquisa-termo" className="sr-only">Pesquisar no site</label>
              <input
                id="pesquisa-termo"
                type="search"
                enterKeyHint="search"
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                placeholder="O que você está procurando?"
                minLength={2}
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:px-3 sm:py-3.5 sm:text-lg [&::-webkit-search-cancel-button]:appearance-none"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={onClear}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Limpar pesquisa"
                >
                  <FaTimes aria-hidden="true" className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#003f7f] px-4 py-3 text-sm font-bold text-white transition-[background-color,scale] duration-200 hover:bg-[#0052a3] active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-base"
              >
                <FaSearch aria-hidden="true" className="h-3.5 w-3.5 sm:hidden" />
                <span className="sr-only sm:not-sr-only">Buscar</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
