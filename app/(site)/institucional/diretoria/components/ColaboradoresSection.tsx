'use client';

import React from 'react';
import { FaBriefcase } from 'react-icons/fa';
import { SectionHeader } from '../../_components/ui';
import MemberCard, { teamGrid } from './MemberCard';
import { TeamMember } from './types';

interface ColaboradoresSectionProps {
  colaboradores: TeamMember[];
}

const ColaboradoresSection = ({ colaboradores }: ColaboradoresSectionProps) => {
  if (colaboradores.length === 0) return null;

  return (
    <section className="bg-linear-to-b from-gray-50 to-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={FaBriefcase}
          eyebrow="Nossa Equipe"
          title="Colaboradores"
          description="Profissionais dedicados que trabalham diariamente para oferecer o melhor atendimento e serviços aos associados."
        />
        <div className={teamGrid}>
          {colaboradores.map((colaborador, index) => (
            <MemberCard key={colaborador.id} member={colaborador} accent="green" index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ColaboradoresSection;
