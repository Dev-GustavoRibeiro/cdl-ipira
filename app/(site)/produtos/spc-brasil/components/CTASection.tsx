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
      description="Todas as funcionalidades são gratuitas e podem ser acessadas diretamente no site do SPC Brasil."
      actions={
        <>
          <a href="https://www.spcbrasil.org.br" target="_blank" rel="noopener noreferrer" className={btnYellow}>
            Acessar SPC Brasil
            <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
          <Link href="/imprensa/contato" className={btnGlass}>
            Falar com Especialista
            <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-[translate] duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
        </>
      }
    />
  );
};

export default CTASection;
