'use client';

import React from 'react';
import {
  HeroSection,
  IntroSection,
  CertificateTypesSection,
  BenefitsSection,
  EmissionProcessSection,
  CTASection
} from './components';

const CertificadoDigitalPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <IntroSection />
      <CertificateTypesSection />
      <BenefitsSection />
      <EmissionProcessSection />
      <CTASection />
    </div>
  );
};

export default CertificadoDigitalPage;
