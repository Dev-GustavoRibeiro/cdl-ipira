'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaBullhorn, FaFacebook, FaInstagram, FaPhoneAlt, FaYoutube } from 'react-icons/fa';
import { HeroPanel, ProductHero, btnGlass, btnYellow } from '../../_components/ProductUI';
import { CONTACT } from '@/app/components/navigation/navItems';
import { initiatives } from './InitiativesSection';

const HeroSection = () => {
  return (
    <ProductHero
      crumb="CDL Mídia"
      eyebrow="Comunicação"
      icon={FaBullhorn}
      title="CDL"
      highlight="Mídia"
      lead="Sua empresa na vitrine das redes da CDL."
      description="A CDL Ipirá divulga empresas associadas nos seus perfis no Facebook, Instagram e YouTube."
      actions={
        <>
          <Link href="/imprensa/contato" className={btnYellow}>
            Quero Participar
            <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-[translate] duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
          <a href={CONTACT.phone.href} className={btnGlass}>
            <FaPhoneAlt aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">Ligar para a Central de Atendimento:</span>
            {CONTACT.phone.label}
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
          title="Formatos de divulgação"
          description="Conteúdos publicados nos perfis da CDL, conforme a programação."
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
