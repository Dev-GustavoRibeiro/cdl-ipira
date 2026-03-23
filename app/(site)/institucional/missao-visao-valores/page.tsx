'use client';

import React from 'react';
import {
  GlobalStyles,
  Breadcrumb,
  HeroSection,
  QuoteSection,
  MissaoVisaoSection,
  ValoresSection,
  CompromissoSection,
  CTASection
} from './components';

export default function MissaoVisaoValoresPage() {
  return (
    <>
      <GlobalStyles />
      <Breadcrumb />
      <HeroSection />
      <QuoteSection />
      <MissaoVisaoSection />
      <ValoresSection />
      <CompromissoSection />
      <CTASection />
    </>
  );
}
