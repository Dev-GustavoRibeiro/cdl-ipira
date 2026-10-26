import React from 'react';
import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import {
  Breadcrumb,
  HeroSection,
  CommitmentsSection,
  ContentSection
} from './components';

const PATH = '/institucional/compromisso-cdl';

export const metadata = pageMetadata({
  title: 'Compromisso da CDL',
  description:
    'O compromisso da CDL Ipirá com os associados: representação, serviços e ações que fortalecem o comércio e o desenvolvimento econômico de Ipirá-BA.',
  path: PATH,
});

export default function CompromissoCDLPage() {
  return (
    <>
      <Breadcrumb />
      <HeroSection />
      <CommitmentsSection />
      <ContentSection />
      <JsonLd data={[breadcrumbJsonLd(['Compromisso CDL', PATH])]} />
    </>
  );
}
