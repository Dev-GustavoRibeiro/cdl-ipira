'use client';

import React from 'react';

const steps = [
  { step: 1, title: 'Contato', desc: 'Entre em contato com a CDL Ipirá' },
  { step: 2, title: 'Documentação', desc: 'Envie os documentos necessários' },
  { step: 3, title: 'Videoconferência', desc: 'Realize a validação por vídeo' },
  { step: 4, title: 'Emissão', desc: 'Receba seu certificado digital' }
];

const EmissionProcessSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#003f7f] mb-4">
              Como Emitir seu Certificado Digital
            </h2>
            <p className="text-xl text-gray-600">
              Processo simples, rápido e seguro
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-[#003f7f] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmissionProcessSection;



