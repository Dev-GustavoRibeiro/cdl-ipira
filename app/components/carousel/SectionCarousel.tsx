'use client';

/**
 * KIT DE CARROSSÉIS DAS SEÇÕES (Swiper 12) — um só jeito de navegar no site todo.
 * Referência de uso: app/components/NewsCarousel.tsx (cartão + modal) e EventsCarousel.tsx (estado vazio).
 *
 * USO
 *   <SectionCarousel
 *     label="Últimas notícias"              // nome do carrossel (aria-label e status para leitor de tela)
 *     itemName="notícia"                    // aria-roledescription de cada slide
 *     header={<SectionHeading id="x-titulo" eyebrow={...} title="..." />}   // opcional
 *     action={{ href: '/imprensa/noticias', label: 'Ver todas' }}          // opcional
 *     prevLabel="Notícias anteriores" nextLabel="Próximas notícias"
 *     loading={isLoading} skeleton={<MeuCartaoEsqueleto />} empty={<MeuEstadoVazio />}
 *     autoplay={7000} paused={modalAberto}  // autoplay opcional (ms); `paused` segura enquanto um modal está aberto
 *     perView={{ base: 1.15, md: 2.2, lg: 3 }}  // opcional (padrão: CARDS_PER_VIEW)
 *     tone="dark"                           // controles para fundo escuro (faixa azul); padrão "light"
 *   >
 *     {items.map((item) => <MeuCartao key={item.id} ... />)}   // cada filho vira um slide; cartão com h-full
 *   </SectionCarousel>
 *
 * LAYOUT (grade do kit; a seção só cuida do fundo/respiros e do container)
 *   Celular: cabeçalho (a ação "Ver todas" fica na linha do selo, à direita) → carrossel → controles à direita.
 *   md+:     cabeçalho à esquerda; na coluna da direita a ação em cima e os controles embaixo → carrossel.
 *   Um `header` em nó próprio (sem SectionHeading) deve reservar min-h-8 (md: min-h-10) na 1ª linha quando houver
 *   `action`.
 *
 * CABEÇALHO PRÓPRIO (controles fora do lugar padrão, ex.: TV com vídeo em destaque entre o título e o carrossel)
 *   Passe `header` como função: ela recebe { controls, action } já prontos (estado, a11y, data-reveal) e ocupa a
 *   linha inteira acima do carrossel; o kit não posiciona mais nada. Ex.:
 *     header={({ controls, action }) => (
 *       <>
 *         <div className="flex items-end justify-between gap-4"><SectionHeading ... />{action}</div>
 *         <Destaque />
 *         <div className="mt-4 flex justify-end">{controls}</div>
 *       </>
 *     )}
 *   `controls` é null quando tudo cabe numa vista (nada para navegar); `action` é null sem a prop `action`.
 *
 * LARGURA DOS SLIDES (slidesPerView "auto" + CSS): perView por breakpoint do Tailwind (base, sm, md, lg, xl, 2xl;
 *   valor que falta herda do anterior), limitado ao total de itens (2 itens no desktop = 2 cartões largos). A mesma
 *   conta vale para o esqueleto e para o HTML do servidor, então nada pula quando o Swiper inicia.
 *   Fracionário = "espiadinha" do próximo. A ALTURA vem do cartão: use mídia com altura pela tela (mediaFitClass) para
 *   a seção caber em --screen-fit.
 *
 * COMPORTAMENTO
 *   Arrastar/swipe (física do Swiper, grabCursor), snap, setas ← → quando o foco está no carrossel ou nos controles,
 *   (o mousedown não é cancelado: o clique foca o cartão como "de mouse", sem anel; os slides são select-none e o
 *   contêiner cancela o dragstart nativo de links/imagens),
 *   transição de 700ms com easing expo; cartões parcialmente fora da vista encolhem/esmaecem (efeito pela posição,
 *   acompanha o dedo). Slides fora da vista ficam `inert` (fora do Tab e do leitor de tela); se o foco estava num
 *   deles, vai para o primeiro visível. Sem loop (nada duplicado para leitor de tela); o autoplay volta ao início
 *   sozinho no fim. Autoplay pausa no botão de pausa, no hover (Swiper), com foco de teclado dentro, com menos de 35%
 *   do carrossel na tela, aba oculta e com `paused`. Movimento reduzido: velocidade 0 e sem autoplay.
 *
 * TOKENS DOS CONTROLES
 *   Botões redondos 44px (h-11 w-11), ícone 14px; light: branco + anel cinza, hover azul #003f7f; dark: vidro
 *   branco/10 + anel branco/25, hover branco. Nas pontas: aria-disabled (continua focável) e opacidade 35%. Com
 *   autoplay, antes das setas vem o botão de pausa/retomar (mesmo tamanho, sem fundo: "fantasma"), que segura a troca
 *   até ser clicado de novo.
 *   Contador "01 / 04" (posições do snap) em tabular-nums 14px bold, total a 75% (AA); barra de 3px: trilho
 *   translúcido e preenchimento amarelo #ffd000 que cresce com o tempo do autoplay até a próxima posição (sem autoplay,
 *   mostra a posição).
 *   Status para leitor de tela: "<label>: 1 a 3 de 6" (live polite só quando o autoplay não está rodando).
 *
 * MOVIMENTO AO ROLAR (a seção liga): useReveal(sectionRef, deps) anima o SectionHeading, a ação e os controles
 *   (data-reveal); useCardsMotion(sectionRef, deps) anima os cartões. Nada de backdrop-filter/filter: blur nos cartões
 *   ou no fundo da seção: sob o header de vidro e com o parallax, repintam a cada quadro e piscam ao rolar.
 *
 * TAMBÉM EXPORTA
 *   SectionHeading (selo + título + barra tricolor + texto opcional, com data-reveal para o useReveal),
 *   useCardsMotion (entrada dos cartões ao rolar: [data-card], [data-card-media], [data-card-parallax], [data-card-pop]),
 *   mediaFitClass (mídia 16:10 com teto pela altura da tela), CARDS_PER_VIEW, syncInert, tipos PerView e CarouselSlots.
 */

