'use client';

import React from 'react';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import { TeamMember } from './types';

interface PresidenteSectionProps {
  presidente: TeamMember;
}

const PresidenteSection = ({ presidente }: PresidenteSectionProps) => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Card Principal com efeito premium */}
          <div className="relative">
            {/* Glow dourado intenso */}
            <div className="absolute -inset-2 bg-[#ffd000]/30 rounded-[2rem] blur-2xl"></div>

            <div className="relative bg-linear-to-br from-[#002855] via-[#003f7f] to-[#002855] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#ffd000]/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]">
              {/* Barra dourada superior mais grossa */}
              <div className="h-3 bg-linear-to-r from-[#ffd000] via-[#ffdd33] to-[#ffd000]"></div>

              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Foto do Presidente */}
                <div className="relative h-[450px] sm:h-[550px] lg:h-auto lg:min-h-[600px]">
                  <div className="absolute inset-0 bg-[#002855]">
                    {presidente.photo_url ? (
                      <Image
                        src={presidente.photo_url}
                        alt={presidente.name}
                        fill
                        className="object-cover object-top"
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        quality={100}
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-linear-to-br from-[#002855] to-[#003f7f]">
                        <FaUser className="w-40 h-40 text-white/20" />
                      </div>
                    )}
                  </div>
                  {/* Gradientes premium */}
                  <div className="absolute inset-0 bg-linear-to-t from-[#001a33] via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-linear-to-r from-transparent to-[#002855]/60 lg:block hidden"></div>

                  {/* Badge Presidente Premium com glow maior */}
                  <div className="absolute top-6 left-6 z-10">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-[#ffd000] rounded-full blur-lg opacity-70"></div>
                      <div className="relative bg-linear-to-r from-[#ffd000] to-[#ffdd33] text-[#002855] px-7 py-3.5 rounded-full font-black text-base sm:text-lg shadow-2xl flex items-center gap-2.5 border-2 border-[#ffdd33]/50">
                        <span className="text-2xl">👑</span>
                        PRESIDENTE
                      </div>
                    </div>
                  </div>

                  {/* Decoração canto inferior esquerdo */}
                  <div className="absolute bottom-6 left-6">
                    <div className="w-20 h-1.5 bg-[#ffd000]/60 rounded-full mb-2"></div>
                    <div className="w-14 h-1.5 bg-[#ffd000]/40 rounded-full mb-2"></div>
                    <div className="w-8 h-1.5 bg-[#ffd000]/20 rounded-full"></div>
                  </div>

                  {/* Decoração canto superior direito */}
                  <div className="absolute top-6 right-6 hidden lg:block">
                    <div className="w-1.5 h-12 bg-[#ffd000]/40 rounded-full"></div>
                  </div>
                </div>

                {/* Informações */}
                <div className="p-8 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-center text-white relative">
                  {/* Coroa decorativa de fundo */}
                  <div className="absolute top-6 right-6 text-[120px] opacity-5 leading-none select-none pointer-events-none">
                    👑
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-1 bg-[#ffd000] rounded-full"></div>
                    <span className="text-[#ffd000] text-sm font-black uppercase tracking-widest">
                      Liderança CDL Ipirá
                    </span>
                    <div className="w-14 h-1 bg-[#ffd000] rounded-full"></div>
                  </div>

                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                    {presidente.name}
                  </h2>

                  <p className="text-[#ffd000] text-xl sm:text-2xl font-bold mb-8">
                    {presidente.position}
                  </p>

                  {presidente.bio && (
                    <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-8 text-justify">
                      {presidente.bio}
                    </p>
                  )}

                  {presidente.contribution && (
                    <div className="relative">
                      <div className="absolute -inset-1 bg-[#ffd000]/15 rounded-2xl blur-md"></div>
                      <div className="relative bg-[#001a33]/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-[#ffd000]/30">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#ffd000] flex items-center justify-center shadow-lg">
                            <span className="text-2xl">⭐</span>
                          </div>
                          <h3 className="text-[#ffd000] font-black text-base uppercase tracking-wider">
                            Contribuição
                          </h3>
                        </div>
                        <p className="text-white text-sm sm:text-base leading-relaxed text-justify">
                          {presidente.contribution}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Barra inferior premium */}
              <div className="h-3 bg-linear-to-r from-[#ffd000] via-[#00a859] to-[#ffd000]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PresidenteSection;


