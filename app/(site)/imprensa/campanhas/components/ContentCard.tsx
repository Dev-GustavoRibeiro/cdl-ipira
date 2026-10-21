'use client';

import React from 'react';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { isOptimizableImage } from '@/lib/images';
import { cardClass, staggerDelay } from '../../noticias/components/LoadStates';

interface ContentCardProps {
  title: string;
  /** DD/MM/YYYY */
  date: string;
  badge: string;
  text?: string;
  image?: string;
  gradient?: string;
  /** Ícone exibido quando não há imagem */
  icon: IconType;
  actionLabel: string;
  onOpen: () => void;
  index?: number;
}

/** Cartão no estilo do NewsGrid, usado para notícias, eventos realizados e álbuns. */
const ContentCard = ({
  title,
  date,
  badge,
  text,
  image,
  gradient = 'from-[#003f7f] to-[#0066cc]',
  icon: Icon,
  actionLabel,
  onOpen,
  index = 0,
}: ContentCardProps) => {
  const [day, month, year] = date.split('/');

  return (
    <article className={cardClass} style={staggerDelay(index)}>
      {/* Botão sobre o cartão inteiro: clicável e acessível por teclado */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${actionLabel}: ${title}`}
        className="absolute inset-0 z-20 w-full cursor-pointer rounded-2xl focus-inset"
      ></button>

      <div className={`relative h-48 sm:h-56 bg-linear-to-br ${gradient} overflow-hidden shrink-0`}>
        {image ? (
          <>
            <Image
              src={image}
              alt={title}
              fill
              unoptimized={!isOptimizableImage(image)}
              className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-16 h-16 text-white/30" aria-hidden="true" />
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 max-w-[60%]">
          <span className="bg-white/90 backdrop-blur-sm text-[#003f7f] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black shadow-lg flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#00a859] rounded-full shrink-0"></span>
            <span className="truncate">{badge}</span>
          </span>
        </div>

        {/* Data flutuante */}
        {day && month && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
            <div className="bg-white rounded-xl px-2.5 py-2 shadow-lg text-center">
              <div className="text-[#003f7f] text-lg font-black leading-none">{day}</div>
              <div className="text-[#00a859] text-[10px] font-bold mt-1">{month}/{year}</div>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-5 sm:p-6 flex flex-col grow">
        <h3 className="text-lg sm:text-xl font-extrabold tracking-[-0.015em] text-gray-900 mb-2 group-hover:text-[#003f7f] transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>
        {text && (
          <p className="text-sm sm:text-[15px] text-gray-600 mb-5 leading-relaxed line-clamp-3">
            {text}
          </p>
        )}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <span className="inline-flex items-center gap-1.5 text-[#00a859] font-bold text-sm transition-[gap] duration-300 group-hover:gap-2.5">
            {actionLabel}
            <FaArrowRight className="w-3 h-3" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
};

export default ContentCard;
