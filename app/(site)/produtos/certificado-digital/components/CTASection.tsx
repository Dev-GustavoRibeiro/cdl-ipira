'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaPhone } from 'react-icons/fa';
import { CTABand, btnGlass, btnYellow } from '../../_components/ProductUI';

const CTASection = () => {
  return (
    <CTABand
      title="Emita seu Certificado Digital Agora"
      description="Atendimento por videoconferência. Emita de onde estiver, com total segurança e praticidade."
      actions={
        <>
          <Link href="/imprensa/contato" className={btnYellow}>
            Solicitar Certificado
            <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-[translate] duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
          <a href="tel:+557532541599" className={btnGlass}>
            <FaPhone aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">Ligar para a Central de Atendimento:</span>
            (75) 3254-1599
          </a>
        </>
      }
    />
  );
};

export default CTASection;
