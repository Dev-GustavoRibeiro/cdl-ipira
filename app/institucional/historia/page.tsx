'use client';

import React from 'react';
import {
  Breadcrumb,
  HeroSection,
  StatsSection,
  QuoteSection,
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
      <StatsSection />
      <QuoteSection />
      <HistoryContent />
      <TimelineSection />
      <PillarsSection />
      <CTASection />
    </>
  );
}
