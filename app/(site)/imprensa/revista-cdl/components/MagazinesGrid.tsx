import React from 'react';
import Image from 'next/image';
import { FaBook, FaCalendarAlt, FaEye, FaDownload } from 'react-icons/fa';
import { parseDateOnly } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import { StateBlock, staggerDelay } from '../../noticias/components/LoadStates';
import { Magazine } from './types';

// Estante: 2 capas por linha no celular e largura fixa nas telas maiores; a última linha fica centralizada
export const MAGAZINES_GRID = 'flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8';
export const MAGAZINE_ITEM_WIDTH = 'w-[calc(50%-0.375rem)] sm:w-72';

interface MagazinesGridProps {
  magazines: Magazine[];
  searchTerm: string;
}

const MagazinesGrid = ({ magazines, searchTerm }: MagazinesGridProps) => {
  if (magazines.length === 0) {
    // Sem busca, a única edição já está em destaque acima: não precisa de aviso
    if (!searchTerm) return null;
    return (
      <StateBlock
        icon={FaBook}
        title="Nenhuma edição encontrada"
        description="Tente buscar pelo título ou pelo número da edição."
      />
    );
  }

  return (
    <div className={MAGAZINES_GRID}>
      {magazines.map((magazine, index) => (
        <article
          key={magazine.id}
          className={`${MAGAZINE_ITEM_WIDTH} group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100 shadow-[0_10px_30px_-18px_rgba(0,63,127,0.35)] transition-[transform,translate,scale,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-20px_rgba(0,63,127,0.45)] motion-reduce:hover:translate-y-0 animate-scale-in`}
          style={staggerDelay(index)}
        >
          {/* Capa */}
          <div className="relative aspect-3/4 bg-linear-to-br from-[#003f7f] to-[#0052a3] flex items-center justify-center overflow-hidden shrink-0">
            {magazine.cover_url ? (
              <Image
                src={magazine.cover_url}
                alt={`Capa: ${magazine.title}`}
                fill
                sizes="(max-width: 640px) 50vw, 288px"
                unoptimized={!isOptimizableImage(magazine.cover_url)}
                className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            ) : (
              <FaBook className="w-20 h-20 text-white/30" aria-hidden="true" />
            )}
          </div>

          {/* Info */}
          <div className="p-3.5 sm:p-5 flex flex-col grow">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-gray-500 mb-1.5 sm:mb-2">
              <FaCalendarAlt className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00a859] shrink-0" aria-hidden="true" />
              {/* Só a primeira letra maiúscula: "Julho de 2026" (capitalize deixaria "De") */}
              <span className="inline-block first-letter:uppercase">
                {parseDateOnly(magazine.date)?.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h3 className="text-sm sm:text-lg font-extrabold tracking-[-0.015em] text-[#003f7f] mb-1 line-clamp-3 leading-snug">
              {magazine.title}
            </h3>
            {magazine.edition && (
              <p className="text-xs sm:text-sm text-gray-500 mb-2">Edição {magazine.edition}</p>
            )}
            {magazine.description && (
              // .line-clamp-2 (globals.css) define display e venceria o "hidden": o wrapper esconde no celular
              <div className="hidden sm:block mb-4">
                <p className="text-sm text-gray-600 line-clamp-2">{magazine.description}</p>
              </div>
            )}
            <div className="flex gap-2 mt-auto pt-3">
              <a
                href={magazine.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm hover:bg-[#0052a3] active:scale-[0.98] transition-[transform,translate,scale,background-color] duration-200"
              >
                <FaEye className="w-3.5 h-3.5" aria-hidden="true" />
                Ler
              </a>
              <a
                href={magazine.file_url}
                download
                aria-label={`Baixar ${magazine.title}`}
                title="Baixar PDF"
                className="w-9 sm:w-11 shrink-0 inline-flex items-center justify-center border-2 border-[#003f7f] text-[#003f7f] rounded-full hover:bg-[#003f7f] hover:text-white active:scale-[0.98] transition-[transform,translate,scale,background-color,color] duration-200"
              >
                <FaDownload className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default MagazinesGrid;
