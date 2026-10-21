'use client';

import React from 'react';
import { FaFlag, FaHandshake, FaHeart, FaShieldAlt, FaUsers } from 'react-icons/fa';
import { SectionHeader, shadowCard } from '../../_components/ui';

const commitments = [
  {
    id: 1,
    title: 'Representatividade',
    description: 'Defendemos os interesses do comércio local junto aos poderes públicos e entidades representativas.',
    icon: FaUsers,
    tile: 'bg-linear-to-br from-[#003f7f] to-[#0066cc] text-white',
  },
  {
    id: 2,
    title: 'Fortalecimento',
    description: 'Oferecemos serviços e ferramentas que fortalecem os negócios dos nossos associados.',
    icon: FaShieldAlt,
    tile: 'bg-linear-to-br from-[#00a859] to-[#00d670] text-white',
  },
  {
    id: 3,
    title: 'Desenvolvimento',
    description: 'Promovemos o desenvolvimento econômico e social de Ipirá e região.',
    icon: FaHandshake,
    tile: 'bg-linear-to-br from-[#ffd000] to-[#ffed4e] text-[#003f7f]',
  },
  {
    id: 4,
    title: 'Compromisso Social',
    description: 'Desenvolvemos projetos sociais que beneficiam a comunidade local.',
    icon: FaHeart,
    tile: 'bg-linear-to-br from-[#003f7f] to-[#0066cc] text-white',
  },
];

const CommitmentsSection = () => {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader icon={FaFlag} eyebrow="O que defendemos" title="Nossos Compromissos" />

        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {commitments.map((commitment, index) => {
            const Icon = commitment.icon;
            return (
              <li
                key={commitment.id}
                className={`relative flex flex-col overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-[#003f7f]/[0.07] animate-scale-in sm:p-7 ${shadowCard}`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2 right-4 text-6xl font-black tracking-tighter text-[#003f7f]/[0.05] select-none"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={`relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-[0_12px_24px_-12px_rgba(0,63,127,0.6)] ${commitment.tile}`}>
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="relative mt-6 text-xl font-black tracking-tight text-[#003f7f]">{commitment.title}</h3>
                <p className="relative mt-2.5 text-sm leading-relaxed text-pretty text-gray-600 sm:text-base">{commitment.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default CommitmentsSection;
