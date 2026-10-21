import React from 'react';
import Image from 'next/image';
import { FaBook, FaCalendarAlt, FaEye, FaDownload } from 'react-icons/fa';
import { parseDateOnly } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import { Magazine } from './types';

interface LatestMagazineSectionProps {
  magazine: Magazine;
}

const LatestMagazineSection = ({ magazine }: LatestMagazineSectionProps) => {
  return (
    <section className="py-8 sm:py-12 bg-linear-to-r from-[#003f7f] to-[#0052a3]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="inline-block bg-[#ffd000] text-[#003f7f] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide shadow-[0_12px_30px_-12px_rgba(255,208,0,0.9)]">
            Edição Mais Recente
          </span>
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_30px_60px_-25px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Capa */}
            <div className="md:w-1/3 relative aspect-3/4 md:aspect-auto md:min-h-80 bg-linear-to-br from-[#003f7f] to-[#0052a3]">
              {magazine.cover_url ? (
                <Image
                  src={magazine.cover_url}
                  alt={`Capa: ${magazine.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  unoptimized={!isOptimizableImage(magazine.cover_url)}
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FaBook className="w-24 h-24 text-white/30" aria-hidden="true" />
                </div>
              )}
            </div>
            {/* Info */}
            <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <FaCalendarAlt className="w-4 h-4 text-[#00a859] shrink-0" aria-hidden="true" />
                <span className="inline-block first-letter:uppercase">
                  {parseDateOnly(magazine.date)?.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
                {magazine.edition && (
                  <span className="bg-[#003f7f]/10 text-[#003f7f] px-2.5 py-0.5 rounded-full text-xs font-bold">
                    Edição {magazine.edition}
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-[-0.015em] text-[#003f7f] mb-3">
                {magazine.title}
              </h2>
              {magazine.description && (
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {magazine.description}
                </p>
              )}
              <div className="flex gap-3">
                <a
                  href={magazine.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-6 py-3 rounded-full font-bold shadow-[0_12px_28px_-12px_rgba(0,63,127,0.7)] hover:bg-[#0052a3] hover:-translate-y-0.5 active:scale-[0.98] transition-[transform,translate,scale,background-color] duration-200"
                >
                  <FaEye className="w-4 h-4" aria-hidden="true" />
                  Ler Revista
                </a>
                <a
                  href={magazine.file_url}
                  download
                  aria-label={`Baixar ${magazine.title}`}
                  title="Baixar PDF"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#003f7f] text-[#003f7f] px-5 py-3 rounded-full font-bold hover:bg-[#003f7f] hover:text-white active:scale-[0.98] transition-[transform,translate,scale,background-color,color] duration-200"
                >
                  <FaDownload className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestMagazineSection;



