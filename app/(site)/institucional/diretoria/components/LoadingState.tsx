'use client';

import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingState = () => {
  return (
    <section className="py-16 bg-white">
      <div className="flex justify-center items-center">
        <div className="flex items-center gap-3 text-[#003f7f]">
          <FaSpinner className="animate-spin w-6 h-6" />
          <span className="text-lg font-medium">Carregando equipe...</span>
        </div>
      </div>
    </section>
  );
};

export default LoadingState;



