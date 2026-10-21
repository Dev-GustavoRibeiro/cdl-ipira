'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { isOptimizableImage } from '@/lib/images';
import { FaTimes, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaMapMarkerAlt, FaImages, FaExternalLinkAlt } from 'react-icons/fa';
import { formatDateBR } from '@/lib/date';
import { useIsClient, useModalBehavior } from '@/lib/hooks/useModalBehavior';
import { Album, AlbumPhoto } from './types';

interface PhotoModalProps {
  isOpen: boolean;
  album: Album | null;
  photos: AlbumPhoto[];
  selectedPhotoIndex: number;
  isLoadingPhotos: boolean;
  onClose: () => void;
  onPrevPhoto: () => void;
  onNextPhoto: () => void;
  onSelectPhoto: (index: number) => void;
}

// Mesmo botão de fechar dos demais modais do site
const CLOSE = 'grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/90 text-[#003f7f] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)] ring-1 ring-black/5 backdrop-blur-md transition-[scale,background-color] duration-200 hover:scale-105 hover:bg-white active:scale-95 motion-reduce:hover:scale-100';
// Botões de vidro sobre o fundo escuro
const GLASS = 'grid place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-md transition-[scale,background-color] duration-200 hover:bg-white/20 active:scale-95';
const CHIP = 'inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/15';

const SWIPE_MIN = 50;

