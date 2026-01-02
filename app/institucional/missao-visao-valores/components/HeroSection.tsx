'use client';

import React from 'react';
import { FaGem, FaAward, FaTrophy, FaUsers, FaFlag } from 'react-icons/fa';
import AnimatedCounter from './AnimatedCounter';
import FloatingParticles from './FloatingParticles';

const diferenciais = [
  { icon: FaAward, text: 'Reconhecimento regional', number: '15+', label: 'Prêmios' },
  { icon: FaTrophy, text: 'Excelência em serviços', number: '98%', label: 'Satisfação' },
  { icon: FaUsers, text: 'Rede de associados', number: '100+', label: 'Empresas' },
  { icon: FaFlag, text: 'Anos de tradição', number: '30+', label: 'Anos' },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background complexo */}
      <div className="absolute inset-0">
        {/* Gradiente base */}
        <div className="absolute inset-0 bg-linear-to-br from-[#001a33] via-[#003f7f] to-[#0066cc]"></div>
        
        {/* Malha de gradiente */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#00a859] rounded-full blur-[150px] transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#ffd000] rounded-full blur-[150px] transform translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#0066cc] rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Grid de linhas */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>

        {/* Partículas */}
        <FloatingParticles />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            {/* Badge animado */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold mb-8 border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer"></div>
              <FaGem className="text-[#ffd000] relative z-10" />
              <span className="relative z-10">Nossos Fundamentos</span>
            </div>
            
            {/* Título com efeito */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.9]">
              <span className="block">Missão</span>
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#ffd000] via-[#ffed4e] to-[#ffd000]">
                Visão
              </span>
              <span className="block">Valores</span>
            </h1>
            
            <p className="text-white/80 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
              Os pilares que sustentam nossa atuação e impulsionam o comércio de Ipirá rumo ao futuro.
            </p>
          </div>

          {/* Contadores animados */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16">
            {diferenciais.map((item, index) => (
              <div 
                key={index}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 text-center">
                  {/* Ícone com anel pulsante */}
                  <div className="relative inline-flex mb-3 sm:mb-4">
                    <div className="absolute inset-0 bg-[#ffd000]/30 rounded-full animate-pulse-ring"></div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-[#ffd000] to-[#ffed4e] rounded-full flex items-center justify-center relative z-10">
                      <item.icon className="text-[#003f7f] text-xl sm:text-2xl" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1">
                    <AnimatedCounter end={parseInt(item.number)} suffix={item.number.includes('%') ? '%' : '+'} />
                  </div>
                  <div className="text-white/60 text-xs sm:text-sm font-medium uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Onda SVG melhorada */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 200L48 183.3C96 166.7 192 133.3 288 116.7C384 100 480 100 576 108.3C672 116.7 768 133.3 864 141.7C960 150 1056 150 1152 141.7C1248 133.3 1344 116.7 1392 108.3L1440 100V200H1392C1344 200 1248 200 1152 200C1056 200 960 200 864 200C768 200 672 200 576 200C480 200 384 200 288 200C192 200 96 200 48 200H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;



