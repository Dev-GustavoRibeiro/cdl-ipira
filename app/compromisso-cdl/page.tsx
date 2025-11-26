import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FaFileAlt, FaHandshake, FaHeart, FaShieldAlt, FaUsers, FaCheckCircle } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Compromisso da CDL - CDL Ipirá',
  description: 'Conheça o compromisso da CDL Ipirá com o desenvolvimento do comércio local e o fortalecimento dos associados.',
};

export default function CompromissoCDLPage() {
  const commitments = [
    {
      id: 1,
      title: 'Representatividade',
      description: 'Defendemos os interesses do comércio local junto aos poderes públicos e entidades representativas.',
      icon: <FaUsers className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-[#003f7f] to-[#0066cc]'
    },
    {
      id: 2,
      title: 'Fortalecimento',
      description: 'Oferecemos serviços e ferramentas que fortalecem os negócios dos nossos associados.',
      icon: <FaShieldAlt className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-[#00a859] to-[#00d670]'
    },
    {
      id: 3,
      title: 'Desenvolvimento',
      description: 'Promovemos o desenvolvimento econômico e social de Ipirá e região.',
      icon: <FaHandshake className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-[#ffd000] to-[#ffed4e]'
    },
    {
      id: 4,
      title: 'Compromisso Social',
      description: 'Desenvolvemos projetos sociais que beneficiam a comunidade local.',
      icon: <FaHeart className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-[#003f7f] to-[#0066cc]'
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
            <span className="text-white font-semibold">Compromisso da CDL</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <div className="inline-block bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
              🤝 Nosso Compromisso
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-3 sm:mb-4 leading-tight">
              Compromisso da CDL
            </h1>
            <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4 text-justify">
              A CDL Ipirá tem o compromisso de representar, fortalecer e desenvolver o comércio local, sempre em busca do crescimento sustentável dos nossos associados e da comunidade.
            </p>
          </div>
        </div>
      </section>

      {/* Compromissos */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
              Nossos Compromissos
            </h2>
            <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {commitments.map((commitment, index) => (
              <div
                key={commitment.id}
                className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br ${commitment.color} rounded-full flex items-center justify-center mb-4 sm:mb-6 text-white group-hover:scale-110 transition-transform`}>
                  {commitment.icon}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#003f7f] mb-2 sm:mb-3">
                  {commitment.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
                  {commitment.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Texto Principal */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg">
              <div className="space-y-4 sm:space-y-5 md:space-y-6 text-gray-700 leading-relaxed text-justify">
                <p className="text-sm xs:text-base sm:text-lg">
                  A <strong className="text-[#003f7f] font-bold">CDL Ipirá</strong> tem como compromisso fundamental representar, defender e fortalecer os interesses do comércio local, sempre trabalhando em prol do desenvolvimento econômico e social de nossa cidade.
                </p>

                <p className="text-sm xs:text-base sm:text-lg">
                  Nossa missão é oferecer serviços de excelência que contribuam para o crescimento e sucesso dos nossos associados, proporcionando ferramentas, orientações e suporte necessário para que possam prosperar em seus negócios.
                </p>

                <p className="text-sm xs:text-base sm:text-lg">
                  Além disso, a CDL Ipirá desenvolve projetos sociais que beneficiam toda a comunidade, demonstrando nosso compromisso não apenas com o comércio, mas também com o bem-estar social e o desenvolvimento integral de Ipirá.
                </p>

                <p className="text-sm xs:text-base sm:text-lg">
                  Estamos comprometidos em ser uma instituição transparente, ética e eficiente, sempre buscando inovações e melhorias que agreguem valor aos nossos associados e à comunidade como um todo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}





