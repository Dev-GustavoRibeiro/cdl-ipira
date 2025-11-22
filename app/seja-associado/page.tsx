import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FaCheckCircle, FaShieldAlt, FaGavel, FaCertificate, FaUsers, FaHandshake } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Seja um Associado - CDL Ipirá',
  description: 'Faça parte da maior rede de empresários. Associe-se à CDL Ipirá e tenha acesso a benefícios exclusivos.',
};

export default function SejaAssociadoPage() {
  const benefits = [
    {
      id: 1,
      title: 'Consultas SPC Ilimitadas',
      description: 'Acesso ilimitado a consultas de CPF e CNPJ para proteger seu negócio.',
      icon: <FaShieldAlt className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-[#003f7f] to-[#0066cc]'
    },
    {
      id: 2,
      title: 'Orientação Jurídica',
      description: 'Assessoria jurídica gratuita para questões trabalhistas, tributárias e comerciais.',
      icon: <FaGavel className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-[#00a859] to-[#00d670]'
    },
    {
      id: 3,
      title: 'Certificado Digital',
      description: 'Acesso facilitado a certificado digital com condições especiais.',
      icon: <FaCertificate className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-[#ffd000] to-[#ffed4e]'
    },
    {
      id: 4,
      title: 'Networking',
      description: 'Participe de eventos, reuniões e encontros para expandir sua rede de contatos.',
      icon: <FaUsers className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-[#003f7f] to-[#0066cc]'
    },
    {
      id: 5,
      title: 'Cursos e Capacitações',
      description: 'Acesso a cursos, workshops e palestras para desenvolvimento profissional.',
      icon: <FaHandshake className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-[#00a859] to-[#00d670]'
    },
    {
      id: 6,
      title: 'Representatividade',
      description: 'Sua voz representada junto aos poderes públicos e entidades.',
      icon: <FaCheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-[#ffd000] to-[#ffed4e]'
    },
  ];

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
            <span className="text-white font-semibold">Seja um Associado</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-[#00a859] via-[#00c46a] to-[#00d670] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <div className="inline-block bg-[#ffd000] text-[#003f7f] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
              🤝 Associação
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4 leading-tight drop-shadow-2xl">
              Seja um Associado
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-white/90">
              Faça parte da maior rede de empresários
            </p>
            <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#ffd000] via-white to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto px-4 text-justify">
              Tenha acesso a consultas SPC ilimitadas, assessoria jurídica, certificado digital e muito mais! Invista no crescimento do seu negócio.
            </p>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
              Benefícios Exclusivos
            </h2>
            <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.id}
                className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br ${benefit.color} rounded-full flex items-center justify-center mb-4 sm:mb-6 text-white group-hover:scale-110 transition-transform`}>
                  {benefit.icon}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#003f7f] mb-2 sm:mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-blur-fade-in">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black mb-4 sm:mb-6">
              Associe-se Agora
            </h2>
            <p className="text-white/90 text-sm sm:text-base mb-6 sm:mb-8 text-justify">
              Preencha o formulário de filiação e nossa equipe entrará em contato para finalizar sua associação.
            </p>
            <a
              href="https://app.higestor.com.br/inscricao/empresa/cdl-ipira"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#ffd000] text-[#003f7f] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-[#ffed4e] transition-all duration-300 hover:scale-105 shadow-xl text-sm sm:text-base group"
            >
              Fazer Inscrição
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




