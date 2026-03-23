import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface NoResultsStateProps {
  query: string;
}

const NoResultsState = ({ query }: NoResultsStateProps) => {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-600 mb-2">Nenhum resultado encontrado</h2>
      <p className="text-gray-500 mb-6">
        Não encontramos resultados para &quot;{query}&quot;
      </p>
      <p className="text-gray-400 text-sm">
        Tente usar palavras-chave diferentes ou mais gerais
      </p>
    </div>
  );
};

export default NoResultsState;



