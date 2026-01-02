import React from 'react';
import { FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const InfoCardsSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-[#003f7f] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPhone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Atendimento Rápido</h3>
            <p className="text-gray-600">
              Nossa equipe está pronta para atender você de segunda a sábado.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-[#00a859] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaWhatsapp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-gray-600">
              Fale conosco pelo WhatsApp e receba respostas rápidas e diretas.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-[#ffd000] text-[#003f7f] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">E-mail</h3>
            <p className="text-gray-600">
              Envie sua mensagem por e-mail e responderemos em até 24 horas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoCardsSection;



