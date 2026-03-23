'use client';

import React from 'react';
import { FaCheckCircle, FaShieldAlt, FaLock, FaCertificate, FaPhone } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Coluna Esquerda - Banner Visual */}
          <div className="relative bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#00a859] rounded-3xl overflow-hidden shadow-2xl min-h-[500px] flex flex-col justify-between p-8 lg:p-12">
            {/* Elementos Decorativos */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
              <div className="absolute bottom-20 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>

            {/* Ícones Digitais */}
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <FaShieldAlt className="w-8 h-8 text-white" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <FaLock className="w-8 h-8 text-white" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <FaCertificate className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6 leading-tight">
                CERTIFICADO
                <span className="block text-[#ffd000]">DIGITAL</span>
              </h1>
              <p className="text-white text-lg lg:text-xl mb-6 leading-relaxed">
                Realize transações online e troca de documentos virtuais com segurança!
              </p>
              <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                Oferecemos certificados digitais ICP-Brasil destinados à pessoa física e pessoa jurídica, 
                e-jurídica destinado a advogados, e-saúde para enfermeiros e médicos de acordo com a 
                necessidade de cada cliente.
              </p>
            </div>

            {/* Logo CDL no rodapé do banner */}
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-6">
              <p className="text-white font-bold text-sm">CDL Ipirá</p>
            </div>
          </div>

          {/* Coluna Direita - Informações Textuais */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-[#003f7f] mb-6">
                Certificado Digital - Segurança e praticidade na palma da sua mão
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                O Certificado Digital é um documento eletrônico que funciona como uma identidade virtual, 
                garantindo validade jurídica e total segurança em transações online. Ele é essencial para 
                quem busca agilidade, autenticidade e proteção nas atividades digitais.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Na CDL Ipirá, você encontra certificados digitais da ICP-Brasil, com opções pensadas para 
                diferentes perfis e necessidades:
              </p>
            </div>

            {/* Lista de Tipos */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <FaCheckCircle className="w-6 h-6 text-[#00a859] flex-shrink-0 mt-1" />
                <span className="text-gray-700 text-lg">
                  <strong className="text-[#003f7f]">Pessoa Física e Jurídica</strong> - Certificado ICP-Brasil para uso geral
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="w-6 h-6 text-[#00a859] flex-shrink-0 mt-1" />
                <span className="text-gray-700 text-lg">
                  <strong className="text-[#003f7f]">e-Jurídico</strong> - Exclusivo para advogados
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="w-6 h-6 text-[#00a859] flex-shrink-0 mt-1" />
                <span className="text-gray-700 text-lg">
                  <strong className="text-[#003f7f]">e-Saúde</strong> - Ideal para médicos, enfermeiros e profissionais da saúde
                </span>
              </li>
            </ul>

            <div className="bg-[#003f7f]/5 rounded-xl p-6 border-l-4 border-[#003f7f]">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Tudo com atendimento ágil, prático e seguro — inclusive por videoconferência, para sua 
                maior comodidade, emita seu certificado de onde estiver.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Simplifique sua rotina com tecnologia, confiança e credibilidade.
              </p>
            </div>

            {/* CTA e Contato */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#003f7f]/10">
              <p className="text-gray-800 font-semibold text-lg mb-4">
                Quer saber mais? Entre em contato conosco.
              </p>
              <a
                href="tel:557532541599"
                className="flex items-center gap-3 text-[#003f7f] font-bold text-lg hover:text-[#0066cc] transition-colors"
              >
                <div className="bg-[#003f7f] text-white p-3 rounded-lg">
                  <FaPhone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Central de Atendimento CDL Ipirá</p>
                  <p className="text-xl">(75) 3254-1599</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



