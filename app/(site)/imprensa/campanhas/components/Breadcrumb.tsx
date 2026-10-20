'use client';

import React from 'react';
import Link from 'next/link';

interface BreadcrumbProps {
  /** Título da campanha (página de detalhe) */
  title?: string;
}

const Breadcrumb = ({ title }: BreadcrumbProps) => {
  return (
    <div className="bg-[#003f7f] text-white py-2.5 sm:py-3">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm min-w-0" aria-label="Breadcrumb">
          <Link
            href="/"
            className="hover:text-[#ffd000] transition-colors flex items-center gap-1 group shrink-0"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-[-2px] transition-transform" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Início</span>
          </Link>
          <span className="text-white/40">/</span>
          <Link
            href="/imprensa/noticias"
            className="hover:text-[#ffd000] transition-colors shrink-0"
          >
            Imprensa
          </Link>
          <span className="text-white/40">/</span>
          {title ? (
            <>
              <Link
                href="/imprensa/campanhas"
                className="hover:text-[#ffd000] transition-colors shrink-0"
              >
                Campanhas
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-semibold truncate" aria-current="page">{title}</span>
            </>
          ) : (
            <span className="text-white font-semibold" aria-current="page">Campanhas</span>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
