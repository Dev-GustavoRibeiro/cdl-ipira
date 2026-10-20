'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { FaArrowRight, FaEye, FaPlay, FaTv } from 'react-icons/fa';
import { formatDateBR } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import { CardsSkeleton, StateBlock, cardClass, primaryButton, scrollBehavior, staggerDelay } from '../../noticias/components/LoadStates';
import { Video } from './types';

interface VideosGridProps {
  videos: Video[];
  isLoading: boolean;
  onVideoClick: (video: Video) => void;
  /** Volta para "Todas" quando a categoria escolhida não tem vídeos */
  onResetFilter?: () => void;
}

const PAGE_SIZE = 9;

const VideosGrid = ({ videos, isLoading, onVideoClick, onResetFilter }: VideosGridProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  // A página vale para a lista atual: trocar de categoria volta para a página 1
  const listKey = videos.map((video) => video.id).join(',');
  const [pageState, setPageState] = useState({ listKey, page: 1 });
  const totalPages = Math.max(1, Math.ceil(videos.length / PAGE_SIZE));
  const currentPage = pageState.listKey === listKey ? Math.min(pageState.page, totalPages) : 1;
  const pageVideos = videos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (page: number) => {
    setPageState({ listKey, page });
    sectionRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  };

  return (
    <section ref={sectionRef} className="py-10 sm:py-12 md:py-16 bg-white scroll-mt-[var(--header-height,0px)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <CardsSkeleton label="Carregando vídeos" />
        ) : videos.length === 0 ? (
          <StateBlock
            icon={FaTv}
            title="Nenhum vídeo nesta categoria"
            description="Ainda não publicamos vídeos aqui. Confira os outros conteúdos da TV Lojista."
          >
            {onResetFilter && (
              <button type="button" onClick={onResetFilter} className={primaryButton}>
                Ver todos os vídeos
              </button>
            )}
          </StateBlock>
        ) : (
          <div className="cards-grid gap-5 sm:gap-6 md:gap-8">
            {pageVideos.map((video, index) => (
              <article key={video.id} className={cardClass} style={staggerDelay(index)}>
                {/* Botão cobrindo o card inteiro: clique, toque e teclado abrem o vídeo */}
                <button
                  type="button"
                  onClick={() => onVideoClick(video)}
                  aria-label={`Assistir: ${video.title}`}
                  className="absolute inset-0 z-20 w-full cursor-pointer rounded-2xl focus-inset"
                />
                {/* Thumbnail do Vídeo */}
                <div className="relative h-48 sm:h-56 md:h-60 overflow-hidden bg-linear-to-br from-[#003f7f] to-[#0066cc] shrink-0">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    unoptimized={!isOptimizableImage(video.thumbnail)}
                    className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                  />
                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-black/10"></div>

                  {/* Badge categoria */}
                  {video.category && (
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 max-w-[60%]">
                      <span className="block truncate bg-white/95 backdrop-blur-sm text-[#003f7f] px-3 py-1.5 rounded-full text-[11px] font-black shadow-lg">
                        {video.category}
                      </span>
                    </div>
                  )}

                  {/* Botão Play (visual) */}
                  <div className="absolute inset-0 flex items-center justify-center z-10" aria-hidden="true">
                    <div className="bg-white/95 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-[0_12px_35px_-10px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100">
                      <FaPlay className="w-6 h-6 sm:w-7 sm:h-7 text-[#003f7f] translate-x-0.5" />
                    </div>
                  </div>

                  {/* Duração */}
                  {video.duration && (
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 bg-black/80 text-white px-2.5 py-1 rounded-lg text-xs font-bold tabular-nums">
                      {video.duration}
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-5 sm:p-6 flex flex-col grow">
                  <h3 className="text-lg sm:text-xl font-extrabold tracking-[-0.015em] text-gray-900 mb-2 group-hover:text-[#003f7f] transition-colors line-clamp-2 leading-snug">
                    {video.title}
                  </h3>

                  {video.description && (
                    <p className="text-sm sm:text-[15px] text-gray-600 mb-5 leading-relaxed line-clamp-3">
                      {video.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 min-w-0">
                      {video.views && (
                        <>
                          <FaEye className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{video.views}</span>
                          <span className="text-gray-300" aria-hidden="true">•</span>
                        </>
                      )}
                      <span className="truncate">{formatDateBR(video.date) || video.date}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[#00a859] font-bold text-sm shrink-0 transition-[gap] duration-300 group-hover:gap-2.5">
                      Assistir
                      <FaArrowRight className="w-3 h-3" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Paginação (só quando há mais de uma página) */}
        {!isLoading && totalPages > 1 && (
          <nav aria-label="Páginas de vídeos" className="mt-8 sm:mt-12 flex items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Página anterior"
              className="w-10 h-10 sm:w-11 sm:h-11 inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-[#003f7f] hover:text-white transition-colors duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                aria-label={`Página ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                className={page === currentPage
                  ? 'w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#003f7f] text-white font-bold text-sm sm:text-base shadow-[0_8px_20px_-8px_rgba(0,63,127,0.7)]'
                  : 'w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-100 text-gray-700 hover:bg-[#003f7f]/10 hover:text-[#003f7f] transition-colors duration-200 active:scale-[0.98] font-bold text-sm sm:text-base'}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Próxima página"
              className="w-10 h-10 sm:w-11 sm:h-11 inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-[#003f7f] hover:text-white transition-colors duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        )}
      </div>
    </section>
  );
};

export default VideosGrid;



