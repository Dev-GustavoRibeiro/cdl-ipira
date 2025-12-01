'use client';

import React from 'react';
import Image from 'next/image';
import { FaShieldAlt, FaBell, FaHandshake, FaChartLine, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaArrowRight, FaUsers, FaFileAlt, FaCreditCard } from 'react-icons/fa';

const SPCBrasilPage = () => {
  const features = [
    {
      id: 1,
      title: 'SPC AVISA',
      icon: FaBell,
      color: 'from-[#003f7f] to-[#0066cc]',
      iconBg: 'bg-[#003f7f]',
      description: 'Sistema de alertas que notifica sobre consultas e movimentações de CPF/CNPJ em tempo real.',
      benefits: [
        'Alertas em tempo real sobre consultas ao seu CPF/CNPJ',
        'Monitoramento 24/7 de movimentações financeiras',
        'Proteção contra fraudes e uso indevido de dados',
        'Notificações por e-mail e SMS',
        'Histórico completo de consultas realizadas'
      ],
      howItWorks: [
        'Cadastre-se no SPC AVISA gratuitamente',
        'Receba alertas instantâneos quando seu CPF/CNPJ for consultado',
        'Acompanhe todas as movimentações em um painel exclusivo',
        'Tome decisões rápidas com informações em tempo real'
      ],
      useCases: [
        'Empresários que querem monitorar consultas ao CNPJ',
        'Pessoas físicas preocupadas com segurança de dados',
        'Empresas que precisam rastrear consultas de clientes',
        'Profissionais que desejam proteger sua reputação creditícia'
      ]
    },
    {
      id: 2,
      title: 'SPC CONCILIADOR',
      icon: FaHandshake,
      color: 'from-[#00a859] to-[#00d670]',
      iconBg: 'bg-[#00a859]',
      description: 'Plataforma que facilita a negociação e conciliação de dívidas entre empresas e consumidores.',
      benefits: [
        'Negocie dívidas de forma rápida e segura',
        'Descontos especiais para quitação antecipada',
        'Parcelamento facilitado sem burocracia',
        'Ambiente seguro e confiável para negociações',
        'Histórico de negociações disponível online'
      ],
      howItWorks: [
        'Acesse o portal SPC CONCILIADOR',
        'Consulte suas dívidas registradas',
        'Negocie condições especiais diretamente online',
        'Efetue o pagamento e regularize sua situação'
      ],
      useCases: [
        'Consumidores que desejam quitar dívidas antigas',
        'Empresas que querem recuperar créditos',
        'Pessoas que buscam descontos na negociação',
        'Quem precisa regularizar o nome para obter crédito'
      ]
    },
    {
      id: 3,
      title: 'CADASTRO POSITIVO',
      icon: FaChartLine,
      color: 'from-[#ffd000] to-[#ffed4e]',
      iconBg: 'bg-[#ffd000]',
      description: 'Sistema que registra seu histórico positivo de pagamentos, melhorando seu score de crédito.',
      benefits: [
        'Aumente seu score de crédito com histórico positivo',
        'Facilite a aprovação de crédito e financiamentos',
        'Tenha acesso a melhores condições e taxas',
        'Construa uma reputação creditícia sólida',
        'Seus pagamentos em dia são registrados automaticamente'
      ],
      howItWorks: [
        'Cadastre-se no Cadastro Positivo',
        'Autorize o compartilhamento de seus dados positivos',
        'Seus pagamentos em dia são registrados automaticamente',
        'Acompanhe a evolução do seu score de crédito'
      ],
      useCases: [
        'Pessoas que pagam em dia e querem melhorar o score',
        'Jovens que estão construindo histórico creditício',
        'Empresas que buscam melhorar relacionamento com bancos',
        'Quem deseja ter acesso a crédito com melhores condições'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#003f7f] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <div className="inline-block bg-[#ffd000] text-[#003f7f] px-6 py-3 rounded-full text-sm font-black mb-6 shadow-2xl">
              🛡️ SPC Brasil
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 drop-shadow-2xl">
              SPC Brasil
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Proteção, negociação e construção de crédito. Tudo em um só lugar.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#spc-avisa"
                className="bg-white text-[#003f7f] px-8 py-4 rounded-full font-bold hover:bg-[#ffd000] hover:text-[#003f7f] transition-all duration-300 hover:scale-105 shadow-lg"
              >
                SPC AVISA
              </a>
              <a
                href="#spc-conciliador"
                className="bg-white text-[#003f7f] px-8 py-4 rounded-full font-bold hover:bg-[#00a859] hover:text-white transition-all duration-300 hover:scale-105 shadow-lg"
              >
                SPC CONCILIADOR
              </a>
              <a
                href="#cadastro-positivo"
                className="bg-white text-[#003f7f] px-8 py-4 rounded-full font-bold hover:bg-[#ffd000] hover:text-[#003f7f] transition-all duration-300 hover:scale-105 shadow-lg"
              >
                CADASTRO POSITIVO
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Introdução */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black text-[#003f7f] mb-6">
              O que é o SPC Brasil?
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              O SPC Brasil é o maior sistema de proteção ao crédito do país, oferecendo soluções 
              completas para empresas e consumidores. Com mais de 50 anos de experiência, ajudamos 
              milhões de brasileiros a proteger, negociar e construir seu histórico creditício.
            </p>
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#003f7f]/10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaShieldAlt className="w-8 h-8 text-[#003f7f]" />
                <h3 className="text-2xl font-bold text-[#003f7f]">Soluções Integradas</h3>
              </div>
              <p className="text-gray-600">
                Três ferramentas poderosas que trabalham juntas para oferecer proteção completa, 
                facilitar negociações e construir um histórico creditício positivo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards das 3 Funcionalidades */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.id}
                  id={feature.id === 1 ? 'spc-avisa' : feature.id === 2 ? 'spc-conciliador' : 'cadastro-positivo'}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100"
                >
                  <div className={`bg-linear-to-br ${feature.color} p-8 text-white`}>
                    <div className={`${feature.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                    <p className="text-white/90 leading-relaxed">{feature.description}</p>
                  </div>
                  <div className="p-6">
                    <a
                      href={`#detalhes-${feature.id}`}
                      className="inline-flex items-center gap-2 text-[#003f7f] font-bold hover:gap-4 transition-all"
                    >
                      <span>Saiba mais</span>
                      <FaArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detalhes de cada Funcionalidade */}
      {features.map((feature) => {
        const IconComponent = feature.icon;
        return (
          <section
            key={feature.id}
            id={`detalhes-${feature.id}`}
            className={`py-16 ${feature.id % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                {/* Header da Seção */}
                <div className="text-center mb-12">
                  <div className={`inline-block bg-linear-to-br ${feature.color} text-white px-6 py-3 rounded-full text-sm font-black mb-6 shadow-lg`}>
                    {feature.title}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-[#003f7f] mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                    {feature.description}
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Benefícios */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <FaCheckCircle className={`w-6 h-6 ${feature.iconBg} text-white p-2 rounded-lg`} />
                      <h3 className="text-2xl font-bold text-gray-900">Benefícios</h3>
                    </div>
                    <ul className="space-y-4">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <FaCheckCircle className={`w-5 h-5 ${feature.iconBg} text-white rounded-full flex-shrink-0 mt-0.5`} />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Como Funciona */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <FaInfoCircle className={`w-6 h-6 ${feature.iconBg} text-white p-2 rounded-lg`} />
                      <h3 className="text-2xl font-bold text-gray-900">Como Funciona</h3>
                    </div>
                    <ol className="space-y-4">
                      {feature.howItWorks.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className={`${feature.iconBg} text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
                            {index + 1}
                          </span>
                          <span className="text-gray-700 pt-1">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Casos de Uso */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <FaUsers className={`w-6 h-6 ${feature.iconBg} text-white p-2 rounded-lg`} />
                    <h3 className="text-2xl font-bold text-gray-900">Para Quem é Indicado</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {feature.useCases.map((useCase, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <FaArrowRight className={`w-5 h-5 ${feature.iconBg} text-white rounded-full p-1 flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                  <div className={`bg-linear-to-br ${feature.color} rounded-2xl p-8 text-white shadow-2xl`}>
                    <h3 className="text-2xl font-black mb-4">Pronto para começar?</h3>
                    <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                      Acesse o {feature.title} agora mesmo e aproveite todos os benefícios.
                    </p>
                    <a
                      href="https://www.spcbrasil.org.br"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-white text-[#003f7f] px-8 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      Acessar {feature.title}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Comparativo */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-[#003f7f] text-center mb-12">
              Compare as Funcionalidades
            </h2>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#003f7f] text-white">
                      <th className="px-6 py-4 text-left font-bold">Funcionalidade</th>
                      <th className="px-6 py-4 text-center font-bold">SPC AVISA</th>
                      <th className="px-6 py-4 text-center font-bold">SPC CONCILIADOR</th>
                      <th className="px-6 py-4 text-center font-bold">CADASTRO POSITIVO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-4 font-semibold text-gray-900">Tipo de Serviço</td>
                      <td className="px-6 py-4 text-center text-gray-700">Monitoramento</td>
                      <td className="px-6 py-4 text-center text-gray-700">Negociação</td>
                      <td className="px-6 py-4 text-center text-gray-700">Histórico Positivo</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-900">Custo</td>
                      <td className="px-6 py-4 text-center text-gray-700">Gratuito</td>
                      <td className="px-6 py-4 text-center text-gray-700">Gratuito</td>
                      <td className="px-6 py-4 text-center text-gray-700">Gratuito</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-4 font-semibold text-gray-900">Tempo de Ativação</td>
                      <td className="px-6 py-4 text-center text-gray-700">Imediato</td>
                      <td className="px-6 py-4 text-center text-gray-700">Imediato</td>
                      <td className="px-6 py-4 text-center text-gray-700">Imediato</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-900">Disponibilidade</td>
                      <td className="px-6 py-4 text-center text-gray-700">24/7</td>
                      <td className="px-6 py-4 text-center text-gray-700">24/7</td>
                      <td className="px-6 py-4 text-center text-gray-700">24/7</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold text-gray-900">Benefício Principal</td>
                      <td className="px-6 py-4 text-center text-gray-700">Proteção</td>
                      <td className="px-6 py-4 text-center text-gray-700">Regularização</td>
                      <td className="px-6 py-4 text-center text-gray-700">Score de Crédito</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#003f7f] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Comece a Usar o SPC Brasil Hoje
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Todas as funcionalidades são gratuitas e podem ser acessadas diretamente no site do SPC Brasil.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.spcbrasil.org.br"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#ffd000] text-[#003f7f] px-8 py-4 rounded-full font-bold hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Acessar SPC Brasil
              </a>
              <a
                href="/imprensa/contato"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#003f7f] transition-all duration-300"
              >
                Falar com Especialista
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SPCBrasilPage;



