'use client';

import React from 'react';
import { FaHistory, FaFlag, FaChartLine, FaLightbulb, FaStar } from 'react-icons/fa';
import { SectionHeader, shadowCard } from '../../_components/ui';

// Cor do marcador de cada fase (ícone escuro no amarelo para manter o contraste)
const tones = {
  blue: 'bg-linear-to-br from-[#003f7f] to-[#0066cc] text-white',
  green: 'bg-linear-to-br from-[#00a859] to-[#00d670] text-white',
  yellow: 'bg-linear-to-br from-[#ffd000] to-[#ffed4e] text-[#003f7f]',
};

const timelineEvents = [
  {
    year: 'Fundação',
    title: 'Nascimento da CDL Ipirá',
    description: 'Um grupo de empresários visionários se uniu para criar uma entidade que representasse e fortalecesse o comércio local.',
    icon: FaFlag,
    tone: tones.blue,
  },
  {
    year: 'Crescimento',
    title: 'Expansão dos Serviços',
    description: 'Implantação do SPC Brasil e novos serviços de proteção ao crédito, beneficiando comerciantes de toda a região.',
    icon: FaChartLine,
    tone: tones.green,
  },
  {
    year: 'Modernização',
    title: 'Era Digital',
    description: 'Adoção de tecnologias modernas, certificação digital e sistemas online para melhor atender os associados.',
    icon: FaLightbulb,
    tone: tones.yellow,
  },
  {
    year: 'Presente',
    title: 'Referência Regional',
    description: 'Hoje somos referência em representação comercial, com mais de 100 associados e uma visão ambiciosa para 2030.',
    icon: FaStar,
    tone: tones.blue,
  },
];

const TimelineSection = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-gray-50 to-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={FaHistory}
          eyebrow="Nossa Trajetória"
          title="Marcos da Nossa História"
          description="Cada momento da nossa jornada representa um passo em direção ao sucesso."
        />

        {/* Celular: linha à esquerda e cartões em coluna única. Desktop: linha no centro e cartões alternados. */}
        <div className="relative mx-auto max-w-5xl">
          <div
            aria-hidden="true"
            className="absolute top-3 bottom-3 left-5 w-1 -translate-x-1/2 rounded-full mask-b-from-85% bg-linear-to-b from-[#003f7f] via-[#00a859] to-[#ffd000] md:left-1/2"
          />
          <ol>
          {timelineEvents.map((event, index) => {
            const onRight = index % 2 === 1;
            const Icon = event.icon;
            return (
              <li
                key={event.title}
                className={`relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-5 pb-8 last:pb-0 sm:gap-x-6 md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] md:gap-x-10 md:pb-12 ${
                  // No desktop os lados alternam: cada cartão sobe até a metade do anterior (sem buracos)
                  index > 0 ? 'md:-mt-24' : ''
                }`}
              >
                {/* Marcador na linha */}
                <div className="col-start-1 row-start-1 flex justify-center pt-5 md:col-start-2 md:pt-6">
                  <span
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-white shadow-[0_10px_24px_-10px_rgba(0,63,127,0.6)] md:h-14 md:w-14 ${event.tone}`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4 md:h-5 md:w-5" />
                  </span>
                </div>

                {/* Cartão */}
                <article
                  className={`relative col-start-2 row-start-1 overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-[#003f7f]/[0.07] sm:p-7 ${shadowCard} ${
                    onRight ? 'md:col-start-3' : 'md:col-start-1'
                  }`}
                >
                  {/* Número da fase como marca d'água */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-2 right-4 text-7xl font-black tracking-tighter text-[#003f7f]/[0.05] select-none"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="relative inline-flex items-center gap-2 rounded-full bg-[#003f7f]/[0.07] px-3 py-1 text-xs font-bold tracking-[0.12em] text-[#003f7f] uppercase">
                    {event.year}
                  </span>
                  <h3 className="relative mt-4 text-xl font-black tracking-tight text-balance text-[#003f7f] sm:text-2xl">{event.title}</h3>
                  <p className="relative mt-2.5 text-sm leading-relaxed text-pretty text-gray-600 sm:text-base">{event.description}</p>
                </article>
              </li>
            );
          })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
