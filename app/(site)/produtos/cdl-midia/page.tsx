'use client';

import React from 'react';
import {
  HeroSection,
  IntroSection,
  PlatformsSection,
  InitiativesSection,
  BenefitsSection,
  ContentTypesSection,
  CTASection
} from './components';

const CDLMidiaPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <IntroSection />
      <PlatformsSection />
      <InitiativesSection />
      <BenefitsSection />
      <ContentTypesSection />
      <CTASection />
    </div>
  );
};

export default CDLMidiaPage;
