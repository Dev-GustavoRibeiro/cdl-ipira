'use client';

import React from 'react';
import Link from 'next/link';

const Breadcrumb = () => {
  return (
    <div className="bg-[#003f7f] text-white py-3">
      <div className="container mx-auto px-4">
        <nav className="text-sm" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#ffd000] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span>Produtos</span>
          <span className="mx-2">/</span>
          <span className="text-white/80">Certificado Digital</span>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;



