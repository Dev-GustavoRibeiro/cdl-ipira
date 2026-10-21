'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { A11y, Autoplay, Navigation } from 'swiper/modules';
import {
  FaImages,
  FaCamera,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { isOptimizableImage } from '@/lib/images';
import { formatDateLong } from '@/lib/date';
import 'swiper/css';

interface Gallery {
  id: number;
  title: string;
  image: string | null;
  photos: number;
  category?: string;
  date?: string;
  location?: string;
  description?: string;
}

// Até este número de álbuns, grade estática centralizada; acima, carrossel.
const MAX_STATIC = 3;

const albumHref = (gallery: Gallery) => `/imprensa/galeria-fotos?album=${gallery.id}`;
const photosLabel = (n: number) => `${n} ${n === 1 ? 'foto' : 'fotos'}`;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#003f7f]/40 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-50';

function Cover({ gallery, sizes }: { gallery: Gallery; sizes: string }) {
  if (!gallery.image) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#003f7f] to-[#0052a3]">
        <FaImages className="h-20 w-20 text-white/15" aria-hidden />
      </div>
    );
  }
  return (
    <Image
      src={gallery.image}
      alt={gallery.title}
      fill
      sizes={sizes}
      unoptimized={!isOptimizableImage(gallery.image)}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
  );
}

