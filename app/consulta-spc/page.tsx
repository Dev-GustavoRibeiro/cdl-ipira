import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FaShieldAlt, FaSearch, FaCheckCircle, FaLock, FaClock, FaUsers } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Consulta SPC Brasil - CDL Ipirá',
  description: 'Consulte CPF e CNPJ de forma rápida e segura. Proteja seu negócio com o SPC Brasil.',
};

export default function ConsultaSPCPage() {
  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-[#003f7f] text-white py-2.5 sm:py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffd000] transition-colors flex items-center gap-1 group">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-[-2px] transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Início</span>
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-semibold">Consulta SPC Brasil</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-[#ffd000] via-[#ffda33] to-[#ffed4e] text-[#003f7f] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#003f7f] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#003f7f] rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <div className="inline-block bg-[#003f7f] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
              🛡️ SPC Brasil
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4 leading-tight">
              Consulta SPC Brasil
            </h1>
            <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Proteção e segurança para seu negócio
            </p>
            <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#003f7f] rounded-full mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4 text-justify">
              Consulte CPF e CNPJ de forma rápida e segura. Tome decisões de crédito com confiança e proteja sua empresa contra inadimplência.
            </p>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
                Por que usar o SPC Brasil?
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
                      Consultas Ilimitadas
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 text-justify">
                      Associados têm acesso a consultas ilimitadas de CPF e CNPJ.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#003f7f] rounded-full flex items-center justify-center shrink-0">
                    <FaClock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-2">
                      Respostas Rápidas
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 text-justify">
                      Obtenha informações em tempo real sobre a situação cadastral.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ffd000] rounded-full flex items-center justify-center shrink-0">
                    <FaLock className="w-5 h-5 sm:w-6 sm:h-6 text-[#003f7f]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-2">
                      Segurança Total
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 text-justify">
                      Dados protegidos e consultas realizadas de forma segura e confidencial.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00a859] rounded-full flex items-center justify-center shrink-0">
                    <FaUsers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-2">
                      Redução de Inadimplência
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 text-justify">
                      Tome decisões de crédito informadas e reduza riscos de inadimplência.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-blur-fade-in">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black mb-4 sm:mb-6">
              Acesse o Portal do Associado
            </h2>
            <p className="text-white/90 text-sm sm:text-base mb-6 sm:mb-8 text-justify">
              Para realizar consultas SPC Brasil, acesse o Portal do Associado com suas credenciais.
            </p>
            <a
              href="https://app.higestor.com.br/portal/cdl-ipira"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#ffd000] text-[#003f7f] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-[#ffed4e] transition-all duration-300 hover:scale-105 shadow-xl text-sm sm:text-base group"
            >
              <FaSearch className="w-5 h-5 sm:w-6 sm:h-6" />
              Acessar Portal
              <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}




