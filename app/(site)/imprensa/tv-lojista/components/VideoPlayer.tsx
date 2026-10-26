'use client';

import React, { useEffect, useRef } from 'react';
import { formatDateBR } from '@/lib/date';
import ThirdPartyEmbed from '../../noticias/components/ThirdPartyEmbed';
import { Video } from './types';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

const VideoPlayer = ({ video, onClose }: VideoPlayerProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Quem abriu pelo teclado continua no player (o foco não fica preso no cartão lá embaixo)
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, [video.id]);

  return (
    <section id="video-player" aria-label="Player de vídeo" className="py-8 sm:py-12 bg-white border-b border-gray-200 scroll-mt-[var(--header-height,0px)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Largura limitada pela altura livre (tela - header - título e respiros): em notebook 1280x720 o player 16:9
            inteiro, com a barra de controles, cabe na tela */}
        <div className="max-w-[min(64rem,max(18rem,calc((100dvh-var(--header-height,0px)-9rem)*16/9)))] mx-auto animate-blur-fade-in">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 ref={titleRef} tabIndex={-1} className="text-xl sm:text-3xl font-black tracking-[-0.015em] text-[#003f7f]">
              {video.title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 w-11 h-11 inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#003f7f] hover:text-white active:scale-[0.98] transition-[background-color,color,scale] duration-200"
              aria-label="Fechar vídeo"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Sem consentimento, o aviso ocupa o lugar do player (cresce no celular se o texto não couber em 16:9) */}
          <ThirdPartyEmbed
            provider="YouTube"
            link={video.youtube_id ? { href: `https://www.youtube.com/watch?v=${video.youtube_id}`, label: 'Assistir no YouTube' } : undefined}
            className="aspect-video rounded-xl sm:rounded-2xl shadow-2xl"
          >
            <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-black">
              <iframe
                src={video.videoUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                // credentialless: o iframe roda numa sessão descartável (os cookies do YouTube não ficam no navegador da
                // pessoa). O React já trata o atributo como booleano; os tipos ainda não, daí o spread
                {...{ credentialless: true }}
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </ThirdPartyEmbed>

          <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDateBR(video.date) || video.date}</span>
              </div>
              {video.duration && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{video.duration}</span>
                </div>
              )}
              {video.views && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{video.views} visualizações</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="bg-[#003f7f] text-white px-3 py-1 rounded-full text-xs font-bold">
                  {video.category}
                </span>
              </div>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              {video.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoPlayer;



