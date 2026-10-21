'use client';

import React from 'react';
import { FaHeart, FaUsers, FaHandshake, FaRocket, FaShieldAlt, FaLightbulb, FaChartLine } from 'react-icons/fa';
import { SectionHeader, shadowCard } from '../../_components/ui';

// Ícones em azul, verde e amarelo (no amarelo o ícone fica azul para manter o contraste)
const tiles = [
  'bg-linear-to-br from-[#003f7f] to-[#0066cc] text-white',
  'bg-linear-to-br from-[#00a859] to-[#00d670] text-white',
  'bg-linear-to-br from-[#ffd000] to-[#ffed4e] text-[#003f7f]',
];

const valores = [
  {
    icon: FaUsers,
    title: 'Foco no Associado',
    description: 'Excelência no atendimento, comunicação constante e gerar valor ao associado.',
    fullDescription: 'Colocamos nossos associados no centro de tudo. Cada decisão, cada serviço e cada iniciativa é pensada para agregar valor real aos negócios de quem confia em nós.',
  },
  {
    icon: FaHandshake,
    title: 'Comprometimento',
    description: 'Compromisso com a verdade, espírito de equipe, integridade, inovação, valor e paixão.',
    fullDescription: 'Honramos nossos compromissos com transparência e dedicação. Nossa equipe trabalha unida com paixão pelo que faz.',
  },
  {
    icon: FaRocket,
    title: 'Eficiência',
    description: 'Gestão da qualidade, fidelização, inovação, performance e solução ao associado.',
    fullDescription: 'Buscamos sempre os melhores resultados com processos otimizados e soluções que realmente fazem a diferença.',
  },
  {
    icon: FaShieldAlt,
    title: 'Ética',
    description: 'Transparência em todas as ações, respeito aos associados e à comunidade.',
    fullDescription: 'Agimos com integridade absoluta. A confiança dos nossos associados é nosso maior patrimônio.',
  },
  {
    icon: FaLightbulb,
    title: 'Inovação',
    description: 'Busca constante por novas soluções e tecnologias para melhor atender.',
    fullDescription: 'Estamos sempre à frente, buscando as melhores tecnologias e práticas do mercado para beneficiar nossos associados.',
  },
  {
    icon: FaChartLine,
    title: 'Excelência',
    description: 'Compromisso com a qualidade em tudo o que fazemos para nossos associados.',
    fullDescription: 'Não nos contentamos com o bom, buscamos sempre o excepcional em cada entrega.',
  },
];

const ValoresSection = () => {
  return (
    <section className="bg-white pt-4 pb-16 sm:pt-6 sm:pb-20 lg:pt-8 lg:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={FaHeart}
          eyebrow="O que nos move"
          title="Nossos Valores"
          description="Princípios que norteiam cada decisão e ação da CDL Ipirá."
        />

        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {valores.map((valor, index) => {
            const Icon = valor.icon;
            return (
              <li key={valor.title} className={`relative overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-[#003f7f]/[0.07] sm:p-8 ${shadowCard}`}>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2 right-5 text-7xl font-black tracking-tighter text-[#003f7f]/[0.05] select-none"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={`relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-[0_12px_24px_-12px_rgba(0,63,127,0.6)] ${tiles[index % 3]}`}>
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="relative mt-6 text-xl font-black tracking-tight text-[#003f7f] sm:text-2xl">{valor.title}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-pretty text-gray-600 sm:text-base">{valor.fullDescription}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ValoresSection;
