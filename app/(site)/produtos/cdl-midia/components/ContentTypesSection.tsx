'use client';

import React from 'react';
import { FaVideo, FaMicrophone, FaFileAlt, FaPhotoVideo } from 'react-icons/fa';
import { ACCENTS, SectionHeader, cardSurface } from '../../_components/ProductUI';

const contentTypes = [
  {
    icon: FaVideo,
    title: 'Vídeos de Boas-Vindas',
    description: 'Apresente sua empresa aos associados da CDL com vídeos personalizados e profissionais.',
    accent: ACCENTS.blue
  },
  {
    icon: FaMicrophone,
    title: 'Podcasts',
    description: 'Participe de entrevistas e compartilhe conhecimento através do CDL Cast.',
    accent: ACCENTS.green
  },
  {
    icon: FaFileAlt,
    title: 'Histórias Inspiradoras',
    description: 'Conte a trajetória da sua empresa no projeto "Minha Empresa Faz História".',
    accent: ACCENTS.yellow
  }
];

const ContentTypesSection = () => {
  return (
    <section aria-labelledby="midia-conteudos" className="bg-white py-16 md:py-24">
      <div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-8">
        <SectionHeader
          id="midia-conteudos"
          align="left"
          eyebrow="Formatos"
          icon={FaPhotoVideo}
          title="Tipos de Conteúdo"
          subtitle="Diversos formatos para destacar sua empresa"
          className="lg:col-span-5"
        />

        <ul className="space-y-4 sm:space-y-5 lg:col-span-7">
          {contentTypes.map((type) => {
            const Icon = type.icon;
            return (
              <li key={type.title} className={`flex items-start gap-5 p-5 sm:p-6 ${cardSurface}`}>
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${type.accent.tile}`}>
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-[#003f7f] sm:text-xl">{type.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-gray-600">{type.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ContentTypesSection;
