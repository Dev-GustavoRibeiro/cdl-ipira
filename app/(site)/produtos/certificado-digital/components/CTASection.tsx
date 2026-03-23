'use client';

import React from 'react';
import { FaArrowRight, FaPhone } from 'react-icons/fa';

const CTASection = () => {
  return (
    <section className="py-20 bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#003f7f] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Emita seu Certificado Digital Agora
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Atendimento por videoconferência. Emita de onde estiver, com total segurança e praticidade.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/imprensa/contato"
              className="bg-[#ffd000] text-[#003f7f] px-8 py-4 rounded-full font-bold hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-3"
            >
              <span>Solicitar Certificado</span>
              <FaArrowRight className="w-5 h-5" />
            </a>
            <a
              href="tel:557532541599"
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#003f7f] transition-all duration-300 flex items-center gap-3"
            >
              <FaPhone className="w-5 h-5" />
              <span>(75) 3254-1599</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;



