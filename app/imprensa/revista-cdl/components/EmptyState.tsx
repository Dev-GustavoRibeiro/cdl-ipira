import React from 'react';
import { FaBook } from 'react-icons/fa';

const EmptyState = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <FaBook className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhuma edição disponível</h3>
        <p className="text-gray-500">Em breve teremos novas edições da Revista CDL.</p>
      </div>
    </section>
  );
};

export default EmptyState;



