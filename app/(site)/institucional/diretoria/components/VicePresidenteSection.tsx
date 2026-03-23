'use client';

import React from 'react';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import { TeamMember } from './types';

interface VicePresidenteSectionProps {
  vicePresidentes: TeamMember[];
}

const VicePresidenteSection = ({ vicePresidentes }: VicePresidenteSectionProps) => {
  if (vicePresidentes.length === 0) return null;

  return (
    <>
      {vicePresidentes.map((vice) => (
        <section key={vice.id} className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="bg-linear-to-r from-[#0052a3] to-[#003f7f] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Informações - lado esquerdo */}
                  <div className="p-8 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-center text-white order-2 lg:order-1">
                    <span className="text-[#ffd000] text-sm font-bold uppercase tracking-widest mb-4">
                      Vice-Liderança CDL Ipirá
                    </span>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 leading-tight">
                      {vice.name}
                    </h2>

                    <p className="text-white/70 text-base sm:text-lg mb-6">
                      {vice.position}
                    </p>

                    <div className="w-20 h-1 bg-[#ffd000] rounded-full mb-6"></div>

                    {vice.function_description && (
                      <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 text-justify">
                        {vice.function_description}
                      </p>
                    )}

                    {vice.contribution && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h3 className="text-[#ffd000] font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                          <span>⭐</span> Contribuição
                        </h3>
                        <p className="text-white/95 text-sm sm:text-base leading-relaxed text-justify">
                          {vice.contribution}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Foto - lado direito */}
                  <div className="relative h-[400px] sm:h-[500px] lg:h-auto lg:min-h-[500px] order-1 lg:order-2">
                    <div className="absolute inset-0 bg-[#003f7f]">
                      {vice.photo_url ? (
                        <Image
                          src={vice.photo_url}
                          alt={vice.name}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          quality={100}
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-linear-to-br from-[#003f7f] to-[#0066cc]">
                          <FaUser className="w-32 h-32 text-white/30" />
                        </div>
                      )}
                    </div>
                    {/* Gradiente sutil */}
                    <div className="absolute inset-0 bg-linear-to-l from-transparent to-[#003f7f]/30 lg:block hidden"></div>

                    {/* Badge Vice-Presidente */}
                    <div className="absolute top-6 right-6 z-10">
                      <div className="bg-[#ffd000] text-[#003f7f] px-5 py-2.5 rounded-full font-black text-sm shadow-lg flex items-center gap-2">
                        <span className="text-lg">🛡️</span>
                        VICE-PRESIDENTE
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barra inferior */}
                <div className="h-1.5 bg-linear-to-r from-[#ffd000] via-[#003f7f] to-[#ffd000]"></div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default VicePresidenteSection;


