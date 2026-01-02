'use client';

import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { features } from './FeaturesData';

const FeaturesCards = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                id={feature.id === 1 ? 'spc-avisa' : feature.id === 2 ? 'spc-conciliador' : 'cadastro-positivo'}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100"
              >
                <div className={`bg-linear-to-br ${feature.color} p-8 text-white`}>
                  <div className={`${feature.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                  <p className="text-white/90 leading-relaxed">{feature.description}</p>
                </div>
                <div className="p-6">
                  <a
                    href={`#detalhes-${feature.id}`}
                    className="inline-flex items-center gap-2 text-[#003f7f] font-bold hover:gap-4 transition-all"
                  >
                    <span>Saiba mais</span>
                    <FaArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesCards;



