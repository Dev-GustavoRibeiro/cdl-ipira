'use client';

import React from 'react';
import { FaUserTie } from 'react-icons/fa';
import { SectionHeader } from '../../_components/ui';
import MemberCard, { teamGrid } from './MemberCard';
import { TeamMember } from './types';

interface DiretoresSectionProps {
  diretores: TeamMember[];
}

const DiretoresSection = ({ diretores }: DiretoresSectionProps) => {
  return (
    <section className="bg-linear-to-b from-gray-50 to-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader icon={FaUserTie} eyebrow="Gestão da CDL" title="Diretores" />

        {diretores.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl bg-white px-6 py-10 text-center ring-1 ring-[#003f7f]/[0.07]">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#003f7f]/[0.07] text-[#003f7f]">
              <FaUserTie aria-hidden="true" className="h-6 w-6" />
            </span>
            <p className="mt-4 text-base text-gray-600">Nenhum diretor cadastrado no momento.</p>
          </div>
        ) : (
          <div className={teamGrid}>
            {diretores.map((diretor, index) => (
              <MemberCard key={diretor.id} member={diretor} accent="yellow" index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DiretoresSection;
