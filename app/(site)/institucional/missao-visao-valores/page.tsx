'use client';

import React from 'react';
import {
  Breadcrumb,
  HeroSection,
  MissaoVisaoSection,
  ValoresSection,
  CompromissoSection,
  CTASection
} from './components';

export default function MissaoVisaoValoresPage() {
  return (
    <>
      <Breadcrumb />
      <HeroSection />
      {/* Citação da diretoria sai até a diretoria aprovar o texto (QuoteSection fica guardado) */}
      <MissaoVisaoSection />
      <ValoresSection />
      <CompromissoSection />
      <CTASection />
    </>
  );
}
