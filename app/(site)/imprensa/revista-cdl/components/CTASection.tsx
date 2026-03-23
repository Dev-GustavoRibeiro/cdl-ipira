import React from 'react';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 bg-linear-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-[#003f7f] mb-4">
          Quer aparecer na Revista CDL?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Divulgue sua empresa e seus produtos para toda a comunidade lojista de Ipirá e região. Entre em contato com a CDL e saiba como participar das próximas edições.
        </p>
        <Link
          href="/imprensa/contato"
          className="inline-flex items-center gap-2 bg-[#00a859] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#00d670] transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Fale Conosco
        </Link>
      </div>
    </section>
  );
};

export default CTASection;



