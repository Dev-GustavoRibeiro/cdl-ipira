'use client';

import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';

const IntroSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-[#003f7f] mb-6">
            O que é o SPC Brasil?
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            O SPC Brasil é o maior sistema de proteção ao crédito do país, oferecendo soluções 
            completas para empresas e consumidores. Com mais de 50 anos de experiência, ajudamos 
            milhões de brasileiros a proteger, negociar e construir seu histórico creditício.
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#003f7f]/10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaShieldAlt className="w-8 h-8 text-[#003f7f]" />
              <h3 className="text-2xl font-bold text-[#003f7f]">Soluções Integradas</h3>
            </div>
            <p className="text-gray-600">
              Três ferramentas poderosas que trabalham juntas para oferecer proteção completa, 
              facilitar negociações e construir um histórico creditício positivo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;



