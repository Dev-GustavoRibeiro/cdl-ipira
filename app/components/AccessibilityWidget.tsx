'use client';

/**
 * Acessibilidade: botão flutuante de vidro + painel (ModalShell: folha no celular, diálogo no desktop).
 * - Preferências em localStorage 'a11y-preferences' (accessibility/prefs.ts), aplicadas antes da primeira pintura pelo
 *   script do ConditionalLayout e, depois, a cada mudança. Os efeitos visuais são classes a11y-* no <html> (globals.css).
 * - Alt+A abre/fecha o painel (fora de campos de texto). Esc fecha e devolve o foco a quem abriu.
 * - Guia/máscara de leitura, leitura em voz alta e VLibras são feitos aqui.
 */

import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import {
  FaAdjust,
  FaBookOpen,
  FaFont,
  FaLink,
  FaMinus,
  FaMousePointer,
  FaPause,
  FaPlay,
  FaPlus,
  FaRulerHorizontal,
  FaSignLanguage,
  FaStop,
  FaTextHeight,
  FaTextWidth,
  FaTintSlash,
  FaUndoAlt,
  FaUniversalAccess,
  FaVolumeUp,
} from 'react-icons/fa';
import { ModalShell, modalButton } from './Modal';
import { useIsClient } from '@/lib/hooks/useModalBehavior';
import { DEFAULT_PREFS, TEXT_STEPS, applyPrefs, countActive, readPrefs, savePrefs, type A11yPrefs } from './accessibility/prefs';
import { notifyMotionChange } from './accessibility/motion';
import { useSpeech } from './accessibility/useSpeech';

type ToggleKey = Exclude<keyof A11yPrefs, 'text'>;
type Option = { key: ToggleKey; label: string; hint: string; icon: IconType };

const GROUPS: { title: string; options: Option[] }[] = [
  {
    title: 'Texto',
    options: [
      { key: 'spacing', label: 'Espaçamento do texto', hint: 'Mais espaço entre linhas, letras e palavras', icon: FaTextWidth },
      { key: 'font', label: 'Fonte legível', hint: 'Letras bem distintas, para dislexia e baixa visão', icon: FaFont },
      { key: 'links', label: 'Destacar links', hint: 'Sublinha e contorna todos os links', icon: FaLink },
    ],
  },
  {
    title: 'Visual',
    options: [
      { key: 'contrast', label: 'Alto contraste', hint: 'Fundo preto, texto branco e links amarelos', icon: FaAdjust },
      { key: 'grayscale', label: 'Escala de cinza', hint: 'Mostra a página sem cores', icon: FaTintSlash },
      { key: 'cursor', label: 'Cursor grande', hint: 'Ponteiro do mouse maior e com contorno', icon: FaMousePointer },
    ],
  },
  {
    title: 'Leitura e foco',
    options: [
      { key: 'guide', label: 'Guia de leitura', hint: 'Faixa que acompanha o ponteiro e o foco', icon: FaRulerHorizontal },
      { key: 'mask', label: 'Máscara de leitura', hint: 'Escurece tudo fora da linha que você lê', icon: FaBookOpen },
      { key: 'motion', label: 'Pausar animações', hint: 'Para carrosséis, zoom das fotos e efeitos', icon: FaPause },
    ],
  },
];

const LIBRAS: Option = { key: 'libras', label: 'Libras (VLibras)', hint: 'Tradutor de Libras do governo federal', icon: FaSignLanguage };

const CARD = 'rounded-[1.25rem] border px-4 py-3.5 sm:p-4';
// Celular: uma coluna (cartões em linha, como os ajustes do sistema). A partir de sm: grade de cartões, 3 por linha.
const GRID = 'grid gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,10rem),1fr))] sm:gap-3';
const ICON_TILE = 'grid size-10 shrink-0 place-items-center rounded-xl';
// Sem tamanho: o −/+ do texto usa px (não cresce nem anda a cada toque) e o "parar" da leitura, rem
const STEP_BUTTON =
  'grid shrink-0 place-items-center rounded-full bg-gray-100 text-[#003f7f] transition-[background-color,scale] duration-200 hover:bg-gray-200 active:scale-95 aria-disabled:cursor-not-allowed aria-disabled:opacity-40';
const MAX_TEXT = TEXT_STEPS[TEXT_STEPS.length - 1];

/* ---------------------------------------------------------------- VLibras */

