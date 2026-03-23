'use client';

import React from 'react';

const Breadcrumb = () => {
  return (
    <div className="bg-[#003f7f] text-white py-3">
      <div className="container mx-auto px-4">
        <nav className="text-sm">
          <a href="/" className="hover:text-[#ffd000] transition-colors">Home</a>
          <span className="mx-2">/</span>
          <a href="/produtos" className="hover:text-[#ffd000] transition-colors">Produtos</a>
          <span className="mx-2">/</span>
          <span className="text-white/80">Certificado Digital</span>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;



