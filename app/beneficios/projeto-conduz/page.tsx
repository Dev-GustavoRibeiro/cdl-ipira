import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FaMusic, FaDrum, FaGuitar, FaChild, FaGraduationCap, FaHeart, FaUsers, FaCalendarAlt } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Projeto Conduz - CDL Ipirá',
  description: 'Projeto Conduz: Aulas gratuitas de Violão, Cajon, Ukulele, Capoeira, Yoga, Judô e Palestras Educacionais para crianças e adolescentes.',
};

export default function ProjetoConduzPage() {
  const activities = [
    {
      id: 1,
      title: 'Violão',
      icon: <FaGuitar className="w-8 h-8 sm:w-10 sm:h-10" />,
      description: 'Aulas de violão para iniciantes e intermediários, desenvolvendo habilidades musicais e expressão artística.',
      color: 'from-[#003f7f] to-[#0066cc]'
    },
    {
      id: 2,
      title: 'Cajon',
      icon: <FaDrum className="w-8 h-8 sm:w-10 sm:h-10" />,
      description: 'Aprenda a tocar cajon, instrumento de percussão que desenvolve ritmo e coordenação motora.',
      color: 'from-[#00a859] to-[#00d670]'
    },
    {
      id: 3,
      title: 'Ukulele',
      icon: <FaMusic className="w-8 h-8 sm:w-10 sm:h-10" />,
      description: 'Aulas de ukulele, instrumento havaiano que proporciona aprendizado musical de forma divertida e acessível.',
      color: 'from-[#ffd000] to-[#ffed4e]'
    },
    {
      id: 4,
      title: 'Capoeira',
      icon: <FaChild className="w-8 h-8 sm:w-10 sm:h-10" />,
      description: 'Arte marcial brasileira que combina luta, dança e música, desenvolvendo coordenação, flexibilidade e cultura.',
      color: 'from-[#003f7f] to-[#0066cc]'
    },
    {
      id: 5,
      title: 'Yoga',
      icon: <FaHeart className="w-8 h-8 sm:w-10 sm:h-10" />,
      description: 'Práticas de yoga para crianças e adolescentes, promovendo bem-estar físico e mental, concentração e equilíbrio.',
      color: 'from-[#00a859] to-[#00d670]'
    },
    {
      id: 6,
      title: 'Judô',
      icon: <FaUsers className="w-8 h-8 sm:w-10 sm:h-10" />,
      description: 'Arte marcial que desenvolve disciplina, respeito, coordenação motora e autoconfiança.',
      color: 'from-[#ffd000] to-[#ffed4e]'
    },
    {
      id: 7,
      title: 'Palestras Educacionais',
      icon: <FaGraduationCap className="w-8 h-8 sm:w-10 sm:h-10" />,
      description: 'Palestras sobre temas importantes como educação, cidadania, valores e desenvolvimento pessoal.',
      color: 'from-[#003f7f] to-[#0066cc]'
    },
  ];

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-[#003f7f] text-white py-2.5 sm:py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm" aria-label="Breadcrumb">
            <Link 
              href="/" 
              className="hover:text-[#ffd000] transition-colors flex items-center gap-1 group"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-[-2px] transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Início</span>
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-semibold">Projeto Conduz</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-blur-fade-in">
            <div className="inline-block bg-[#ffd000] text-[#003f7f] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
              🎵 Projeto Social
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4 leading-tight drop-shadow-2xl">
              Projeto Conduz
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-white/90">
              Construindo um futuro melhor!
            </p>
            <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#ffd000] via-white to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto px-4 text-justify">
              Aulas gratuitas de Violão, Cajon, Ukulele, Capoeira, Yoga, Judô e Palestras Educacionais para crianças e adolescentes a partir de 8 anos.
            </p>
          </div>
        </div>
      </section>

      {/* Sobre o Projeto */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
                Sobre o Projeto
              </h2>
              <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
            </div>

            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-gray-700 leading-relaxed text-justify">
              <p className="text-sm xs:text-base sm:text-lg">
                O <strong className="text-[#003f7f] font-bold">Projeto Conduz</strong> é uma iniciativa social da CDL Ipirá que oferece atividades educacionais, culturais e esportivas gratuitas para crianças e adolescentes da nossa comunidade.
              </p>

              <p className="text-sm xs:text-base sm:text-lg">
                Com o objetivo de promover o desenvolvimento integral dos jovens, o projeto oferece diversas modalidades que estimulam a criatividade, a disciplina, o trabalho em equipe e a formação de valores positivos.
              </p>

              <p className="text-sm xs:text-base sm:text-lg">
                Todas as atividades são ministradas por profissionais qualificados e são totalmente gratuitas para os participantes, representando um investimento da CDL Ipirá no futuro da nossa cidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Atividades */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
              Atividades Oferecidas
            </h2>
            <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br ${activity.color} rounded-full flex items-center justify-center mb-4 sm:mb-6 text-white group-hover:scale-110 transition-transform`}>
                  {activity.icon}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#003f7f] mb-2 sm:mb-3">
                  {activity.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Informações de Inscrição */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 text-white shadow-2xl">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black mb-3 sm:mb-4">
                  Como Participar
                </h2>
                <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#ffd000] via-white to-[#ffd000] rounded-full mx-auto"></div>
              </div>

              <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#ffd000] rounded-full flex items-center justify-center shrink-0 text-[#003f7f] font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold mb-1">
                      Idade Mínima
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 text-justify">
                      O projeto é destinado a crianças e adolescentes a partir de 8 anos de idade.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#ffd000] rounded-full flex items-center justify-center shrink-0 text-[#003f7f] font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold mb-1">
                      Inscrições
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 text-justify">
                      As inscrições podem ser feitas na sede da CDL Ipirá ou através do formulário de contato.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#ffd000] rounded-full flex items-center justify-center shrink-0 text-[#003f7f] font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold mb-1">
                      Documentos Necessários
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 text-justify">
                      RG ou certidão de nascimento do participante e comprovante de residência.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#ffd000] rounded-full flex items-center justify-center shrink-0 text-[#003f7f] font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold mb-1">
                      Gratuito
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 text-justify">
                      Todas as atividades são totalmente gratuitas, sem custos para os participantes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/contato"
                  className="inline-flex items-center justify-center gap-2 bg-[#ffd000] text-[#003f7f] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-[#ffed4e] transition-all duration-300 hover:scale-105 shadow-xl text-sm sm:text-base group"
                >
                  Fazer Inscrição
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/contato"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-white hover:text-[#003f7f] transition-all duration-300 text-sm sm:text-base"
                >
                  Entre em Contato
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horários */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
                Horários e Localização
              </h2>
              <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00a859] rounded-full flex items-center justify-center shrink-0">
                    <FaCalendarAlt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-2">
                      Horários
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 text-justify">
                      As aulas são realizadas em horários específicos para cada modalidade. Entre em contato para conhecer os horários disponíveis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#003f7f] rounded-full flex items-center justify-center shrink-0">
                    <FaUsers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-2">
                      Localização
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 text-justify">
                      As atividades são realizadas na sede da CDL Ipirá ou em espaços parceiros da comunidade.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}





