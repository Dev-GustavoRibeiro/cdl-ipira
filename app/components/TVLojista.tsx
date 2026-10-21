'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaArrowRight, FaVideo, FaClock } from 'react-icons/fa';
import { isOptimizableImage } from '@/lib/images';
import { formatDateBR } from '@/lib/date';

interface Video {
  id: number;
  title: string;
  youtube_id: string;
  description?: string | null;
  thumbnail?: string | null;
  category?: string | null;
  date?: string | null;
  duration?: string | null;
}

const videoHref = (video: Video) => `/imprensa/tv-lojista?video=${video.id}`;

/** Miniatura com fallback: capa do painel → maxresdefault (nem todo vídeo tem) → hqdefault → foto da sede. */
function VideoThumb({ video, large = false, sizes }: { video: Video; large?: boolean; sizes: string }) {
  const yt = video.youtube_id ? `https://i.ytimg.com/vi/${video.youtube_id}` : '';
  const candidates = [video.thumbnail, large && yt && `${yt}/maxresdefault.jpg`, yt && `${yt}/hqdefault.jpg`, '/cdl-ipira-sede.jpg']
    .filter(Boolean) as string[];
  const [index, setIndex] = React.useState(0);
  const src = candidates[index];

  return (
    <Image
      src={src}
      alt={video.title}
      fill
      sizes={sizes}
      unoptimized={!isOptimizableImage(src)}
      onError={() => setIndex((i) => Math.min(i + 1, candidates.length - 1))}
      // object-cover em 16:9 corta as tarjas pretas do hqdefault (4:3)
      className="object-cover text-transparent transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
  );
}

