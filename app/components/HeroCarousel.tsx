'use client';

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaPause, FaPlay } from 'react-icons/fa';
import { isOptimizableImage } from '@/lib/images';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  gradient: string;
  accentColor: string;
  image: string;
  imagePosition: string;
  imageFit: string;
  pattern: string;
  order: number;
}

// Tempo de cada slide no avanço automático (a barra de progresso dirige a troca)
const SLIDE_DURATION_MS = 7000;
const ASSOCIE_SE_URL = 'https://app.higestor.com.br/inscricao/empresa/cdl-ipira';
const DEFAULT_GRADIENT = 'from-[#003f7f] via-[#0052a3] to-[#0066cc]';

// Classes literais para o Tailwind gerar (valores vêm do painel: cover, contain, fill, none).
// "none" (tamanho real) vira cover: o next/image serve o arquivo redimensionado por tela,
// então o "tamanho real" mudaria a cada dispositivo (recorte gigante no retina, faixas no celular).
const FIT_CLASSES: Record<string, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-cover',
};

// Cores de botão claras do seletor do painel pedem texto azul; as demais (escuras/saturadas), texto branco
const LIGHT_ACCENTS = new Set([
  'bg-[#ffd000]', 'bg-white', 'bg-yellow-500', 'bg-amber-500', 'bg-lime-500',
  'bg-orange-500', 'bg-sky-500', 'bg-cyan-500', 'bg-teal-500', 'bg-emerald-500',
]);
const accentTextClass = (accent: string) => (LIGHT_ACCENTS.has(accent) ? 'text-[#003f7f]' : 'text-white');

