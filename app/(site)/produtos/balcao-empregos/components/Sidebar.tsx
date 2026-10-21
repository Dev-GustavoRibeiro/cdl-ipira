'use client';

import React, { useState } from 'react';
import { FaCheck, FaChevronDown, FaPlus } from 'react-icons/fa';
import { btnYellow } from '../../_components/ProductUI';

interface SidebarProps {
  onOpenModal: () => void;
}

const benefits = [
  'Acesso a currículos qualificados',
  'Divulgação gratuita para associados',
  'Processo de recrutamento simplificado',
  'Suporte da equipe CDL',
];

/** Chamada "Quer contratar?" que fecha a lista de vagas (faixa em duas colunas a partir do tablet). */
const Sidebar = ({ onOpenModal }: SidebarProps) => {
  // No celular a lista de benefícios fica recolhida; a partir do tablet, sempre aberta
  const [showBenefits, setShowBenefits] = useState(false);

  return (
    // Duas colunas no tablet e no desktop largo; em 1024px a coluna das vagas é estreita, então empilha
    <div className="relative isolate grid gap-6 overflow-hidden rounded-3xl bg-linear-to-br from-[#001a3d] via-[#003f7f] to-[#0052a3] p-6 text-white shadow-[0_30px_60px_-30px_rgba(0,63,127,0.7)] sm:grid-cols-2 sm:gap-10 sm:p-8 lg:grid-cols-1 lg:gap-6 lg:p-10 xl:grid-cols-2 xl:gap-10">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-16 -z-10 h-64 w-64 rounded-full bg-[#0066cc]/50 blur-3xl" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 bg-linear-to-r from-[#0066cc] via-[#00a859] to-[#ffd000]" />

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#ffd000]">Para empresas</p>
        <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Quer contratar?</h3>
        <p className="mt-2 max-w-[40ch] text-white/80">Inicie seu recrutamento completo e preencha suas vagas!</p>
        <button type="button" onClick={onOpenModal} aria-haspopup="dialog" className={`${btnYellow} mt-6 w-full sm:w-auto`}>
          <FaPlus aria-hidden="true" className="h-3.5 w-3.5" />
          Cadastre sua vaga
        </button>
      </div>

      <div className="border-t border-white/15 pt-5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-10 lg:border-t lg:border-l-0 lg:pt-6 lg:pl-0 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-10">
        <button
          type="button"
          onClick={() => setShowBenefits((open) => !open)}
          aria-expanded={showBenefits}
          aria-controls="beneficios-balcao"
          className="flex w-full items-center justify-between gap-3 rounded-lg text-left font-bold sm:hidden"
        >
          Benefícios
          <FaChevronDown
            aria-hidden="true"
            className={`h-3.5 w-3.5 text-[#ffd000] transition-[rotate] duration-200 motion-reduce:transition-none ${showBenefits ? 'rotate-180' : ''}`}
          />
        </button>
        <h4 className="hidden font-bold sm:block">Benefícios</h4>
        <ul id="beneficios-balcao" className={`mt-4 space-y-3 text-sm text-white/90 sm:block sm:text-base ${showBenefits ? 'block' : 'hidden'}`}>
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00a859] text-white">
                <FaCheck aria-hidden="true" className="h-2.5 w-2.5" />
              </span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
