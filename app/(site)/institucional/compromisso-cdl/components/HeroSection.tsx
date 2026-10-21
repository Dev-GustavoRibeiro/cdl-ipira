'use client';

import React from 'react';
import { FaHandshake } from 'react-icons/fa';
import { PageHero } from '../../_components/ui';

const HeroSection = () => (
  <PageHero
    icon={FaHandshake}
    eyebrow="Nosso Compromisso"
    title="Compromisso da CDL"
    description="A CDL Ipirá tem o compromisso de representar, fortalecer e desenvolver o comércio local, sempre em busca do crescimento sustentável dos nossos associados e da comunidade."
  />
);

export default HeroSection;
