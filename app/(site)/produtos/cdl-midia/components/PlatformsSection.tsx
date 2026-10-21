'use client';

import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaShareAlt } from 'react-icons/fa';
import { SectionHeader, cardLift, cardSurface } from '../../_components/ProductUI';

const platforms = [
  {
    name: 'Facebook',
    icon: FaFacebook,
    description: 'Conteúdo exclusivo, eventos e interação com a comunidade empresarial'
  },
  {
    name: 'Instagram',
    icon: FaInstagram,
    description: 'Stories, reels e posts visuais que destacam sua empresa'
  },
  {
    name: 'YouTube',
    icon: FaYoutube,
    description: 'Vídeos institucionais, entrevistas e conteúdo educativo'
  }
];

const PlatformsSection = () => {
  return (
    <section aria-labelledby="midia-plataformas" className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="midia-plataformas"
          eyebrow="Canais"
          icon={FaShareAlt}
          title="Nossas Plataformas"
          subtitle="Estamos presentes nas principais redes sociais para dar visibilidade à sua empresa"
        />

        {/* Uma coluna até o tablet; três a partir do desktop, com o ícone acima do texto em 1024px (colunas estreitas) */}
        <ul className="mx-auto mt-12 grid max-w-2xl gap-5 sm:gap-6 md:mt-14 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <li key={platform.name} className={`group flex h-full items-start gap-5 p-6 sm:p-7 lg:flex-col xl:flex-row ${cardSurface} ${cardLift}`}>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#003f7f]/10 text-[#003f7f] ring-1 ring-[#003f7f]/15 transition-colors duration-300 group-hover:bg-[#003f7f] group-hover:text-white motion-reduce:transition-none">
                  <Icon aria-hidden="true" className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-[#003f7f]">{platform.name}</h3>
                  <p className="mt-2 leading-relaxed text-gray-600">{platform.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default PlatformsSection;
