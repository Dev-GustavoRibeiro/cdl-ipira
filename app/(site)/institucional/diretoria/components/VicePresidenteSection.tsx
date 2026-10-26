'use client';

import React from 'react';
import Image from 'next/image';
import { FaShieldAlt, FaStar, FaUser } from 'react-icons/fa';
import { isOptimizableImage } from '@/lib/images';
import { shadowCard } from '../../_components/ui';
import { sameText } from './MemberCard';
import { TeamMember } from './types';

interface VicePresidenteSectionProps {
  vicePresidentes: TeamMember[];
}

const VicePresidenteSection = ({ vicePresidentes }: VicePresidenteSectionProps) => {
  if (vicePresidentes.length === 0) return null;

  return (
    <section className="bg-white pb-16 sm:pb-20 lg:pb-24">
      <div className="container mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
        {vicePresidentes.map((vice) => (
          <article
            key={vice.id}
            className={`relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-white p-5 ring-1 ring-[#003f7f]/[0.07] sm:p-8 lg:p-10 ${shadowCard}`}
          >
            <div aria-hidden="true" className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#0066cc]/[0.06] blur-3xl" />
            <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
              {/* Informações */}
              <div className="order-2 px-1 pb-2 sm:px-2 lg:order-1 lg:py-4 lg:pl-4">
                <p className="flex items-center gap-3 text-xs font-bold tracking-[0.16em] text-[#003f7f] uppercase sm:text-sm">
                  <span aria-hidden="true" className="h-0.5 w-10 rounded-full bg-[#ffd000]" />
                  Vice-Liderança CDL Ipirá
                </p>
                <h2 className="mt-4 text-3xl leading-[1.05] font-black tracking-tight text-balance text-[#003f7f] sm:text-4xl lg:text-5xl">{vice.name}</h2>
                {!sameText(vice.position, vice.name) && <p className="mt-3 text-lg font-bold text-gray-700">{vice.position}</p>}

                {vice.function_description && !sameText(vice.function_description, vice.position) && (
                  <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-pretty text-gray-700 sm:text-lg">{vice.function_description}</p>
                )}

                {vice.contribution && (
                  <div className="mt-8 rounded-2xl bg-gray-50 p-5 ring-1 ring-[#003f7f]/[0.06] sm:p-7">
                    <p className="flex items-center gap-3 text-sm font-black tracking-[0.12em] text-[#003f7f] uppercase">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffd000] text-[#003f7f]">
                        <FaStar aria-hidden="true" className="h-4 w-4" />
                      </span>
                      Contribuição
                    </p>
                    <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-pretty text-gray-700">{vice.contribution}</p>
                  </div>
                )}
              </div>

              {/* Foto com moldura azul */}
              <div className="relative order-1 mx-auto w-full max-w-sm pb-5 lg:order-2 lg:max-w-none">
                <div className="rounded-[1.75rem] bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#00a859] p-1.5 shadow-[0_24px_50px_-24px_rgba(0,63,127,0.7)]">
                  <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-gray-100">
                    {vice.photo_url ? (
                      <Image
                        src={vice.photo_url}
                        alt={`Foto de ${vice.name}`}
                        fill
                        sizes="(max-width: 1024px) 384px, 400px"
                        quality={100}
                        unoptimized={!isOptimizableImage(vice.photo_url)}
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-linear-to-br from-[#003f7f] to-[#0066cc]">
                        <FaUser aria-hidden="true" className="h-28 w-28 text-white/30" />
                      </div>
                    )}
                  </div>
                </div>
                <span className="absolute bottom-0 left-1/2 inline-flex w-max -translate-x-1/2 items-center gap-2 rounded-full bg-[#003f7f] px-5 py-2.5 text-xs font-black tracking-[0.16em] whitespace-nowrap text-white uppercase shadow-[0_14px_30px_-12px_rgba(0,63,127,0.9)] ring-4 ring-white sm:text-sm">
                  <FaShieldAlt aria-hidden="true" className="h-4 w-4 text-[#ffd000]" />
                  Vice-presidente
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default VicePresidenteSection;
