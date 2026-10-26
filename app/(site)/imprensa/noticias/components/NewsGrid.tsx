'use client';

import React from 'react';
import Image from 'next/image';
import { FaArrowRight, FaNewspaper, FaUser } from 'react-icons/fa';
import { formatDateBR } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import { NewsItem } from './types';
import { CardsSkeleton, StateBlock, cardClass, primaryButton, staggerDelay } from './LoadStates';

interface NewsGridProps {
  news: NewsItem[];
  isLoading: boolean;
  onOpenModal: (item: NewsItem) => void;
  /** Volta para "Todas" quando a categoria escolhida não tem notícias */
  onResetFilter?: () => void;
}

const NewsGrid = ({ news, isLoading, onOpenModal, onResetFilter }: NewsGridProps) => {
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título da lista para leitores de tela: os cartões (h3) vêm logo depois do h1 */}
        <h2 className="sr-only">Lista de notícias</h2>
        {isLoading ? (
          <CardsSkeleton label="Carregando notícias" />
        ) : news.length === 0 ? (
          <StateBlock
            icon={FaNewspaper}
            title="Nenhuma notícia por aqui"
            description="Ainda não publicamos notícias nesta categoria. Veja as outras novidades da CDL Ipirá."
          >
            {onResetFilter && (
              <button type="button" onClick={onResetFilter} className={primaryButton}>
                Ver todas as notícias
              </button>
            )}
          </StateBlock>
        ) : (
          <div className="cards-grid gap-5 sm:gap-6 md:gap-8">
            {news.map((item, index) => {
              // Data vem formatada (DD/MM/YYYY) ou crua do banco (YYYY-MM-DD)
              const [day, month, year] = (formatDateBR(item.date) || item.date || '').split('/');
              return (
                <article key={item.id} className={cardClass} style={staggerDelay(index)}>
                  {/* Botão cobrindo o cartão inteiro: clique, toque e teclado abrem a notícia */}
                  <button
                    type="button"
                    onClick={() => onOpenModal(item)}
                    aria-label={`Leia mais: ${item.title}`}
                    className="absolute inset-0 z-20 w-full cursor-pointer rounded-2xl focus-inset"
                  />

                  {/* Imagem */}
                  <div className={`relative h-48 sm:h-56 md:h-60 bg-linear-to-br ${item.color || 'from-[#003f7f] to-[#0066cc]'} overflow-hidden shrink-0`}>
                    {item.image ? (
                      <>
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                          unoptimized={!isOptimizableImage(item.image)}
                          // 1ª linha da grade: candidata a LCP, carrega sem esperar o lazy
                          loading={index < 3 ? 'eager' : undefined}
                          fetchPriority={index === 0 ? 'high' : undefined}
                          className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/10"></div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaNewspaper className="w-14 h-14 text-white/30" aria-hidden="true" />
                      </div>
                    )}

                    {/* Badge categoria */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 max-w-[60%]">
                      <span className="bg-white/95 backdrop-blur-sm text-[#003f7f] px-3 py-1.5 rounded-full text-[11px] font-black shadow-lg flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#00a859] rounded-full shrink-0"></span>
                        <span className="truncate">{item.category}</span>
                      </span>
                    </div>

                    {/* Data flutuante */}
                    {day && month && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                        <div className="bg-white rounded-xl px-2.5 py-2 shadow-lg text-center">
                          <div className="text-[#003f7f] text-lg font-black leading-none">{day}</div>
                          <div className="text-[#00703c] text-[11px] font-bold mt-1">
                            {month}/{year}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 sm:p-6 flex flex-col grow">
                    <h3 className="text-lg sm:text-xl font-extrabold tracking-[-0.015em] text-gray-900 mb-2 group-hover:text-[#003f7f] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {item.excerpt && (
                      <p className="text-sm sm:text-[15px] text-gray-600 mb-5 leading-relaxed line-clamp-3">
                        {item.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 min-w-0">
                        <FaUser className="w-3 h-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.author || 'CDL Ipirá'}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[#00703c] font-bold text-sm shrink-0 transition-[gap] duration-300 group-hover:gap-2.5">
                        Leia mais
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

export default NewsGrid;
