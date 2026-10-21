'use client';

import React from 'react';
import { FaArrowDown, FaBriefcase, FaFileAlt, FaPlus, FaUser } from 'react-icons/fa';
import { HeroPanel, ProductHero, btnGlass, btnYellow } from '../../_components/ProductUI';

interface HeroSectionProps {
  onOpenModal: () => void;
}

const HeroSection = ({ onOpenModal }: HeroSectionProps) => {
  return (
    <ProductHero
      crumb="Balcão de Empregos"
      eyebrow="Empregos em Ipirá"
      icon={FaBriefcase}
      title="Balcão de"
      highlight="Empregos"
      lead="Oportunidades de emprego, você encontra no site da CDL."
      description="Com o CDL Balcão de Empregos, você terá acesso aos currículos dos melhores profissionais da cidade!"
      actions={
        <>
          <button type="button" onClick={onOpenModal} aria-haspopup="dialog" className={btnYellow}>
            <FaPlus aria-hidden="true" className="h-3.5 w-3.5" />
            Cadastre sua Vaga
          </button>
          <a href="#vagas" className={btnGlass}>
            Ver vagas abertas
            <FaArrowDown aria-hidden="true" className="h-3.5 w-3.5 transition-[translate] duration-200 group-hover:translate-y-0.5 motion-reduce:transition-none" />
          </a>
        </>
      }
      aside={
        <HeroPanel
          title="Contrate agora!"
          items={[
            { icon: FaBriefcase, title: 'Acesso a Talentos', text: 'Encontre profissionais qualificados e prontos para contribuir com seu negócio.', accent: 'green' },
            { icon: FaUser, title: 'Processo Simplificado', text: 'Cadastre suas vagas e receba currículos de candidatos interessados.', accent: 'sky' },
            { icon: FaFileAlt, title: 'Gratuito para Associados', text: 'Serviço exclusivo e gratuito para associados da CDL Ipirá.', accent: 'yellow' },
          ]}
        />
      }
    />
  );
};

export default HeroSection;
