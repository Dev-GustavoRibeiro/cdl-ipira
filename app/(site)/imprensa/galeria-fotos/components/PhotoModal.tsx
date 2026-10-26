'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { A11y, Zoom } from 'swiper/modules';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaImages, FaMapMarkerAlt, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import { ModalChip, ModalShell } from '@/app/components/Modal';
import { isOptimizableImage } from '@/lib/images';
import { formatDateBR } from '@/lib/date';
import { Album, AlbumPhoto } from './types';
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/zoom';

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

// Lightbox escuro quase em tela cheia. Altura fixa (não só máxima): o palco da foto fica com o que sobra entre o
// topo e as miniaturas. Com ! porque fundo e largura do ModalShell vêm de classes de mesmo peso.
const PANEL =
  'bg-[#0b1220]! bg-[radial-gradient(ellipse_at_50%_-10%,rgba(0,102,204,0.22),transparent_60%)] text-white h-[calc(100dvh-2.5rem-env(safe-area-inset-top))] sm:h-[min(92dvh,60rem)] sm:max-w-[96rem]!';

// Controles do kit de carrosséis no tom escuro; hover branco com ícone azul. Sem backdrop-filter: as setas ficam
// sobre o palco, e o desfoque refeito a cada quadro com a foto deslizando por baixo cintila (regra do Modal.tsx).
// Fundo navy quase opaco no lugar, legível também sobre foto clara.
const CONTROL =
  'inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0b1220]/75 text-sm font-bold text-white ring-1 ring-white/25 transition-[background-color,color,scale,box-shadow] duration-200 hover:bg-white hover:text-[#003f7f] hover:ring-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd000]';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const pad = (n: number) => String(n).padStart(2, '0');

// O painel usa o nome do arquivo como título da foto ("IMG_4949", "WhatsApp Image 2025-11-28 at 10.11.12"):
// isso não é legenda. ponytail: heurística pelos nomes de câmera/celular comuns; ampliar a lista se aparecerem outros.
const isFileName = (title: string) => /^(img|dsc|pxl|mvimg|whatsapp image|screenshot)?[\W_]*\d[\d\W_]*(at[\d\W_]+)?(wa\d+)?$/i.test(title.trim());
const captionOf = (photo: AlbumPhoto) => (photo.title && !isFileName(photo.title) ? photo.title.trim() : '');

// Unsplash não passa pelo otimizador (host fora do next.config): a miniatura pede a foto pequena pela própria URL.
// Fotos do Storage seguem pelo next/image, que já gera o tamanho certo.
const thumbSrc = (src: string) => {
  try {
    const url = new URL(src);
    if (url.host !== 'images.unsplash.com') return src;
    url.searchParams.set('w', '200');
    return url.toString();
  } catch {
    return src;
  }
};

