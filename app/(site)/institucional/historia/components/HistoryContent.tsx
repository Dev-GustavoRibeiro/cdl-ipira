'use client';

import React from 'react';
import Image from 'next/image';
import { FaBuilding, FaGem } from 'react-icons/fa';
import { SectionHeader, shadowCard } from '../../_components/ui';

const HistoryContent = () => {
  return (
    <section className="bg-white pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Foto da sede com moldura e selo */}
          <div className="relative order-2 mx-auto w-full max-w-xl lg:order-1">
            <div aria-hidden="true" className="absolute -right-3 -bottom-3 h-2/3 w-2/3 rounded-3xl bg-[#ffd000]/30 sm:-right-5 sm:-bottom-5" />
            <div className={`relative aspect-4/5 overflow-hidden rounded-3xl bg-[#003f7f] ring-1 ring-[#003f7f]/10 sm:aspect-4/3 lg:aspect-4/5 ${shadowCard}`}>
              <Image
                src="/cdl-ipira-sede.jpg"
                alt="Sede da CDL Ipirá no centro da cidade"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[#001a3d]/50 via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/95 p-3 pr-5 shadow-[0_20px_40px_-20px_rgba(0,26,61,0.6)] ring-1 ring-black/5 backdrop-blur-sm sm:bottom-6 sm:left-6 sm:p-4 sm:pr-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ffd000] text-[#003f7f] sm:h-12 sm:w-12">
                <FaBuilding aria-hidden="true" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs font-medium text-gray-600">Sede própria</span>
                <span className="block text-base font-black tracking-tight text-[#003f7f] sm:text-lg">Centro de Ipirá</span>
              </span>
            </div>
          </div>

          {/* Texto */}
          <div className="order-1 lg:order-2">
            <SectionHeader
              icon={FaGem}
              eyebrow="Nossa Fundação"
              align="left"
              className="mb-8"
              title={
                <>
                  O Início de Uma <span className="block text-[#00a859]">Grande Jornada</span>
                </>
              }
            />

            <div className="max-w-[62ch] space-y-5 text-base leading-relaxed text-gray-700 sm:text-lg">
              <p>
                A <strong className="text-[#003f7f]">Câmara de Dirigentes Lojistas de Ipirá (CDL Ipirá)</strong> nasceu do sonho de um grupo de
                empresários visionários que acreditavam no poder da união para fortalecer o comércio local.
              </p>
              <p>
                Desde sua fundação, a CDL Ipirá tem sido uma instituição fundamental para o{' '}
                <strong className="text-[#003f7f]">desenvolvimento econômico e social</strong> de nossa cidade, oferecendo serviços essenciais
                como o SPC Brasil, assessoria jurídica, certificado digital e muito mais.
              </p>
              <p>
                Ao longo dos anos, expandimos nossa atuação, sempre inovando e buscando as melhores soluções para nossos associados.
                Promovemos eventos, cursos e ações que fortalecem não apenas o setor comercial, mas toda a comunidade.
              </p>
            </div>

            {/* Destaque */}
            <div className="relative mt-8 max-w-[62ch] overflow-hidden rounded-2xl bg-linear-to-r from-[#003f7f]/[0.05] to-[#00a859]/[0.06] p-6 pl-7 ring-1 ring-[#003f7f]/[0.07]">
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-[#003f7f] via-[#00a859] to-[#ffd000]" />
              <p className="text-lg font-black tracking-tight text-[#003f7f]">Nossa missão continua</p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 sm:text-base">
                Com uma trajetória marcada pela dedicação, continuamos sendo parceiros essenciais para o sucesso dos negócios em Ipirá.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryContent;
