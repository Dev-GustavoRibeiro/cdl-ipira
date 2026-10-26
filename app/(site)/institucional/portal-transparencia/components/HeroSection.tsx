'use client';

import React from 'react';
import { FaEye } from 'react-icons/fa';
import { PageHero } from '../../_components/ui';

const HeroSection = () => (
  <PageHero
    icon={FaEye}
    eyebrow="Transparência"
    title="Portal Transparência"
    description="Acesse informações sobre transparência, prestação de contas e gestão da CDL Ipirá. Compromisso com a transparência e a prestação de contas aos nossos associados."
  />
);

export default HeroSection;
