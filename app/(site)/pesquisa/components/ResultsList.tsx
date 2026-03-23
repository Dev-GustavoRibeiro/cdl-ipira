'use client';

import React from 'react';
import { SearchResult, typeConfig } from './types';
import ResultCard from './ResultCard';

interface ResultsListProps {
  results: SearchResult[];
  activeFilter: string | null;
  onClearFilter: () => void;
}

const ResultsList = ({ results, activeFilter, onClearFilter }: ResultsListProps) => {
  return (
    <>
      {/* Lista de resultados */}
      <div className="space-y-4">
        {results.map((result) => (
          <ResultCard key={`${result.type}-${result.id}`} result={result} />
        ))}
      </div>

      {/* Mensagem se filtrou e não tem resultados */}
      {activeFilter && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Nenhum resultado do tipo &quot;{typeConfig[activeFilter]?.label || activeFilter}&quot; encontrado
          </p>
          <button
            onClick={onClearFilter}
            className="mt-4 text-[#003f7f] font-medium hover:underline"
          >
            Ver todos os resultados
          </button>
        </div>
      )}
    </>
  );
};

export default ResultsList;



