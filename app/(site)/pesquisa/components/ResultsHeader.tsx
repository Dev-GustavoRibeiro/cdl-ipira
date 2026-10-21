import React from 'react';

interface ResultsHeaderProps {
  query: string;
  total: number;
}

const ResultsHeader = ({ query, total }: ResultsHeaderProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-black leading-tight tracking-tight text-balance text-[#003f7f] sm:text-3xl">
        Resultados para <span className="text-gray-900">&ldquo;{query}&rdquo;</span>
      </h2>
      <div aria-hidden="true" className="mt-4 h-1.5 w-16 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
      <p role="status" className="mt-3 text-sm text-gray-600">
        <strong className="font-bold text-gray-900 tabular-nums">{total}</strong>{' '}
        {total === 1 ? 'resultado encontrado' : 'resultados encontrados'}
      </p>
    </div>
  );
};

export default ResultsHeader;