const PhotoModal = ({
  isOpen,
  album,
  photos,
  selectedPhotoIndex,
  isLoadingPhotos,
  onClose,
  onPrevPhoto,
  onNextPhoto,
  onSelectPhoto,
}: PhotoModalProps) => {
  const titleId = useId();
  const open = isOpen && !!album;

  // ← → trocam a foto (Esc, foco preso e trava de rolagem vêm do ModalShell)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowLeft') onPrevPhoto();
      else if (e.key === 'ArrowRight') onNextPhoto();
      else return;
      e.preventDefault();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onPrevPhoto, onNextPhoto]);

  const date = album ? formatDateBR(album.date) : '';

  return (
    <ModalShell
      isOpen={open}
      onClose={onClose}
      labelledBy={titleId}
      className={PANEL}
      bodyClassName="flex flex-col"
      header={
        album && (
          // Desktop: título e chips na mesma linha (cada linha a menos aqui é altura a mais para a foto); janela baixa
          // (celular deitado): título menor e respiros curtos
          <div className="shrink-0 px-5 pt-6 pr-16 pb-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2 sm:px-8 sm:pt-5 sm:pr-20 sm:pb-4 sm:[@media(max-height:520px)]:pt-3 sm:[@media(max-height:520px)]:pb-2">
            <h2 id={titleId} className="line-clamp-2 text-lg leading-tight font-black tracking-tight text-balance sm:text-2xl sm:[@media(max-height:520px)]:text-lg">
              {album.title}
            </h2>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:mt-0">
              {album.category && <ModalChip tone="accent">{album.category}</ModalChip>}
              {date && (
                <ModalChip tone="glass" icon={FaCalendarAlt}>
                  {date}
                </ModalChip>
              )}
              {album.location && (
                <ModalChip tone="glass" icon={FaMapMarkerAlt}>
                  {album.location}
                </ModalChip>
              )}
            </div>
          </div>
        )
      }
    >
      {album &&
        (isLoadingPhotos ? (
          // Esqueleto do palco e das miniaturas enquanto as fotos carregam
          <div role="status" className="flex min-h-0 flex-1 flex-col items-center gap-4 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-20 sm:pb-6">
            <span className="sr-only">Carregando fotos</span>
            <div aria-hidden="true" className="min-h-0 w-full max-w-4xl flex-1 animate-pulse rounded-2xl bg-white/6 motion-reduce:animate-none" />
            <div aria-hidden="true" className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 w-12 animate-pulse rounded-lg bg-white/8 motion-reduce:animate-none sm:h-14 sm:w-20" />
              ))}
            </div>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6 pb-10">
            <div className="max-w-sm text-center">
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/10 ring-8 ring-white/5">
                <FaImages className="h-8 w-8 text-white/80" aria-hidden="true" />
              </span>
              <p className="mt-6 text-xl font-black tracking-tight">Nenhuma foto neste álbum ainda</p>
              <p className="mt-2 text-sm text-white/70">Volte em breve para ver os registros deste momento.</p>
              <button type="button" onClick={onClose} className={`${CONTROL} mt-7 px-6`}>
                Voltar à galeria
              </button>
            </div>
          </div>
        ) : (
          <Viewer
            album={album}
            photos={photos}
            index={Math.min(selectedPhotoIndex, photos.length - 1)}
            onSelect={onSelectPhoto}
            onPrev={onPrevPhoto}
            onNext={onNextPhoto}
          />
        ))}
    </ModalShell>
  );
};

interface ViewerProps {
  album: Album;
  photos: AlbumPhoto[];
  index: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Palco (Swiper com zoom) + barra de controles + miniaturas. Quem manda no índice é a página (setas e teclado usam
 * onPrev/onNext, que dão a volta no fim); arrastar a foto avisa a página pelo onSelect e o Swiper acompanha o índice.
 */
function Viewer({ album, photos, index, onSelect, onPrev, onNext }: ViewerProps) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  // Só monta no cliente (dentro do portal do ModalShell)
  const [reduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  // Fotos já carregadas continuam montadas; as demais só entram quando ficam a uma de distância
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set());
  const [zoomed, setZoomed] = useState(false);
  const total = photos.length;
  const photo = photos[index];
  const caption = captionOf(photo);

  const markLoaded = (id: number) => setLoaded((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));

  // Índice vindo de fora (setas, teclado, miniaturas): o Swiper desliza até ele
  useEffect(() => {
    const swiper = swiperRef.current;
    if (swiper && !swiper.destroyed && swiper.activeIndex !== index) swiper.slideTo(index);
  }, [index]);

