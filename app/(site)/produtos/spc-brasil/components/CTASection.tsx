'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import { CTABand, btnGlass, btnYellow } from '../../_components/ProductUI';

const CTASection = () => {
  return (
    <CTABand
      className="bg-gray-50"
      title="Comece a Usar o SPC Brasil Hoje"
      description="Preços, prazos e disponibilidade de cada serviço são definidos pelo SPC Brasil. Fale com a CDL para saber como usar com o seu CPF ou CNPJ."
      actions={
        <>
          <a href="https://www.spcbrasil.org.br" target="_blank" rel="noopener noreferrer" className={btnYellow}>
            Acessar SPC Brasil
            <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
          <Link href="/imprensa/contato" className={btnGlass}>
            Falar com a CDL
            <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-[translate] duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
        </>
      }
    />
  );
};

export default CTASection;
