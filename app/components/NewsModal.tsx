'use client';

import React, { useId } from 'react';
import Link from 'next/link';
import { FaArrowRight, FaBullhorn, FaCalendarAlt, FaClock, FaNewspaper, FaUser } from 'react-icons/fa';
import { sanitizeNewsHtml } from '@/lib/sanitize';
import { formatDateLong } from '@/lib/date';
import { ModalBody, ModalChip, ModalMedia, ModalProse, ModalShell, ModalTitle, ShareButton, modalButton } from './Modal';

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
    /** Campanha ligada (embed campaigns(slug, title); o RLS já devolve null para campanha desativada) */
    campaign?: { slug: string; title: string } | null;
  } | null;
}

// Conteúdo salvo como texto puro (sem tags) vira parágrafos; HTML passa pelo DOMPurify (lista restrita de lib/sanitize)
const HTML_TAG = /<[a-z][\s\S]*?>/i;

// Quem abre pode zerar `news` ao fechar: o ModalShell segue mostrando a última notícia durante a saída
export default function NewsModal({ isOpen, onClose, news }: NewsModalProps) {
  const titleId = useId();
  const pagePath = news?.id != null ? `/imprensa/noticias/${news.id}` : null;

  return (
    <ModalShell
      isOpen={isOpen && !!news}
      onClose={onClose}
      labelledBy={titleId}
      footer={
        news &&
        pagePath && (
          <>
            <ShareButton title={news.title} url={pagePath} />
            <Link href={pagePath} className={`ml-auto max-sm:flex-1 ${modalButton.primary}`}>
              Ver página da notícia
              <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" aria-hidden="true" />
            </Link>
          </>
        )
      }
    >
      {news && <NewsContent news={news} titleId={titleId} />}
    </ModalShell>
  );
}

function NewsContent({ news, titleId }: { news: NonNullable<NewsModalProps['news']>; titleId: string }) {
  const content = news.content || '';
  // A data pode vir do banco (YYYY-MM-DD) ou já formatada pela página
  const displayDate = formatDateLong(news.date) || news.date;
  const words = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(words / 200));

  return (
    <>
      <ModalMedia
        image={news.image}
        gradient={news.color}
        fallback={<FaNewspaper aria-hidden="true" className="absolute top-1/2 right-[7%] -translate-y-1/2 -rotate-6 text-[clamp(4.5rem,18vw,8rem)] text-white/20" />}
      >
        <ModalChip tone="light" dot>
          {news.category}
        </ModalChip>
        {displayDate && (
          <ModalChip tone="glass" icon={FaCalendarAlt}>
            {displayDate}
          </ModalChip>
        )}
      </ModalMedia>

      <ModalBody>
        <ModalTitle id={titleId}>{news.title}</ModalTitle>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <ModalChip icon={FaUser}>{news.author || 'CDL Ipirá'}</ModalChip>
          <ModalChip icon={FaClock}>{readTime} min de leitura</ModalChip>
          {/* Notícia de campanha: atalho para a página dela (regulamento, lojas, sorteios) */}
          {news.campaign && (
            <Link
              href={`/imprensa/campanhas/${news.campaign.slug}`}
              className="group inline-flex min-h-8 items-center gap-1.5 rounded-full bg-[#ffd000] px-3 text-left text-xs leading-tight font-bold text-[#001a3d] transition-[background-color] duration-200 hover:bg-[#ffdb33]"
            >
              <FaBullhorn aria-hidden="true" className="h-3 w-3 shrink-0" />
              Campanha {news.campaign.title}
              <FaArrowRight aria-hidden="true" className="h-2.5 w-2.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </Link>
          )}
        </div>

        <div aria-hidden="true" className="mt-7 h-1 w-16 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />

        <ModalProse className="mt-7" {...(HTML_TAG.test(content) ? { html: sanitizeNewsHtml(content) } : { text: content })} />
      </ModalBody>
    </>
  );
}
