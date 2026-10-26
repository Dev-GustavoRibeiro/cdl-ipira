'use client';

import React from 'react';
import {
  HeroSection,
  IntroSection,
  PlatformsSection,
  InitiativesSection,
  BenefitsSection,
  CTASection
} from './components';

const CDLMidiaPage = () => {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <PlatformsSection />
      <InitiativesSection />
      <BenefitsSection />
      {/* Formatos de conteúdo agora ficam em InitiativesSection (ContentTypesSection fica guardado) */}
      <CTASection />
    </>
  );
};

export default CDLMidiaPage;
