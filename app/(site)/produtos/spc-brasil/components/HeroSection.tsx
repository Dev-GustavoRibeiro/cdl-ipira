'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaBolt, FaClock, FaExternalLinkAlt, FaGift, FaShieldAlt } from 'react-icons/fa';
import { HeroPanel, ProductHero, btnGlass, btnYellow } from '../../_components/ProductUI';
import { features } from './FeaturesData';

const HeroSection = () => {
  return (
    <ProductHero
      crumb="SPC Brasil"
      eyebrow="Proteção ao crédito"
      icon={FaShieldAlt}
      title="SPC"
      highlight="Brasil"
      lead="Proteção, negociação e construção de crédito. Tudo em um só lugar."
      actions={
        <>
          <a href="https://www.spcbrasil.org.br" target="_blank" rel="noopener noreferrer" className={btnYellow}>
            Acessar SPC Brasil
            <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
          <Link href="/imprensa/contato" className={btnGlass}>
            Falar com Especialista
            <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-[translate] duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
        </>
      }
      chips={[
        { icon: FaGift, label: 'Gratuito' },
        { icon: FaBolt, label: 'Ativação imediata' },
        { icon: FaClock, label: 'Disponível 24/7' },
      ]}
      aside={
        <HeroPanel
          title="Soluções Integradas"
          description="Três ferramentas poderosas que trabalham juntas para oferecer proteção completa, facilitar negociações e construir um histórico creditício positivo."
          items={features.map((feature) => ({
            icon: feature.icon,
            title: feature.title,
            text: feature.type,
            accent: feature.accent,
            href: `#${feature.anchor}`,
          }))}
        />
      }
    />
  );
};

export default HeroSection;
