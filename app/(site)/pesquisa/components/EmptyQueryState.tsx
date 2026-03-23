import React from 'react';
import { FaSearch } from 'react-icons/fa';

const EmptyQueryState = () => {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-600 mb-2">Digite sua pesquisa</h2>
      <p className="text-gray-500">Use o campo acima para buscar conteúdos no site</p>
    </div>
  );
};

export default EmptyQueryState;



