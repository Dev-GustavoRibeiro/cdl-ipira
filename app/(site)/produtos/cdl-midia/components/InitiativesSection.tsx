'use client';

import React from 'react';
import { FaUsers, FaFileAlt, FaMicrophone, FaNewspaper } from 'react-icons/fa';

const initiatives = [
  {
    id: 1,
    title: 'CDL Conecta',
    icon: FaUsers,
    description: 'Conectando empresas e fortalecendo relacionamentos através de conteúdo estratégico e networking digital.',
    color: 'from-[#003f7f] to-[#0066cc]',
    iconBg: 'bg-[#003f7f]'
  },
  {
    id: 2,
    title: 'Minha Empresa Faz História',
    icon: FaFileAlt,
    description: 'Destaque a trajetória e os valores da sua empresa através de histórias inspiradoras e conteúdo relevante.',
    color: 'from-[#00a859] to-[#00d670]',
    iconBg: 'bg-[#00a859]'
  },
  {
    id: 3,
    title: 'CDL Cast',
    icon: FaMicrophone,
    description: 'Podcasts exclusivos com informações estratégicas, entrevistas e conteúdos que inspiram o empreendedorismo.',
    color: 'from-[#ffd000] to-[#ffed4e]',
    iconBg: 'bg-[#ffd000]'
  },
  {
    id: 4,
    title: 'CDL News',
    icon: FaNewspaper,
    description: 'Notícias, atualizações e informações relevantes sobre o mercado, economia e oportunidades de negócio.',
    color: 'from-[#ff6b6b] to-[#ff8787]',
    iconBg: 'bg-[#ff6b6b]'
  }
];

const InitiativesSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-[#003f7f] mb-4">
            Nossas Iniciativas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Projetos exclusivos que geram visibilidade e reconhecimento para sua empresa
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {initiatives.map((initiative) => {
            const IconComponent = initiative.icon;
            return (
              <div
                key={initiative.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100"
              >
                <div className={`bg-linear-to-br ${initiative.color} p-6 text-white`}>
                  <div className={`${initiative.iconBg} w-14 h-14 rounded-full flex items-center justify-center mb-4`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black mb-2">{initiative.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed">{initiative.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InitiativesSection;



