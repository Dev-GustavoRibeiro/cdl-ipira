import React from 'react';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 bg-linear-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.015em] text-[#003f7f] mb-4">
          Quer aparecer na Revista CDL?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Divulgue sua empresa na Revista CDL. Fale com a CDL para saber como participar.
        </p>
        {/* Texto escuro: branco sobre o verde da marca dá 3,1:1 (abaixo dos 4,5:1 do WCAG AA) */}
        <Link
          href="/imprensa/contato"
          className="inline-flex items-center gap-2 bg-[#00a859] text-[#001a3d] px-8 py-3.5 rounded-full font-bold shadow-[0_12px_28px_-12px_rgba(0,168,89,0.8)] hover:bg-[#00d670] hover:-translate-y-0.5 active:scale-[0.98] transition-[transform,translate,scale,background-color] duration-200"
        >
          Fale Conosco
        </Link>
      </div>
    </section>
  );
};

export default CTASection;



