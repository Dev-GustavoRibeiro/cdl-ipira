'use client';

import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#003f7f] py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white">
          <div className="inline-block bg-[#ffd000] text-[#003f7f] px-6 py-3 rounded-full text-sm font-black mb-6 shadow-2xl">
            📸 Galeria de Fotos
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 drop-shadow-2xl">
            Momentos CDL Ipirá
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Reviva os melhores momentos dos nossos eventos, encontros e celebrações
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



