'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaPhoneAlt } from 'react-icons/fa';
import { CTABand, btnGlass, btnYellow } from '../../_components/ProductUI';
import { CONTACT } from '@/app/components/navigation/navItems';

const CTASection = () => {
  return (
    <CTABand
      title="Destaque sua Empresa nas Redes Sociais"
      description="Fale com a CDL Ipirá para saber como divulgar a sua empresa nos perfis da entidade."
      actions={
        <>
          <Link href="/imprensa/contato" className={btnYellow}>
            Quero Participar
            <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-[translate] duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
          <a href={CONTACT.phone.href} className={btnGlass}>
            <FaPhoneAlt aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">Ligar para a Central de Atendimento:</span>
            {CONTACT.phone.label}
          </a>
        </>
      }
    />
  );
};

export default CTASection;