import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { A11y, Autoplay } from 'swiper/modules';
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';
import { EASE, MOTION_OK, ScrollTrigger, gsap, useGSAP } from '@/lib/motion';
import 'swiper/css';
import 'swiper/css/a11y';

type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type PerView = { base: number } & Partial<Record<Exclude<Breakpoint, 'base'>, number>>;

/** Cartões das seções: 1 + espiadinha no celular, ~2 no tablet, 3 no desktop, 4 nas telas largas. */
export const CARDS_PER_VIEW: PerView = { base: 1.15, sm: 1.6, md: 2.2, lg: 3, '2xl': 4 };

/** Mídia 16:10 dos cartões com teto pela altura da tela (cartões largos ou telas baixas recortam em vez de crescer). */
// Foco dado por clique/toque (o modal devolve o foco ao cartão ao fechar), sem anel. focusVisible ainda fora do lib.dom
// do TS (por isso a constante, sem checagem de propriedade extra); navegador sem suporte ignora a opção.
export const MOUSE_FOCUS = { preventScroll: true, focusVisible: false };

export const mediaFitClass = 'aspect-[16/10] max-h-[clamp(7.5rem,25svh,17rem)]';

const BREAKPOINTS: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
// Espaço entre slides por breakpoint: o mesmo número vai para o Swiper e para o CSS (--gap)
const GAPS = { 640: 18, 768: 22, 1024: 24, 1280: 28 } as const;
const GAP_VARS = '[--gap:14px] sm:[--gap:18px] md:[--gap:22px] lg:[--gap:24px] xl:[--gap:28px]';
const PV_VARS = '[--pv:var(--pv-base)] sm:[--pv:var(--pv-sm)] md:[--pv:var(--pv-md)] lg:[--pv:var(--pv-lg)] xl:[--pv:var(--pv-xl)] 2xl:[--pv:var(--pv-2xl)]';
// Mesma conta do Swiper para slidesPerView fracionário: (largura - (pv - 1) * gap) / pv. Com ! porque o CSS do Swiper
// (fora das camadas do Tailwind) fixa .swiper-slide em 100%; a classe tem de aparecer inteira no código para ser gerada.
const SLIDE_W = 'w-[calc((100%_-_(var(--pv)_-_1)_*_var(--gap))_/_var(--pv))]!';
const EASE_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)';

