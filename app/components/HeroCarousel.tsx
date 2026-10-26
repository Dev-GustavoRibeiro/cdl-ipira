'use client';

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image, { getImageProps } from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass, SwiperModule } from 'swiper/types';
import { effectInit, effectVirtualTransitionEnd } from 'swiper/effect-utils';
import 'swiper/css';
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaPause, FaPlay } from 'react-icons/fa';
import { isOptimizableImage } from '@/lib/images';
import { EASE, MOTION_OK, SplitText, gsap, useGSAP } from '@/lib/motion';

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
  /** Imagem própria do celular (painel → "Imagem para celular"); vazia: o celular usa a imagem principal */
  imageMobile: string;
  imagePosition: string;
  imageFit: string;
  pattern: string;
  order: number;
}

// Tempo de cada slide no avanço automático (a barra de progresso dirige a troca) e duração da troca
const SLIDE_DURATION_MS = 7000;
const TRANSITION_MS = 950;
const ASSOCIE_SE_URL = 'https://app.higestor.com.br/inscricao/empresa/cdl-ipira';
const DEFAULT_GRADIENT = 'from-[#003f7f] via-[#0052a3] to-[#0066cc]';

// Exatamente a primeira tela: janela - header no estado de topo (--hero-top = --bar-full, a min-h do <header>, + a
// barra de contatos h-9 no layout desktop) - barra inferior do celular. Além disso o hero sobe por baixo do header
// inteiro (--hero-under = --bar-full): o vidro do header mostra o fundo do slide, não o branco da página. Tudo em rem,
// como o header: com o texto ampliado as medidas em px ficavam menores que ele.
// Em janela baixa (celular deitado) cresce até o mínimo em que o conteúdo cabe. O esqueleto usa a mesma altura.
// Celular baixo com texto ampliado: o mínimo de 30rem (720px a 150%) jogava os botões para baixo da barra inferior;
// em tela baixa a descrição e o 2º botão saem (ver os slides) e o que sobra cabe em 21rem.
// Tela larga com a barra inferior (texto ampliado, variante mob): o mínimo de 26rem levava a pílula de controles para
// baixo da barra (1280×720 a 150%); o mínimo para onde a pílula fica 0.5rem acima dela (a base do hero, --hero-low,
// pode passar por trás da barra, como os atalhos que sobem sobre ela).
const HERO_HEIGHT =
  '[@media(orientation:portrait)_and_(max-height:700px)]:[html.a11y-text_&]:[--hero-min:21rem] -mt-[var(--hero-under)] [--hero-under:var(--bar-full)] [--hero-top:var(--bar-full)] desk:[--hero-top:calc(var(--bar-full)+2.25rem)] [--hero-min:30rem] lg:[--hero-min:26rem] mob:lg:[--hero-min:min(26rem,calc(100svh-var(--hero-top)-var(--bottom-nav)+var(--hero-low)-0.5rem))] short-landscape:[--hero-min:20rem] h-[calc(max(100svh-var(--hero-top)-var(--bottom-nav),var(--hero-min))+var(--hero-under))]';

// Respiros laterais alinhados ao container do header (texto, controles e imagem "inteira" usam os mesmos)
const GUTTER_X = 'px-4 sm:px-6 lg:px-[max(6rem,calc((100vw-80rem)/2+2rem))] 2xl:px-[max(6rem,calc((100vw-96rem)/2+2rem))]';
// Área do texto: embaixo (celular/tablet) acima dos controles; à esquerda e centrada na altura a partir de lg e no
// celular deitado. --hero-ctrl = altura reservada aos controles (0 com um slide só); --hero-low = piso do conteúdo:
// acima do degradê, dos atalhos que sobem sobre a base do hero (--services-overlap) e do botão flutuante de
// acessibilidade (fixo no canto inferior esquerdo).
const COPY_AREA = `flex h-full flex-col justify-end ${GUTTER_X} pt-[calc(var(--hero-under)+1rem)] pb-[calc(var(--hero-low)+var(--hero-ctrl)+clamp(0.5rem,1.6svh,1rem))] lg:justify-center lg:pt-[calc(var(--hero-under)+1.5rem)] short-landscape:justify-center`;

// Classes literais para o Tailwind gerar (valores vêm do painel: cover, contain, fill, none).
// "none" (tamanho real) vira cover: o next/image serve o arquivo redimensionado por tela.
const FIT_CLASSES: Record<string, string> = {
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-cover',
};