const PhotoModal = ({
  isOpen,
  album,
  photos,
  selectedPhotoIndex,
  isLoadingPhotos,
  onClose,
  onPrevPhoto,
  onNextPhoto,
  onSelectPhoto
}: PhotoModalProps) => {
  const isClient = useIsClient();
  const titleId = useId();
  // Esc, foco preso e trava de scroll ficam no hook; as setas trocam a foto
  const dialogRef = useModalBehavior<HTMLDivElement>(isOpen && !!album, onClose);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Transição cruzada: a foto anterior continua visível até a nova carregar e então as duas trocam de opacidade
  const currentUrl = isOpen && !isLoadingPhotos ? photos[selectedPhotoIndex]?.url ?? null : null;
  const [layers, setLayers] = useState<{ url: string | null; prevUrl: string | null }>({ url: currentUrl, prevUrl: null });
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  if (layers.url !== currentUrl) setLayers({ url: currentUrl, prevUrl: layers.url });

  // Mantém a miniatura ativa visível na faixa
  useEffect(() => {
    if (!isOpen) return;
    const thumb = thumbsRef.current?.querySelector<HTMLElement>('[aria-current="true"]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    thumb?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
  }, [isOpen, selectedPhotoIndex, photos]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') onPrevPhoto();
    if (e.key === 'ArrowRight') onNextPhoto();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null || photos.length < 2) return;
    const dx = e.changedTouches[0].clientX - start;
    if (dx > SWIPE_MIN) onPrevPhoto();
    else if (dx < -SWIPE_MIN) onNextPhoto();
  };

  if (!isClient || !isOpen || !album) return null;

  const photo = photos[selectedPhotoIndex];
  const date = formatDateBR(album.date);

  // Portal no body com camada de modal, acima do header e da navegação inferior
  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="fixed inset-0 z-100 flex flex-col bg-[#001a3d]/95 text-white backdrop-blur-md transition-opacity duration-300 starting:opacity-0 motion-reduce:transition-none"
      onKeyDown={handleKeyDown}
    >
      {/* Brilho sutil das cores da marca no fundo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,102,204,0.25),transparent_60%)]" />

      {/* Topo: álbum + fechar */}
      <header className="relative flex items-start gap-4 px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="line-clamp-2 text-lg leading-tight font-black tracking-tight text-balance sm:text-2xl">
            {album.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {date && (
              <span className={CHIP}>
                <FaCalendarAlt className="h-3 w-3 text-[#ffd000]" aria-hidden="true" />
                {date}
              </span>
            )}
            {album.location && (
              <span className={CHIP}>
                <FaMapMarkerAlt className="h-3 w-3 text-[#00d670]" aria-hidden="true" />
                {album.location}
              </span>
            )}
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar" className={CLOSE}>
          <FaTimes className="h-4 w-4" aria-hidden="true" />
        </button>
      </header>

      {isLoadingPhotos ? (
        // Esqueleto da foto e das miniaturas enquanto as fotos carregam
        <div role="status" aria-label="Carregando fotos" className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-4 py-6">
          <div className="aspect-4/3 max-h-full w-full max-w-3xl animate-pulse rounded-3xl bg-white/10 motion-reduce:animate-none" />
          <div className="flex gap-2" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 w-14 animate-pulse rounded-xl bg-white/10 motion-reduce:animate-none sm:h-16 sm:w-20" />
            ))}
          </div>
        </div>
      ) : photos.length === 0 || !photo ? (
        <div className="relative flex flex-1 items-center justify-center px-6">
          <div className="max-w-sm text-center">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/10 ring-8 ring-white/5">
              <FaImages className="h-8 w-8 text-white/80" aria-hidden="true" />
            </span>
            <p className="mt-6 text-xl font-black tracking-tight">Nenhuma foto neste álbum ainda</p>
            <p className="mt-2 text-sm text-white/70">Volte em breve para ver os registros deste momento.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/20 transition-[scale,background-color] duration-200 hover:bg-white/20 active:scale-95"
            >
              Voltar à galeria
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Palco: troca com setas, teclado ou deslizando o dedo */}
          <div
            className="relative mx-2 my-3 min-h-0 flex-1 touch-pan-y sm:mx-6 sm:my-4"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={handleTouchEnd}
          >
            {/* Esqueleto enquanto a primeira foto carrega (nas trocas, a foto anterior fica visível) */}
            {!layers.prevUrl && loadedUrl !== layers.url && (
              <div aria-hidden="true" className="absolute inset-0 m-auto aspect-4/3 max-h-full w-full max-w-3xl animate-pulse rounded-3xl bg-white/10 motion-reduce:animate-none" />
            )}
            {[layers.prevUrl, layers.url].map((url) => {
              if (!url) return null;
              const isCurrent = url === layers.url;
              const visible = isCurrent ? loadedUrl === url : loadedUrl !== layers.url;
              return (
                <div
                  key={url}
                  aria-hidden={!isCurrent || undefined}
                  className={`absolute inset-0 transition-opacity duration-300 ease-out motion-reduce:transition-none ${visible ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Image
                    src={url}
                    alt={isCurrent ? photo.title || `Foto ${selectedPhotoIndex + 1} do álbum ${album.title}` : ''}
                    fill
                    sizes="100vw"
                    unoptimized={!isOptimizableImage(url)}
                    className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                    priority={isCurrent}
                    onLoad={isCurrent ? () => setLoadedUrl(url) : undefined}
                    onError={isCurrent ? () => setLoadedUrl(url) : undefined}
                  />
                </div>
              );
            })}

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={onPrevPhoto}
                  className={`${GLASS} absolute top-1/2 left-1 h-11 w-11 -translate-y-1/2 sm:left-2 sm:h-14 sm:w-14`}
                  aria-label="Foto anterior"
                >
                  <FaChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onNextPhoto}
                  className={`${GLASS} absolute top-1/2 right-1 h-11 w-11 -translate-y-1/2 sm:right-2 sm:h-14 sm:w-14`}
                  aria-label="Próxima foto"
                >
                  <FaChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </button>
              </>
            )}
          </div>

          {/* Legenda, contador e link para a original */}
          <div className="relative flex items-center gap-3 px-4 sm:px-6">
            <span aria-hidden="true" className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-bold tabular-nums ring-1 ring-white/15">
              {selectedPhotoIndex + 1} / {photos.length}
            </span>
            {/* Contador anunciado ao trocar de foto */}
            <p aria-live="polite" className="sr-only">Foto {selectedPhotoIndex + 1} de {photos.length}</p>
            <p className="min-w-0 flex-1 truncate text-sm text-white/80">{photo.title}</p>
            <a
              href={photo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-white/90 ring-1 ring-white/20 transition-colors hover:bg-white/10"
            >
              <FaExternalLinkAlt className="h-3 w-3" aria-hidden="true" />
              <span className="hidden sm:inline">Abrir original</span>
              <span className="sr-only sm:hidden">Abrir foto original</span>
            </a>
          </div>

          {/* Miniaturas */}
          <div ref={thumbsRef} className="scrollbar-hide relative mt-3 overflow-x-auto px-4 pt-1.5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-5">
            <div className="mx-auto flex w-max gap-2 p-1">
              {photos.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectPhoto(index)}
                  aria-label={`Ver foto ${index + 1}`}
                  aria-current={index === selectedPhotoIndex}
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-[#001a3d] transition-[opacity,box-shadow] duration-200 sm:h-16 sm:w-20 ${
                    index === selectedPhotoIndex ? 'opacity-100 ring-[#ffd000]' : 'opacity-50 ring-transparent hover:opacity-90'
                  }`}
                >
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    sizes="80px"
                    unoptimized={!isOptimizableImage(item.url)}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>,
    document.body
  );
};

export default PhotoModal;
