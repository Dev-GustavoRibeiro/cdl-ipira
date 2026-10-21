'use client';

import React from 'react';
import Image from 'next/image';
import { FaArrowRight, FaCalendarAlt, FaMapMarkerAlt, FaImages } from 'react-icons/fa';
import { formatDateLong } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import { CardsSkeleton, StateBlock, cardClass, primaryButton, staggerDelay } from '../../noticias/components/LoadStates';
import { Album } from './types';

interface AlbumsGridProps {
  albums: Album[];
  isLoading: boolean;
  onOpenModal: (album: Album) => void;
  /** Limpa busca e categoria quando nada é encontrado */
  onResetFilters?: () => void;
}

const AlbumsGrid = ({ albums, isLoading, onOpenModal, onResetFilters }: AlbumsGridProps) => {
  return (
    <section className="py-10 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        {isLoading ? (
          <CardsSkeleton label="Carregando álbuns" />
        ) : albums.length === 0 ? (
          <StateBlock
            icon={FaImages}
            title="Nenhum álbum encontrado"
            description="Tente outra busca ou categoria. Novos álbuns são publicados após cada evento."
          >
            {onResetFilters && (
              <button type="button" onClick={onResetFilters} className={primaryButton}>
                Ver todos os álbuns
              </button>
            )}
          </StateBlock>
        ) : (
          <div className="cards-grid gap-5 sm:gap-6 md:gap-8">
            {albums.map((album, index) => {
              const photoCount = album.photo_count || 0;
              const photoLabel = `${photoCount} ${photoCount === 1 ? 'foto' : 'fotos'}`;
              return (
                <article key={album.id} className={cardClass} style={staggerDelay(index)}>
                  {/* Botão cobrindo o card inteiro: clique, toque e teclado abrem o álbum */}
                  <button
                    type="button"
                    onClick={() => onOpenModal(album)}
                    aria-label={`Ver fotos do álbum ${album.title}`}
                    className="absolute inset-0 z-20 w-full cursor-pointer rounded-2xl focus-inset"
                  />
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-linear-to-br from-[#003f7f] to-[#0052a3] shrink-0">
                    {album.cover_url ? (
                      <Image
                        src={album.cover_url}
                        alt={album.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                        unoptimized={!isOptimizableImage(album.cover_url)}
                        className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FaImages className="w-16 h-16 text-white/30" aria-hidden="true" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold">
                      <FaImages className="w-3 h-3" aria-hidden="true" />
                      {photoLabel}
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col grow">
                    {album.category && (
                      <span className="self-start bg-[#003f7f]/10 text-[#003f7f] px-3 py-1 rounded-full text-[11px] font-black mb-3">
                        {album.category}
                      </span>
                    )}
                    <h3 className="text-lg sm:text-xl font-extrabold tracking-[-0.015em] text-gray-900 mb-3 group-hover:text-[#003f7f] transition-colors line-clamp-2 leading-snug">
                      {album.title}
                    </h3>
                    <ul className="flex flex-col gap-2 text-sm text-gray-600 mb-5">
                      <li className="flex items-center gap-2">
                        <FaCalendarAlt className="w-3.5 h-3.5 text-[#00a859] shrink-0" aria-hidden="true" />
                        <span>{formatDateLong(album.date)}</span>
                      </li>
                      {album.location && (
                        <li className="flex items-center gap-2 min-w-0">
                          <FaMapMarkerAlt className="w-3.5 h-3.5 text-[#0066cc] shrink-0" aria-hidden="true" />
                          <span className="truncate">{album.location}</span>
                        </li>
                      )}
                    </ul>
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <span className="inline-flex items-center gap-1.5 text-[#00a859] font-bold text-sm transition-[gap] duration-300 group-hover:gap-2.5">
                        Ver {photoLabel}
                        <FaArrowRight className="w-3 h-3" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default AlbumsGrid;
