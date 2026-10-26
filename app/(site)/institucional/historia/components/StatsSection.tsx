'use client';

import React from 'react';
import { FaUsers, FaCalendarAlt, FaHandshake, FaAward } from 'react-icons/fa';
import { StatsPanel, type StatItem } from '../../_components/ui';

const conquistas: StatItem[] = [
  { icon: FaUsers, end: 100, suffix: '+', label: 'Associados Ativos' },
  { icon: FaCalendarAlt, end: 30, suffix: '+', label: 'Anos de História' },
  { icon: FaHandshake, end: 500, suffix: '+', label: 'Parcerias Realizadas' },
  { icon: FaAward, end: 15, suffix: '+', label: 'Reconhecimentos' },
];

const StatsSection = () => {
  return (
    // O painel sobe sobre a base do hero; flow-root segura a margem negativa dentro da seção
    <section aria-label="A CDL Ipirá em números" className="relative z-10 flow-root bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <StatsPanel items={conquistas} className="mx-auto -mt-16 max-w-6xl sm:-mt-20" />
      </div>
    </section>
  );
};

export default StatsSection;
