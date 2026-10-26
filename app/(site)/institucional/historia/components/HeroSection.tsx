'use client';

import React from 'react';
import Link from 'next/link';
import { FaHistory, FaUsers } from 'react-icons/fa';
import { HeroHighlight, PageHero, btnGhostDark, btnYellow } from '../../_components/ui';

const HeroSection = () => {
  return (
    <PageHero
      icon={FaHistory}
      eyebrow="Nossa Trajetória"
      image={{ src: '/cdl-ipira-sede.jpg', alt: 'Fachada da sede da CDL Ipirá' }}
      title={
        <>
          Uma História de <HeroHighlight dark>Sucesso</HeroHighlight>
        </>
      }
      description="Uma entidade dedicada ao fortalecimento do comércio de Ipirá e ao apoio a cada empresa associada."
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link href="/institucional/diretoria" className={btnYellow}>
          Conheça a Diretoria
          <FaUsers aria-hidden="true" />
        </Link>
        <Link href="/institucional/missao-visao-valores" className={btnGhostDark}>
          Missão e Valores
        </Link>
      </div>
    </PageHero>
  );
};

export default HeroSection;
