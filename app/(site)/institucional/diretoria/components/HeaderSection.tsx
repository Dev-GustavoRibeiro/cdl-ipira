'use client';

import React from 'react';
import { FaUsers } from 'react-icons/fa';
import { PageHero } from '../../_components/ui';

const HeaderSection = () => (
  <PageHero
    icon={FaUsers}
    eyebrow="Nossa Liderança"
    title="Diretoria"
    description="Conheça os profissionais que lideram a CDL Ipirá e trabalham pelo fortalecimento do comércio local."
  />
);

export default HeaderSection;
