'use client';

import React from 'react';
import Image from 'next/image';
import { FaCrown, FaStar, FaUser } from 'react-icons/fa';
import { isOptimizableImage } from '@/lib/images';
import { TeamMember } from './types';

interface PresidenteSectionProps {
  presidente: TeamMember;
}

const PresidenteSection = ({ presidente }: PresidenteSectionProps) => {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <article className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-linear-to-br from-[#001a3d] via-[#003f7f] to-[#0052a3] p-5 shadow-[0_30px_70px_-30px_rgba(0,26,61,0.8)] sm:p-8 lg:p-10">
          <div aria-hidden="true" className="absolute -top-28 -right-20 -z-10 h-80 w-80 rounded-full bg-[#ffd000]/15 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-32 -left-24 -z-10 h-80 w-80 rounded-full bg-[#0066cc]/40 blur-3xl" />

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            {/* Foto com moldura nas cores da marca */}
            <div className="relative mx-auto w-full max-w-sm pb-5 lg:max-w-none">
              <div className="rounded-[1.75rem] bg-linear-to-br from-[#ffd000] via-[#ffed4e] to-[#00a859] p-1.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)]">
                <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-[#001a3d]">
                  {presidente.photo_url ? (
                    <Image
                      src={presidente.photo_url}
                      alt={`Foto de ${presidente.name}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 384px, 440px"
                      quality={100}
                      unoptimized={!isOptimizableImage(presidente.photo_url)}
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-[#001a3d] to-[#003f7f]">
                      <FaUser aria-hidden="true" className="h-32 w-32 text-white/20" />
                    </div>
                  )}
                </div>
              </div>
              <span className="absolute bottom-0 left-1/2 inline-flex w-max -translate-x-1/2 items-center gap-2 rounded-full bg-[#ffd000] px-5 py-2.5 text-xs font-black tracking-[0.16em] whitespace-nowrap text-[#003f7f] uppercase shadow-[0_14px_30px_-12px_rgba(255,208,0,0.9)] ring-4 ring-[#003f7f] sm:text-sm">
                <FaCrown aria-hidden="true" className="h-4 w-4" />
                Presidente
              </span>
            </div>

            {/* Informações */}
            <div className="px-1 pb-2 text-white sm:px-2 lg:py-4 lg:pr-4">
              <p className="flex items-center gap-3 text-xs font-bold tracking-[0.16em] text-[#ffd000] uppercase sm:text-sm">
                <span aria-hidden="true" className="h-0.5 w-10 rounded-full bg-[#ffd000]" />
                Liderança CDL Ipirá
              </p>
              <h2 className="mt-4 text-3xl leading-[1.05] font-black tracking-tight text-balance sm:text-5xl lg:text-6xl">{presidente.name}</h2>
              <p className="mt-3 text-lg font-bold text-[#ffd000] sm:text-xl">{presidente.position}</p>

              {presidente.bio && (
                <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-pretty text-white/85 sm:text-lg">{presidente.bio}</p>
              )}

              {presidente.contribution && (
                <div className="mt-8 rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/15 backdrop-blur-sm sm:p-7">
                  <p className="flex items-center gap-3 text-sm font-black tracking-[0.12em] text-[#ffd000] uppercase">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffd000] text-[#003f7f]">
                      <FaStar aria-hidden="true" className="h-4 w-4" />
                    </span>
                    Contribuição
                  </p>
                  <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-pretty text-white/90 sm:text-base">{presidente.contribution}</p>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default PresidenteSection;
