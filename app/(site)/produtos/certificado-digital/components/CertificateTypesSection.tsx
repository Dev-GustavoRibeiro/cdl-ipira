'use client';

import React from 'react';
import { FaCheckCircle, FaBuilding, FaGavel, FaUserMd } from 'react-icons/fa';

const certificateTypes = [
  {
    id: 1,
    title: 'Pessoa Física e Jurídica',
    icon: FaBuilding,
    description: 'Certificado digital ICP-Brasil para pessoas físicas e jurídicas. Ideal para realizar transações online, assinar documentos e acessar serviços governamentais com total segurança.',
    features: [
      'Assinatura digital de documentos',
      'Acesso a serviços governamentais',
      'Transações bancárias online',
      'Declaração de Imposto de Renda',
      'Validade jurídica garantida'
    ],
    color: 'from-[#003f7f] to-[#0066cc]',
    iconBg: 'bg-[#003f7f]'
  },
  {
    id: 2,
    title: 'e-Jurídico',
    icon: FaGavel,
    description: 'Certificado digital exclusivo para advogados. Permite assinar petições, acessar sistemas do Poder Judiciário e realizar atos processuais com validade jurídica.',
    features: [
      'Assinatura de petições digitais',
      'Acesso ao PJe (Processo Judicial Eletrônico)',
      'Validade jurídica em processos',
      'Agilidade em atos processuais',
      'Conformidade com normas do CNJ'
    ],
    color: 'from-[#00a859] to-[#00d670]',
    iconBg: 'bg-[#00a859]'
  },
  {
    id: 3,
    title: 'e-Saúde',
    icon: FaUserMd,
    description: 'Certificado digital ideal para médicos, enfermeiros e profissionais da saúde. Permite assinar receitas digitais, prontuários eletrônicos e documentos médicos com segurança.',
    features: [
      'Assinatura de receitas digitais',
      'Prontuários eletrônicos',
      'Prescrições médicas digitais',
      'Conformidade com normas da ANVISA',
      'Validade legal em documentos médicos'
    ],
    color: 'from-[#ffd000] to-[#ffed4e]',
    iconBg: 'bg-[#ffd000]'
  }
];

const CertificateTypesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-[#003f7f] mb-4">
            Tipos de Certificado Digital
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Escolha o certificado ideal para suas necessidades
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {certificateTypes.map((cert) => {
            const IconComponent = cert.icon;
            return (
              <div
                key={cert.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100"
              >
                <div className={`bg-linear-to-br ${cert.color} p-8 text-white`}>
                  <div className={`${cert.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">{cert.title}</h3>
                  <p className="text-white/90 leading-relaxed">{cert.description}</p>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Principais funcionalidades:</h4>
                  <ul className="space-y-3">
                    {cert.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FaCheckCircle className={`w-5 h-5 ${cert.iconBg} text-white rounded-full flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CertificateTypesSection;



