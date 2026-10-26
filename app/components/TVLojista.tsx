'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaVideo, FaClock } from 'react-icons/fa';
import SectionCarousel, { SectionHeading, useCardsMotion, type PerView } from './carousel/SectionCarousel';
import { useReveal } from './motion/useReveal';
import { isOptimizableImage } from '@/lib/images';
import { formatDateBR, formatDateLong } from '@/lib/date';
import { EASE, MOTION_OK, gsap, useGSAP } from '@/lib/motion';

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

// Lista de vídeos: cartões compactos (miniatura + título), mais por vista que os cartões das outras seções
const STRIP_PER_VIEW: PerView = { base: 1.2, sm: 1.8, md: 2.5, lg: 3, '2xl': 4 };

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
      // Decorativa: o título do vídeo já está no texto ao lado
      alt=""
      fill
      sizes={sizes}
      unoptimized={!isOptimizableImage(src)}
      onError={() => setIndex((i) => Math.min(i + 1, candidates.length - 1))}
      // object-cover em 16:9 corta as tarjas pretas do hqdefault (4:3)
      className="object-cover text-transparent transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
  );
}

/**
 * Vídeo em destaque (abre o player na página da TV). Mídia 16:9 com altura limitada pela tela (--tv-h, da seção):
 * até o lg o texto fica sobre a imagem (abaixo dela quando é o único vídeo e sobra altura); do lg em diante, num painel
 * ao lado. `previous` fica por baixo durante a troca (o novo é revelado por cima dele).
 */
