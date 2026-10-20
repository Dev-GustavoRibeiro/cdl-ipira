import React from 'react';
import type { Metadata } from 'next';
import { CampanhasContent } from './components';

const description =
  'Conheça as campanhas da CDL Ipirá que movimentam o comércio local: novidades, próximos eventos e tudo o que já realizamos.';

export const metadata: Metadata = {
  title: 'Campanhas',
  description,
  openGraph: {
    title: 'Campanhas - CDL Ipirá',
    description,
    url: '/imprensa/campanhas',
    type: 'website',
  },
};

export default function CampanhasPage() {
  return <CampanhasContent />;
}
