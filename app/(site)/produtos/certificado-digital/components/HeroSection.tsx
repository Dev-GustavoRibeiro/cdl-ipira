'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaBuilding, FaCertificate, FaGavel, FaLock, FaPhone, FaShieldAlt, FaUserMd, FaVideo } from 'react-icons/fa';
import { HeroPanel, ProductHero, btnGlass, btnYellow } from '../../_components/ProductUI';

const HeroSection = () => {
  return (
    <ProductHero
      crumb="Certificado Digital"
      eyebrow="ICP-Brasil"
      icon={FaCertificate}
      title="Certificado"
      highlight="Digital"
      lead="Realize transações online e troca de documentos virtuais com segurança!"
      description="Oferecemos certificados digitais ICP-Brasil destinados à pessoa física e pessoa jurídica, e-jurídica destinado a advogados, e-saúde para enfermeiros e médicos de acordo com a necessidade de cada cliente."
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
      chips={[
        { icon: FaShieldAlt, label: 'Validade jurídica' },
        { icon: FaLock, label: 'Criptografia de alto nível' },
        { icon: FaVideo, label: 'Emissão por videoconferência' },
      ]}
      aside={
        <HeroPanel
          title="Opções para cada perfil"
          description="Na CDL Ipirá, você encontra certificados digitais da ICP-Brasil, com opções pensadas para diferentes perfis e necessidades:"
          items={[
            { icon: FaBuilding, title: 'Pessoa Física e Jurídica', text: 'Certificado ICP-Brasil para uso geral', accent: 'sky', href: '#certificado-1' },
            { icon: FaGavel, title: 'e-Jurídico', text: 'Exclusivo para advogados', accent: 'green', href: '#certificado-2' },
            { icon: FaUserMd, title: 'e-Saúde', text: 'Ideal para médicos, enfermeiros e profissionais da saúde', accent: 'yellow', href: '#certificado-3' },
          ]}
        />
      }
    />
  );
};

export default HeroSection;
