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
      description="Divulgue as vagas da sua empresa e receba o contato de candidatos interessados."
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
          title="Para empresas"
          // "Gratuito para associados" só volta quando a CDL confirmar a regra (e se não associados podem anunciar)
          items={[
            { icon: FaFileAlt, title: 'Envio pelo WhatsApp', text: 'Preencha os dados da vaga e envie para a equipe da CDL pelo WhatsApp.', accent: 'yellow' },
            { icon: FaBriefcase, title: 'Divulgação da Vaga', text: 'A CDL publica a vaga no site para quem procura emprego em Ipirá.', accent: 'green' },
            { icon: FaUser, title: 'Contato dos Candidatos', text: 'Os candidatos se apresentam pelo WhatsApp da CDL ou diretamente à sua empresa.', accent: 'sky' },
          ]}
        />
      }
    />
  );
};

export default HeroSection;
