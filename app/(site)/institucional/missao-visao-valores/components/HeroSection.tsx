'use client';

import React from 'react';
import { FaGem } from 'react-icons/fa';
import { PageHero } from '../../_components/ui';

// Sem painel de números: só voltam com fonte e data confirmadas pela CDL (publicidade não pode induzir a erro)
const HeroSection = () => {
  return (
    <PageHero
      icon={FaGem}
      eyebrow="Nossos Fundamentos"
      title="Missão, Visão e Valores"
      description="Os pilares que sustentam nossa atuação e impulsionam o comércio de Ipirá rumo ao futuro."
    />
  );
};

export default HeroSection;