function FeaturedVideo({ video, previous, solo }: { video: Video; previous: Video | null; solo: boolean }) {
  const date = formatDateLong(video.date);

  return (
    <div data-cinema className="mt-[clamp(0.875rem,2.4svh,1.75rem)]">
      <article className="group relative overflow-hidden rounded-[1.75rem] bg-[#00264d] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/15 transition-[box-shadow] duration-300 hover:ring-[#ffd000]/45 has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-[#ffd000] lg:flex">
        <div className="relative aspect-video max-h-(--tv-h) w-full shrink-0 overflow-hidden bg-[#003366] lg:max-h-none lg:w-[min(64%,calc(var(--tv-h)*16/9))]">
          {previous && previous.id !== video.id && (
            <div aria-hidden="true" className="absolute inset-0">
              <VideoThumb key={previous.id} video={previous} large sizes="(min-width: 1024px) 60rem, 100vw" />
            </div>
          )}
          <div data-feature-media className="absolute inset-0">
            <VideoThumb key={video.id} video={video} large sizes="(min-width: 1024px) 60rem, 100vw" />
          </div>
          {/* Véu só embaixo (texto sobreposto até o lg), forte na faixa do texto: as miniaturas do YouTube trazem letras
              grandes gravadas que competiriam com o título. Do lg em diante a foto fica limpa */}
          {!solo && <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/70 via-50% to-transparent lg:hidden" />}

          <span className={`absolute left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#ffd000] text-[#003f7f] shadow-[0_0_0_8px_rgba(255,208,0,0.22),0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-[scale] duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:top-1/2 ${solo ? 'top-1/2' : 'top-[40%]'}`}>
            <span data-pulse aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-[#ffd000] opacity-0" />
            <FaPlay aria-hidden="true" className="ml-[6%] h-[36%] w-[36%]" />
          </span>
          {video.duration && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-xs font-bold text-white tabular-nums sm:top-4 sm:right-4">
              <FaClock aria-hidden="true" className="h-3 w-3" />
              <span className="sr-only">Duração:</span> {video.duration}
            </span>
          )}
        </div>

        <div
          data-feature-text
          // Anuncia o vídeo novo quando outro é escolhido na lista
          aria-live="polite"
          className={`p-4 sm:p-6 lg:static ${solo ? '' : 'absolute inset-x-0 bottom-0'} lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:justify-center lg:p-[clamp(1.5rem,3.5svh,2.75rem)]`}
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="rounded-full bg-[#ffd000] px-2.5 py-0.5 text-[11px] font-black tracking-wider text-[#003f7f] uppercase">Em destaque</span>
            {video.category && (
              // Fundo sólido: sobre a miniatura (até o lg) um selo translúcido some nas letras claras da imagem
              <span className="rounded-full bg-[#001a3d]/85 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-white uppercase ring-1 ring-white/20 ring-inset">{video.category}</span>
            )}
            {date && <span className="hidden text-xs font-medium text-white/75 sm:inline">{date}</span>}
          </div>
          <h3 className="mt-2 text-base leading-snug font-black tracking-tight text-balance text-white transition-colors duration-300 group-hover:text-[#ffd000] sm:mt-3 sm:text-xl md:text-2xl lg:text-[clamp(1.25rem,3svh,1.875rem)]">
            {/* Link "esticado": o ::after cobre o cartão inteiro */}
            <Link href={videoHref(video)} className="after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:shadow-none! focus-visible:outline-none!">
              <span className="sr-only">Assistir: </span>
              <span className="line-clamp-2 lg:line-clamp-3">{video.title}</span>
            </Link>
          </h3>
          {video.description && (
            // Painel estreito (lg) em tela baixa: sem resumo, para o painel não passar da altura do vídeo
            <p className="mt-3 hidden text-[15px] leading-relaxed text-pretty text-white/75 lg:line-clamp-3 lg:[@media(max-height:760px)]:line-clamp-2 lg:max-xl:[@media(max-height:800px)]:hidden">{video.description}</p>
          )}
          <span aria-hidden="true" className="mt-[clamp(1rem,3svh,1.75rem)] hidden w-fit items-center gap-2.5 rounded-full bg-white px-5 py-3 text-sm font-black text-[#003f7f] shadow-[0_15px_30px_-15px_rgba(0,0,0,0.5)] transition-colors duration-300 group-hover:bg-[#ffd000] lg:inline-flex">
            <FaPlay className="h-3 w-3" />
            Assistir agora
          </span>
        </div>
      </article>
    </div>
  );
}

/** Esqueleto do destaque (mesma caixa: 16:9 limitada pela tela; painel ao lado no lg). */
function FeaturedSkeleton() {
  const pulse = 'animate-pulse bg-white/10 motion-reduce:animate-none';
  return (
    <div aria-hidden="true" className="mt-[clamp(0.875rem,2.4svh,1.75rem)] overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 lg:flex">
      <div className={`aspect-video max-h-(--tv-h) w-full shrink-0 lg:max-h-none lg:w-[min(64%,calc(var(--tv-h)*16/9))] ${pulse}`} />
      <div className="hidden flex-1 flex-col justify-center gap-3 p-10 lg:flex">
        <div className={`h-5 w-40 rounded-full ${pulse}`} />
        <div className={`h-7 w-11/12 rounded-full ${pulse}`} />
        <div className={`h-7 w-2/3 rounded-full ${pulse}`} />
      </div>
    </div>
  );
}

/**
 * Vídeo da lista: escolhe o destaque (o vídeo atual fica marcado). O marcado tem fundo mais escuro que o azul da seção,
 * não mais claro: sobre o branco translúcido o "Em destaque" amarelo de 10px e a data ficavam abaixo de 4,5:1.
 */
function VideoChip({ video, active, onSelect }: { video: Video; active: boolean; onSelect: (video: Video) => void }) {
  const date = formatDateBR(video.date);

  return (
    <article
      data-card
      className={`group relative flex h-full items-center gap-3 rounded-2xl p-2 pr-3 ring-1 transition-[background-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#ffd000] motion-reduce:hover:translate-y-0 ${active ? 'bg-[#001a3d]/45 ring-[#ffd000]/70' : 'bg-white/6 ring-white/12 hover:bg-white/10 hover:ring-white/30'}`}
    >
      <div data-card-media className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl bg-[#003366] sm:w-32 lg:w-[clamp(8rem,13svh,10rem)]">
        <VideoThumb video={video} sizes="10rem" />
        <span className={`absolute inset-0 grid place-items-center transition-colors duration-300 ${active ? 'bg-[#001a3d]/55' : 'bg-black/10 group-hover:bg-black/30'}`}>
          {active ? (
            // "No ar": barrinhas de equalizador no vídeo em destaque
            <span aria-hidden="true" className="flex h-4 items-end gap-0.5">
              <span className="h-full w-1 rounded-full bg-[#ffd000]" />
              <span className="h-2/3 w-1 rounded-full bg-[#ffd000]" />
              <span className="h-5/6 w-1 rounded-full bg-[#ffd000]" />
            </span>
          ) : (
            <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-[#ffd000] text-[#003f7f] transition-[scale] duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100">
              <FaPlay className="ml-0.5 h-2.5 w-2.5" />
            </span>
          )}
        </span>
        {video.duration && (
          <span className="absolute right-1 bottom-1 rounded-md bg-black/75 px-1.5 py-px text-[10px] font-bold text-white tabular-nums">
            <span className="sr-only">Duração:</span> {video.duration}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-black tracking-[0.14em] text-[#ffd000] uppercase">{active ? 'Em destaque' : video.category || 'TV Lojista'}</p>
        <h3 className="mt-0.5 text-sm leading-snug font-bold text-white">
          {/* Botão "esticado": o ::after cobre o cartão inteiro */}
          <button
            type="button"
            aria-pressed={active}
            // Foca no clique (o arraste do carrossel impede o foco no mousedown)
            onClick={(e) => {
              e.currentTarget.focus({ preventScroll: true });
              onSelect(video);
            }}
            className="block w-full cursor-pointer text-left after:absolute after:inset-0 after:z-10 after:rounded-2xl after:content-[''] focus-visible:shadow-none! focus-visible:outline-none!"
          >
            <span className="sr-only">Mostrar em destaque: </span>
            <span className="line-clamp-2">{video.title}</span>
          </button>
        </h3>
        {date && <p className="mt-1 text-[11px] font-medium text-white/90 tabular-nums">{date}</p>}
      </div>
    </article>
  );
}

function ChipSkeleton() {
  const pulse = 'animate-pulse bg-white/10 motion-reduce:animate-none';
  return (
    <div className="flex h-full items-center gap-3 rounded-2xl p-2 ring-1 ring-white/10">
      <div className={`aspect-video w-28 shrink-0 rounded-xl sm:w-32 lg:w-[clamp(8rem,13svh,10rem)] ${pulse}`} />
      <div className="flex-1 space-y-2">
        <div className={`h-2.5 w-16 rounded-full ${pulse}`} />
        <div className={`h-3.5 w-11/12 rounded-full ${pulse}`} />
        <div className={`h-3.5 w-2/3 rounded-full ${pulse}`} />
      </div>
    </div>
  );
}

const TVLojista = () => {
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeId, setActiveId] = React.useState<number | null>(null);
  const [previous, setPrevious] = React.useState<Video | null>(null);
  const root = React.useRef<HTMLElement>(null);
  const swapped = React.useRef(false);

  useReveal(root, [isLoading, videos.length]);
  useCardsMotion(root, [isLoading, videos.length]);

  const featured = videos.find((v) => v.id === activeId) ?? videos[0];

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, small: '(max-width: 767px)' }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        const q = gsap.utils.selector(el);
        // fim: seção inteira na tela, com o topo logo abaixo da barra compacta do header
        const bar = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar-compact')) || 0;

        // "Modo cinema": o destaque entra menor e chega à escala 1 enquanto a faixa escurece ("luzes baixando"),
        // acompanhando a rolagem para frente e para trás
        const cinema = q('[data-cinema]')[0]?.firstElementChild;
        if (cinema) {
          gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: { trigger: el, start: 'top bottom', end: () => `top ${bar()}`, scrub: true, invalidateOnRefresh: true },
            })
            .fromTo(cinema, { scale: ctx.conditions.small ? 0.92 : 0.86 }, { scale: 1 }, 0)
            .fromTo(q('[data-dim]'), { opacity: 0 }, { opacity: 1 }, 0);
        }

        // Pulso discreto no play, só enquanto a seção está na tela
        const pulses = q('[data-pulse]');
        if (pulses.length) {
          gsap.fromTo(
            pulses,
            { scale: 1, opacity: 0.7 },
            {
              scale: 1.8,
              opacity: 0,
              duration: 1.6,
              ease: EASE.soft,
              repeat: -1,
              repeatDelay: 0.8,
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', toggleActions: 'play pause resume pause' },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [isLoading, videos.length], revertOnUpdate: true },
  );

  // Troca do destaque escolhida na lista: a imagem nova é revelada da direita sobre a anterior (com leve zoom) e o
  // texto sobe em cascata. Na carga inicial não roda (a entrada é a do modo cinema).
  useGSAP(
    () => {
      if (!swapped.current) return;
      swapped.current = false;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline()
          .fromTo(q('[data-feature-media]'), { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: EASE.expo, clearProps: 'clipPath' }, 0)
          .fromTo(q('[data-feature-media] img'), { scale: 1.08 }, { scale: 1, duration: 1.2, ease: EASE.expo, clearProps: 'transform' }, 0)
          .fromTo(q('[data-feature-text] > *'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: EASE.enter, stagger: 0.06, clearProps: 'transform,opacity' }, 0.12);
      });
      return () => mm.revert();
    },
    // revertOnUpdate: uma troca no meio da anterior desfaz a anterior antes (sem duas animações no mesmo elemento)
    { scope: root, dependencies: [featured?.id], revertOnUpdate: true },
  );

  React.useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos?limit=8');
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

  const solo = !isLoading && videos.length === 1;

  const select = (video: Video) => {
    if (!featured || video.id === featured.id) return;
    swapped.current = true;
    setPrevious(featured);
    setActiveId(video.id);
  };

  return (
    // Bloco azul da marca (borda reta entre as seções), uma tela útil (--screen-fit) com o conteúdo centrado; celular
    // deitado cresce naturalmente. --tv-h: altura máxima do destaque = o que sobra da tela depois dos respiros, do
    // cabeçalho, da lista e dos controles (sem lista, sobra mais).
    <section
      ref={root}
      aria-labelledby="tv-lojista-titulo"
      aria-busy={isLoading || undefined}
      className={`relative flex flex-col justify-center overflow-hidden bg-[#003f7f] py-(--scene-blend) [@media(min-height:560px)]:min-h-(--screen-fit) ${
        solo
          ? '[--tv-h:max(10rem,calc(var(--screen-fit)-2*var(--scene-blend)-12.5rem))] md:[--tv-h:max(14rem,calc(var(--screen-fit)-2*var(--scene-blend)-15rem))] lg:[--tv-h:max(14rem,calc(var(--screen-fit)-2*var(--scene-blend)-10rem))]'
          : '[--tv-h:max(10rem,calc(var(--screen-fit)-2*var(--scene-blend)-16rem))] md:[--tv-h:max(12rem,calc(var(--screen-fit)-2*var(--scene-blend)-17.5rem))] lg:[--tv-h:max(12rem,calc(var(--screen-fit)-2*var(--scene-blend)-18.25rem))]'
      }`}
    >
      {/* Brilhos da faixa: gradientes radiais em vez de filter: blur (área grande sob o header de vidro) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(34rem_30rem_at_92%_0%,rgba(255,208,0,0.12),transparent_70%),radial-gradient(30rem_26rem_at_0%_100%,rgba(0,168,89,0.12),transparent_70%),linear-gradient(135deg,#003f7f,#0052a3_50%,#003366)]" />
        {/* Escurece com o modo cinema (opacidade animada pela rolagem) */}
        <div data-dim className="absolute inset-0 bg-linear-to-b from-[#001a3d]/35 via-[#001a3d]/55 to-[#001a3d]/35 opacity-0" />
      </div>

      <div className="relative container mx-auto w-full px-4">
        <SectionCarousel
          label="Vídeos da TV Lojista"
          itemName="vídeo"
          tone="dark"
          action={{ href: '/imprensa/tv-lojista', label: 'Ver todos' }}
          prevLabel="Vídeos anteriores"
          nextLabel="Próximos vídeos"
          loading={isLoading}
          skeleton={<ChipSkeleton />}
          perView={STRIP_PER_VIEW}
          header={({ controls, action }) => (
            // Cabeçalho próprio: o destaque fica entre o título e a lista. Controles: no md+ na coluna à direita do
            // título (embaixo da ação); no celular numa linha "Mais vídeos" logo acima da lista.
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6">
              <div className="col-start-1 row-start-1 min-w-0">
                <SectionHeading
                  id="tv-lojista-titulo"
                  tone="dark"
                  eyebrow={
                    <>
                      <FaVideo aria-hidden="true" />
                      Vídeos para o comércio
                    </>
                  }
                  eyebrowClass="bg-[#ffd000] text-[#003f7f]"
                  title="TV Lojista"
                  // Os vídeos são de terceiros: "da CDL" e "parceiros" só voltam com vídeo próprio e convênio confirmado
                  text="Dicas em vídeo para o lojista, selecionadas pela CDL Ipirá."
                />
              </div>
              {action && <div className="relative z-10 col-start-2 row-start-1 self-start justify-self-end">{action}</div>}
              <div className="col-span-2 row-start-2">
                {featured ? <FeaturedVideo video={featured} previous={previous} solo={solo} /> : <FeaturedSkeleton />}
              </div>
              {controls && (
                // Celulares estreitos (< 380px): só os controles, senão o rótulo e o contador quebram linha
                <div className="col-span-2 row-start-3 mt-3 flex items-center justify-end gap-4 min-[380px]:justify-between md:col-span-1 md:col-start-2 md:row-start-1 md:mt-0 md:self-end">
                  <p aria-hidden="true" className="hidden text-[11px] font-bold tracking-[0.14em] whitespace-nowrap text-white/85 uppercase min-[380px]:block md:hidden">
                    Mais vídeos
                  </p>
                  {controls}
                </div>
              )}
            </div>
          )}
        >
          {/* Um vídeo só: o destaque basta (sem lista) */}
          {!solo && videos.map((video) => <VideoChip key={video.id} video={video} active={video.id === featured?.id} onSelect={select} />)}
        </SectionCarousel>
      </div>
    </section>
  );
};

export default TVLojista;
