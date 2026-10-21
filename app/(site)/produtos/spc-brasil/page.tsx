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
    <div className="min-h-screen bg-white">
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
