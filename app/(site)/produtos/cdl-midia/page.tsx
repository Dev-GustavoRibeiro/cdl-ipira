'use client';

import React from 'react';
import {
  Breadcrumb,
  HeroSection,
  PlatformsSection,
  InitiativesSection,
  BenefitsSection,
  ContentTypesSection,
  CTASection
} from './components';

const CDLMidiaPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <Breadcrumb />
      <HeroSection />
      <PlatformsSection />
      <InitiativesSection />
      <BenefitsSection />
      <ContentTypesSection />
      <CTASection />
    </div>
  );
};

export default CDLMidiaPage;
