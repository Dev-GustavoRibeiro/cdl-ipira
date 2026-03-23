'use client';

import React from 'react';

interface SidebarProps {
  onOpenModal: () => void;
}

const Sidebar = ({ onOpenModal }: SidebarProps) => {
  return (
    <div className="bg-linear-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 sticky top-24">
      <h3 className="text-xl sm:text-2xl font-black text-[#003f7f] mb-3 sm:mb-4">
        Quer contratar?
      </h3>
      <p className="text-sm sm:text-base text-gray-700 mb-5 sm:mb-6 leading-relaxed text-justify">
        Inicie seu recrutamento completo e preencha suas vagas!
      </p>
      <button
        onClick={onOpenModal}
        className="w-full inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-3 sm:py-4 rounded-full font-bold hover:bg-[#0066cc] transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base group"
      >
        Cadastre sua vaga
        <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
        <h4 className="text-base sm:text-lg font-bold text-[#003f7f] mb-3 sm:mb-4">
          Benefícios
        </h4>
        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#00a859] font-bold shrink-0">✓</span>
            <span className="text-justify">Acesso a currículos qualificados</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00a859] font-bold shrink-0">✓</span>
            <span className="text-justify">Divulgação gratuita para associados</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00a859] font-bold shrink-0">✓</span>
            <span className="text-justify">Processo de recrutamento simplificado</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00a859] font-bold shrink-0">✓</span>
            <span className="text-justify">Suporte da equipe CDL</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;



