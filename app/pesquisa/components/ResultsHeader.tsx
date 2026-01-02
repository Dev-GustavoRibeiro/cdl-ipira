import React from 'react';

interface ResultsHeaderProps {
  query: string;
  total: number;
}

const ResultsHeader = ({ query, total }: ResultsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Resultados para &quot;{query}&quot;
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {total} {total === 1 ? 'resultado encontrado' : 'resultados encontrados'}
        </p>
      </div>
    </div>
  );
};

export default ResultsHeader;