function perViewVars(perView: PerView, total: number) {
  const vars: Record<string, number> = {};
  let last = perView.base;
  for (const bp of BREAKPOINTS) {
    last = perView[bp] ?? last;
    vars[`--pv-${bp}`] = Math.max(1, Math.min(total, last));
  }
  return vars as React.CSSProperties;
}

// Slides fora da área visível (no destino da transição) ficam inertes: fora do Tab e do leitor de tela.
// Conta pelas posições do Swiper com 1px de folga, porque a classe "fully-visible" falha com larguras fracionadas.
export function syncInert(s: SwiperClass) {
  const active = document.activeElement;
  const start = s.snapGrid[s.snapIndex] ?? 0;
  s.slides.forEach((el, i) => {
    const left = s.slidesGrid[i] - start;
    el.inert = left < -1 || left + s.slidesSizesGrid[i] > s.width + 1;
  });
  // Se o foco estava num card que saiu de vista, leva para o primeiro card visível
  if (active instanceof HTMLElement && active.closest('.swiper-slide')?.hasAttribute('inert')) {
    s.slides.find((el) => !el.inert)?.querySelector<HTMLElement>('button, a[href]')?.focus({ preventScroll: true });
  }
}

// Profundidade pela posição: quanto do slide está fora da vista, menor e mais apagado (vale no arraste, quadro a
// quadro, e nas transições, que usam a mesma duração/easing do trilho via setTransition). Mexe numa camada interna
// para não brigar com o Swiper (que move o trilho) nem com a entrada do cartão (GSAP no [data-card]).
function paintDepth(s: SwiperClass) {
  s.slides.forEach((slide, i) => {
    const inner = slide.firstElementChild as HTMLElement | null;
    const size = s.slidesSizesGrid[i];
    if (!inner || !size) return;
    const left = s.slidesGrid[i] + s.translate;
    const seen = (Math.min(left + size, s.width) - Math.max(left, 0)) / size;
    const k = seen > 0.995 ? 0 : 1 - Math.max(0, seen);
    inner.style.transformOrigin = left < 0 ? '100% 50%' : '0% 50%';
    inner.style.transform = k ? `scale(${(1 - 0.07 * k).toFixed(4)})` : '';
    inner.style.opacity = k ? (1 - 0.6 * k).toFixed(3) : '';
  });
}

const TONES = {
  light: {
    button: 'bg-white text-[#003f7f] ring-1 ring-[#003f7f]/12 shadow-[0_10px_24px_-14px_rgba(0,63,127,0.55)] hover:bg-[#003f7f] hover:text-white hover:ring-[#003f7f]',
    count: 'text-[#003f7f]',
    total: 'text-[#003f7f]/75', // AA (>= 4.5:1) também sobre a névoa
    track: 'bg-[#003f7f]/12',
    ghost: 'text-[#003f7f]/70 hover:bg-[#003f7f]/8 hover:text-[#003f7f]',
    action: 'bg-white text-[#003f7f] ring-1 ring-[#003f7f]/15 hover:bg-[#003f7f] hover:text-white hover:ring-[#003f7f]',
  },
  dark: {
    button: 'bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-sm hover:bg-white hover:text-[#003f7f] hover:ring-white',
    count: 'text-white',
    total: 'text-white/75',
    track: 'bg-white/20',
    ghost: 'text-white/75 hover:bg-white/10 hover:text-white',
    action: 'bg-white/10 text-white ring-1 ring-white/25 hover:bg-white hover:text-[#003f7f]',
  },
} as const;

// Foco visível: o anel global (globals.css, :focus-visible) já serve aos dois tons
const navButton = 'grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm transition-[background-color,color,box-shadow,scale,opacity] duration-200 active:scale-95 aria-disabled:pointer-events-none aria-disabled:opacity-35';
const pad = (n: number) => String(n).padStart(2, '0');

type Snap = { index: number; count: number; first: number; last: number; total: number };

/** O que o cabeçalho em forma de função recebe: nós prontos (null quando não há o que mostrar). */
export type CarouselSlots = { controls: React.ReactNode; action: React.ReactNode };

const REDUCE = '(prefers-reduced-motion: reduce)';
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
/** Preferência de movimento reduzido (false no servidor). */
function useReducedMotion() {
  return React.useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => false);
}

