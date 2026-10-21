'use client';

import React from 'react';
import { FaBriefcase } from 'react-icons/fa';
import { Service } from './types';
import SectionHeader from './SectionHeader';

interface ServicesSectionProps {
  services: Service[];
}

const ServicesSection = ({ services }: ServicesSectionProps) => {
  return (
    <section aria-labelledby="servicos-titulo" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="servicos-titulo"
          eyebrow="O que oferecemos"
          icon={FaBriefcase}
          title="Serviços Oferecidos"
          subtitle="Apoio jurídico para as principais questões do comércio, do contrato à resolução de conflitos."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 md:mt-14">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-[#003f7f]/[0.06] shadow-[0_20px_50px_-20px_rgba(0,63,127,0.35)] transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(0,63,127,0.5)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7 animate-scale-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Barra nas cores da marca, aparece no hover */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
              />
              <div className="flex items-start justify-between">
                {/* service.color traz o gradiente e a cor do ícone */}
                <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br shadow-[0_12px_24px_-12px_rgba(0,63,127,0.6)] sm:h-16 sm:w-16 ${service.color}`}>
                  {service.icon}
                </span>
                <span aria-hidden="true" className="text-sm font-black tabular-nums text-gray-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-black leading-snug tracking-tight text-[#003f7f]">
                {service.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
