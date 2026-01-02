import React from 'react';
import { FaCheckCircle, FaUsers, FaClock, FaShieldAlt } from 'react-icons/fa';

const BenefitsSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
              Por que escolher nossa Orientação Jurídica?
            </h2>
            <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00a859] rounded-full flex items-center justify-center shrink-0">
                  <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-2">
                    Gratuito para Associados
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-justify">
                    Serviço totalmente gratuito para associados em dia com suas obrigações.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#003f7f] rounded-full flex items-center justify-center shrink-0">
                  <FaUsers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-2">
                    Profissionais Qualificados
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-justify">
                    Equipe de advogados especializados em direito comercial e empresarial.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ffd000] rounded-full flex items-center justify-center shrink-0">
                  <FaClock className="w-5 h-5 sm:w-6 sm:h-6 text-[#003f7f]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-2">
                    Atendimento Rápido
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-justify">
                    Respostas ágeis para suas dúvidas jurídicas, sem burocracia.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00a859] rounded-full flex items-center justify-center shrink-0">
                  <FaShieldAlt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-2">
                    Proteção do Seu Negócio
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-justify">
                    Orientações para proteger seus direitos e evitar problemas jurídicos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;



