'use client';

/**
 * Sistema de modais do site: base compartilhada (ModalShell) + peças de conteúdo.
 *
 * COMO USAR (modais públicos: notícia, evento, vaga, inscrição, fotos...)
 *
 *   const titleId = useId();
 *   <ModalShell
 *     isOpen={isOpen}                 // abre/fecha (a saída anima; o painel fica montado ~300ms)
 *     onClose={onClose}               // Esc, X, clique no fundo e arrastar a folha para baixo chamam isto
 *     labelledBy={titleId}            // id do título (aria-labelledby)
 *     size="lg"                       // 'sm' 32rem (confirmação) · 'md' 42rem (formulário) · 'lg' 55rem/880px (leitura)
 *     footer={<>                       // rodapé fixo com as ações (opcional); ganha a barra de progresso de leitura
 *       <ShareButton title={titulo} url="/caminho" />
 *       <a className={`ml-auto ${modalButton.primary}`}>Ação</a>
 *     </>}
 *     dismissible                     // false: fundo não fecha e a folha só "estica" (formulário com dados digitados)
 *   >
 *     <ModalMedia image={url} gradient="from-[#003f7f] to-[#0066cc]" fallback={<Icone />}>
 *       <ModalChip tone="light" dot>Categoria</ModalChip>   // chips sobre a mídia (canto inferior)
 *     </ModalMedia>
 *     <ModalBody>
 *       <ModalTitle id={titleId}>Título</ModalTitle>
 *       <ModalProse text={textoPuro} />   // ou html={DOMPurify.sanitize(html)}
 *     </ModalBody>
 *   </ModalShell>
 *
 * - Celular (< 640px): folha que sobe da base, com alça; arrastar para baixo fecha; rolagem interna; safe-area.
 *   'lg' ocupa a altura cheia (100dvh menos a faixa de cima); 'sm'/'md' crescem com o conteúdo.
 *   Desktop: diálogo centralizado; entrada scale/opacity 220ms, saída mais rápida. Movimento reduzido: sem animação.
 *   Janela baixa (altura <= 520px, celular deitado): margens, capa e rodapé encolhem sozinhos.
 * - Foco preso, Esc, trava de rolagem e devolução do foco vêm do useModalBehavior (pilha: um modal aberto por cima
 *   de outro, ex.: inscrição sobre o evento, funciona — o último renderizado fica por cima).
 * - Durante a saída o shell mostra o último conteúdo de quando estava aberto: pode zerar o item ao fechar e
 *   renderizar `{item && ...}` sem a saída animada ficar vazia (veja NewsModal/EventModal).
 * - Outros slots: `header` (faixa fixa acima da rolagem), `bodyClassName` (classes da área que rola), `busy`
 *   (aria-busy), `className` (classes extras do painel). Botões de rodapé: `modalButton.primary|secondary|icon`.
 * - A folha só é puxada com o conteúdo no topo e em gesto vertical: listas/miniaturas horizontais e campos rolados
 *   dentro do modal continuam livres. A ModalMedia ganha parallax ao rolar (ViewTimeline, no compositor) e a foto entra
 *   com fade quando carrega.
 * - Efeitos presos à rolagem do corpo do modal: use linha do tempo de rolagem (CSS/ViewTimeline), não listener de
 *   scroll mexendo em transform (chega um quadro atrasado e treme), e nada de backdrop-filter sobre o que rola.
 * - Botão que vira "enviando": use aria-disabled (não disabled), senão o foco sai do diálogo.
 *
 * O export default `Modal` é o modal dos formulários do painel (mesma base, sem fechar no clique fora).
 */

