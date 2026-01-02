import React from 'react';
import type { Metadata } from 'next';
import {
  Breadcrumb,
  HeroSection,
  CommitmentsSection,
  ContentSection
} from './components';

export const metadata: Metadata = {
  title: 'Compromisso da CDL - CDL Ipirá',
  description: 'Conheça o compromisso da CDL Ipirá com o desenvolvimento do comércio local e o fortalecimento dos associados.',
};

export default function CompromissoCDLPage() {
  return (
    <>
      <Breadcrumb />
      <HeroSection />
      <CommitmentsSection />
      <ContentSection />
    </>
  );
}
