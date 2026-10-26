'use client';

import React from 'react';
import {
  Breadcrumb,
  HeroSection,
  HistoryContent,
  TimelineSection,
  PillarsSection,
  CTASection
} from './components';

export default function HistoriaPage() {
  return (
    <>
      <Breadcrumb />
      <HeroSection />
      {/* Números e citação dos fundadores saem até a CDL confirmar os dados (StatsSection/QuoteSection ficam guardados) */}
      <HistoryContent />
      <TimelineSection />
      <PillarsSection />
      <CTASection />
    </>
  );
}
