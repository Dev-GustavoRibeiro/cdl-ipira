'use client';

import React from 'react';
import {
  Breadcrumb,
  HeroSection,
  CertificateTypesSection,
  BenefitsSection,
  EmissionProcessSection,
  CTASection
} from './components';

const CertificadoDigitalPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <Breadcrumb />
      <HeroSection />
      <CertificateTypesSection />
      <BenefitsSection />
      <EmissionProcessSection />
      <CTASection />
    </div>
  );
};

export default CertificadoDigitalPage;
