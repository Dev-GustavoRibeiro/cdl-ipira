'use client';

import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import { SectionHeader } from '../../_components/ProductUI';

const IntroSection = () => {
  return (
    <section aria-labelledby="spc-sobre" className="bg-linear-to-b from-gray-50 to-white pt-16 md:pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="spc-sobre"
          eyebrow="Sobre o SPC"
          icon={FaShieldAlt}
          title="O que é o SPC Brasil?"
          subtitle="O SPC Brasil é o serviço de proteção ao crédito do Sistema CNDL, do qual a CDL Ipirá faz parte. Pela CDL, a empresa associada consulta CPF e CNPJ antes de vender a prazo e tem acesso às soluções do SPC Brasil."
        />
      </div>
    </section>
  );
};

export default IntroSection;
