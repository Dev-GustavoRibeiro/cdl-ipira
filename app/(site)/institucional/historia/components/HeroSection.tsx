'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHistory, FaUsers } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background com imagem e overlay */}
      <div className="absolute inset-0">
        <Image
          src="/cdl-ipira-sede.jpg"
          alt="Sede CDL Ipirá"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#003f7f]/95 via-[#003f7f]/80 to-[#003f7f]/60"></div>
        <div className="absolute inset-0 bg-linear-to-t from-[#003f7f] via-transparent to-transparent"></div>
      </div>

      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#ffd000]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#00a859]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-bold mb-8 border border-white/20">
            <FaHistory className="text-[#ffd000]" />
            <span>Nossa Trajetória</span>
          </div>
          
          {/* Título */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[0.9]">
            Uma História de
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#ffd000] via-[#ffed4e] to-[#ffd000]">
              Sucesso
            </span>
          </h1>
          
          <p className="text-white/80 text-lg sm:text-xl md:text-2xl max-w-2xl leading-relaxed mb-10">
            Mais de três décadas dedicadas ao fortalecimento do comércio de Ipirá e ao sucesso de cada associado.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/institucional/diretoria"
              className="inline-flex items-center justify-center gap-2 bg-[#ffd000] text-[#003f7f] px-8 py-4 rounded-full font-bold text-base hover:bg-white transition-all duration-300 hover:scale-105 shadow-xl group"
            >
              Conheça a Diretoria
              <FaUsers className="group-hover:scale-110 transition-transform" />
            </Link>
            <Link
              href="/institucional/missao-visao-valores"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-base border-2 border-white/30 hover:bg-white hover:text-[#003f7f] transition-all duration-300"
            >
              Missão e Valores
            </Link>
          </div>
        </div>
      </div>

      {/* Onda decorativa */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;