// Só aceita caminho interno ("/...") ou http(s); outros esquemas (javascript:, data:) não viram link
function safeLink(link?: string) {
  const href = link?.trim();
  if (!href) return null;
  if (href.startsWith('/') && !href.startsWith('//')) return { href, external: false };
  if (/^https?:\/\//i.test(href)) return { href, external: true };
  return null;
}

// Preferência do sistema por menos movimento e aba oculta, lidas sem efeitos (SSR: false)
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const subscribeVisibility = (cb: () => void) => {
  document.addEventListener('visibilitychange', cb);
  return () => document.removeEventListener('visibilitychange', cb);
};

const pad = (n: number) => String(n).padStart(2, '0');

const ctaBase =
  'group/cta inline-flex items-center gap-2.5 rounded-full px-5 py-3.5 sm:px-7 sm:py-4 text-sm sm:text-base font-extrabold tracking-wide transition-[translate,scale,box-shadow,background-color] duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#003f7f] motion-reduce:transition-none motion-reduce:hover:translate-y-0';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Pausa o avanço automático com o mouse por cima ou foco de teclado dentro do carrossel
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // Pausa escolhida pelo usuário (botão): necessária no toque, onde não há hover
  const [isStopped, setIsStopped] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => false);
  const tabHidden = useSyncExternalStore(subscribeVisibility, () => document.hidden, () => false);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const swipeStartX = useRef<number | null>(null);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const response = await fetch('/api/hero');
        if (response.ok) {
          const data = await response.json();
          // Se vier da API (snake_case), converter para camelCase
          const formattedSlides = data.map((s: { id: number; title: string; subtitle: string; description: string; button_text?: string; buttonText?: string; button_link?: string; buttonLink?: string; gradient: string; accent_color?: string; accentColor?: string; image?: string; image_position?: string; imagePosition?: string; image_fit?: string; imageFit?: string; pattern?: string; order_index?: number; order?: number }) => ({
            id: s.id,
            title: s.title,
            subtitle: s.subtitle,
            description: s.description,
            buttonText: s.button_text || s.buttonText,
            buttonLink: s.button_link || s.buttonLink,
            gradient: s.gradient,
            accentColor: s.accent_color || s.accentColor,
            image: s.image,
            imagePosition: s.image_position || s.imagePosition || 'center',
            imageFit: s.image_fit || s.imageFit || 'cover',
            pattern: s.pattern,
            order: s.order_index || s.order
          }));
          // Sem slides ativos no painel: mostra os slides padrão em vez de um carregamento infinito
          setSlides(formattedSlides.length > 0 ? formattedSlides : initialSlides);
        } else {
          // Fallback para mock data se falhar
          setSlides(initialSlides);
        }
      } catch (error) {
        console.error('Erro ao carregar slides:', error);
        setSlides(initialSlides);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSlides();
  }, []);

  const total = slides.length;
  const hasMany = total > 1;
  const autoplay = hasMany && !reducedMotion;
  const isPaused = isHovered || isFocused || tabHidden || isStopped;

  const goTo = useCallback((index: number) => {
    setCurrentSlide(total ? (index + total) % total : 0);
  }, [total]);

  // Ken Burns: zoom lento na imagem ativa. A que sai mantém a escala enquanto some (sem "pulo")
  useEffect(() => {
    if (reducedMotion) {
      mediaRefs.current.forEach((el) => el?.getAnimations().forEach((a) => a.cancel()));
      return;
    }
    const el = mediaRefs.current[currentSlide];
    if (!el?.animate) return;
    el.getAnimations().forEach((a) => a.cancel());
    el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }], { duration: 14000, easing: 'ease-out', fill: 'forwards' });
  }, [currentSlide, reducedMotion, slides]);

  if (isLoading || total === 0) {
    // Esqueleto com a mesma altura e o mesmo gradiente da marca: sem salto de layout nem spinner infinito
    return (
      <section aria-label="Carregando destaques" aria-busy="true" className="relative h-[520px] sm:h-[560px] md:h-[600px] lg:h-[640px] w-full overflow-hidden bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc]">
        <div className="container mx-auto flex h-full flex-col justify-end px-4 pb-14 sm:px-6 md:justify-center md:pb-28 lg:px-8">
          <div className="max-w-2xl space-y-5 animate-pulse motion-reduce:animate-none">
            <div className="h-7 w-48 rounded-full bg-white/20" />
            <div className="h-12 w-4/5 rounded-xl bg-white/20 sm:h-16" />
            <div className="space-y-2.5">
              <div className="h-4 w-full max-w-lg rounded-full bg-white/15" />
              <div className="h-4 w-2/3 max-w-md rounded-full bg-white/15" />
            </div>
            <div className="h-12 w-44 rounded-full bg-white/25 sm:h-14" />
          </div>
        </div>
      </section>
    );
  }

  const next = () => goTo(currentSlide + 1);
  const prev = () => goTo(currentSlide - 1);

  return (
    <section
      aria-roledescription={hasMany ? 'carrossel' : undefined}
      aria-label="Destaques da CDL Ipirá"
      className="relative isolate h-[520px] sm:h-[560px] md:h-[600px] lg:h-[640px] w-full touch-pan-y overflow-hidden bg-[#003f7f]"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setIsHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setIsHovered(false)}
      onFocus={(e) => e.target.matches(':focus-visible') && setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsFocused(false);
      }}
      onPointerDown={(e) => {
        // Arrastar com o dedo/caneta troca o slide; o mouse usa as setas
        swipeStartX.current = hasMany && e.pointerType !== 'mouse' ? e.clientX : null;
      }}
      onPointerUp={(e) => {
        const start = swipeStartX.current;
        swipeStartX.current = null;
        if (start === null) return;
        const dx = e.clientX - start;
        if (dx <= -50) next();
        else if (dx >= 50) prev();
      }}
      onPointerCancel={() => { swipeStartX.current = null; }}
    >
      <div aria-live={autoplay && !isPaused ? 'off' : 'polite'} className="absolute inset-0">
        {slides.map((slide, index) => {
          // Só o primeiro slide é o h1 da página; slides ocultos saem da navegação por teclado
          const Heading = index === 0 ? 'h1' : 'h2';
          const isCurrent = index === currentSlide;
          const primary = slide.buttonText ? safeLink(slide.buttonLink) : null;
          const PrimaryCta = primary?.external ? 'a' : Link;
          const accent = slide.accentColor || 'bg-[#ffd000]';
          const showAssocie = primary?.href !== ASSOCIE_SE_URL;

          return (
            <div
              key={slide.id}
              role={hasMany ? 'group' : undefined}
              aria-roledescription={hasMany ? 'slide' : undefined}
              aria-label={hasMany ? `${index + 1} de ${total}` : undefined}
              aria-hidden={!isCurrent}
              inert={!isCurrent}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none ${isCurrent ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
            >
              {/* Fundo: gradiente da marca (aparece sozinho sem imagem e nas bordas de "conter") */}
              <div className={`absolute inset-0 bg-linear-to-br ${slide.gradient || DEFAULT_GRADIENT}`} />

              {slide.image ? (
                <div ref={(el) => { mediaRefs.current[index] = el; }} className="absolute inset-0 will-change-transform">
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    sizes="100vw"
                    className={FIT_CLASSES[slide.imageFit] || 'object-cover'}
                    style={{ objectPosition: slide.imagePosition || 'center' }}
                    preload={index === 0}
                    unoptimized={!isOptimizableImage(slide.image)}
                    draggable={false}
                  />
                </div>
              ) : (
                <>
                  {slide.pattern && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-10"
                      style={{ backgroundImage: `url('/patterns/${slide.pattern}.svg')` }}
                    />
                  )}
                  <div aria-hidden="true" className="absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-[#00a859]/25 blur-3xl" />
                  <div aria-hidden="true" className="absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-[#ffd000]/15 blur-3xl" />
                </>
              )}

              {/* Overlay direcional da marca (lado do texto) + vinheta inferior: a foto continua viva */}
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[#003f7f]/95 via-[#003f7f]/60 to-[#003f7f]/10 md:bg-linear-to-r md:from-[#003f7f]/90 md:via-[#003f7f]/55 md:via-40% md:to-transparent md:to-85%" />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/45 to-transparent" />

              {/* Conteúdo */}
              <div className={`relative z-10 container mx-auto flex h-full flex-col justify-end px-4 sm:px-6 md:justify-center lg:px-8 ${hasMany ? 'pb-24 md:pb-36' : 'pb-12 md:pb-24'}`}>
                <div
                  className={`max-w-2xl text-white transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none ${isCurrent ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-4 opacity-0'}`}
                >
                  {slide.subtitle && (
                    <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-3.5 py-1.5 text-[11px] font-extrabold uppercase leading-tight tracking-wider text-[#003f7f] sm:tracking-[0.14em] shadow-[0_10px_30px_-12px_rgba(255,208,0,0.8)] sm:mb-5 sm:text-xs">
                      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#003f7f]" />
                      {slide.subtitle}
                    </p>
                  )}
                  <Heading className="text-[2.5rem] font-black leading-[1.02] tracking-tight text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)] sm:text-6xl lg:text-7xl">
                    {slide.title}
                  </Heading>
                  {slide.description && (
                    <p className="mt-4 max-w-[60ch] line-clamp-3 text-base leading-relaxed text-white/90 text-pretty sm:mt-5 sm:line-clamp-none sm:text-lg lg:text-xl">
                      {slide.description}
                    </p>
                  )}

                  <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
                    {primary && (
                      <PrimaryCta
                        href={primary.href}
                        {...(primary.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className={`${ctaBase} ${accent} ${accentTextClass(accent)} shadow-[0_16px_36px_-14px_rgba(0,0,0,0.5)] hover:shadow-[0_22px_44px_-14px_rgba(0,0,0,0.55)]`}
                      >
                        {slide.buttonText}
                        <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                        {primary.external && <span className="sr-only">(abre em nova aba)</span>}
                      </PrimaryCta>
                    )}
                    {showAssocie && (
                      <a
                        href={ASSOCIE_SE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${ctaBase} border border-white/50 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white/15`}
                      >
                        <span className="sm:hidden">Associe-se</span>
                        <span className="hidden sm:inline">Seja um associado</span>
                        <FaExternalLinkAlt aria-hidden="true" className="h-3 w-3 opacity-80" />
                        <span className="sr-only">(abre em nova aba)</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controles: contador, progresso segmentado (enche com o tempo) e setas, junto do conteúdo */}
      {hasMany && (
        <div
          className="absolute inset-x-0 bottom-6 z-20 md:bottom-24"
          // Setas do teclado nos controles (dentro do slide, a troca tiraria o foco do elemento)
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
          }}
        >
          <div className="container mx-auto flex items-center gap-4 px-4 sm:px-6 lg:px-8">
            <p aria-hidden="true" className="shrink-0 whitespace-nowrap text-sm font-black tabular-nums tracking-wider text-white">
              {pad(currentSlide + 1)}
              <span className="font-semibold text-white/55"> / {pad(total)}</span>
            </p>

            <div className="flex w-full max-w-[13rem] gap-1.5 sm:max-w-xs">
              {slides.map((slide, index) => {
                const isCurrent = index === currentSlide;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Ir para o slide ${index + 1}: ${slide.title}`}
                    aria-current={isCurrent ? 'true' : undefined}
                    className="group flex h-8 flex-1 items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd000]"
                  >
                    <span className="relative h-1 w-full overflow-hidden rounded-full bg-white/25 transition-colors group-hover:bg-white/45">
                      <span
                        className="absolute inset-0 origin-left rounded-full bg-[#ffd000]"
                        style={
                          isCurrent && autoplay
                            ? { animation: `hero-progress ${SLIDE_DURATION_MS}ms linear forwards`, animationPlayState: isPaused ? 'paused' : 'running' }
                            : { transform: `scaleX(${index <= currentSlide ? 1 : 0})` }
                        }
                        onAnimationEnd={isCurrent ? next : undefined}
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex shrink-0 gap-2">
              {autoplay && (
                <button
                  type="button"
                  onClick={() => setIsStopped((s) => !s)}
                  aria-label={isStopped ? 'Retomar troca automática' : 'Pausar troca automática'}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-[background-color,scale] duration-200 hover:bg-white/25 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd000] motion-reduce:transition-none"
                >
                  {isStopped ? <FaPlay aria-hidden="true" className="h-3 w-3 translate-x-px" /> : <FaPause aria-hidden="true" className="h-3 w-3" />}
                </button>
              )}
              <button
                type="button"
                onClick={prev}
                aria-label="Slide anterior"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-[background-color,scale] duration-200 hover:bg-white/25 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd000] motion-reduce:transition-none"
              >
                <FaChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Próximo slide"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-[background-color,scale] duration-200 hover:bg-white/25 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd000] motion-reduce:transition-none"
              >
                <FaChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe da barra de progresso (React 19 deduplica e leva para o <head>) */}
      <style href="hero-carousel-progress" precedence="default">
        {'@keyframes hero-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}'}
      </style>
    </section>
  );
}

const initialSlides: Slide[] = [
  {
    id: 1,
    title: 'Projeto Conduz',
    subtitle: 'Construindo um futuro melhor!',
    description: 'Aulas gratuitas de Violão, Cajon, Ukulele, Capoeira, Yoga, Judô e Palestras Educacionais para crianças e adolescentes.',
    buttonText: 'Saiba Mais',
    buttonLink: '/imprensa/contato',
    gradient: 'from-[#003f7f] via-[#0052a3] to-[#0066cc]',
    accentColor: 'bg-[#ffd000]',
    image: '',
    imagePosition: 'center',
    imageFit: 'cover',
    pattern: 'music',
    order: 1
  },
  {
    id: 2,
    title: 'Seja um Associado',
    subtitle: 'Faça parte da maior rede de empresários',
    description: 'Tenha acesso a consultas SPC ilimitadas, assessoria jurídica, certificado digital e muito mais! Invista no crescimento do seu negócio.',
    buttonText: 'Associe-se Agora',
    buttonLink: 'https://app.higestor.com.br/inscricao/empresa/cdl-ipira',
    gradient: 'from-[#00a859] via-[#00c46a] to-[#00d670]',
    accentColor: 'bg-[#ffd000]',
    image: '',
    imagePosition: 'center',
    imageFit: 'cover',
    pattern: 'business',
    order: 2
  }
];
