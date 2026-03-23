'use client';

import React from 'react';
import { FaAward, FaShieldAlt, FaRocket, FaHeart } from 'react-icons/fa';

const CompromissoSection = () => {
  return (
    <section className="py-16 sm:py-20 bg-linear-to-r from-[#003f7f] via-[#0052a3] to-[#003f7f] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
            <FaAward className="text-[#ffd000] text-3xl sm:text-4xl" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
            Nosso Compromisso
          </h2>
          
          <p className="text-white/90 text-lg sm:text-xl md:text-2xl leading-relaxed mb-10 max-w-3xl mx-auto">
            Trabalhamos todos os dias para sermos mais do que uma entidade — somos <span className="text-[#ffd000] font-bold">parceiros reais</span> no crescimento de cada associado.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: FaShieldAlt, text: 'Proteção e segurança' },
              { icon: FaRocket, text: 'Crescimento contínuo' },
              { icon: FaHeart, text: 'Atendimento humanizado' },
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/10 hover:bg-white/20 transition-all">
                <item.icon className="text-[#ffd000] text-2xl sm:text-3xl mx-auto mb-3" />
                <p className="text-white font-medium text-sm sm:text-base">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompromissoSection;



