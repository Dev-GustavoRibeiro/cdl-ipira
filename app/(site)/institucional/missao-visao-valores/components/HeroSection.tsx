'use client';

import React from 'react';
import { FaGem, FaAward, FaTrophy, FaUsers, FaFlag } from 'react-icons/fa';
import { PageHero, StatsPanel, type StatItem } from '../../_components/ui';

const diferenciais: StatItem[] = [
  { icon: FaAward, end: 15, suffix: '+', label: 'Prêmios' },
  { icon: FaTrophy, end: 98, suffix: '%', label: 'Satisfação' },
  { icon: FaUsers, end: 100, suffix: '+', label: 'Empresas' },
  { icon: FaFlag, end: 30, suffix: '+', label: 'Anos' },
];

const HeroSection = () => {
  return (
    <PageHero
      icon={FaGem}
      eyebrow="Nossos Fundamentos"
      title="Missão, Visão e Valores"
      description="Os pilares que sustentam nossa atuação e impulsionam o comércio de Ipirá rumo ao futuro."
    >
      <StatsPanel items={diferenciais} className="mx-auto max-w-5xl" />
    </PageHero>
  );
};

export default HeroSection;
