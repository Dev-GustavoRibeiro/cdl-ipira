'use client';

import React from 'react';
import { FaShieldAlt, FaFileSignature, FaLock, FaVideo } from 'react-icons/fa';

const benefits = [
  {
    icon: FaShieldAlt,
    title: 'Segurança Total',
    description: 'Proteção garantida com criptografia de alto nível e validade jurídica'
  },
  {
    icon: FaFileSignature,
    title: 'Assinatura Digital',
    description: 'Assine documentos online com a mesma validade de uma assinatura física'
  },
  {
    icon: FaLock,
    title: 'Autenticidade',
    description: 'Garante a identidade do signatário e a integridade dos documentos'
  },
  {
    icon: FaVideo,
    title: 'Atendimento Online',
    description: 'Emissão por videoconferência, sem sair de casa ou do escritório'
  }
];

const BenefitsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-[#003f7f] mb-4">
            Por que escolher o Certificado Digital?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vantagens que fazem a diferença no seu dia a dia
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
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