const VLIBRAS_SRC = 'https://vlibras.gov.br/app/vlibras-plugin.js';
type VLibrasWindow = Window & { VLibras?: { Widget: new (options: object) => unknown }; VLibrasWidget?: { open?: () => void } };

const subscribeNoop = () => () => {};

// O player do VLibras é um iframe de outro site sem cabeçalho COEP: com a página isolada (COEP + COOP de produção,
// window.crossOriginIsolated) o navegador o bloqueia e o avatar fica carregando para sempre. Aí a opção nem aparece.
const librasAvailable = () => !window.crossOriginIsolated;

/** O script do governo só é baixado quando a pessoa liga a opção; desligar esconde o botão e o avatar dele. */
function showVLibras(on: boolean, openNow: boolean) {
  for (const id of ['vlibras-access-wrapper', 'vlibras-app-root']) {
    const el = document.getElementById(id);
    if (el) el.style.display = on ? '' : 'none';
  }
  if (!on) return;
  const w = window as VLibrasWindow;
  if (w.VLibrasWidget?.open) {
    if (openNow) w.VLibrasWidget.open();
    return;
  }
  if (document.querySelector(`script[src="${VLIBRAS_SRC}"]`)) return;
  const script = document.createElement('script');
  script.src = VLIBRAS_SRC;
  script.async = true;
  script.onload = () => {
    // O construtor cria o botão do VLibras (lateral direita); open() já mostra o avatar
    new w.VLibras!.Widget({});
    if (openNow) w.VLibrasWidget?.open?.();
  };
  document.body.append(script);
}

/* ---------------------------------------------------------------- guia e máscara de leitura */

/** Faixa e/ou máscara presas à altura do ponteiro (ou do elemento focado pelo teclado), escritas direto no DOM. */
function ReadingAids({ guide, mask }: { guide: boolean; mask: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const place = (y: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => el.style.setProperty('--y', `${Math.round(y)}px`));
    };
    const onPointer = (e: PointerEvent) => place(e.clientY);
    const onFocus = (e: FocusEvent) => {
      if (!(e.target instanceof Element)) return;
      const rect = e.target.getBoundingClientRect();
      if (rect.height) place(rect.top + Math.min(rect.height, 64) / 2);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });
    window.addEventListener('focusin', onFocus);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('focusin', onFocus);
    };
  }, []);

  // Acima de tudo (inclusive dos modais) e sem receber cliques
  return createPortal(
    <div ref={ref} aria-hidden="true" data-a11y-aid className="pointer-events-none fixed inset-0 z-200 [--y:50vh]">
      {mask && (
        <>
          <div className="absolute inset-x-0 top-0 h-[max(0px,calc(var(--y)-3.25em))] border-b-2 border-[#ffd000] bg-[#001a3d]/75" />
          <div className="absolute inset-x-0 top-[calc(var(--y)+3.25em)] bottom-0 border-t-2 border-[#ffd000] bg-[#001a3d]/75" />
        </>
      )}
      {guide && (
        <div className="absolute inset-x-0 top-[var(--y)] h-[2.75em] -translate-y-1/2 border-y-[3px] border-[#ffd000] bg-[#ffd000]/15 shadow-[0_0_0_1px_rgba(0,26,61,0.55),inset_0_0_0_1px_rgba(0,26,61,0.55)]" />
      )}
    </div>,
    document.body
  );
}

/* ---------------------------------------------------------------- peças do painel */

function Group({ title, grid = GRID, children }: { title: string; grid?: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id}>
      <h3 id={id} className="mb-3 text-xs font-black tracking-[0.14em] text-[#003f7f] uppercase">
        {title}
      </h3>
      <div className={grid}>{children}</div>
    </section>
  );
}

/**
 * Cartão liga/desliga: o cartão inteiro é o interruptor (role=switch), com nome = rótulo e descrição = dica.
 * Pela largura do próprio cartão (@container, em rem: acompanha o tamanho do texto): largo (celular a 100%) vira linha
 * ícone | texto | interruptor; estreito (grade do desktop, celular com texto a 130–150%) fica ícone e interruptor em
 * cima e o texto embaixo, com a largura toda, sem quebrar palavra no meio.
 */
