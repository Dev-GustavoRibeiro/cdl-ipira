'use client';

import React from 'react';
import {
  HeroSection,
  IntroSection,
  FeaturesCards,
  FeatureDetails,
  ComparisonTable,
  CTASection
} from './components';

const SPCBrasilPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <HeroSection />
      <IntroSection />
      <FeaturesCards />
      <FeatureDetails />
      <ComparisonTable />
      <CTASection />
    </div>
  );
};

export default SPCBrasilPage;