/** Card alto com painel de vidro (grade e carrossel). */
function AlbumCard({ gallery }: { gallery: Gallery }) {
  const date = formatDateLong(gallery.date);

  return (
    <Link href={albumHref(gallery)} className={`group block h-full rounded-[2rem] ${focusRing}`}>
      <article className="relative isolate h-[440px] overflow-hidden rounded-[2rem] bg-[#003f7f] shadow-[0_18px_40px_-20px_rgba(0,63,127,0.5)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_50px_-22px_rgba(0,63,127,0.6)] group-active:scale-[0.98] motion-reduce:group-hover:translate-y-0 sm:h-[480px]">
        <Cover gallery={gallery} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw" />
        <div className="absolute inset-0 bg-linear-to-t from-[#00152b] via-[#00152b]/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-md transition-colors duration-300 group-hover:bg-white/15">
            <div className="mb-3 flex items-center gap-2">
              {gallery.category && (
                <span className="rounded-full bg-[#ffd000] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#003f7f]">
                  {gallery.category}
                </span>
              )}
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white">
                <FaCamera className="h-3 w-3" aria-hidden />
                {photosLabel(gallery.photos)}
              </span>
            </div>
            <h3 className="line-clamp-2 text-lg font-black leading-tight tracking-tight text-white text-balance sm:text-xl">
              {gallery.title}
            </h3>
            {date && (
              <p className="mt-2 flex items-center gap-2 text-xs font-medium text-white/80">
                <FaCalendarAlt className="h-3 w-3" aria-hidden />
                {date}
              </p>
            )}
            <span className="mt-4 inline-flex items-center gap-2.5 text-sm font-bold text-white">
              Ver galeria
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:bg-[#ffd000] group-hover:text-[#003f7f]">
                <FaArrowRight className="h-3 w-3 -rotate-45 transition-transform duration-300 group-hover:rotate-0" aria-hidden />
              </span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/** Um único álbum: card largo com capa e detalhes, em vez de um card solto no meio da seção. */
function FeaturedAlbum({ gallery }: { gallery: Gallery }) {
  const date = formatDateLong(gallery.date);

  return (
    <Link href={albumHref(gallery)} className={`group block rounded-[2rem] ${focusRing}`}>
      <article className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_50px_-20px_rgba(0,63,127,0.35)] ring-1 ring-[#003f7f]/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_30px_60px_-20px_rgba(0,63,127,0.45)] group-active:scale-[0.99] motion-reduce:group-hover:translate-y-0 md:grid-cols-12">
        <div className="relative aspect-[4/5] max-h-[460px] w-full overflow-hidden bg-[#003f7f] md:col-span-5 md:aspect-auto md:max-h-none md:min-h-[480px] lg:col-span-4 lg:min-h-[540px]">
          <Cover gallery={gallery} sizes="(min-width: 1024px) 32rem, (min-width: 768px) 42vw, 100vw" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            <FaCamera className="h-3 w-3" aria-hidden />
            {photosLabel(gallery.photos)}
          </span>
        </div>

        <div className="flex flex-col justify-center p-6 text-left sm:p-8 md:col-span-7 lg:col-span-8 lg:p-12">
          {gallery.category && (
            <span className="w-fit rounded-full bg-[#ffd000] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#003f7f]">
              {gallery.category}
            </span>
          )}
          <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight text-[#003f7f] text-balance sm:text-3xl lg:text-4xl">
            {gallery.title}
          </h3>

          {(date || gallery.location) && (
            <ul className="mt-5 flex flex-col gap-2.5 text-sm font-medium text-gray-600">
              {date && (
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003f7f]/10 text-[#003f7f]">
                    <FaCalendarAlt className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  {date}
                </li>
              )}
              {gallery.location && (
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00a859]/10 text-[#00a859]">
                    <FaMapMarkerAlt className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  {gallery.location}
                </li>
              )}
            </ul>
          )}

          {gallery.description && (
            <p className="mt-5 line-clamp-3 leading-relaxed text-gray-600 text-pretty">{gallery.description}</p>
          )}

          <span className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-linear-to-r from-[#003f7f] to-[#0066cc] px-6 py-3.5 text-sm font-bold text-white shadow-[0_15px_30px_-12px_rgba(0,63,127,0.6)] transition-shadow duration-300 group-hover:shadow-[0_20px_40px_-12px_rgba(0,63,127,0.7)]">
            Ver álbum completo
            <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" aria-hidden />
          </span>
        </div>
      </article>
    </Link>
  );
}

const navButton =
  'flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 active:scale-[0.95] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#003f7f]/30 [&.swiper-button-lock]:hidden';

const GaleriaFotos = () => {
  const [galleries, setGalleries] = React.useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const prevRef = React.useRef<HTMLButtonElement>(null);
  const nextRef = React.useRef<HTMLButtonElement>(null);
  const swiperRef = React.useRef<SwiperType | null>(null);

  React.useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await fetch('/api/albums?limit=8');
        setGalleries(response.ok ? await response.json() : []);
      } catch (error) {
        console.error('Erro ao carregar galerias:', error);
        setGalleries([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  // Sem álbuns, a seção some em vez de mostrar um bloco vazio
  if (!isLoading && galleries.length === 0) return null;

  const isCarousel = galleries.length > MAX_STATIC;
  // O carrossel só existe no cliente (depois do fetch), então dá para ler a preferência aqui
  const reduceMotion =
    isCarousel && typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') swiperRef.current?.slidePrev();
    if (e.key === 'ArrowRight') swiperRef.current?.slideNext();
  };

  return (
    <section aria-labelledby="galeria-titulo" className="relative overflow-hidden bg-gray-50 py-16 sm:py-20 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-[#003f7f]/5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[#ffd000]/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-[0.03]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#003f7f] shadow-[0_10px_25px_-12px_rgba(255,208,0,0.8)]">
              <FaCamera className="h-3.5 w-3.5" aria-hidden />
              Nossa Galeria
            </span>
            <h2 id="galeria-titulo" className="text-4xl font-black leading-[1.05] tracking-tight text-[#003f7f] text-balance sm:text-5xl md:text-6xl">
              Momentos que{' '}
              <span className="bg-linear-to-r from-[#003f7f] to-[#0066cc] bg-clip-text text-transparent">Fazem História</span>
            </h2>
            <div className="mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 text-pretty sm:text-lg">
              Navegue pelos registros fotográficos dos principais eventos, ações e celebrações realizados pela CDL Ipirá.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/imprensa/galeria-fotos"
              className="group inline-flex items-center gap-3 rounded-full bg-linear-to-r from-[#003f7f] to-[#0066cc] px-6 py-3.5 text-sm font-bold text-white shadow-[0_15px_30px_-12px_rgba(0,63,127,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-12px_rgba(0,63,127,0.7)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#003f7f]/30 motion-reduce:hover:translate-y-0 sm:text-base"
            >
              Ver todas as galerias
              <FaArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" aria-hidden />
            </Link>
            {!isLoading && isCarousel && (
              <>
                <button
                  ref={prevRef}
                  type="button"
                  aria-label="Galeria anterior"
                  className={`${navButton} border border-[#003f7f]/15 bg-white text-[#003f7f] shadow-sm hover:bg-[#003f7f] hover:text-white`}
                >
                  <FaChevronLeft className="h-4 w-4" aria-hidden />
                </button>
                <button
                  ref={nextRef}
                  type="button"
                  aria-label="Próxima galeria"
                  className={`${navButton} bg-[#003f7f] text-white shadow-[0_12px_25px_-10px_rgba(0,63,127,0.6)] hover:bg-[#0052a3]`}
                >
                  <FaChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </>
            )}
          </div>
        </div>

        {isLoading ? (
          <div role="status" className="flex flex-wrap justify-center gap-6">
            <span className="sr-only">Carregando galerias…</span>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                aria-hidden
                className={`h-[440px] w-full animate-pulse rounded-[2rem] bg-gray-200 motion-reduce:animate-none sm:h-[480px] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] ${i === 1 ? 'hidden sm:block' : i === 2 ? 'hidden lg:block' : ''}`}
              />
            ))}
          </div>
        ) : galleries.length === 1 ? (
          <FeaturedAlbum gallery={galleries[0]} />
        ) : !isCarousel ? (
          <ul className="flex flex-wrap justify-center gap-6">
            {galleries.map((gallery) => (
              <li key={gallery.id} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <AlbumCard gallery={gallery} />
              </li>
            ))}
          </ul>
        ) : (
          <div
            role="region"
            aria-roledescription="carrossel"
            aria-label="Galerias de fotos"
            onKeyDown={handleKeyDown}
            onFocus={() => swiperRef.current?.autoplay?.stop()}
            onBlur={(e) => {
              if (!reduceMotion && !e.currentTarget.contains(e.relatedTarget as Node)) swiperRef.current?.autoplay?.start();
            }}
          >
            <Swiper
              modules={[A11y, Autoplay, Navigation]}
              onBeforeInit={(swiper) => {
                const nav = swiper.params.navigation;
                if (nav && typeof nav !== 'boolean') {
                  nav.prevEl = prevRef.current;
                  nav.nextEl = nextRef.current;
                }
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              navigation={{ prevEl: null, nextEl: null }}
              rewind
              watchSlidesProgress
              speed={reduceMotion ? 0 : 600}
              autoplay={reduceMotion ? false : { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              a11y={{
                prevSlideMessage: 'Galeria anterior',
                nextSlideMessage: 'Próxima galeria',
                firstSlideMessage: 'Primeira galeria',
                lastSlideMessage: 'Última galeria',
                slideLabelMessage: '{{index}} de {{slidesLength}}',
              }}
              breakpoints={{
                0: { slidesPerView: 1.12, spaceBetween: 16 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              // folga para a sombra e o hover dos cards não serem cortados pelo overflow do Swiper
              className="-mx-4! -mt-4! -mb-16! w-auto! px-4! pt-4! pb-16! lg:-mx-8! lg:px-8!"
            >
              {galleries.map((gallery) => (
                <SwiperSlide
                  key={gallery.id}
                  // Sobrescreve o estilo global de .swiper-slide (padding/centralização) e esconde,
                  // do leitor de tela e do Tab, os slides fora da área visível
                  className="block! h-auto! px-0! text-left! [transition:visibility_0.6s]! [&:not(.swiper-slide-visible)]:invisible"
                >
                  <AlbumCard gallery={gallery} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
};

export default GaleriaFotos;
