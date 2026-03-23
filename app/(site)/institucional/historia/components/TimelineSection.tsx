'use client';

import React from 'react';
import { FaHistory, FaFlag, FaChartLine, FaLightbulb, FaStar } from 'react-icons/fa';

const timelineEvents = [
  {
    year: 'Fundação',
    title: 'Nascimento da CDL Ipirá',
    description: 'Um grupo de empresários visionários se uniu para criar uma entidade que representasse e fortalecesse o comércio local.',
    icon: FaFlag,
    color: 'from-[#003f7f] to-[#0066cc]'
  },
  {
    year: 'Crescimento',
    title: 'Expansão dos Serviços',
    description: 'Implantação do SPC Brasil e novos serviços de proteção ao crédito, beneficiando comerciantes de toda a região.',
    icon: FaChartLine,
    color: 'from-[#00a859] to-[#00d670]'
  },
  {
    year: 'Modernização',
    title: 'Era Digital',
    description: 'Adoção de tecnologias modernas, certificação digital e sistemas online para melhor atender os associados.',
    icon: FaLightbulb,
    color: 'from-[#ffd000] to-[#ffed4e]'
  },
  {
    year: 'Presente',
    title: 'Referência Regional',
    description: 'Hoje somos referência em representação comercial, com mais de 100 associados e uma visão ambiciosa para 2030.',
    icon: FaStar,
    color: 'from-[#003f7f] to-[#0066cc]'
  },
];

const TimelineSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-linear-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-linear-to-r from-[#ffd000] to-[#ffed4e] text-[#003f7f] px-6 py-3 rounded-full text-sm font-black mb-6 shadow-lg">
            <FaHistory />
            <span>Nossa Trajetória</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f] mb-4">
            Marcos da Nossa História
          </h2>
          <div className="w-24 sm:w-32 h-1.5 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Cada momento da nossa jornada representa um passo em direção ao sucesso.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Linha central */}
            <div className="absolute left-4 sm:left-1/2 transform sm:-translate-x-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full"></div>

            {/* Eventos */}
            <div className="space-y-12 sm:space-y-16">
              {timelineEvents.map((event, index) => (
                <div key={index} className={`relative flex items-start sm:items-center ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                  {/* Card */}
                  <div className={`ml-12 sm:ml-0 sm:w-[calc(50%-40px)] ${index % 2 === 0 ? 'sm:pr-8 sm:text-right' : 'sm:pl-8'}`}>
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-gray-200 group">
                      {/* Badge de ano */}
                      <div className={`inline-flex items-center gap-2 bg-linear-to-r ${event.color} text-white px-4 py-2 rounded-full text-sm font-bold mb-4`}>
                        <event.icon />
                        <span>{event.year}</span>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-black text-[#003f7f] mb-3 group-hover:text-[#0066cc] transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Ponto central */}
                  <div className="absolute left-0 sm:left-1/2 transform sm:-translate-x-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#003f7f] z-10">
                    <event.icon className="text-[#003f7f] text-sm sm:text-lg" />
                  </div>

                  {/* Espaçador */}
                  <div className="hidden sm:block sm:w-[calc(50%-40px)]"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;