  // Miniatura ativa no centro da faixa (rola só a faixa, nunca a página)
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!strip || !thumb) return;
    strip.scrollTo({ left: thumb.offsetLeft + thumb.offsetWidth / 2 - strip.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
  }, [index, reduce]);

  // Com a foto ampliada, arrastar move a foto: o toque não chega à folha do celular (que fecharia ao puxar para baixo)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const hold = (e: TouchEvent) => {
      if ((swiperRef.current?.zoom.scale ?? 1) > 1) e.stopPropagation();
    };
    stage.addEventListener('touchstart', hold, { passive: true });
    return () => stage.removeEventListener('touchstart', hold);
  }, []);

  // Profundidade pela posição (acompanha o dedo, quadro a quadro): a foto que sai encolhe e esmaece um pouco.
  // Mexe numa camada interna; o Swiper move o trilho e o zoom mexe no contêiner da foto.
  const paintDepth = (swiper: SwiperClass) => {
    if (reduce) return;
    swiper.slides.forEach((slide) => {
      const layer = slide.firstElementChild as HTMLElement | null;
      const p = Math.min(1, Math.abs((slide as HTMLElement & { progress?: number }).progress ?? 0));
      if (!layer) return;
      layer.style.transform = p > 0.001 ? `scale(${(1 - 0.08 * p).toFixed(4)})` : '';
      layer.style.opacity = p > 0.001 ? (1 - 0.6 * p).toFixed(3) : '';
    });
  };
  const syncDepthDuration = (swiper: SwiperClass, ms: number) =>
    swiper.slides.forEach((slide) => {
      const layer = slide.firstElementChild as HTMLElement | null;
      if (layer) layer.style.transitionDuration = `${ms}ms`;
    });

  const arrow = (dir: 'prev' | 'next', className: string) => {
    const Icon = dir === 'prev' ? FaChevronLeft : FaChevronRight;
    return (
      <button
        type="button"
        onClick={dir === 'prev' ? onPrev : onNext}
        aria-label={dir === 'prev' ? 'Foto anterior' : 'Próxima foto'}
        className={`${CONTROL} ${className}`}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Palco: arrastar (com física e encaixe), setas, teclado; dois toques ou pinça ampliam */}
      <div ref={stageRef} className="relative min-h-0 flex-1">
        <Swiper
          modules={[A11y, Zoom]}
          initialSlide={index}
          spaceBetween={24}
          speed={reduce ? 0 : 550}
          // Arrasto lento troca a partir de 1/3 da largura (o padrão, metade, parece "preso" num palco largo)
          longSwipesRatio={0.3}
          grabCursor
          zoom={{ maxRatio: 2.5 }}
          watchSlidesProgress
          a11y={{
            containerMessage: `Fotos do álbum ${album.title}`,
            containerRoleDescriptionMessage: 'galeria de fotos',
            itemRoleDescriptionMessage: 'foto',
            slideLabelMessage: 'Foto {{index}} de {{slidesLength}}',
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            paintDepth(swiper);
          }}
          onSlideChange={(swiper) => onSelect(swiper.activeIndex)}
          onZoomChange={(_swiper, scale) => setZoomed(scale > 1)}
          onProgress={paintDepth}
          onSetTransition={syncDepthDuration}
          style={{ '--swiper-wrapper-transition-timing-function': EASE } as React.CSSProperties}
          className="h-full"
        >
          {photos.map((item, i) => {
            const isLoaded = loaded.has(item.id);
            const itemCaption = captionOf(item);
            return (
              <SwiperSlide key={item.id} aria-hidden={i !== index || undefined}>
                <div style={{ transitionTimingFunction: EASE }} className="relative h-full px-0 py-1 transition-[transform,opacity] sm:px-20 sm:py-2">
                  {/* Esqueleto até a foto chegar */}
                  {!isLoaded && <div aria-hidden="true" className="absolute inset-x-4 inset-y-[12%] animate-pulse rounded-2xl bg-white/6 motion-reduce:animate-none sm:inset-x-28" />}
                  <div className="swiper-zoom-container">
                    {(isLoaded || Math.abs(i - index) <= 1) && (
                      // Tamanho natural limitado ao palco (max-w/max-h do CSS do zoom): a caixa é a própria foto, então
                      // a sombra e os limites do arrasto com zoom seguem a foto, não o palco
                      <Image
                        src={item.url}
                        alt={itemCaption || `Foto ${i + 1} de ${total} do álbum ${album.title}`}
                        width={1600}
                        height={1200}
                        sizes="(min-width: 640px) 90vw, 100vw"
                        loading="eager"
                        fetchPriority={i === index ? 'high' : 'auto'}
                        unoptimized={!isOptimizableImage(item.url)}
                        draggable={false}
                        onLoad={() => markLoaded(item.id)}
                        onError={() => markLoaded(item.id)}
                        className={`h-auto w-auto rounded-md shadow-[0_30px_80px_-24px_rgba(0,0,0,0.85)] transition-opacity duration-500 ease-out select-none motion-reduce:transition-none ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                      />
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Setas laterais (desktop/tablet); no celular ficam na barra abaixo */}
        {total > 1 && (
          <>
            {arrow('prev', 'absolute top-1/2 left-4 z-10 -translate-y-1/2 max-sm:hidden sm:h-12 sm:w-12 lg:left-6')}
            {arrow('next', 'absolute top-1/2 right-4 z-10 -translate-y-1/2 max-sm:hidden sm:h-12 sm:w-12 lg:right-6')}
          </>
        )}
      </div>

      {/* Barra: contador + progresso (mesma linguagem dos carrosséis), legenda, ampliar, original e miniaturas.
          Celular/tablet: miniaturas numa linha própria embaixo. Desktop (lg): tudo numa linha só, miniaturas no meio,
          para sobrar altura para a foto; a legenda, quando há, vai para a linha de baixo. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-3 px-4 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))] sm:gap-x-4 sm:px-8 sm:pt-4 sm:pb-5 lg:gap-x-6 sm:[@media(max-height:520px)]:pt-2 sm:[@media(max-height:520px)]:pb-3">
        {total > 1 && arrow('prev', 'sm:hidden')}
        <p aria-hidden="true" className="shrink-0 text-sm font-bold tabular-nums">
          <span className="text-white">{pad(index + 1)}</span>
          <span className="text-white/55"> / {pad(total)}</span>
        </p>
        {total > 1 && arrow('next', 'sm:hidden')}
        <div aria-hidden="true" className="relative h-[3px] min-w-8 flex-1 overflow-hidden rounded-full bg-white/20 sm:w-36 sm:flex-none">
          <div
            style={{ scale: `${(index + 1) / total} 1`, transitionTimingFunction: EASE }}
            className="absolute inset-0 origin-left rounded-full bg-[#ffd000] transition-[scale] duration-500 motion-reduce:transition-none"
          />
        </div>
        {caption && (
          <p className="min-w-0 text-sm text-pretty text-white/85 max-sm:order-first max-sm:basis-full max-sm:line-clamp-2 sm:flex-1 sm:truncate lg:order-3 lg:basis-full lg:text-center">
            {caption}
          </p>
        )}
        <button
          type="button"
          onClick={() => swiperRef.current?.zoom.toggle()}
          aria-pressed={zoomed}
          aria-label="Ampliar foto"
          title={zoomed ? 'Reduzir' : 'Ampliar (ou toque duas vezes na foto)'}
          className={`${CONTROL} sm:ml-auto lg:order-2`}
        >
          {zoomed ? <FaSearchMinus className="h-4 w-4" aria-hidden="true" /> : <FaSearchPlus className="h-4 w-4" aria-hidden="true" />}
        </button>
        <a href={photo.url} target="_blank" rel="noopener noreferrer" className={`${CONTROL} sm:px-4 lg:order-2`}>
          <FaExternalLinkAlt className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="max-sm:sr-only">Abrir original</span>
          <span className="sr-only">(abre em nova aba)</span>
        </a>
        {/* Anunciado ao trocar de foto */}
        <p aria-live="polite" className="sr-only">
          Foto {index + 1} de {total}
          {caption && `: ${caption}`}
        </p>

        {/* Miniaturas (somem em janelas muito baixas, ex.: celular deitado). Celular/tablet: a faixa rola de ponta a
            ponta do painel (margem negativa desfaz o respiro da barra) */}
        {total > 1 && (
          <div
            ref={stripRef}
            role="group"
            aria-label="Miniaturas"
            className="scrollbar-hide relative order-last -mx-4 basis-full overflow-x-auto overscroll-x-contain px-4 sm:-mx-8 sm:px-8 lg:order-1 lg:mx-0 lg:min-w-0 lg:flex-1 lg:px-0 [@media(max-height:480px)]:hidden"
          >
            <div className="mx-auto flex w-max gap-2 p-1">
              {photos.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-label={`Ver foto ${i + 1} de ${total}`}
                  aria-current={i === index ? 'true' : undefined}
                  className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-[#0b1220] transition-[opacity,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:h-14 sm:w-20 ${
                    i === index ? 'opacity-100 ring-[#ffd000]' : 'opacity-45 ring-transparent hover:opacity-90'
                  }`}
                >
                  <Image src={thumbSrc(item.url)} alt="" fill sizes="80px" unoptimized={!isOptimizableImage(item.url)} className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotoModal;