/** Esqueleto padrão: mesma anatomia do cartão de notícia (mídia 16:10, título, resumo, rodapé), para nada pular. */
function DefaultSkeleton() {
  const bar = 'animate-pulse rounded-full bg-[#003f7f]/8 motion-reduce:animate-none';
  return (
    <div className="h-full rounded-[1.75rem] bg-white p-2 ring-1 ring-[#003f7f]/8">
      <div className={`${mediaFitClass} w-full animate-pulse rounded-[1.3rem] bg-[#003f7f]/8 motion-reduce:animate-none`} />
      <div className="px-3 pt-3 pb-1.5">
        <div className="space-y-2 py-1 md:space-y-2.5">
          <div className={`h-4 w-11/12 ${bar}`} />
          <div className={`h-4 w-2/3 ${bar}`} />
        </div>
        <div className="mt-1.5 space-y-2.5 py-1.5 [@media(max-height:700px)]:hidden">
          <div className={`h-3 w-full ${bar}`} />
          <div className={`h-3 w-4/5 ${bar}`} />
        </div>
        <div className="flex items-center justify-between pt-3">
          <div className={`h-3 w-24 ${bar}`} />
          <div className={`h-8 w-8 ${bar}`} />
        </div>
      </div>
    </div>
  );
}

export interface SectionCarouselProps {
  /** Nome do carrossel para leitor de tela (ex.: "Últimas notícias"). */
  label: string;
  /** aria-roledescription de cada slide (ex.: "notícia"). */
  itemName: string;
  children?: React.ReactNode;
  /** Cabeçalho da seção. Como função, recebe a ação e os controles prontos e posiciona os dois (ver CABEÇALHO PRÓPRIO). */
  header?: React.ReactNode | ((slots: CarouselSlots) => React.ReactNode);
  action?: { href: string; label: string };
  prevLabel?: string;
  nextLabel?: string;
  loading?: boolean;
  skeleton?: React.ReactNode;
  empty?: React.ReactNode;
  /** Intervalo do autoplay em ms (sem a prop, não há autoplay). */
  autoplay?: number;
  /** Segura o autoplay (ex.: modal aberto). */
  paused?: boolean;
  perView?: PerView;
  tone?: keyof typeof TONES;
  className?: string;
}

