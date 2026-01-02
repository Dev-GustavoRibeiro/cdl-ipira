'use client';

import React from 'react';
import { FaBullhorn, FaChartLine, FaUsers, FaVideo } from 'react-icons/fa';

const benefits = [
  {
    icon: FaBullhorn,
    title: 'Visibilidade',
    description: 'Sua empresa sempre em destaque nas redes sociais da CDL'
  },
  {
    icon: FaChartLine,
    title: 'Reconhecimento',
    description: 'Fortaleça a imagem e a credibilidade do seu negócio'
  },
  {
    icon: FaUsers,
    title: 'Comunidade',
    description: 'Conecte-se com outros empresários e potenciais clientes'
  },
  {
    icon: FaVideo,
    title: 'Conteúdo Exclusivo',
    description: 'Vídeos de boas-vindas, podcasts e histórias inspiradoras'
  }
];

const BenefitsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-[#003f7f] mb-4">
            Benefícios para sua Empresa
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vantagens que fazem a diferença na visibilidade do seu negócio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center border-2 border-gray-100"
              >
                <div className="bg-[#003f7f] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;