function SwitchCard({ option, on, onToggle, note }: { option: Option; on: boolean; onToggle: () => void; note?: string }) {
  const id = useId();
  const Icon = option.icon;
  const row = '@min-[18rem]:col-start-2 @min-[18rem]:col-span-1 @min-[18rem]:row-start-1';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={`${id}-l`}
      aria-describedby={`${id}-d`}
      onClick={onToggle}
      // flex: o botão centraria o conteúdo na altura, e o cartão de dica curta ficava mais baixo que os vizinhos
      className={`${CARD} @container flex flex-col text-left transition-[background-color,border-color,box-shadow] duration-200 ${
        on ? 'border-[#003f7f] bg-[#003f7f]/[0.06] shadow-[inset_0_0_0_1px_#003f7f]' : 'border-gray-200 bg-white hover:border-[#003f7f]/45 hover:bg-gray-50'
      }`}
    >
      <span className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3.5 gap-y-3 @min-[18rem]:items-center">
        <span aria-hidden="true" className={`${ICON_TILE} col-start-1 row-start-1 ${on ? 'bg-[#003f7f] text-white' : 'bg-gray-100 text-[#003f7f]'}`}>
          <Icon className="size-[1.125rem]" />
        </span>
        <span className={`col-span-3 row-start-2 block ${row}`}>
          <span id={`${id}-l`} className="block text-sm leading-tight font-bold text-gray-900">
            {option.label}
          </span>
          {/* note: aviso no lugar da dica (visível e lido como descrição) */}
          <span id={`${id}-d`} className={`mt-1 block text-xs leading-snug ${note ? 'font-semibold text-[#003f7f]' : 'text-gray-600'}`}>
            {note ?? option.hint}
          </span>
        </span>
        {/* Interruptor: contorno e bolinha cinza-escuro desligado (contraste 3:1 com o branco), azul ligado */}
        <span
          aria-hidden="true"
          className={`relative col-start-3 row-start-1 mt-1 h-6 w-10 shrink-0 rounded-full border-2 transition-colors duration-200 @min-[18rem]:mt-0 ${on ? 'border-[#003f7f] bg-[#003f7f]' : 'border-gray-500 bg-white'}`}
        >
          <span
            className={`absolute top-1/2 left-0.5 size-4 -translate-y-1/2 rounded-full transition-[translate,background-color] duration-200 ${on ? 'translate-x-4 bg-white' : 'bg-gray-500'}`}
          />
        </span>
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------- widget */

export default function AccessibilityWidget({ fontVar }: { fontVar: string }) {
  const isClient = useIsClient();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<A11yPrefs>(readPrefs);
  const [status, setStatus] = useState('');
  const [picked, setPicked] = useState('');
  // Botão −/+ tocado e onde estava na tela; folga no topo do painel (ver o efeito abaixo)
  const stepAnchor = useRef<{ el: HTMLElement; top: number } | null>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const speech = useSpeech(usePathname());
  const titleId = useId();
  const textId = useId();
  const speechId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const librasOk = useSyncExternalStore(subscribeNoop, librasAvailable, () => false);
  const active = countActive(prefs);

  // Aplica a cada mudança (na carga o script do layout já aplicou: nada muda na tela)
  useEffect(() => {
    const motionBefore = document.documentElement.classList.contains('a11y-motion');
    applyPrefs(prefs, fontVar);
    // Ligar e desligar: hero e carrosséis (o SectionCarousel recria o Swiper pela key) voltam a girar sem recarregar
    if (motionBefore !== prefs.motion) notifyMotionChange();
    // Tamanho do texto: tudo acima do −/+ cresce (ou encolhe) em rem e o levaria para longe do dedo. A rolagem do painel
    // o devolve ao mesmo lugar da tela, e o próximo toque no mesmo ponto acerta o botão de novo. Encolhendo com o painel
    // no topo não há para onde rolar: a folga no topo cresce no lugar (e é a primeira a sumir quando o texto volta a crescer).
    const anchor = stepAnchor.current;
    const spacer = spacerRef.current;
    const scroller = anchor?.el.closest('.overflow-y-auto');
    stepAnchor.current = null;
    if (anchor && spacer && scroller) {
      const drift = () => anchor.el.getBoundingClientRect().top - anchor.top;
      if (drift() > 0) spacer.style.height = `${Math.max(0, spacer.offsetHeight - drift())}px`;
      scroller.scrollBy({ top: drift(), behavior: 'instant' });
      if (drift() < 0) spacer.style.height = `${spacer.offsetHeight - drift()}px`;
    }
  }, [prefs, fontVar]);

  // VLibras ligado em outra visita: carrega o botão dele (sem abrir o avatar). Depois quem liga/desliga é o cartão.
  useEffect(() => {
    if (readPrefs().libras && librasAvailable()) showVLibras(true, false);
  }, []);

  // Com o VLibras aberto, todo clique vira "traduzir este texto" (o botão só age no 2º clique, e o Espaço/Enter nem
  // isso). No painel e no botão flutuante o clique tem de agir direto: a marca é a que o próprio VLibras usa para
  // deixar passar os cliques que ele repete. Captura no document: roda antes do ouvinte dele, que fica no body.
  useEffect(() => {
    if (!prefs.libras) return;
    const pass = (e: MouseEvent) => {
      const target = e.target as Node;
      const panel = document.getElementById(titleId)?.closest('[role="dialog"]');
      if (panel?.contains(target) || buttonRef.current?.contains(target)) Object.defineProperty(e, '__vlibrasSyntheticClick', { value: true });
    };
    document.addEventListener('click', pass, true);
    return () => document.removeEventListener('click', pass, true);
  }, [prefs.libras, titleId]);

  // O texto selecionado na página é guardado ao abrir (clicar no painel desfaria a seleção)
  const captureSelection = () => setPicked(window.getSelection()?.toString().trim() ?? '');

  // Alt+A abre/fecha (no Mac, Option+A: e.code continua KeyA)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey || e.code !== 'KeyA') return;
      const target = e.target as HTMLElement;
      if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      e.preventDefault();
      captureSelection();
      setOpen((value) => !value);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const update = (next: A11yPrefs, message: string) => {
    setPrefs(next);
    savePrefs(next);
    setStatus(message);
  };

  const toggle = (option: Option) => {
    const on = !prefs[option.key];
    const next = { ...prefs, [option.key]: on };
    // Guia e máscara juntas embolam a tela: ligar uma desliga a outra
    if (on && option.key === 'guide') next.mask = false;
    if (on && option.key === 'mask') next.guide = false;
    if (option.key === 'libras') showVLibras(on, on);
    update(next, `${option.label}: ${on ? 'ligado' : 'desligado'}`);
  };

  const step = TEXT_STEPS.indexOf(prefs.text as (typeof TEXT_STEPS)[number]);
  const setText = (index: number, from: HTMLElement) => {
    if (index < 0 || index >= TEXT_STEPS.length) return;
    stepAnchor.current = { el: from, top: from.getBoundingClientRect().top };
    const text = TEXT_STEPS[index];
    update({ ...prefs, text }, `Tamanho do texto: ${text}%${text === MAX_TEXT ? '. Para ampliar mais, use o zoom do navegador' : ''}`);
  };

  const reset = () => {
    if (!active) return;
    speech.stop();
    if (prefs.libras) showVLibras(false, false);
    update(DEFAULT_PREFS, 'Preferências de acessibilidade restauradas para o padrão');
  };

  // Lê o trecho selecionado; sem seleção, o modal aberto por baixo do painel (notícia, evento...) ou o conteúdo principal
  const readAloud = () => {
    const dialogs = [...document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]')].filter(
      (dialog) => dialog.getAttribute('aria-labelledby') !== titleId
    );
    const source = dialogs.at(-1) ?? document.getElementById('conteudo');
    speech.speak(picked || source?.innerText || '');
  };

  if (!isClient) return null;

  const SpeechIcon = speech.state === 'playing' ? FaPause : FaPlay;
  const speechLabel = speech.state === 'playing' ? 'Pausar' : speech.state === 'paused' ? 'Continuar' : 'Ouvir';

  return (
    <>
      {(prefs.guide || prefs.mask) && <ReadingAids guide={prefs.guide} mask={prefs.mask} />}

      {/* Botão flutuante de vidro (mesma posição de antes: esquerda no celular em pé, direita no layout desktop e no
          celular deitado). O selo verde conta os ajustes ligados. */}
      <button
        ref={buttonRef}
        type="button"
        // Mouse/toque: a seleção é lida no pointerdown, antes de o clique desfazê-la; teclado (detail 0): no clique
        onPointerDown={captureSelection}
        onClick={(e) => {
          if (e.detail === 0) captureSelection();
          setOpen(true);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Alt+A"
        aria-label={active ? `Acessibilidade (${active} ${active === 1 ? 'ajuste ativo' : 'ajustes ativos'})` : 'Acessibilidade'}
        title="Acessibilidade (Alt+A)"
        // Tamanho em px: com o texto a 150% o botão não cresce por cima do conteúdo (a distância da barra inferior, em
        // rem, acompanha a barra). Celular em pé e baixo (360×640): menor e mais rente ao canto e à barra.
        className="liquid-glass liquid-glass-strong fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-3 z-40 grid size-[48px] place-items-center rounded-full text-[#003f7f] transition-[scale] duration-200 hover:scale-105 active:scale-95 md:left-4 md:size-[56px] desk:right-6 desk:bottom-6 desk:left-auto short-landscape:right-3 short-landscape:left-auto [@media(orientation:portrait)_and_(max-height:700px)]:bottom-[calc(4.75rem+env(safe-area-inset-bottom))] [@media(orientation:portrait)_and_(max-height:700px)]:left-1.5 [@media(orientation:portrait)_and_(max-height:700px)]:size-[44px]"
      >
        <FaUniversalAccess aria-hidden="true" className="size-[24px] md:size-[28px]" />
        {/* Selo verde: quantos ajustes estão ligados (número azul-escuro: 5,5:1 no verde; branco daria só 3,1:1) */}
        {active > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-[4px] -right-[4px] grid h-[20px] min-w-[20px] place-items-center rounded-full bg-[#00a859] px-[4px] text-[11px] leading-none font-black text-[#001a3d] ring-2 ring-white"
          >
            {active}
          </span>
        )}
      </button>

      <ModalShell
        isOpen={open}
        onClose={() => setOpen(false)}
        labelledBy={titleId}
        size="md"
        header={
          // Faixa fixa só com o título (a explicação rola com os cartões): com texto a 150% no celular sobra altura para
          // as opções. @container: numa tela estreita o ícone sai e o título pode hifenizar (nada passa sob o X).
          // Celular deitado: sem o ícone e só da altura do X, para sobrar janela de rolagem.
          <div className="@container shrink-0 border-b border-gray-100">
            <div aria-hidden="true" className="h-1.5 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
            <div className="flex min-h-[4.25rem] items-center gap-3 py-3 pr-16 pl-5 max-sm:pt-5 sm:min-h-[5rem] sm:gap-4 sm:pr-20 sm:pl-8 short-landscape:min-h-[3.5rem] short-landscape:py-2">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#003f7f] text-white sm:size-12 @max-[22rem]:hidden short-landscape:hidden"
              >
                <FaUniversalAccess className="size-5 sm:size-6" />
              </span>
              <h2
                id={titleId}
                className="min-w-0 text-xl leading-tight font-black tracking-tight text-[#003f7f] hyphens-auto [overflow-wrap:anywhere] sm:text-2xl short-landscape:text-xl"
              >
                Acessibilidade
              </h2>
            </div>
          </div>
        }
        footer={
          <>
            <button type="button" onClick={reset} aria-disabled={!active} className={`${modalButton.secondary} aria-disabled:opacity-50`}>
              <FaUndoAlt aria-hidden="true" className="size-3.5" />
              Restaurar padrões
            </button>
            {/* Atalho de teclado: só com mouse (no celular, mesmo deitado, não serve) */}
            <p className="ml-auto hidden text-xs text-gray-600 sm:pointer-fine:block">
              Atalho: <kbd className="rounded-md bg-gray-100 px-1.5 py-0.5 font-sans font-bold text-gray-800 ring-1 ring-gray-300">Alt</kbd> +{' '}
              <kbd className="rounded-md bg-gray-100 px-1.5 py-0.5 font-sans font-bold text-gray-800 ring-1 ring-gray-300">A</kbd>
            </p>
          </>
        }
      >
        {/* Folga em cima, só para o −/+ do texto não fugir do dedo (ver o efeito que aplica as preferências) */}
        <div ref={spacerRef} aria-hidden="true" />
        <div className="space-y-6 px-5 pt-4 pb-6 sm:px-8 sm:pt-5 sm:pb-8">
          {GROUPS.map((group, index) => (
            <Group key={group.title} title={group.title}>
              {/* Tamanho do texto, primeiro do grupo Texto. Quem toca seguido no mesmo ponto não pode errar o botão: o
                  contador é todo em px e centralizado (o painel cresce em rem para os dois lados, o centro fica parado),
                  e o que cresce acima dele a rolagem compensa (ver o efeito que aplica as preferências). */}
              {index === 0 && (
                <div role="group" aria-labelledby={textId} className={`${CARD} col-span-full border-gray-200`}>
                  <div className="flex items-center gap-3.5">
                    <span aria-hidden="true" className={`${ICON_TILE} ${prefs.text !== 100 ? 'bg-[#003f7f] text-white' : 'bg-gray-100 text-[#003f7f]'}`}>
                      <FaTextHeight className="size-[1.125rem]" />
                    </span>
                    <div className="min-w-0">
                      <p id={textId} className="text-sm leading-tight font-bold text-gray-900">
                        Tamanho do texto
                      </p>
                      <p className="mt-1 text-xs leading-snug text-gray-600">Aumenta letras e espaços do site inteiro</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-[8px]">
                    <button
                      type="button"
                      onClick={(e) => setText(step - 1, e.currentTarget)}
                      aria-disabled={step <= 0}
                      aria-label="Diminuir texto"
                      className={`${STEP_BUTTON} size-[44px]`}
                    >
                      <FaMinus aria-hidden="true" className="size-3" />
                    </button>
                    {/* Largura fixa: "100%" ou "150%", maior ou menor, não empurra os botões */}
                    <div className="flex w-[76px] flex-col items-center gap-[6px]">
                      <span className="text-sm leading-none font-black whitespace-nowrap text-[#003f7f] tabular-nums">{prefs.text}%</span>
                      <span aria-hidden="true" className="flex gap-[4px]">
                        {TEXT_STEPS.map((value, i) => (
                          <span key={value} className={`h-[6px] w-[12px] rounded-full ${i <= step ? 'bg-[#003f7f]' : 'bg-gray-200'}`} />
                        ))}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => setText(step + 1, e.currentTarget)}
                      aria-disabled={step >= TEXT_STEPS.length - 1}
                      aria-label="Aumentar texto"
                      className={`${STEP_BUTTON} size-[44px]`}
                    >
                      <FaPlus aria-hidden="true" className="size-3" />
                    </button>
                  </div>
                  {/* Abaixo dos botões: aparecer não os empurra */}
                  {prefs.text === MAX_TEXT && <p className="mt-2 text-center text-xs leading-snug text-gray-600">No máximo. Para ampliar mais, use o zoom do navegador.</p>}
                </div>
              )}
              {group.options.map((option) => (
                <SwitchCard
                  key={option.key}
                  option={option}
                  on={prefs[option.key]}
                  onToggle={() => toggle(option)}
                />
              ))}
            </Group>
          ))}

          {/* Leitura em voz alta e Libras lado a lado (sem o VLibras, a leitura ocupa a linha) */}
          <Group title={librasOk ? 'Ouvir e Libras' : 'Ouvir'} grid="grid gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] sm:gap-3">
            <div role="group" aria-labelledby={speechId} className={`${CARD} flex flex-wrap items-center gap-x-4 gap-y-3 border-gray-200`}>
              <span aria-hidden="true" className={`${ICON_TILE} ${speech.state !== 'idle' ? 'bg-[#003f7f] text-white' : 'bg-gray-100 text-[#003f7f]'}`}>
                <FaVolumeUp className="size-[1.125rem]" />
              </span>
              <div className="min-w-0 flex-1 basis-40">
                <p id={speechId} className="text-sm leading-tight font-bold text-gray-900">
                  Ler em voz alta
                </p>
                <p className="mt-1 text-xs leading-snug text-gray-600">
                  {!speech.supported
                    ? 'Este navegador não oferece leitura em voz alta.'
                    : picked
                      ? 'Lê o trecho que você selecionou.'
                      : 'Lê o conteúdo da página. Selecione um trecho antes para ouvir só ele.'}
                </p>
              </div>
              {speech.supported && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={speech.state === 'playing' ? speech.pause : speech.state === 'paused' ? speech.resume : readAloud}
                    className={modalButton.primary}
                  >
                    <SpeechIcon aria-hidden="true" className="size-3.5" />
                    {speechLabel}
                  </button>
                  <button type="button" onClick={speech.stop} aria-disabled={speech.state === 'idle'} aria-label="Parar leitura" className={`${STEP_BUTTON} size-11`}>
                    <FaStop aria-hidden="true" className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
            {librasOk && <SwitchCard option={LIBRAS} on={prefs.libras} onToggle={() => toggle(LIBRAS)} />}
          </Group>

          {/* No fim, não no topo: com o texto a 150% num celular pequeno, o tamanho do texto já aparece ao abrir */}
          <p className="text-center text-sm text-pretty text-gray-600">As escolhas ficam salvas neste aparelho.</p>
          <p role="status" className="sr-only">
            {status}
          </p>
        </div>
      </ModalShell>
    </>
  );
}
