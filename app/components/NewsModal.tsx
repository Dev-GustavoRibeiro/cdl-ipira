'use client';

import React, { useId } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaCalendarAlt, FaClock, FaLink, FaNewspaper, FaTimes, FaUser, FaWhatsapp } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import DOMPurify from 'isomorphic-dompurify';
import { formatDateLong } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import { useIsClient, useModalBehavior } from '@/lib/hooks/useModalBehavior';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: {
    /** Com o id, o rodapé mostra o link para a página da notícia e o compartilhamento */
    id?: number | string;
    title: string;
    content: string;
    date: string;
    category: string;
    image?: string;
    author?: string;
    color?: string;
  } | null;
}

// Conteúdo salvo como texto puro (sem tags) vira parágrafos; HTML passa pelo DOMPurify
const HTML_TAG = /<[a-z][\s\S]*?>/i;

/* Casca padrão dos modais do site (mesmas classes em EventModal, JobModal e nos formulários):
   no celular abre como folha inferior; a partir de sm, painel centralizado com leve escala. */
const OVERLAY = 'fixed inset-0 z-100 flex items-end justify-center sm:items-center sm:p-6';
const BACKDROP = 'absolute inset-0 bg-[#001a3d]/70 backdrop-blur-sm transition-opacity duration-300 starting:opacity-0 motion-reduce:transition-none';
const PANEL = 'relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_-24px_60px_-24px_rgba(0,26,61,0.55)] outline-none transition-[opacity,translate,scale] duration-300 ease-out starting:translate-y-full sm:max-h-[90dvh] sm:rounded-3xl sm:shadow-[0_40px_100px_-30px_rgba(0,26,61,0.7)] sm:starting:translate-y-4 sm:starting:scale-[0.97] sm:starting:opacity-0 motion-reduce:transition-none';
const CLOSE = 'absolute top-3 right-3 z-30 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#003f7f] shadow-[0_8px_20px_-8px_rgba(0,26,61,0.6)] ring-1 ring-black/5 backdrop-blur-md transition-[scale,background-color] duration-200 hover:scale-105 hover:bg-white active:scale-95 motion-reduce:hover:scale-100 sm:top-4 sm:right-4';
const FOOTER = 'flex shrink-0 items-center gap-3 border-t border-gray-100 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8';
const BTN_PRIMARY = 'inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#003f7f] to-[#0066cc] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)] active:scale-[0.98] motion-reduce:hover:translate-y-0';
const BTN_ICON = 'grid h-11 w-11 shrink-0 place-items-center rounded-full transition-[translate,scale,background-color] duration-200 hover:-translate-y-0.5 active:scale-95 motion-reduce:hover:translate-y-0';

export default function NewsModal({ isOpen, onClose, news }: NewsModalProps) {
  const isClient = useIsClient();
  const titleId = useId();
  const dialogRef = useModalBehavior<HTMLDivElement>(isOpen && !!news, onClose);

  if (!isClient || !isOpen || !news) return null;

  const content = news.content || '';
  const isHtml = HTML_TAG.test(content);
  // A data pode vir do banco (YYYY-MM-DD) ou já formatada pela página
  const displayDate = formatDateLong(news.date) || news.date;
  const words = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(words / 200));
  const pagePath = news.id != null ? `/imprensa/noticias/${news.id}` : null;
  const shareUrl = pagePath ? `${window.location.origin}${pagePath}` : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copiado!');
    } catch {
      toast.error('Não foi possível copiar o link.');
    }
  };

  return createPortal(
    <div className={OVERLAY}>
      <div aria-hidden="true" onClick={onClose} className={BACKDROP} />

      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={`${PANEL} sm:max-w-3xl`}>
        <button type="button" onClick={onClose} aria-label="Fechar" className={CLOSE}>
          <FaTimes className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {/* Capa 16:9 com degradê; sem imagem, a cor da notícia */}
          <div className={`relative aspect-video w-full shrink-0 overflow-hidden bg-linear-to-br sm:max-h-[44dvh] ${news.color || 'from-[#003f7f] to-[#0066cc]'}`}>
            {news.image ? (
              <Image
                src={news.image}
                alt=""
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                unoptimized={!isOptimizableImage(news.image)}
                className="object-cover"
              />
            ) : (
              <FaNewspaper aria-hidden="true" className="absolute inset-0 m-auto text-7xl text-white/25" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-[#001a3d]/80 via-[#001a3d]/10 to-transparent" />

            <div className="absolute right-5 bottom-5 left-5 flex flex-wrap items-center gap-2 sm:right-8 sm:bottom-6 sm:left-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-black tracking-wide text-[#003f7f] uppercase shadow-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00a859]" aria-hidden="true" />
                {news.category}
              </span>
              {displayDate && (
                <span className="inline-flex items-center gap-2 rounded-full bg-[#001a3d]/55 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-md">
                  <FaCalendarAlt className="h-3 w-3 text-[#ffd000]" aria-hidden="true" />
                  {displayDate}
                </span>
              )}
            </div>
          </div>

          <article className="px-5 pt-7 pb-10 sm:px-10 sm:pt-9 sm:pb-12">
            <h2 id={titleId} className="max-w-[24ch] text-[1.75rem] leading-[1.1] font-black tracking-tight text-balance text-[#003f7f] sm:text-4xl">
              {news.title}
            </h2>
            <div className="mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" aria-hidden="true" />

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2.5 font-semibold text-gray-800">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#003f7f]/10 text-[#003f7f]">
                  <FaUser className="h-3 w-3" aria-hidden="true" />
                </span>
                {news.author || 'CDL Ipirá'}
              </span>
              <span className="inline-flex items-center gap-2">
                <FaClock className="h-3.5 w-3.5 text-[#00a859]" aria-hidden="true" />
                {readTime} min de leitura
              </span>
            </div>

            <div className="mt-7 max-w-[65ch] border-t border-gray-100 pt-7 text-base sm:text-[17px]">
              {isHtml ? (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
              ) : (
                <div className="prose max-w-none">
                  {content.split(/\n+/).filter((paragraph) => paragraph.trim()).map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>

        {pagePath && (
          <div className={FOOTER}>
            <span className="hidden text-xs font-bold tracking-[0.14em] text-gray-500 uppercase sm:inline">Compartilhar</span>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${news.title} ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Compartilhar no WhatsApp"
              className={`${BTN_ICON} bg-[#00a859] text-white shadow-[0_10px_24px_-12px_rgba(0,168,89,0.9)] hover:bg-[#008f4c]`}
            >
              <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
            </a>
            <button type="button" onClick={copyLink} aria-label="Copiar link da notícia" className={`${BTN_ICON} bg-gray-100 text-[#003f7f] hover:bg-gray-200`}>
              <FaLink className="h-4 w-4" aria-hidden="true" />
            </button>
            <Link href={pagePath} className={`group ml-auto ${BTN_PRIMARY}`}>
              Ver página da notícia
              <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
