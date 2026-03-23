import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <FaSpinner className="w-12 h-12 text-[#003f7f] animate-spin mb-4" />
      <p className="text-gray-600 text-lg">Pesquisando...</p>
    </div>
  );
};

export default LoadingState;



