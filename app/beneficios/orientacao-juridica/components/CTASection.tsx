import React from 'react';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

const CTASection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-blur-fade-in">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black mb-4 sm:mb-6">
            Precisa de Ajuda Imediata?
          </h2>
          <p className="text-white/90 text-sm sm:text-base mb-6 sm:mb-8 text-justify">
            Entre em contato conosco através dos canais abaixo para atendimento rápido.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <a
              href="tel:+5575999999999"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#003f7f] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-[#ffd000] hover:text-[#003f7f] transition-all duration-300 hover:scale-105 shadow-xl group"
            >
              <FaPhone className="w-4 h-4 sm:w-5 sm:h-5" />
              Ligar Agora
            </a>
            <a
              href="mailto:juridico@cdlipira.com.br"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-white hover:text-[#003f7f] transition-all duration-300 group"
            >
              <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5" />
              Enviar E-mail
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;



