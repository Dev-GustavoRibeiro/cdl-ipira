'use client';

import React from 'react';
import { FaCheckCircle, FaInfoCircle, FaUsers, FaArrowRight } from 'react-icons/fa';
import { features } from './FeaturesData';

const FeatureDetails = () => {
  return (
    <>
      {features.map((feature) => {
        const IconComponent = feature.icon;
        return (
          <section
            key={feature.id}
            id={`detalhes-${feature.id}`}
            className={`py-16 ${feature.id % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                {/* Header da Seção */}
                <div className="text-center mb-12">
                  <div className={`inline-block bg-linear-to-br ${feature.color} text-white px-6 py-3 rounded-full text-sm font-black mb-6 shadow-lg`}>
                    {feature.title}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-[#003f7f] mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                    {feature.description}
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Benefícios */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <FaCheckCircle className={`w-6 h-6 ${feature.iconBg} text-white p-2 rounded-lg`} />
                      <h3 className="text-2xl font-bold text-gray-900">Benefícios</h3>
                    </div>
                    <ul className="space-y-4">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <FaCheckCircle className={`w-5 h-5 ${feature.iconBg} text-white rounded-full flex-shrink-0 mt-0.5`} />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Como Funciona */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <FaInfoCircle className={`w-6 h-6 ${feature.iconBg} text-white p-2 rounded-lg`} />
                      <h3 className="text-2xl font-bold text-gray-900">Como Funciona</h3>
                    </div>
                    <ol className="space-y-4">
                      {feature.howItWorks.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className={`${feature.iconBg} text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
                            {index + 1}
                          </span>
                          <span className="text-gray-700 pt-1">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Casos de Uso */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <FaUsers className={`w-6 h-6 ${feature.iconBg} text-white p-2 rounded-lg`} />
                    <h3 className="text-2xl font-bold text-gray-900">Para Quem é Indicado</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {feature.useCases.map((useCase, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <FaArrowRight className={`w-5 h-5 ${feature.iconBg} text-white rounded-full p-1 flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                  <div className={`bg-linear-to-br ${feature.color} rounded-2xl p-8 text-white shadow-2xl`}>
                    <h3 className="text-2xl font-black mb-4">Pronto para começar?</h3>
                    <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                      Acesse o {feature.title} agora mesmo e aproveite todos os benefícios.
                    </p>
                    <a
                      href="https://www.spcbrasil.org.br"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-white text-[#003f7f] px-8 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      Acessar {feature.title}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
};

export default FeatureDetails;