import React, { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import type { IconType } from 'react-icons';
import { FaCheck, FaShareAlt, FaTimes } from 'react-icons/fa';
import { isOptimizableImage } from '@/lib/images';
import { useIsClient, useModalBehavior } from '@/lib/hooks/useModalBehavior';

/* ---------------------------------------------------------------- base */

// Tempo que o modal continua montado depois de fechar (a saída mais longa é a da folha: 240ms)
const EXIT_MS = 300;

// lg (leitura): no celular a folha tem sempre a altura cheia, com as ações no mesmo lugar mesmo com texto curto
const SIZES = { sm: 'sm:max-w-lg', md: 'sm:max-w-2xl', lg: 'max-sm:h-[calc(100dvh-2.5rem-env(safe-area-inset-top))] sm:max-w-[55rem]' } as const;

// data-state="closed" no contêiner raiz (group/modal) dispara a saída; a entrada usa @starting-style (starting:).
// Classes escritas por extenso: o Tailwind só gera o que aparece literal no código.
// Desfoque só no desktop: no celular a folha cobre quase tudo e o desfoque da tela inteira seria refeito a cada quadro
// enquanto o carrossel/letreiro atrás continuam animando (custo de GPU que trava o arrastar da folha).
const BACKDROP =
  'absolute inset-0 bg-[#001a3d]/70 sm:backdrop-blur-sm transition-opacity duration-300 ease-out starting:opacity-0 group-data-[state=closed]/modal:opacity-0 group-data-[state=closed]/modal:duration-200';

const PANEL = [
  'relative flex w-full flex-col overflow-hidden bg-white outline-none',
  // Celular: folha de baixo, quase a tela toda (sobra uma faixa do fundo em cima para tocar e fechar)
  'max-h-[calc(100dvh-2.5rem-env(safe-area-inset-top))] rounded-t-[1.75rem] shadow-[0_-24px_60px_-24px_rgba(0,26,61,0.55)]',
  'transition-[translate] duration-[420ms] ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-full',
  'group-data-[state=closed]/modal:translate-y-full group-data-[state=closed]/modal:duration-[240ms] group-data-[state=closed]/modal:ease-[cubic-bezier(0.4,0,1,1)]',
  // Desktop: diálogo central que cresce de 96% com opacidade
  'sm:max-h-[min(92dvh,60rem)] sm:rounded-[1.75rem] sm:shadow-[0_40px_100px_-30px_rgba(0,26,61,0.7)]',
  // Janela baixa (celular deitado): margens, capa e rodapé encolhem para sobrar altura para o texto
  'sm:[@media(max-height:520px)]:max-h-[calc(100dvh-1.5rem)]',
  'sm:transition-[opacity,scale,translate] sm:duration-[220ms] sm:ease-[cubic-bezier(0.16,1,0.3,1)]',
  'sm:starting:translate-y-2 sm:starting:scale-[0.96] sm:starting:opacity-0',
  'sm:group-data-[state=closed]/modal:translate-y-1 sm:group-data-[state=closed]/modal:scale-[0.98] sm:group-data-[state=closed]/modal:opacity-0 sm:group-data-[state=closed]/modal:duration-150 sm:group-data-[state=closed]/modal:ease-in',
  'motion-reduce:transition-none sm:motion-reduce:transition-none',
].join(' ');

// Sem backdrop-filter no X e nos chips sobre a capa: ficam por cima de conteúdo que rola e o desfoque refeito a cada
// quadro cintila (Safari principalmente). Fundo quase opaco no lugar.
const CLOSE_BUTTON =
  'absolute top-3 right-3 z-30 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-[#003f7f] shadow-[0_8px_24px_-8px_rgba(0,26,61,0.55)] ring-1 ring-black/5 transition-[scale,background-color,color] duration-200 hover:bg-white hover:text-[#001a3d] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066cc] sm:top-4 sm:right-4';

const FOOTER =
  'relative flex shrink-0 items-center gap-3 border-t border-gray-100 bg-white px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-4 sm:[@media(max-height:520px)]:py-2.5';

/** Classes dos botões de rodapé (mesmo visual em todos os modais). */
export const modalButton = {
  primary:
    'group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#003f7f] to-[#0066cc] px-6 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,box-shadow,opacity] duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 aria-disabled:pointer-events-none aria-disabled:opacity-70 motion-reduce:hover:translate-y-0',
  secondary:
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold text-[#003f7f] ring-1 ring-gray-200 transition-[background-color,scale] duration-200 hover:bg-gray-50 active:scale-[0.98]',
  icon: 'grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gray-100 text-[#003f7f] transition-[background-color,scale] duration-200 hover:bg-gray-200 active:scale-95',
} as const;

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  /** id do título do diálogo (aria-labelledby) */
  labelledBy: string;
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  /** Faixa fixa acima da área que rola (ex.: título dos formulários do painel) */
  header?: React.ReactNode;
  /** Ações no rodapé fixo */
  footer?: React.ReactNode;
  /** false: clique no fundo não fecha e a folha só estica ao ser puxada (Esc e o X continuam fechando) */
  dismissible?: boolean;
  busy?: boolean;
  className?: string;
  bodyClassName?: string;
}

export function ModalShell({
  isOpen,
  onClose,
  labelledBy,
  children,
  size = 'lg',
  header,
  footer,
  dismissible = true,
  busy,
  className = '',
  bodyClassName = '',
}: ModalShellProps) {
  const isClient = useIsClient();
  const dialogRef = useModalBehavior<HTMLDivElement>(isOpen, onClose);
  const backdropRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const latest = useRef({ onClose, dismissible });

  // Continua montado durante a saída
  const [mounted, setMounted] = useState(isOpen);
  if (isOpen && !mounted) setMounted(true);

  // ...mostrando o último conteúdo de quando estava aberto (quem abre costuma zerar o item ao fechar).
  // Re-renderizar com os mesmos elementos é barato: o React pula subárvores com o mesmo elemento.
  const [shown, setShown] = useState({ children, header, footer });
  if (isOpen && (shown.children !== children || shown.header !== header || shown.footer !== footer)) setShown({ children, header, footer });
  const view = isOpen ? { children, header, footer } : shown;

  useEffect(() => {
    latest.current = { onClose, dismissible };
  });

  useEffect(() => {
    if (isOpen || !mounted) return;
    const timer = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(timer);
  }, [isOpen, mounted]);

  // Celular: puxar a folha para baixo (pela alça ou com o conteúdo no topo) fecha; arrasto curto volta ao lugar
  useEffect(() => {
    const panel = dialogRef.current;
    const scroller = scrollRef.current;
    if (!isOpen || !panel || !scroller) return;

    const sheet = window.matchMedia('(max-width: 639.98px)');
    const backdrop = backdropRef.current;
    let state: 'idle' | 'maybe' | 'drag' = 'idle';
    let startX = 0;
    let startY = 0;
    let dy = 0;
    let velocity = 0;
    let lastY = 0;
    let lastT = 0;

    const release = () => {
      panel.style.translate = '';
      panel.style.transition = '';
      if (backdrop) backdrop.style.opacity = backdrop.style.transition = '';
    };

    const onStart = (e: TouchEvent) => {
      state = 'idle';
      if (!sheet.matches || e.touches.length > 1) return;
      // Com o texto (ou um campo/lista interna) rolado, o gesto é rolagem normal
      for (let el = e.target as HTMLElement | null; el && el !== panel; el = el.parentElement) if (el.scrollTop > 0) return;
      startX = e.touches[0].clientX;
      startY = lastY = e.touches[0].clientY;
      lastT = e.timeStamp;
      dy = velocity = 0;
      state = 'maybe';
    };

    const onMove = (e: TouchEvent) => {
      if (state === 'idle') return;
      const y = e.touches[0].clientY;
      dy = y - startY;
      if (state === 'maybe') {
        // Subindo ou na horizontal (carrossel/miniaturas dentro do modal): não é puxar a folha
        if (dy < 0 || Math.abs(e.touches[0].clientX - startX) > dy || scroller.scrollTop > 0) {
          state = 'idle';
          return;
        }
        if (dy < 4) return;
        state = 'drag';
        panel.style.transition = 'none';
        if (backdrop) backdrop.style.transition = 'none';
      }
      e.preventDefault();
      if (e.timeStamp > lastT) velocity = (y - lastY) / (e.timeStamp - lastT);
      lastY = y;
      lastT = e.timeStamp;
      // Sem permissão para fechar, a folha estica pouco e com resistência
      const pull = latest.current.dismissible ? Math.max(0, dy) : Math.min(48, Math.max(0, dy) * 0.25);
      panel.style.translate = `0 ${pull}px`;
      if (backdrop) backdrop.style.opacity = String(1 - Math.min(1, pull / panel.offsetHeight) * 0.85);
    };

    const onEnd = (e: TouchEvent) => {
      if (state !== 'drag') {
        state = 'idle';
        return;
      }
      state = 'idle';
      release();
      const far = dy > Math.min(160, panel.offsetHeight * 0.3);
      // Peteleco: rápido no fim do gesto (soltar depois de parar o dedo não conta)
      const flick = velocity > 0.5 && dy > 40 && e.timeStamp - lastT < 120;
      if (latest.current.dismissible && (far || flick)) latest.current.onClose();
    };

    panel.addEventListener('touchstart', onStart, { passive: true });
    panel.addEventListener('touchmove', onMove, { passive: false });
    panel.addEventListener('touchend', onEnd);
    panel.addEventListener('touchcancel', onEnd);
    return () => {
      panel.removeEventListener('touchstart', onStart);
      panel.removeEventListener('touchmove', onMove);
      panel.removeEventListener('touchend', onEnd);
      panel.removeEventListener('touchcancel', onEnd);
      release();
    };
  }, [isOpen, mounted, isClient, dialogRef]);

  // Progresso de leitura no rodapé (escrito direto no DOM: nada re-renderiza ao rolar)
  const handleScroll = () => {
    const scroller = scrollRef.current;
    if (!scroller || !progressRef.current) return;
    const max = scroller.scrollHeight - scroller.clientHeight;
    progressRef.current.style.scale = `${max > 8 ? Math.min(1, scroller.scrollTop / max) : 0} 1`;
  };

  if (!isClient || !mounted) return null;

  return createPortal(
    <div
      data-state={isOpen ? 'open' : 'closed'}
      inert={!isOpen}
      className="group/modal fixed inset-0 z-100 flex items-end justify-center sm:items-center sm:p-6 sm:[@media(max-height:520px)]:p-3"
    >
      <div ref={backdropRef} aria-hidden="true" onClick={dismissible ? onClose : undefined} onMouseDown={dismissible ? undefined : (e) => e.preventDefault()} className={BACKDROP} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-busy={busy || undefined}
        tabIndex={-1}
        className={`${PANEL} ${SIZES[size]} ${className}`}
      >
        {/* Alça da folha (celular): branca com contorno para aparecer sobre foto e sobre fundo branco */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-2 sm:hidden">
          <span className="h-1.5 w-11 rounded-full bg-white/90 shadow-[0_1px_4px_rgba(0,26,61,0.35)] ring-1 ring-[#001a3d]/15" />
        </div>

        <button type="button" onClick={onClose} aria-label="Fechar" className={CLOSE_BUTTON}>
          <FaTimes className="h-4 w-4" aria-hidden="true" />
        </button>

        {view.header}

        <div ref={scrollRef} onScroll={handleScroll} className={`min-h-0 flex-1 overflow-y-auto overscroll-contain ${bodyClassName}`}>
          {view.children}
        </div>

        {view.footer && (
          <div className={FOOTER}>
            {/* Progresso de leitura sobre a borda do rodapé */}
            <div
              ref={progressRef}
              aria-hidden="true"
              style={{ scale: '0 1' }}
              className="absolute inset-x-0 -top-px h-0.5 origin-left bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]"
            />
            {view.footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/* ---------------------------------------------------------------- peças de conteúdo */

interface ModalMediaProps {
  image?: string | null;
  /** Classes do degradê (from-… to-…) usado sem imagem e enquanto ela carrega */
  gradient?: string;
  /** Elemento grande (ícone, data...) mostrado quando não há imagem */
  fallback?: React.ReactNode;
  /** Chips no canto inferior da mídia */
  children?: React.ReactNode;
}

type ViewTimelineCtor = new (options: { subject: Element; axis: 'block' }) => AnimationTimeline;

/**
 * Parallax da capa ao rolar o modal: a capa desce 35% da própria altura enquanto sai de vista. Usa a linha do tempo
 * de rolagem do navegador (ViewTimeline), que roda no compositor junto com a rolagem; um listener de scroll chega um
 * quadro atrasado e a foto treme (cintila) ao rolar com o dedo. Sem suporte (Firefox) ou com movimento reduzido, fica parada.
 * Função fora do componente: a ref estável liga a animação uma vez só.
 */
function attachParallax(el: HTMLDivElement | null) {
  const ViewTimeline = (window as unknown as { ViewTimeline?: ViewTimelineCtor }).ViewTimeline;
  if (!el?.parentElement || !ViewTimeline || reduceMotion()) return;
  const options = { timeline: new ViewTimeline({ subject: el.parentElement, axis: 'block' }), fill: 'both', rangeStart: 'exit 0%', rangeEnd: 'exit 100%' };
  const animation = el.animate({ translate: ['0 0', '0 35%'] }, options as KeyframeAnimationOptions);
  return () => animation.cancel();
}

/** Capa 16:9 do modal (altura limitada pela tela no desktop), com degradê para os chips e parallax ao rolar. */
export function ModalMedia({ image, gradient, fallback, children }: ModalMediaProps) {
  return (
    <div
      // Sem foto a faixa é mais baixa: só cor e tipografia não justificam meia tela
      className={`relative w-full shrink-0 overflow-hidden bg-linear-to-br ${image ? 'aspect-video sm:max-h-[min(44dvh,26rem)] sm:[@media(max-height:520px)]:max-h-[34dvh]' : 'aspect-[2.4/1] sm:max-h-[min(30dvh,18rem)]'} ${gradient || 'from-[#003f7f] to-[#0066cc]'}`}
    >
      <div ref={attachParallax} className="absolute inset-0">
        {image ? (
          // Ken Burns curto na abertura: a foto assenta de 1.08 para 1
          <div className="absolute inset-0 transition-[scale] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] starting:scale-[1.08] motion-reduce:transition-none">
            {/* A versão grande da foto quase nunca está em cache (o cartão usa outra largura): entra com fade em vez de
                "estourar" por cima do degradê no meio da abertura. key: outra foto no mesmo modal recomeça o fade. */}
            <Image
              key={image}
              src={image}
              alt=""
              fill
              sizes="(min-width: 640px) 880px, 100vw"
              unoptimized={!isOptimizableImage(image)}
              onLoad={(e) => {
                e.currentTarget.dataset.loaded = '';
              }}
              className="object-cover opacity-0 transition-opacity duration-500 ease-out data-loaded:opacity-100"
            />
          </div>
        ) : (
          <>
            {/* Padrão de pontos da marca sobre o degradê */}
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.16)_1px,transparent_1.6px)] bg-size-[18px_18px]" />
            {fallback}
          </>
        )}
      </div>
      {/* Véu só na base (legibilidade dos chips); sobre o degradê sem foto ele é leve para não sujar a cor */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-linear-to-t via-55% ${image ? 'from-[#001a3d]/80 via-[#001a3d]/5 to-[#001a3d]/15' : 'from-[#001a3d]/35 via-transparent to-transparent'}`}
      />
      {children && <div className="absolute inset-x-5 bottom-4 flex flex-wrap items-center gap-2 sm:inset-x-10 sm:bottom-6">{children}</div>}
    </div>
  );
}

const CHIP_TONES = {
  light: 'bg-white/95 text-[#003f7f] shadow-[0_6px_16px_-6px_rgba(0,0,0,0.45)]',
  glass: 'bg-[#001a3d]/65 text-white ring-1 ring-white/25',
  accent: 'bg-[#ffd000] text-[#001a3d]',
  soft: 'bg-gray-50 text-gray-700 ring-1 ring-gray-200',
  success: 'bg-[#00a859]/10 text-[#00683a] ring-1 ring-[#00a859]/30',
  muted: 'bg-gray-100 text-gray-600',
} as const;

/** Etiqueta de metadado (categoria, data, autor, situação). `dot` põe a bolinha verde da marca. */
export function ModalChip({
  tone = 'soft',
  icon: Icon,
  dot,
  children,
}: {
  tone?: keyof typeof CHIP_TONES;
  icon?: IconType;
  dot?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs leading-none font-bold ${CHIP_TONES[tone]}`}>
      {dot && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#00a859]" />}
      {Icon && <Icon aria-hidden="true" className="h-3 w-3 shrink-0 opacity-80" />}
      {children}
    </span>
  );
}

/** Coluna de leitura centralizada (mesmas margens em todos os modais). */
export function ModalBody({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className="px-5 sm:px-10">
      <div className={`mx-auto max-w-[42rem] pt-6 pb-10 sm:pt-9 sm:pb-12 ${className}`}>{children}</div>
    </div>
  );
}

export function ModalTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-[1.75rem] leading-[1.08] font-black tracking-tight text-balance text-[#003f7f] sm:text-[2.35rem]">
      {children}
    </h2>
  );
}

/**
 * Texto de leitura (60ch ≈ 70 caracteres por linha). O 1º parágrafo sai maior, como abertura.
 * Alinhado à esquerda, sem hifenizar: o .prose global justifica no desktop e, numa coluna estreita, abre "rios"
 * de espaço entre as palavras (o ! vence o .prose, que fica fora das camadas do Tailwind).
 * `html` precisa vir sanitizado (DOMPurify); `text` puro vira parágrafos pelas quebras de linha.
 */
export function ModalProse({ html, text, className = '' }: { html?: string; text?: string; className?: string }) {
  const classes = `prose max-w-[60ch] text-base text-pretty sm:text-[1.0625rem] [&_p]:text-left! [&_p]:hyphens-manual! [&>p:first-child]:text-[1.0625rem] [&>p:first-child]:text-gray-800 sm:[&>p:first-child]:text-lg ${className}`;
  if (html) return <div className={classes} dangerouslySetInnerHTML={{ __html: html }} />;
  return (
    <div className={classes}>
      {(text || '')
        .split(/\n+/)
        .filter((paragraph) => paragraph.trim())
        .map((paragraph, index) => (
          <p key={index}>{paragraph.trim()}</p>
        ))}
    </div>
  );
}

/**
 * Compartilhar: folha nativa do sistema (Web Share API) quando existe; senão copia o link.
 * `url` pode ser caminho relativo ("/imprensa/noticias/3").
 */
export function ShareButton({ title, text, url }: { title: string; text?: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const href = new URL(url, window.location.origin).toString();
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: href });
        return;
      } catch (error) {
        // Cancelar a folha não é erro; outras falhas caem no copiar
        if ((error as DOMException)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      toast.success('Link copiado!');
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error('Não foi possível copiar o link.');
    }
  };

  const Icon = copied ? FaCheck : FaShareAlt;
  return (
    <button
      type="button"
      onClick={share}
      aria-label={copied ? 'Link copiado' : 'Compartilhar'}
      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-gray-100 px-3 text-sm font-bold text-[#003f7f] transition-[background-color,scale] duration-200 hover:bg-gray-200 active:scale-95 sm:px-5"
    >
      <Icon className={`h-4 w-4 ${copied ? 'text-[#00a859]' : ''}`} aria-hidden="true" />
      <span className="max-sm:sr-only">{copied ? 'Link copiado' : 'Compartilhar'}</span>
    </button>
  );
}

/* ---------------------------------------------------------------- modal dos formulários do painel */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Linha de apoio opcional abaixo do título */
  subtitle?: string;
}

// Desktop: a linha de botões no fim do formulário (a que tem o botão de enviar) fica presa ao rodapé do modal,
// sem exigir mudança nas páginas que usam o componente. No celular ela segue o fluxo normal da folha.
const STICKY_ACTIONS = [
  'sm:[&>form>div:last-child:has([type=submit])]:sticky',
  'sm:[&>form>div:last-child:has([type=submit])]:-bottom-7', // compensa o padding do corpo (o sticky para no padding)
  'sm:[&>form>div:last-child:has([type=submit])]:z-10',
  'sm:[&>form>div:last-child:has([type=submit])]:-mx-8',
  'sm:[&>form>div:last-child:has([type=submit])]:-mb-7',
  'sm:[&>form>div:last-child:has([type=submit])]:px-8',
  'sm:[&>form>div:last-child:has([type=submit])]:pt-4',
  'sm:[&>form>div:last-child:has([type=submit])]:pb-7',
  'sm:[&>form>div:last-child:has([type=submit])]:bg-white',
  'sm:[&>form>div:last-child:has([type=submit])]:border-t',
  'sm:[&>form>div:last-child:has([type=submit])]:border-gray-100',
].join(' ');

/**
 * Modal genérico do painel (formulários "Nova notícia", "Novo evento"...).
 * Largo quando tem campos, estreito para confirmações/detalhes.
 * Sem fechar no clique fora nem ao puxar a folha, para não perder o que foi digitado (Esc e o X fecham).
 */
export default function Modal({ isOpen, onClose, title, subtitle, children }: ModalProps) {
  const titleId = useId();

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
      size="sm"
      dismissible={false}
      className="sm:has-[input,select,textarea]:max-w-2xl"
      bodyClassName={`px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-7 ${STICKY_ACTIONS}`}
      header={
        <div className="shrink-0 border-b border-gray-100">
          <div aria-hidden="true" className="h-1.5 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
          <div className="min-w-0 py-4 pr-16 pl-5 max-sm:pt-6 sm:py-5 sm:pr-20 sm:pl-8">
            <h2 id={titleId} className="text-xl leading-tight font-black tracking-tight text-balance text-[#003f7f] sm:text-2xl">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm text-pretty text-gray-500">{subtitle}</p>}
          </div>
        </div>
      }
    >
      {children}
    </ModalShell>
  );
}
