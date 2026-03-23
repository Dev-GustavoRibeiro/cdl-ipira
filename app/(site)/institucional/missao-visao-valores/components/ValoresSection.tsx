'use client';

import React from 'react';
import { FaHeart, FaUsers, FaHandshake, FaRocket, FaShieldAlt, FaLightbulb, FaChartLine } from 'react-icons/fa';

const valores = [
  {
    icon: FaUsers,
    title: 'Foco no Associado',
    description: 'Excelência no atendimento, comunicação constante e gerar valor ao associado.',
    fullDescription: 'Colocamos nossos associados no centro de tudo. Cada decisão, cada serviço e cada iniciativa é pensada para agregar valor real aos negócios de quem confia em nós.',
    color: 'from-[#003f7f] to-[#0066cc]',
    lightColor: 'bg-blue-50',
    accentColor: '#003f7f'
  },
  {
    icon: FaHandshake,
    title: 'Comprometimento',
    description: 'Compromisso com a verdade, espírito de equipe, integridade, inovação, valor e paixão.',
    fullDescription: 'Honramos nossos compromissos com transparência e dedicação. Nossa equipe trabalha unida com paixão pelo que faz.',
    color: 'from-[#00a859] to-[#00d670]',
    lightColor: 'bg-green-50',
    accentColor: '#00a859'
  },
  {
    icon: FaRocket,
    title: 'Eficiência',
    description: 'Gestão da qualidade, fidelização, inovação, performance e solução ao associado.',
    fullDescription: 'Buscamos sempre os melhores resultados com processos otimizados e soluções que realmente fazem a diferença.',
    color: 'from-[#ffd000] to-[#ffed4e]',
    lightColor: 'bg-yellow-50',
    accentColor: '#ffd000'
  },
  {
    icon: FaShieldAlt,
    title: 'Ética',
    description: 'Transparência em todas as ações, respeito aos associados e à comunidade.',
    fullDescription: 'Agimos com integridade absoluta. A confiança dos nossos associados é nosso maior patrimônio.',
    color: 'from-[#003f7f] to-[#0066cc]',
    lightColor: 'bg-blue-50',
    accentColor: '#003f7f'
  },
  {
    icon: FaLightbulb,
    title: 'Inovação',
    description: 'Busca constante por novas soluções e tecnologias para melhor atender.',
    fullDescription: 'Estamos sempre à frente, buscando as melhores tecnologias e práticas do mercado para beneficiar nossos associados.',
    color: 'from-[#00a859] to-[#00d670]',
    lightColor: 'bg-green-50',
    accentColor: '#00a859'
  },
  {
    icon: FaChartLine,
    title: 'Excelência',
    description: 'Compromisso com a qualidade em tudo o que fazemos para nossos associados.',
    fullDescription: 'Não nos contentamos com o bom, buscamos sempre o excepcional em cada entrega.',
    color: 'from-[#ffd000] to-[#ffed4e]',
    lightColor: 'bg-yellow-50',
    accentColor: '#ffd000'
  },
];

const ValoresSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#003f7f]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00a859]/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-linear-to-r from-[#ffd000] to-[#ffed4e] text-[#003f7f] px-6 py-3 rounded-full text-sm font-black mb-6 shadow-lg">
            <FaHeart className="animate-pulse" />
            <span>O que nos move</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-4">
            Nossos Valores
          </h2>
          <div className="w-32 h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Princípios que norteiam cada decisão e ação da CDL Ipirá.
          </p>
        </div>

        {/* Grid de Valores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {valores.map((valor, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-500 hover:-translate-y-2">
                {/* Ícone */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br ${valor.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <valor.icon className={`text-2xl sm:text-3xl ${valor.color.includes('ffd000') ? 'text-[#003f7f]' : 'text-white'}`} />
                </div>

                {/* Conteúdo */}
                <h3 className="text-xl sm:text-2xl font-black text-[#003f7f] mb-3 group-hover:text-[#0066cc] transition-colors">
                  {valor.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {valor.fullDescription}
                </p>

                {/* Decoração */}
                <div className={`absolute -bottom-4 -right-4 w-32 h-32 bg-linear-to-br ${valor.color} rounded-full opacity-5 group-hover:opacity-10 transition-opacity blur-2xl`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValoresSection;



