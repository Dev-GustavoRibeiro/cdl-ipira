'use client';

import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const platforms = [
  {
    name: 'Facebook',
    icon: FaFacebook,
    color: '#1877F2',
    description: 'Conteúdo exclusivo, eventos e interação com a comunidade empresarial'
  },
  {
    name: 'Instagram',
    icon: FaInstagram,
    color: '#E4405F',
    description: 'Stories, reels e posts visuais que destacam sua empresa'
  },
  {
    name: 'YouTube',
    icon: FaYoutube,
    color: '#FF0000',
    description: 'Vídeos institucionais, entrevistas e conteúdo educativo'
  }
];

const PlatformsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-[#003f7f] mb-4">
            Nossas Plataformas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos presentes nas principais redes sociais para dar visibilidade à sua empresa
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {platforms.map((platform, index) => {
            const IconComponent = platform.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100 text-center"
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: platform.color }}
                >
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{platform.name}</h3>
                <p className="text-gray-600 leading-relaxed">{platform.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlatformsSection;



