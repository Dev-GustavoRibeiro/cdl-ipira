'use client';

import React from 'react';
import { FaEnvelope, FaFileAlt, FaVideo, FaPhone } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Coluna Esquerda - Banner Visual */}
          <div className="relative bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#00a859] rounded-3xl overflow-hidden shadow-2xl min-h-[500px] flex flex-col justify-between p-8 lg:p-12">
            {/* Elementos Decorativos */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
              <div className="absolute bottom-20 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>

            {/* Ícone de Mídia */}
            <div className="relative z-10">
              <div className="bg-[#ffd000] rounded-xl p-4 inline-flex items-center gap-3 mb-6">
                <FaEnvelope className="w-6 h-6 text-[#003f7f]" />
                <FaFileAlt className="w-6 h-6 text-[#003f7f]" />
                <FaVideo className="w-6 h-6 text-[#003f7f]" />
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6 leading-tight">
                CDL MÍDIA
              </h1>
              <p className="text-white text-lg lg:text-xl mb-6 leading-relaxed font-semibold">
                Sua empresa sempre na vitrine!
              </p>
              <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                A CDL Ipirá está presente no Facebook, Instagram e YouTube, oferecendo canais 
                exclusivos que dão voz e protagonismo à sua empresa.
              </p>
            </div>

            {/* Logo CDL no rodapé do banner */}
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-6">
              <p className="text-white font-bold text-sm">CDL Ipirá</p>
            </div>
          </div>

          {/* Coluna Direita - Informações Textuais */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-[#003f7f] mb-6">
                CDL Mídia
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                A CDL Ipirá está presente no Facebook, Instagram e YouTube, oferecendo canais 
                exclusivos que dão voz e protagonismo aos seus associados.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Iniciativas como <strong className="text-[#003f7f]">CDL Conecta</strong>, 
                <strong className="text-[#003f7f]"> Minha Empresa Faz História</strong>, 
                <strong className="text-[#003f7f]"> CDL Cast</strong> e 
                <strong className="text-[#003f7f]"> CDL News</strong> geram visibilidade, 
                reconhecimento e fortalecem a imagem dos negócios.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Desde vídeos de boas-vindas até podcasts, compartilhamos informações estratégicas, 
                incentivamos o empreendedorismo e contribuímos para o crescimento econômico. 
                Histórias inspiradoras que fortalecem os laços da comunidade com credibilidade, 
                relevância e valor.
              </p>
            </div>

            {/* CTA e Contato */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#003f7f]/10">
              <p className="text-gray-800 font-semibold text-lg mb-4">
                Quer destacar sua empresa? Entre em contato conosco.
              </p>
              <a
                href="tel:557532541599"
                className="flex items-center gap-3 text-[#003f7f] font-bold text-lg hover:text-[#0066cc] transition-colors"
              >
                <div className="bg-[#003f7f] text-white p-3 rounded-lg">
                  <FaPhone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Central de Atendimento CDL Ipirá</p>
                  <p className="text-xl">(75) 3254-1599</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



