'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaBullhorn, FaFacebook, FaInstagram, FaPhone, FaYoutube } from 'react-icons/fa';
import { HeroPanel, ProductHero, btnGlass, btnYellow } from '../../_components/ProductUI';
import { initiatives } from './InitiativesSection';

const HeroSection = () => {
  return (
    <ProductHero
      crumb="CDL Mídia"
      eyebrow="Comunicação"
      icon={FaBullhorn}
      title="CDL"
      highlight="Mídia"
      lead="Sua empresa sempre na vitrine!"
      description="A CDL Ipirá está presente no Facebook, Instagram e YouTube, oferecendo canais exclusivos que dão voz e protagonismo à sua empresa."
      actions={
        <>
          <Link href="/imprensa/contato" className={btnYellow}>
            Quero Participar
            <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-[translate] duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
          <a href="tel:+557532541599" className={btnGlass}>
            <FaPhone aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">Ligar para a Central de Atendimento:</span>
            (75) 3254-1599
          </a>
        </>
      }
      chips={[
        { icon: FaFacebook, label: 'Facebook' },
        { icon: FaInstagram, label: 'Instagram' },
        { icon: FaYoutube, label: 'YouTube' },
      ]}
      aside={
        <HeroPanel
          title="Iniciativas que geram visibilidade"
          description="Projetos exclusivos que dão voz e protagonismo aos associados."
          items={initiatives.map((initiative) => ({
            icon: initiative.icon,
            title: initiative.title,
            text: initiative.tag,
            accent: initiative.accent,
            href: `#iniciativa-${initiative.id}`,
          }))}
        />
      }
    />
  );
};

export default HeroSection;