// Texto do botão com contraste AA para cada cor do seletor (e valores antigos do banco): amarelo e branco levam o
// azul da marca; verdes e tons médios levam navy (o verde #00a859 com texto branco ficava em 3,1:1); escuros, branco
const BLUE_TEXT_ACCENTS = new Set(['bg-[#ffd000]', 'bg-white']);
const NAVY_TEXT_ACCENTS = new Set([
  'bg-[#00a859]', 'bg-yellow-500', 'bg-amber-500', 'bg-lime-500', 'bg-orange-500',
  'bg-sky-500', 'bg-cyan-500', 'bg-teal-500', 'bg-emerald-500',
]);
const accentTextClass = (accent: string) =>
  BLUE_TEXT_ACCENTS.has(accent) ? 'text-[#003f7f]' : NAVY_TEXT_ACCENTS.has(accent) ? 'text-[#001a3d]' : 'text-white';

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

/**
 * Efeito de troca próprio (módulo do Swiper): o slide que entra é revelado por máscara da direita para a esquerda,
 * com a foto deslizando por dentro e assentando de 1.08 para 1; o que sai desliza 12% para a esquerda e escurece por
 * baixo dele. Tudo é função do progresso de cada slide: arrastando, a máscara acompanha o dedo; ao soltar (ou nos
 * botões/autoplay), transições CSS com a duração do Swiper completam o movimento. Voltar faz o caminho inverso.
 */
type SlideEl = HTMLElement & { progress: number; swiperSlideOffset: number; heroP?: number };
const EASE_IN_OUT = 'cubic-bezier(0.76, 0, 0.24, 1)';
// Depois de arrastar o movimento já tem velocidade: termina desacelerando, sem a arrancada lenta do in-out
const EASE_RELEASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const layers = (el: HTMLElement) =>
  [el, ...el.querySelectorAll<HTMLElement>('[data-hero-media],[data-hero-shade]')] as const;

const HeroReveal: SwiperModule = ({ swiper, on }) => {
  let released = false;
  const setTranslate = () => {
    for (const el of swiper.slides as SlideEl[]) {
      const p = Math.max(-1, Math.min(1, el.progress)); // < 0 entrando pela direita, > 0 saindo pela esquerda
      const last = el.heroP ?? p;
      el.heroP = p;
      const enter = Math.max(-p, 0);
      const leave = Math.max(p, 0);
      // Num salto de vários slides, os do meio mudam sem transição (senão a máscara deles piscaria no caminho)
      if (Math.abs(p) >= 1 && Math.abs(last) >= 1) layers(el).forEach((n) => (n.style.transitionDuration = '0ms'));
      el.style.transform = `translate3d(${-el.swiperSlideOffset}px,0,0) translateX(${-leave * 12}%)`;
      el.style.clipPath = `inset(0 0 0 ${enter * 100}%)`;
      el.style.zIndex = p < 0 ? '3' : p > 0 ? '1' : '2';
      el.style.visibility = Math.abs(p) >= 1 ? 'hidden' : 'visible';
      const [, media, shade] = layers(el);
      if (media) media.style.transform = `translateX(${enter * 18}%) scale(${1 + enter * 0.08})`;
      if (shade) shade.style.opacity = String(leave * 0.7);
    }
  };
  const setTransition = (duration: number) => {
    const ease = released ? EASE_RELEASE : EASE_IN_OUT;
    if (duration) released = false;
    for (const el of swiper.slides) {
      const [slide, media, shade] = layers(el);
      slide.style.transitionProperty = 'transform, clip-path, visibility';
      if (media) media.style.transitionProperty = 'transform';
      if (shade) shade.style.transitionProperty = 'opacity';
      layers(el).forEach((n) => {
        n.style.transitionDuration = `${duration}ms`;
        n.style.transitionTimingFunction = ease;
      });
    }
    effectVirtualTransitionEnd({ swiper, duration, transformElements: swiper.slides, allSlides: true });
  };
  on('sliderFirstMove', () => {
    released = true;
  });
  effectInit({
    effect: 'hero-reveal',
    swiper,
    on: on as unknown as () => void,
    setTranslate,
    setTransition,
    overwriteParams: () => ({ slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 0, watchSlidesProgress: true, virtualTranslate: true }),
  });
};

const ctaBase =
  'group/cta inline-flex items-center gap-2.5 rounded-full px-5 py-3.5 sm:px-7 sm:py-4 text-sm sm:text-base font-extrabold tracking-wide transition-[translate,scale,box-shadow,background-color] duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#001a3d] motion-reduce:transition-none motion-reduce:hover:translate-y-0';

// Setas laterais: vidro escuro sobre a foto; no hover viram brancas. Verticalmente no centro da área visível (abaixo do
// header e acima dos atalhos) a partir de lg; no celular/tablet a 30% dela, acima do texto que fica embaixo.
// Linha de hero_slides (snake_case; camelCase aceito por compatibilidade)
type ApiSlide = { id: number; title: string; subtitle: string; description: string; button_text?: string; buttonText?: string; button_link?: string; buttonLink?: string; gradient: string; accent_color?: string; accentColor?: string; image?: string; image_mobile?: string | null; imageMobile?: string; image_position?: string; imagePosition?: string; image_fit?: string; imageFit?: string; pattern?: string; order_index?: number; order?: number };

