'use client';

import React from 'react';
import { SearchResult, typeConfig } from './types';
import ResultCard from './ResultCard';

interface ResultsListProps {
  results: SearchResult[];
  activeFilter: string | null;
  onClearFilter: () => void;
  /** Termo pesquisado, destacado nos cartões */
  query?: string;
}

const ResultsList = ({ results, activeFilter, onClearFilter, query }: ResultsListProps) => {
  return (
    <>
      {/* Lista de resultados */}
      <ul className="space-y-4">
        {results.map((result) => (
          <li key={`${result.type}-${result.id}`}>
            <ResultCard result={result} query={query} />
          </li>
        ))}
      </ul>

      {/* Mensagem se filtrou e não tem resultados */}
      {activeFilter && results.length === 0 && (
        <div className="rounded-3xl bg-white px-6 py-10 text-center ring-1 ring-gray-100">
          <p className="text-gray-600">
            Nenhum resultado do tipo &quot;{typeConfig[activeFilter]?.label || activeFilter}&quot; encontrado
          </p>
          <button
            type="button"
            onClick={onClearFilter}
            className="mt-4 rounded-full px-4 py-2 text-sm font-bold text-[#003f7f] ring-1 ring-[#003f7f]/20 transition-colors hover:bg-[#003f7f] hover:text-white"
          >
            Ver todos os resultados
          </button>
        </div>
      )}
    </>
  );
};

export default ResultsList;