export default function SectionCarousel({
  label,
  itemName,
  children,
  header,
  action,
  prevLabel = 'Anterior',
  nextLabel = 'Próximo',
  loading,
  skeleton,
  empty,
  autoplay,
  paused,
  perView = CARDS_PER_VIEW,
  tone = 'light',
  className = '',
}: SectionCarouselProps) {
  const slides = React.Children.toArray(children);
  const total = slides.length;
  const [swiper, setSwiper] = React.useState<SwiperClass | null>(null);
  const [snap, setSnap] = React.useState<Snap>({ index: 0, count: 1, first: 1, last: 1, total });
  const [running, setRunning] = React.useState(false);
  const [stopped, setStopped] = React.useState(false);
  const fillRef = React.useRef<HTMLSpanElement>(null);
  const holds = React.useRef(new Set<string>());
  const swiperRef = React.useRef<SwiperClass | null>(null);
  // Movimento reduzido: troca instantânea e sem autoplay. Vai nas props (não em beforeInit): abaixo do 1º breakpoint o
  // Swiper reaplica os parâmetros originais e desfazia a troca.
  const reduced = useReducedMotion();
  const autoOn = !!autoplay && !reduced;
  const t = TONES[tone];

  // Barra com autoplay: posição atual + tempo até a próxima (parado, o efeito abaixo pinta só a posição)
  const paintFill = (s: SwiperClass, time: number) => {
    const count = s.snapGrid.length || 1;
    fillRef.current?.style.setProperty('transform', `scaleX(${Math.min(1, (s.snapIndex + Math.min(1, Math.max(0, time))) / count)})`);
  };

  const sync = (s: SwiperClass) => {
    syncInert(s);
    const shown = s.slides.map((el) => !el.inert);
    setSnap({ index: s.snapIndex, count: s.snapGrid.length, first: shown.indexOf(true) + 1, last: shown.lastIndexOf(true) + 1, total: s.slides.length });
  };

  // Motivos para segurar o autoplay (botão de pausa, foco de teclado dentro, fora da tela, modal aberto). O hover o
  // próprio Swiper pausa.
  const hold = React.useCallback((reason: string, on: boolean) => {
    if (on) holds.current.add(reason);
    else holds.current.delete(reason);
    const ap = swiperRef.current?.autoplay;
    if (!ap || !autoOn) return;
    if (holds.current.size) {
      if (ap.running) ap.stop();
    } else if (!ap.running) {
      ap.paused = false; // a pausa do hover pode ter ficado marcada; sem isso a barra de tempo congela
      ap.start();
    }
  }, [autoOn]);

  React.useEffect(() => hold('prop', !!paused), [hold, paused]);

  React.useEffect(() => {
    // Trocar a preferência de movimento recria o Swiper (key): o antigo já destruído não tem mais el para observar
    if (!swiper || swiper.destroyed || !swiper.el || !autoOn) return;
    // Pela fração visível (isIntersecting fica true com 1px à vista): não troca de slide com a seção quase fora da tela
    const io = new IntersectionObserver(([entry]) => hold('offscreen', entry.intersectionRatio < 0.35), { threshold: [0, 0.35] });
    io.observe(swiper.el);
    return () => io.disconnect();
  }, [swiper, autoOn, hold]);

  const showControls = loading || snap.count > 1;
  const atStart = !swiper || snap.index === 0;
  const atEnd = !swiper || snap.index >= snap.count - 1;

  // Sem autoplay rodando, a barra mostra a posição. Pinta depois do render porque os controles só montam quando o snap
  // passa a contar mais de uma posição (no onAfterInit o fillRef ainda é null e a barra começava vazia em "01 / 04").
  React.useLayoutEffect(() => {
    if (swiper && !running) fillRef.current?.style.setProperty('transform', `scaleX(${(snap.index + 1) / snap.count})`);
  }, [swiper, snap, running]);
  const isEmpty = !loading && total === 0;

  let body: React.ReactNode;
  if (loading) {
    body = (
      <div aria-hidden="true" className={`flex gap-(--gap) overflow-hidden ${GAP_VARS} ${PV_VARS}`} style={perViewVars(perView, 4)}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`shrink-0 ${SLIDE_W}`}>
            {skeleton ?? <DefaultSkeleton />}
          </div>
        ))}
      </div>
    );
  } else if (isEmpty) {
    body = empty ?? null;
  } else {
    body = (
      <Swiper
        // A preferência só é conhecida no cliente: se mudar depois da hidratação, recria com os parâmetros certos
        key={reduced ? 'reduced' : 'motion'}
        modules={[A11y, Autoplay]}
        slidesPerView="auto"
        spaceBetween={14}
        breakpoints={Object.fromEntries(Object.entries(GAPS).map(([bp, gap]) => [bp, { spaceBetween: gap }]))}
        speed={reduced ? 0 : 700}
        grabCursor
        // Sem "button": o padrão do Swiper ignora o arraste sobre um botão focado, e os cartões são botões esticados
        // (o mousedown os foca) — o arraste com mouse não andava e saía com translate NaN. Clique e teclado seguem iguais.
        focusableElements="input, select, option, textarea, video, label"
        // Não cancela o pointerdown (padrão do Swiper): sem o mousedown o navegador não registra o clique como de mouse,
        // e o foco por script do modal aberto pelo cartão (X, e o cartão ao fechar) nascia com o anel de foco. Com o
        // mousedown, o cartão recebe o foco nativo "de mouse", como nas páginas internas. Em troca, o kit impede
        // seleção de texto (select-none) e arraste nativo de links/imagens (dragstart, no contêiner) durante o arraste.
        touchStartPreventDefault={false}
        // Arraste lento: passa para o próximo a partir de 30% do cartão (padrão 50% parecia "duro" no celular)
        longSwipesRatio={0.3}
        autoplay={autoOn ? { delay: autoplay, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
        a11y={{
          containerMessage: label,
          containerRoleDescriptionMessage: 'carrossel',
          itemRoleDescriptionMessage: itemName,
          slideLabelMessage: '{{index}} de {{slidesLength}}',
          // O status próprio (abaixo) anuncia a posição; o trilho não muda de conteúdo
          wrapperLiveRegion: false,
          // Só os slides visíveis recebem foco (os demais ficam inert), então não precisa rolar ao focar
          scrollOnFocus: false,
        }}
        onSwiper={(s) => {
          swiperRef.current = s;
          setSwiper(s);
        }}
        onAfterInit={(s) => {
          sync(s);
          paintDepth(s);
        }}
        onSnapIndexChange={sync}
        onSnapGridLengthChange={sync}
        onResize={sync}
        onSetTranslate={paintDepth}
        onSetTransition={(s, ms) =>
          s.slides.forEach((el) => {
            const inner = el.firstElementChild as HTMLElement | null;
            if (inner) inner.style.transitionDuration = `${ms}ms`;
          })
        }
        onAutoplayTimeLeft={(s, _ms, left) => paintFill(s, 1 - left)}
        onAutoplayStart={() => setRunning(true)}
        onAutoplayStop={() => setRunning(false)}
        // Folga em volta do trilho para a sombra e o "levantar" do cartão no hover não serem cortados. h-auto: o
        // globals.css dá height:100% ao .swiper, que prendia o trilho numa altura menor que a dos cartões. A máscara
        // esmaece só a folga lateral (1rem): no arraste o cartão some suave em vez de ser cortado seco.
        className={`-mx-4! -mt-3! -mb-10! h-auto! w-auto! px-4! pt-3! pb-10! select-none mask-[linear-gradient(to_right,transparent,#000_1rem,#000_calc(100%_-_1rem),transparent)] ${GAP_VARS} ${PV_VARS}`}
        style={{ ...perViewVars(perView, total), '--swiper-wrapper-transition-timing-function': EASE_CSS } as React.CSSProperties}
      >
        {slides.map((child, i) => (
          // O globals.css centraliza/acolchoa .swiper-slide (legado): aqui o slide é só uma caixa da largura certa
          <SwiperSlide key={(React.isValidElement(child) && child.key) || i} className={`block! h-auto! p-0! text-left! text-base! ${SLIDE_W}`}>
            <div className="h-full transition-[transform,opacity] duration-0" style={{ transitionTimingFunction: EASE_CSS }}>
              {child}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  const status = snap.first === snap.last ? `${label}: ${snap.first} de ${snap.total}` : `${label}: ${snap.first} a ${snap.last} de ${snap.total}`;

  const actionNode = action && (
    <Link
      href={action.href}
      // Entra junto com o cabeçalho (useReveal da seção); sem isso a pílula aparecia sozinha antes do título
      data-reveal="fade"
      // Na lista de links do leitor de tela, "Ver todas" de notícias e de galerias eram iguais; o nome começa pelo
      // texto visível (quem usa comando de voz continua falando "Ver todas")
      aria-label={`${action.label}: ${label}`}
      className={`group inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-xs font-bold whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 md:h-10 md:px-5 md:text-sm ${t.action}`}
    >
      {action.label}
      <FaArrowRight aria-hidden="true" className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </Link>
  );

  const controlsNode = showControls && (
    <div
      aria-hidden={loading || undefined}
      // Só depois de carregar: a entrada rodaria com os controles ainda invisíveis (esqueleto)
      data-reveal={loading ? undefined : 'fade'}
      className={`flex items-center gap-3 ${loading ? 'invisible' : ''}`}
    >
      <div aria-hidden="true" className="mr-1 flex items-center gap-3">
        <span className="text-sm font-bold tabular-nums">
          <span className={t.count}>{pad(snap.index + 1)}</span>
          <span className={t.total}> / {pad(snap.count)}</span>
        </span>
        <span className={`relative block h-[3px] w-14 overflow-hidden rounded-full md:w-16 ${t.track}`}>
          <span ref={fillRef} className="absolute inset-0 origin-left rounded-full bg-[#ffd000] [transform:scaleX(0)] transition-transform duration-300 ease-out motion-reduce:transition-none" />
        </span>
      </div>
      <p className="sr-only" aria-live={running ? 'off' : 'polite'}>
        {status}
      </p>
      {/* Pausa permanente da troca automática (WCAG 2.2.2): hover/foco só seguram enquanto duram */}
      {autoOn && snap.count > 1 && (
        <button
          type="button"
          onClick={() => {
            setStopped(!stopped);
            hold('user', !stopped);
          }}
          aria-label={stopped ? 'Retomar troca automática' : 'Pausar troca automática'}
          className={`${navButton} -mx-1 ${t.ghost}`}
        >
          {stopped ? <FaPlay aria-hidden="true" className="h-3 w-3 translate-x-px" /> : <FaPause aria-hidden="true" className="h-3 w-3" />}
        </button>
      )}
      {/* aria-disabled em vez de disabled: o botão focado continua focável no fim/início (com disabled o foco caía no
          body e as setas do carrossel paravam de funcionar). O clique nas pontas é ignorado. */}
      <button type="button" onClick={() => atStart || swiper?.slidePrev()} aria-disabled={atStart} aria-label={prevLabel} className={`${navButton} ${t.button}`}>
        <FaChevronLeft aria-hidden="true" />
      </button>
      <button type="button" onClick={() => atEnd || swiper?.slideNext()} aria-disabled={atEnd} aria-label={nextLabel} className={`${navButton} ${t.button}`}>
        <FaChevronRight aria-hidden="true" />
      </button>
    </div>
  );

  return (
    // Teclado: setas navegam quando o foco está nos cartões ou nos controles. Fica fora dos modais (portais), que
    // também propagariam os eventos pela árvore do React.
    <div
      className={`grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 ${className}`}
      onKeyDown={(e) => {
        if (!swiper || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        if (e.key === 'ArrowLeft') swiper.slidePrev();
        else swiper.slideNext();
      }}
      onFocus={(e) => (e.target as HTMLElement).matches(':focus-visible') && hold('focus', true)}
      // Link/imagem arrastados pelo navegador cancelariam o arraste do carrossel (pointercancel)
      onDragStart={(e) => e.preventDefault()}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && hold('focus', false)}
    >
      {typeof header === 'function' ? (
        // Cabeçalho próprio: ocupa a linha inteira e decide onde vão a ação e os controles
        <div className="col-span-2 row-start-1">{header({ controls: controlsNode || null, action: actionNode || null })}</div>
      ) : (
        <>
          {/* Posições explícitas (col-start) para a ação poder sobrepor a linha do selo no celular sem empurrar o cabeçalho */}
          {header && <div className="col-span-2 col-start-1 row-start-1 md:col-span-1">{header}</div>}
          {(actionNode || controlsNode) && (
            // Celular: "contents" solta ação e controles na grade (ação na linha do selo, controles depois do carrossel).
            // md+: coluna da direita do cabeçalho, ação em cima e controles alinhados à base do título.
            <div className="contents md:col-start-2 md:row-start-1 md:flex md:flex-col md:items-end md:justify-between md:gap-3">
              {actionNode && <div className="relative z-10 col-start-2 row-start-1 flex self-start justify-self-end md:self-end">{actionNode}</div>}
              {controlsNode && <div className="relative z-10 col-span-2 col-start-1 row-start-3 mt-3 justify-self-end md:mt-0">{controlsNode}</div>}
            </div>
          )}
        </>
      )}

      <div className="col-span-2 col-start-1 row-start-2 mt-[clamp(0.875rem,2.4svh,1.75rem)]">{body}</div>
    </div>
  );
}

/** Cabeçalho padrão das seções com carrossel: selo, título, barra tricolor e texto de apoio opcional. */
export function SectionHeading({ id, eyebrow, eyebrowClass, title, text, tone = 'light' }: {
  id: string;
  eyebrow: React.ReactNode;
  eyebrowClass: string;
  title: string;
  text?: string;
  tone?: keyof typeof TONES;
}) {
  return (
    // Texto de apoio ao lado do título no desktop largo (não gasta altura); com título longo, em vez de espremer numa
    // coluna estreita, desce para baixo do título (min-w-56 + wrap). No celular embaixo e só em telas altas.
    <div className="xl:flex xl:flex-wrap xl:items-end xl:gap-x-12 xl:gap-y-3">
      <div className="shrink-0">
        {/* min-h-8: a linha do selo tem a altura da ação "Ver todas", que fica ao lado dela no celular */}
        <div className="flex min-h-8 items-center md:min-h-10">
          <span data-reveal="eyebrow" className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[0.14em] uppercase md:px-4 md:text-xs ${eyebrowClass}`}>
            {eyebrow}
          </span>
        </div>
        <h2
          id={id}
          data-reveal="title"
          className={`mt-1.5 text-[clamp(1.625rem,7.6vw,2.25rem)] leading-[1.05] font-black tracking-tight text-balance md:mt-2 md:text-[clamp(2.25rem,5vw,3rem)] lg:text-[clamp(2.25rem,min(5.6svh,4vw),3.5rem)] ${tone === 'dark' ? 'text-white' : 'text-[#003f7f]'}`}
        >
          {title}
        </h2>
        {/* No tom escuro o azul do início sumiria na faixa #003f7f: começa no branco */}
        <div data-reveal="bar" className={`mt-2.5 h-1.5 w-20 rounded-full bg-linear-to-r via-[#00a859] to-[#ffd000] md:mt-3 md:w-24 ${tone === 'dark' ? 'from-white/85' : 'from-[#003f7f]'}`} />
      </div>
      {text && (
        <p
          data-reveal="fade"
          className={`mt-3 max-w-md text-sm text-pretty xl:mt-0 xl:mb-0.5 xl:max-w-xs xl:min-w-56 xl:text-[15px] max-xl:[@media(max-height:820px)]:hidden max-md:[@media(max-height:780px)]:hidden md:max-xl:hidden ${tone === 'dark' ? 'text-white/75' : 'text-gray-600'}`}
        >
          {text}
        </p>
      )}
    </div>
  );
}

/**
 * Entrada dos cartões (notícias e eventos): sobem em cascata com profundidade, a imagem é revelada por uma máscara de
 * baixo para cima e depois tem parallax interno leve enquanto o cartão atravessa a tela (scrub).
 * Marcação dentro de `scope`: [data-card] (cartão), [data-card-media] (caixa da imagem, recebe a máscara),
 * [data-card-parallax] (camada da imagem) e [data-card-pop] (ícones que "saltam" depois do cartão).
 * Movimento reduzido: nada anima e o conteúdo fica como no HTML.
 */
export function useCardsMotion(scope: React.RefObject<HTMLElement | null>, dependencies: unknown[]) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, wide: '(min-width: 768px)' }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        const k = ctx.conditions.wide ? 1 : 0.6; // celular: distâncias menores
        const q = gsap.utils.selector(root);
        const set = (sel: string, vars: gsap.TweenVars) => q(sel).length && gsap.set(q(sel), vars);

        const cards = q('[data-card]');
        if (cards.length) {
          gsap.set(cards, { y: 64 * k, rotateX: 16 * k, scale: 0.96, opacity: 0, transformPerspective: 1100, transformOrigin: '50% 100%' });
          set('[data-card-media]', { clipPath: 'inset(100% 0% 0% 0%)' });
          set('[data-card-pop]', { scale: 0.4, rotate: -14, opacity: 0 });
          // Cartões que aparecem juntos entram juntos (no carrossel, a fileira inteira). O gatilho mede o cartão já
          // deslocado/inclinado (~100px abaixo do lugar), então "top bottom" equivale a ~88% da tela na posição real.
          // Sem contextSafe no onEnter: o callback já roda no contexto do mm (que desfaz a timeline no revert); embrulhar
          // de novo fecha um ciclo de contextos e o revert estoura a pilha (RangeError em Context.getTweens).
          ScrollTrigger.batch(cards, {
            start: 'top bottom',
            once: true,
            onEnter: (batch: Element[]) => {
              const inside = (sel: string) => batch.flatMap((card) => Array.from(card.querySelectorAll(sel)));
              const tl = gsap.timeline().to(batch, { y: 0, rotateX: 0, scale: 1, opacity: 1, duration: 1, ease: EASE.expo, stagger: 0.1, clearProps: 'transform,opacity' }, 0);
              const media = inside('[data-card-media]');
              const pops = inside('[data-card-pop]');
              if (media.length) tl.to(media, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.out', stagger: 0.1, clearProps: 'clipPath' }, 0.12);
              if (pops.length) tl.to(pops, { scale: 1, rotate: 0, opacity: 1, duration: 0.7, ease: 'back.out(2.2)', stagger: 0.08, clearProps: 'transform,opacity' }, 0.35);
            },
          });
        }

        // Parallax interno: a imagem começa ampliada e acima e assenta enquanto o cartão cruza a tela
        q('[data-card-parallax]').forEach((el) =>
          gsap.fromTo(
            el,
            { scale: 1 + 0.18 * k, yPercent: -6 * k },
            { scale: 1, yPercent: 0, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
          ),
        );
      });
      return () => mm.revert();
    },
    { scope, dependencies, revertOnUpdate: true },
  );
}