const fromRows = (rows: ApiSlide[]): Slide[] =>
  rows.length === 0
    ? initialSlides
    : rows.map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle,
        description: s.description,
        buttonText: s.button_text || s.buttonText || '',
        buttonLink: s.button_link || s.buttonLink || '',
        gradient: s.gradient,
        accentColor: s.accent_color || s.accentColor || '',
        image: s.image || '',
        imageMobile: s.image_mobile || s.imageMobile || '',
        imagePosition: s.image_position || s.imagePosition || 'center',
        imageFit: s.image_fit || s.imageFit || 'cover',
        pattern: s.pattern || '',
        order: s.order_index || s.order || 0,
      }));

// Texto ampliado no celular/tablet: as setas cairiam sobre o selo e o título; ficam os pontos e o arraste
const sideArrow =
  'max-lg:[html.a11y-text_&]:hidden absolute z-20 flex size-11 items-center justify-center rounded-full border border-white/30 bg-[#001a3d]/35 text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md transition-[background-color,color,border-color,scale] duration-200 hover:border-white hover:bg-white hover:text-[#001a3d] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd000] motion-reduce:transition-none top-[calc(var(--hero-under)+(100%-var(--hero-under)-var(--hero-low))*0.3)] -translate-y-1/2 lg:size-14 lg:top-[calc(var(--hero-under)+(100%-var(--hero-under)-var(--hero-low))/2)] short-landscape:hidden';

