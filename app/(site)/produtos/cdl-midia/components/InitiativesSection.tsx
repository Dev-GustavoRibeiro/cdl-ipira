'use client';

import React from 'react';
import type { IconType } from 'react-icons';
import { FaUsers, FaFileAlt, FaMicrophone, FaNewspaper, FaLightbulb } from 'react-icons/fa';
import { ACCENTS, type Accent, SectionHeader, anchorOffset, cardLift, cardSurface } from '../../_components/ProductUI';

// tag: resumo curto usado no painel do hero
export const initiatives: { id: number; title: string; tag: string; icon: IconType; description: string; accent: Accent }[] = [
  {
    id: 1,
    title: 'CDL Conecta',
    tag: 'Networking digital',
    icon: FaUsers,
    description: 'Conectando empresas e fortalecendo relacionamentos através de conteúdo estratégico e networking digital.',
    accent: 'blue'
  },
  {
    id: 2,
    title: 'Minha Empresa Faz História',
    tag: 'Histórias inspiradoras',
    icon: FaFileAlt,
    description: 'Destaque a trajetória e os valores da sua empresa através de histórias inspiradoras e conteúdo relevante.',
    accent: 'green'
  },
  {
    id: 3,
    title: 'CDL Cast',
    tag: 'Podcasts',
    icon: FaMicrophone,
    description: 'Podcasts exclusivos com informações estratégicas, entrevistas e conteúdos que inspiram o empreendedorismo.',
    accent: 'yellow'
  },
  {
    id: 4,
    title: 'CDL News',
    tag: 'Notícias do mercado',
    icon: FaNewspaper,
    description: 'Notícias, atualizações e informações relevantes sobre o mercado, economia e oportunidades de negócio.',
    accent: 'sky'
  }
];

const InitiativesSection = () => {
  return (
    <section aria-labelledby="midia-iniciativas" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="midia-iniciativas"
          eyebrow="Iniciativas"
          icon={FaLightbulb}
          title="Nossas Iniciativas"
          subtitle="Projetos exclusivos que geram visibilidade e reconhecimento para sua empresa"
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 md:mt-14 lg:gap-8 xl:grid-cols-4">
          {initiatives.map((initiative, index) => {
            const Icon = initiative.icon;
            const accent = ACCENTS[initiative.accent];
            return (
              <li key={initiative.id} id={`iniciativa-${initiative.id}`} className={anchorOffset}>
                <article className={`relative flex h-full flex-col overflow-hidden p-6 sm:p-7 ${cardSurface} ${cardLift}`}>
                  <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 ${accent.bar}`} />
                  <div className="flex items-start justify-between gap-4">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accent.tile} shadow-[0_12px_24px_-12px_rgba(0,63,127,0.6)]`}>
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <span aria-hidden="true" className="text-3xl font-black tracking-tight text-[#003f7f]/10">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-black leading-tight tracking-tight text-balance text-[#003f7f]">{initiative.title}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">{initiative.tag}</p>
                  <p className="mt-4 leading-relaxed text-gray-600">{initiative.description}</p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default InitiativesSection;