function FeaturedVideo({ video }: { video: Video }) {
  const date = formatDateBR(video.date);

  return (
    <Link
      href={videoHref(video)}
      className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffd000] focus-visible:ring-offset-4 focus-visible:ring-offset-[#003f7f]"
    >
      <article className="relative overflow-hidden rounded-3xl bg-white/5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] ring-1 ring-white/15 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_40px_70px_-25px_rgba(0,0,0,0.7)] group-hover:ring-[#ffd000]/40 group-active:scale-[0.99] motion-reduce:group-hover:translate-y-0">
        <div className="relative aspect-video overflow-hidden bg-[#003366]">
          <VideoThumb video={video} large sizes="(min-width: 1024px) 52rem, 100vw" />
          {/* No mobile o texto fica abaixo da imagem; do md em diante, sobre ela */}
          <div className="absolute inset-0 bg-black/15 md:bg-linear-to-t md:from-black/90 md:via-black/35 md:to-black/5" />

          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ffd000] text-[#003f7f] shadow-[0_0_0_10px_rgba(255,208,0,0.22),0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100 sm:h-20 sm:w-20 md:top-[42%] xl:h-24 xl:w-24">
            <FaPlay className="ml-1 h-6 w-6 sm:h-7 sm:w-7 xl:h-9 xl:w-9" aria-hidden />
          </span>

          {video.duration && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm sm:right-5 sm:top-5">
              <FaClock className="h-3 w-3" aria-hidden />
              <span className="sr-only">Duração:</span> {video.duration}
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6 md:absolute md:inset-x-0 md:bottom-0 md:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#ffd000] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#003f7f]">
              Em destaque
            </span>
            {video.category && (
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                {video.category}
              </span>
            )}
            {date && <span className="text-xs font-medium text-white/75">{date}</span>}
          </div>
          <h3 className="mt-3 line-clamp-3 text-lg font-black leading-snug tracking-tight text-white text-balance transition-colors duration-300 group-hover:text-[#ffd000] sm:text-2xl md:line-clamp-2! lg:text-3xl">
            {video.title}
          </h3>
        </div>
      </article>
    </Link>
  );
}

/** Um único vídeo: player à esquerda e detalhes à direita, alinhado à largura das outras seções. */
function SingleVideo({ video }: { video: Video }) {
  const date = formatDateBR(video.date);

  return (
    <Link
      href={videoHref(video)}
      className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffd000] focus-visible:ring-offset-4 focus-visible:ring-offset-[#003f7f]"
    >
      <article className="grid overflow-hidden rounded-3xl bg-white/5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] ring-1 ring-white/15 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_40px_70px_-25px_rgba(0,0,0,0.7)] group-hover:ring-[#ffd000]/40 group-active:scale-[0.99] motion-reduce:group-hover:translate-y-0 xl:grid-cols-3">
        <div className="relative overflow-hidden bg-[#003366] xl:col-span-2">
          {/* Garante no mínimo 16:9; se o painel ao lado for mais alto, a imagem acompanha a altura da linha */}
          <div aria-hidden className="aspect-video" />
          <VideoThumb video={video} large sizes="(min-width: 1280px) 52rem, 100vw" />
          <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/5" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ffd000] text-[#003f7f] shadow-[0_0_0_10px_rgba(255,208,0,0.22),0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
            <FaPlay className="ml-1 h-6 w-6 sm:h-7 sm:w-7 lg:h-9 lg:w-9" aria-hidden />
          </span>
          {video.duration && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm sm:right-5 sm:top-5">
              <FaClock className="h-3 w-3" aria-hidden />
              <span className="sr-only">Duração:</span> {video.duration}
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 xl:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#ffd000] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#003f7f]">
              Em destaque
            </span>
            {video.category && (
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                {video.category}
              </span>
            )}
          </div>
          <h3 className="mt-4 line-clamp-4 text-xl font-black leading-snug tracking-tight text-white text-balance transition-colors duration-300 group-hover:text-[#ffd000] sm:text-2xl">
            {video.title}
          </h3>
          {video.description && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/75 text-pretty sm:text-base">{video.description}</p>
          )}
          {date && <p className="mt-3 text-xs font-medium text-white/65">Publicado em {date}</p>}
          <span className="mt-6 inline-flex w-fit items-center gap-2.5 rounded-full bg-white px-5 py-3 text-sm font-black text-[#003f7f] shadow-[0_15px_30px_-15px_rgba(0,0,0,0.5)] transition-colors duration-300 group-hover:bg-[#ffd000]">
            <FaPlay className="h-3 w-3" aria-hidden />
            Assistir agora
          </span>
        </div>
      </article>
    </Link>
  );
}

/** Vídeo secundário: miniatura com título sobreposto. No desktop, dois deles dividem a altura do destaque. */
function VideoTile({ video }: { video: Video }) {
  return (
    <Link
      href={videoHref(video)}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffd000] focus-visible:ring-offset-4 focus-visible:ring-offset-[#003f7f]"
    >
      <article className="relative aspect-video h-full overflow-hidden rounded-2xl bg-[#003366] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/15 transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-[#ffd000]/40 group-active:scale-[0.98] motion-reduce:group-hover:translate-y-0 lg:aspect-auto">
        <VideoThumb video={video} sizes="(min-width: 1024px) 25rem, (min-width: 640px) 50vw, 100vw" />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/5" />
        <span className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#ffd000] text-[#003f7f] shadow-[0_0_0_5px_rgba(255,208,0,0.22)] transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100">
          <FaPlay className="ml-0.5 h-3.5 w-3.5" aria-hidden />
        </span>
        {video.duration && (
          <span className="absolute right-3 top-3 rounded-full bg-black/65 px-2.5 py-0.5 text-[11px] font-bold text-white">
            <span className="sr-only">Duração:</span> {video.duration}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          {video.category && (
            <span className="text-[11px] font-black uppercase tracking-widest text-[#ffd000]">{video.category}</span>
          )}
          <h3 className="mt-1 line-clamp-2 text-base font-black leading-snug tracking-tight text-white transition-colors duration-300 group-hover:text-[#ffd000]">
            {video.title}
          </h3>
        </div>
      </article>
    </Link>
  );
}

const TVLojista = () => {
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos?limit=3');
        setVideos(response.ok ? await response.json() : []);
      } catch (error) {
        console.error('Erro ao carregar vídeos:', error);
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Sem vídeos, a seção some em vez de mostrar um bloco vazio
  if (!isLoading && videos.length === 0) return null;

  const [featured, ...others] = videos;

  return (
    <section aria-labelledby="tv-lojista-titulo" className="relative overflow-hidden bg-[#003f7f] py-16 sm:py-20 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#003366]" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 rounded-full bg-[#ffd000]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/2 rounded-full bg-[#00a859]/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#003f7f] shadow-[0_10px_25px_-10px_rgba(255,208,0,0.6)]">
              <FaVideo className="h-3.5 w-3.5" aria-hidden />
              Canal CDL Ipirá
            </span>
            <h2 id="tv-lojista-titulo" className="text-4xl font-black leading-[1.05] tracking-tight text-white text-balance sm:text-5xl md:text-6xl">
              TV Lojista
            </h2>
            <div className="mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] ring-1 ring-white/25" />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 text-pretty sm:text-lg">
              Acompanhe entrevistas, dicas e conteúdos exclusivos para impulsionar o seu negócio.
            </p>
          </div>

          <Link
            href="/imprensa/tv-lojista"
            className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#ffd000] px-6 py-3.5 text-sm font-black text-[#003f7f] shadow-[0_15px_35px_-12px_rgba(255,208,0,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffed4e] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 motion-reduce:hover:translate-y-0 sm:text-base"
          >
            Ver todos os vídeos
            <FaArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" aria-hidden />
          </Link>
        </div>

        {isLoading ? (
          <div role="status" className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            <span className="sr-only">Carregando vídeos…</span>
            <div aria-hidden className="aspect-video animate-pulse rounded-3xl bg-white/10 ring-1 ring-white/10 motion-reduce:animate-none lg:col-span-2" />
            <div aria-hidden className="hidden animate-pulse rounded-3xl bg-white/10 ring-1 ring-white/10 motion-reduce:animate-none lg:block" />
          </div>
        ) : others.length === 0 ? (
          <SingleVideo video={featured} />
        ) : (
          // Destaque + dois blocos empilhados que somam a altura dele; com 2 vídeos, o segundo bloco leva ao canal
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
              <FeaturedVideo video={featured} />
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:h-0 lg:min-h-full lg:grid-cols-1 lg:grid-rows-2">
              {others.map((video) => (
                <li key={video.id}>
                  <VideoTile video={video} />
                </li>
              ))}
              {others.length === 1 && (
                <li>
                  <Link
                    href="/imprensa/tv-lojista"
                    className="group flex h-full min-h-44 flex-col justify-between gap-5 rounded-2xl bg-white/5 p-5 ring-1 ring-white/15 transition-all duration-300 hover:bg-white/10 hover:ring-[#ffd000]/40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffd000] sm:p-6 lg:min-h-0 lg:gap-3"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffd000] text-[#003f7f]">
                      <FaVideo className="h-4 w-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-lg font-black tracking-tight text-white">Mais conteúdos no canal</span>
                      <span className="mt-1 block text-sm leading-relaxed text-white/70 lg:hidden xl:block">
                        Entrevistas, dicas e capacitações para o seu negócio.
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#ffd000]">
                      Ver todos os vídeos
                      <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" aria-hidden />
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default TVLojista;