// rows: slides lidos no servidor (a foto do 1º slide já vem no HTML); null = falhou lá, busca no navegador
export default function HeroCarousel({ rows = null }: { rows?: ApiSlide[] | null }) {
  const [slides, setSlides] = useState<Slide[]>(() => (rows ? fromRows(rows) : []));
  const [isLoading, setIsLoading] = useState(!rows);
  const [current, setCurrent] = useState(0);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  // Pausa o avanço automático com o mouse sobre o texto/controles ou foco de teclado dentro do carrossel
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // Pausa escolhida pelo usuário (botão): necessária no toque, onde não há hover
  const [isStopped, setIsStopped] = useState(false);
  // Arrastando (toque/mouse): o avanço automático espera soltar
  const [isDragging, setIsDragging] = useState(false);
  // Hero fora da tela (rolou para baixo): o avanço automático e o zoom lento esperam ele voltar
  const [inView, setInView] = useState(true);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => false);
  const tabHidden = useSyncExternalStore(subscribeVisibility, () => document.hidden, () => false);
  const rootRef = useRef<HTMLElement>(null);
  const enteredRef = useRef(false);
  // O 1º slide vindo do servidor já chega pintado: animar a entrada o apagaria e redesenharia na carga
  const skipEntranceRef = useRef(!!rows);

  useEffect(() => {
    if (rows) return;
    async function fetchSlides() {
      try {
        const response = await fetch('/api/hero');
        // Sem slides ativos no painel (ou falha): mostra os slides padrão em vez de um carregamento infinito
        setSlides(response.ok ? fromRows(await response.json()) : initialSlides);
      } catch (error) {
        console.error('Erro ao carregar slides:', error);
        setSlides(initialSlides);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSlides();
  }, [rows]);

  const total = slides.length;
  const hasMany = total > 1;
  const autoplay = hasMany && !reducedMotion;
  const isPaused = isHovered || isFocused || tabHidden || isStopped || isDragging || !inView;
  const loading = isLoading || total === 0;

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Entrada do texto do slide atual (na carga e a cada troca, enquanto a máscara revela a foto): selo, título linha
  // a linha saindo de uma máscara, descrição e botões em cascata. A saída do texto anterior é um fade curto em CSS.
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || loading) return;
      if (skipEntranceRef.current) {
        skipEntranceRef.current = false;
        enteredRef.current = true;
        return;
      }
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const slide = root.querySelector<HTMLElement>(`[data-hero-slide="${current}"]`);
        if (!slide) return;
        const q = gsap.utils.selector(slide);
        const delay = enteredRef.current ? 0.34 : 0.15;
        enteredRef.current = true;
        gsap.from(q('[data-hero-eyebrow]'), { y: 16, scale: 0.94, opacity: 0, duration: 0.6, ease: EASE.enter, delay });
        const [title] = q('[data-hero-title]');
        if (title) {
          SplitText.create(title, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            // Desfaz a divisão ao terminar: a máscara de cada linha cortaria acentos e descendentes do título
            onSplit: (self) =>
              gsap.from(self.lines, { yPercent: 110, duration: 1, ease: EASE.expo, stagger: 0.09, delay: delay + 0.08, onComplete: () => self.revert() }),
          });
        }
        gsap.from(q('[data-hero-desc]'), { y: 18, opacity: 0, duration: 0.8, ease: EASE.enter, delay: delay + 0.3 });
        gsap.from(q('[data-hero-ctas] > *'), { y: 18, opacity: 0, duration: 0.7, ease: EASE.enter, stagger: 0.08, delay: delay + 0.42 });
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [current, loading], revertOnUpdate: true },
  );

  // Ao rolar para fora, a cena se aproxima de leve
  useGSAP(
    () => {
      const section = rootRef.current;
      if (!section || loading) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.to(section.querySelector('[data-hero-stage]'), {
          scale: 1.06,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 0, end: 'bottom top', scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [loading], revertOnUpdate: true },
  );

  const next = () => swiper?.slideNext();
  const prev = () => swiper?.slidePrev();
  const goTo = (index: number) => swiper?.slideToLoop(index);
  // Fim da barra de progresso: avança; se ainda houver troca em andamento (arrastou no fim do tempo), avança depois dela
  const advance = () => {
    if (swiper && !swiper.slideNext()) swiper.once('transitionEnd', () => swiper.slideNext());
  };

  return (
    <section
      ref={rootRef}
      data-under-header
      aria-roledescription={!loading && hasMany ? 'carrossel' : undefined}
      aria-label={loading ? 'Carregando destaques' : 'Destaques da CDL Ipirá'}
      aria-busy={loading || undefined}
      className={`relative isolate w-full overflow-hidden bg-[#001a3d] ${HERO_HEIGHT} [--hero-low:max(4.25rem,var(--services-overlap)+0.75rem)] md:[--hero-low:max(4.75rem,var(--services-overlap)+0.75rem)] lg:[--hero-low:max(var(--scene-blend),5.25rem,var(--services-overlap)+1rem)] short-landscape:[--hero-low:max(var(--scene-blend),var(--services-overlap)+0.5rem)] ${hasMany ? '[--hero-ctrl:3.25rem]' : '[--hero-ctrl:0px]'} ${inView ? '' : '[&_[data-kb]]:[animation-play-state:paused]'}`}
      // Mouse sobre o texto ou os controles pausa (quem está lendo não perde o slide); sobre a foto, segue
      onPointerOver={(e) => e.pointerType === 'mouse' && setIsHovered(!!(e.target as Element).closest('[data-hero-copy],[data-hero-controls] button,[data-hero-arrow]'))}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={(e) => e.target.matches(':focus-visible') && setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsFocused(false);
      }}
    >
      {/* h1 da página fora dos slides: o título de cada slide (h2) sai do leitor de tela quando o slide troca */}
      <h1 className="sr-only">CDL Ipirá — Câmara de Dirigentes Lojistas de Ipirá</h1>
      {loading ? (
        // Esqueleto na mesma altura e na posição do texto: sem salto de layout nem spinner infinito
        <div aria-hidden="true" className={`absolute inset-0 bg-linear-to-br ${DEFAULT_GRADIENT}`}>
          <div className="absolute inset-0 bg-linear-to-t from-[#001a3d]/90 via-[#001a3d]/50 via-40% to-transparent lg:bg-linear-to-r" />
          <div className={COPY_AREA}>
            <div className="w-full max-w-[40rem] space-y-4 animate-pulse motion-reduce:animate-none">
              <div className="h-7 w-48 rounded-full bg-white/20" />
              <div className="h-11 w-4/5 rounded-xl bg-white/20 sm:h-16" />
              <div className="space-y-2.5">
                <div className="h-4 w-full max-w-lg rounded-full bg-white/15" />
                <div className="h-4 w-2/3 max-w-md rounded-full bg-white/15" />
              </div>
              <div className="h-12 w-44 rounded-full bg-white/25 sm:h-14" />
            </div>
          </div>
        </div>
      ) : (
        <div data-hero-stage className="absolute inset-0">
          <Swiper
            modules={[HeroReveal]}
            effect="hero-reveal"
            onSwiper={setSwiper}
            onRealIndexChange={(s) => setCurrent(s.realIndex)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            loop={hasMany}
            allowTouchMove={hasMany}
            grabCursor={hasMany}
            speed={reducedMotion ? 0 : TRANSITION_MS}
            // Soltar depois de 20% do caminho (ou num gesto rápido) já completa a troca
            longSwipesRatio={0.2}
            className="h-full w-full"
          >
            {slides.map((slide, index) => {
              // Slides ocultos saem da navegação por teclado e do leitor de tela
              const isCurrent = index === current;
              const primary = slide.buttonText ? safeLink(slide.buttonLink) : null;
              const PrimaryCta = primary?.external ? 'a' : Link;
              const accent = slide.accentColor || 'bg-[#ffd000]';
              const showAssocie = primary?.href !== ASSOCIE_SE_URL;
              return (
                <SwiperSlide
                  key={slide.id}
                  data-hero-slide={index}
                  role={hasMany ? 'group' : undefined}
                  aria-roledescription={hasMany ? 'slide' : undefined}
                  aria-label={hasMany ? `${index + 1} de ${total}` : undefined}
                  aria-hidden={!isCurrent}
                  inert={!isCurrent}
                  // globals.css centraliza e dá padding a todo .swiper-slide (fora de camada): aqui não
                  className="block! overflow-hidden bg-[#001a3d] p-0! text-left!"
                >
                  {/* Fundo que passa por baixo do header de vidro: a arte do slide desfocada (compatível com a foto) */}
                  <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[calc(var(--hero-under)+3rem)] overflow-hidden">
                    <SlideBackdrop slide={slide} />
                  </div>

                  {/* Foto (ou arte) nítida, começando abaixo do header (o vidro nunca cobre a imagem do carrossel), com
                      uma emenda suave no fundo desfocado. A camada de fora recebe o deslize/zoom da troca; a de dentro, o
                      zoom lento contínuo (Ken Burns), que dá vida mesmo com um slide só. */}
                  <div
                    data-hero-media
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[var(--hero-under)] bottom-0 [mask-image:linear-gradient(to_bottom,transparent,#000_2.5rem)]"
                  >
                    <div data-kb className="absolute inset-0 motion-safe:animate-[hero-kb_20s_ease-in-out_infinite_alternate]">
                      <SlideArt slide={slide} index={index} preload={index === 0} />
                    </div>
                  </div>

                  {/* Véu navy só onde fica o texto: de baixo no celular/tablet, da esquerda a partir de lg e no celular
                      deitado. O resto da foto aparece com as cores reais. Foto cobrindo o hero (vem do painel, pode ter
                      trecho claro atrás do texto): no lg o véu segura 70% até o fim da coluna do texto (~53% da largura)
                      e some até 80%; acabando em 62%, a descrição ficava em 3:1 sobre o claro da foto. Foto "inteira" e
                      arte sem foto já têm fundo escuro atrás do texto: véu curto, sem escurecer a imagem à direita. */}
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-linear-to-t from-[#001a3d]/95 from-5% via-[#001a3d]/70 via-35% to-transparent to-70% lg:bg-linear-to-r lg:from-[#001a3d]/90 lg:from-0% ${slide.image && slide.imageFit !== 'contain' ? 'lg:via-[#001a3d]/70 lg:via-50% lg:to-80%' : 'lg:via-[#001a3d]/55 lg:via-35% lg:to-62%'} short-landscape:bg-linear-to-r short-landscape:from-[#001a3d]/90 short-landscape:from-0% short-landscape:via-[#001a3d]/55 short-landscape:via-40% short-landscape:to-70%`}
                  />

                  <div className={`relative ${COPY_AREA}`}>
                    {/* Fora do slide atual o texto some (fade curto na saída; arrastando, a máscara revela só a foto)
                        e reaparece pela entrada escalonada do GSAP */}
                    <div
                      data-hero-copy
                      className={`w-full max-w-[40rem] text-white lg:max-w-[min(40rem,44vw)] short-landscape:max-w-[55%] ${isCurrent ? '' : 'opacity-0 transition-opacity duration-300'}`}
                    >
                      {slide.subtitle && (
                        <p
                          data-hero-eyebrow
                          className="mb-[clamp(0.375rem,1.5svh,1.25rem)] inline-flex max-w-full items-center gap-2 rounded-full bg-[#ffd000] px-3.5 py-1.5 text-[11px] font-extrabold uppercase leading-tight tracking-wider text-[#003f7f] shadow-[0_10px_30px_-12px_rgba(255,208,0,0.8)] sm:text-xs sm:tracking-[0.14em]"
                        >
                          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#003f7f]" />
                          {slide.subtitle}
                        </p>
                      )}
                      <h2
                        data-hero-title
                        className="max-w-[18ch] text-[clamp(2rem,min(10vw,6svh),3rem)] font-black leading-[1.02] tracking-tight text-balance drop-shadow-[0_2px_16px_rgba(0,10,30,0.35)] md:text-[clamp(2.75rem,min(8vw,6svh),4rem)] lg:text-[clamp(2.75rem,min(5vw,8.2svh),5.5rem)] lg:leading-[0.98] short-landscape:text-[clamp(1.5rem,min(4.5vw,9svh),2.25rem)]"
                      >
                        {slide.title}
                      </h2>
                      {slide.description && (
                        // Halo escuro colado às letras: as fotos vêm do painel, e o contraste não pode depender só do véu.
                        // Tela baixa com texto ampliado: sai, para selo, título e botão caberem acima da barra inferior
                        // (só no layout com barra inferior, variante mob; no desktop vale só a regra de 680px).
                        <p
                          data-hero-desc
                          className="mt-[clamp(0.5rem,1.6svh,1.25rem)] max-w-[52ch] line-clamp-2 text-[15px] leading-relaxed text-white/90 text-pretty [text-shadow:0_0_2px_rgba(0,26,61,0.85),0_1px_12px_rgba(0,26,61,0.6)] min-[400px]:line-clamp-3 md:text-lg lg:text-[clamp(1rem,2.2svh,1.25rem)] [@media(max-height:680px)]:hidden mob:[@media(max-height:800px)]:[html.a11y-text_&]:hidden"
                        >
                          {slide.description}
                        </p>
                      )}

                      <div data-hero-ctas className="mt-[clamp(0.875rem,2.6svh,1.75rem)] flex flex-wrap items-center gap-3">
                        {primary && (
                          <PrimaryCta
                            href={primary.href}
                            data-hero-cta
                            draggable={false}
                            {...(primary.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            // O texto vem do painel e pode ser vago ("Saiba mais"): o nome diz de quê, começando pelo
                            // texto visível (quem usa comando de voz continua falando o que vê)
                            aria-label={`${slide.buttonText}: ${slide.title}${primary.external ? ' (abre em nova aba)' : ''}`}
                            className={`${ctaBase} ${accent} ${accentTextClass(accent)} shadow-[0_16px_36px_-14px_rgba(0,0,0,0.5)] hover:shadow-[0_22px_44px_-14px_rgba(0,0,0,0.55)]`}
                          >
                            {slide.buttonText}
                            <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                          </PrimaryCta>
                        )}
                        {showAssocie && (
                          <a
                            href={ASSOCIE_SE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            draggable={false}
                            // Tela baixa com texto ampliado e barra inferior (mob): os dois botões não cabem lado a lado e o
                            // 2º ia para baixo da barra. Sai só este: o "Associe-se" continua nos atalhos do Menu.
                            className={`${ctaBase} border border-white/50 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white/15 mob:[@media(max-height:800px)]:[html.a11y-text_&]:hidden`}
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

                  {/* Escurece o slide que sai, por baixo do que entra */}
                  <div data-hero-shade aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#000a1a] opacity-0" />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      {/* Setas nas laterais do carrossel (2+ slides), centradas na área visível abaixo do header; no celular um pouco
          acima do meio, longe do texto que fica embaixo; no celular deitado ficam de fora (cairiam no texto) */}
      {!loading && hasMany && (
        <>
          <button type="button" data-hero-arrow onClick={prev} aria-label="Slide anterior" className={`${sideArrow} left-2 sm:left-4 lg:left-[max(1.25rem,calc((100vw-80rem)/2-3rem))] 2xl:left-[max(1.25rem,calc((100vw-96rem)/2-3rem))]`}>
            <FaChevronLeft aria-hidden="true" className="h-4 w-4 lg:h-5 lg:w-5" />
          </button>
          <button type="button" data-hero-arrow onClick={next} aria-label="Próximo slide" className={`${sideArrow} right-2 sm:right-4 lg:right-[max(1.25rem,calc((100vw-80rem)/2-3rem))] 2xl:right-[max(1.25rem,calc((100vw-96rem)/2-3rem))]`}>
            <FaChevronRight aria-hidden="true" className="h-4 w-4 lg:h-5 lg:w-5" />
          </button>
        </>
      )}

      {/* Progresso do tempo de cada slide (clicar vai ao slide) + pausa, numa pílula discreta no centro da base */}
      {!loading && hasMany && (
        <div
          data-hero-controls
          // Celular com texto ampliado: a pílula cresce e encostava no botão flutuante (canto inferior esquerdo); vai
          // para a direita
          className="pointer-events-none absolute inset-x-0 bottom-[var(--hero-low)] z-20 flex justify-center max-md:[html.a11y-text_&]:justify-end max-md:[html.a11y-text_&]:px-4"
          // Setas do teclado nos controles (no texto do slide, a troca tiraria o foco do elemento)
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
          }}
        >
          <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/20 bg-[#001a3d]/40 py-0.5 pl-3 pr-0.5 backdrop-blur-md">
            {slides.map((slide, index) => {
              const isCurrent = index === current;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Ir para o slide ${index + 1}: ${slide.title}`}
                  aria-current={isCurrent ? 'true' : undefined}
                  className={`group/seg flex h-11 items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd000] ${isCurrent ? 'w-12 sm:w-16' : 'w-6 sm:w-8'} transition-[width] duration-300 motion-reduce:transition-none`}
                >
                  {/* Tempo do slide: enche durante o autoplay e congela quando pausado */}
                  <span className="relative h-1 w-full overflow-hidden rounded-full bg-white/30 transition-colors group-hover/seg:bg-white/50">
                    <span
                      className={`absolute inset-0 origin-left rounded-full bg-[#ffd000] ${isCurrent ? (autoplay ? '' : 'scale-x-100') : 'scale-x-0'}`}
                      style={isCurrent && autoplay ? { animation: `hero-progress ${SLIDE_DURATION_MS}ms linear forwards`, animationPlayState: isPaused ? 'paused' : 'running' } : undefined}
                      onAnimationEnd={isCurrent && autoplay ? advance : undefined}
                    />
                  </span>
                </button>
              );
            })}
            {autoplay && (
              <button
                type="button"
                onClick={() => setIsStopped((s) => !s)}
                aria-label={isStopped ? 'Retomar troca automática' : 'Pausar troca automática'}
                className="ml-1 flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd000]"
              >
                {isStopped ? <FaPlay aria-hidden="true" className="h-3 w-3 translate-x-px" /> : <FaPause aria-hidden="true" className="h-3 w-3" />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Anuncia o slide quando a troca é do usuário (com o autoplay correndo, ficaria falando sozinho) */}
      {!loading && hasMany && (
        <p className="sr-only" aria-live={autoplay && !isPaused ? 'off' : 'polite'} aria-atomic="true">
          {`Slide ${current + 1} de ${total}: ${slides[current]?.title ?? ''}`}
        </p>
      )}

      {/* Keyframes da barra de progresso e do zoom lento (React 19 deduplica e leva para o <head>) */}
      <style href="hero-carousel-keyframes" precedence="default">
        {'@keyframes hero-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes hero-kb{from{transform:scale(1)}to{transform:scale(1.07) translate3d(-1.2%,-0.8%,0)}}'}
      </style>
    </section>
  );
}

// Nome do padrão vem do painel e vira URL: só letras, números, _ e -
const patternUrl = (pattern?: string) => (pattern && /^[\w-]+$/.test(pattern) ? `url('/patterns/${pattern}.svg')` : null);

// Arte de um slide. Foto: cobre o hero inteiro respeitando a posição escolhida. "Mostrar inteira" (contain): a foto
// inteira na área livre (acima do texto no celular, à direita no desktop) sobre uma cópia dela desfocada e escurecida.
// Sem foto: gradiente do slide + padrão da marca + numeral grande vazado.
function SlideArt({ slide, index, preload }: { slide: Slide; index: number; preload: boolean }) {
  const position = { objectPosition: slide.imagePosition || 'center' };

  if (slide.image && slide.imageFit === 'contain') {
    return (
      <>
        <SlidePhoto slide={slide} sizes="64px" className="scale-110 object-cover blur-2xl" />
        <div className="absolute inset-0 bg-[#001a3d]/55" />
        <div className="absolute inset-x-4 top-3 bottom-[52%] sm:inset-x-6 lg:top-6 lg:right-[max(6rem,calc((100vw-80rem)/2+2rem))] lg:bottom-[calc(var(--hero-low)+var(--hero-ctrl)+0.75rem)] lg:left-[calc(max(6rem,(100vw-80rem)/2+2rem)+min(40rem,44vw)+2.5rem)] short-landscape:top-3 short-landscape:bottom-[calc(var(--hero-low)+var(--hero-ctrl)+0.5rem)] short-landscape:left-[58%]">
          <SlidePhoto
            slide={slide}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
            style={position}
            preload={preload}
          />
        </div>
      </>
    );
  }

  if (slide.image) {
    return (
      // Em tela mais estreita que 16:9 (celular em pé) a foto cobre pela altura: fica mais larga que a janela
      <SlidePhoto
        slide={slide}
        sizes="(max-aspect-ratio: 16/9) 160vh, 100vw"
        className={FIT_CLASSES[slide.imageFit] || 'object-cover'}
        style={position}
        preload={preload}
      />
    );
  }

  const pattern = patternUrl(slide.pattern || 'business');
  return (
    <div className={`absolute inset-0 bg-linear-to-br ${slide.gradient || DEFAULT_GRADIENT}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_28%,rgba(255,255,255,0.22),transparent_58%)]" />
      {pattern && <div className="absolute inset-0 bg-white opacity-20" style={{ maskImage: pattern, WebkitMaskImage: pattern }} />}
      {/* Anéis concêntricos e numeral translúcido: o "elemento gráfico" do slide sem foto, na área livre do texto.
          Preenchimento e não contorno: o -webkit-text-stroke na fonte variável desenha as sobreposições internas dos glifos. */}
      <div className="absolute top-[18%] right-[-30%] aspect-square w-[95%] rounded-full border border-white/20 lg:top-1/2 lg:right-[-6%] lg:w-[min(52vw,90svh)] lg:-translate-y-1/2" />
      <div className="absolute top-[28%] right-[-12%] aspect-square w-[60%] rounded-full border border-white/15 lg:top-1/2 lg:right-[6%] lg:w-[min(34vw,60svh)] lg:-translate-y-1/2" />
      <span className="absolute top-12 right-7 font-black leading-none tracking-tight text-white/12 tabular-nums select-none text-[clamp(5rem,27vw,9.5rem)] sm:right-10 lg:top-1/2 lg:right-[calc(max(6rem,(100vw-80rem)/2+2rem)+2.5rem)] lg:-translate-y-[58%] lg:text-[clamp(11rem,min(22vw,42svh),22rem)] short-landscape:top-1/2 short-landscape:-translate-y-1/2 short-landscape:text-[min(36svh,8rem)]">
        {pad(index + 1)}
      </span>
    </div>
  );
}

type PhotoProps = { slide: Slide; sizes: string; className: string; style?: React.CSSProperties; preload?: boolean };

// Foto do slide. Com "Imagem para celular" no painel, usa <picture>: abaixo de md o navegador baixa só a do celular.
function SlidePhoto({ slide, sizes, className, style, preload = false }: PhotoProps) {
  const priority = preload ? ({ loading: 'eager', fetchPriority: 'high' } as const) : {};
  if (!slide.imageMobile) {
    return (
      <Image src={slide.image} alt="" fill sizes={sizes} className={className} style={style} preload={preload} {...priority} unoptimized={!isOptimizableImage(slide.image)} draggable={false} />
    );
  }
  const common = { alt: '', fill: true, sizes, ...priority };
  const { props: mobile } = getImageProps({ ...common, src: slide.imageMobile, unoptimized: !isOptimizableImage(slide.imageMobile) });
  const { props: desktop } = getImageProps({ ...common, src: slide.image, unoptimized: !isOptimizableImage(slide.image) });
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobile.srcSet ?? mobile.src} sizes={mobile.sizes} />
      <img {...desktop} alt="" className={className} style={{ ...desktop.style, ...style }} draggable={false} />
    </picture>
  );
}

// Fundo sob o header de vidro: a foto do slide bem desfocada e um pouco escurecida (sem foto, o gradiente do slide)
function SlideBackdrop({ slide }: { slide: Slide }) {
  if (!slide.image) return <div className={`absolute inset-0 bg-linear-to-br ${slide.gradient || DEFAULT_GRADIENT}`} />;
  return (
    <>
      <SlidePhoto slide={slide} sizes="96px" className="scale-125 object-cover blur-2xl" style={{ objectPosition: 'top' }} />
      <div className="absolute inset-0 bg-[#001a3d]/30" />
    </>
  );
}

// Slides de reserva (sem slide ativo ou API fora do ar): só afirmações que o site comprova em outras páginas
const initialSlides: Slide[] = [
  {
    id: 1,
    title: 'CDL Ipirá',
    subtitle: 'Câmara de Dirigentes Lojistas',
    description: 'Representamos os lojistas e apoiamos as empresas associadas de Ipirá. Conheça a nossa história.',
    buttonText: 'Conheça a CDL',
    buttonLink: '/institucional/historia',
    gradient: 'from-[#003f7f] via-[#0052a3] to-[#0066cc]',
    accentColor: 'bg-[#ffd000]',
    image: '',
    imageMobile: '',
    imagePosition: 'center',
    imageFit: 'cover',
    pattern: 'business',
    order: 1
  },
  {
    id: 2,
    title: 'Seja um Associado',
    subtitle: 'Faça parte da rede de empresas associadas',
    description: 'Consultas ao SPC Brasil, orientação jurídica, certificado digital e campanhas para o comércio de Ipirá.',
    buttonText: 'Associe-se Agora',
    buttonLink: 'https://app.higestor.com.br/inscricao/empresa/cdl-ipira',
    gradient: 'from-[#00a859] via-[#00c46a] to-[#00d670]',
    accentColor: 'bg-[#ffd000]',
    image: '',
    imageMobile: '',
    imagePosition: 'center',
    imageFit: 'cover',
    pattern: 'business',
    order: 2
  }
];
