'use client';

import React from 'react';
import { FaUserFriends } from 'react-icons/fa';
import { SectionHeader } from '../../_components/ui';
import MemberCard, { teamGrid } from './MemberCard';
import { TeamMember } from './types';

interface SuplentesSectionProps {
  suplentes: TeamMember[];
}

const SuplentesSection = ({ suplentes }: SuplentesSectionProps) => {
  if (suplentes.length === 0) return null;

  return (
    <section className="bg-white pt-4 pb-16 sm:pt-6 sm:pb-20 lg:pt-8 lg:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader icon={FaUserFriends} eyebrow="Apoio à Diretoria" title="Suplentes" />
        <div className={teamGrid}>
          {suplentes.map((suplente, index) => (
            <MemberCard key={suplente.id} member={suplente} accent="blue" index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuplentesSection;
