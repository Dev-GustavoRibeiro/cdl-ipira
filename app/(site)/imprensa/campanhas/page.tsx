import React from 'react';
import JsonLd from '@/app/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { CampanhasContent } from './components';

const PATH = '/imprensa/campanhas';

export const metadata = pageMetadata({
  title: 'Campanhas',
  description:
    'Campanhas da CDL Ipirá que movimentam o comércio de Ipirá-BA: promoções, sorteios e ações para lojistas e consumidores. Veja as atuais e as próximas.',
  path: PATH,
});

export default function CampanhasPage() {
  return (
    <>
      <CampanhasContent />
      <JsonLd data={[breadcrumbJsonLd(['Campanhas', PATH])]} />
    </>
  );
}
