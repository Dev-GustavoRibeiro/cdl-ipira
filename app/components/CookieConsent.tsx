'use client';

import React, { useState, useEffect, useEffectEvent, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useIsClient } from '@/lib/hooks/useModalBehavior';
import { CONSENT_CHANGE_EVENT, OPEN_CONSENT_EVENT, readConsent, saveConsent } from '@/lib/consent';
import { onSiteReady } from './LoadingScreen';
import { FaCookieBite, FaCheck, FaShieldAlt, FaPlay, FaChevronDown, FaTimes, FaSlidersH } from 'react-icons/fa';

// Aceitar e recusar com o mesmo peso visual (orientação da ANPD): nenhum dos dois é o "botão principal"
const CHOICE =
  'inline-flex min-h-11 flex-1 items-center justify-center whitespace-nowrap rounded-xl bg-[#003f7f] px-4 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(0,63,127,0.7)] transition-[background-color,scale] duration-200 hover:bg-[#0052a3] active:scale-[0.98] motion-reduce:transition-none';

// O aviso é fixo no canto, mas no DOM fica logo depois do link "Pular para o conteúdo": entra entre os primeiros
// Tabs e o leitor de tela o encontra no começo da página (no fim do body eram dezenas de Tabs até ele)
function noticeRoot() {
  let root = document.getElementById('avisos');
  if (!root) {
    root = document.createElement('div');
    root.id = 'avisos';
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) skipLink.after(root);
    else document.body.prepend(root);
  }
  return root;
}

/**
 * Aviso de cookies (LGPD): cartão flutuante que não bloqueia a página.
 * Só existe uma categoria opcional, a que o site de fato usa: conteúdo de terceiros (YouTube e Google Maps).
 * Reabre com as escolhas atuais pelo evento 'cdl:abrir-cookies' (botão "Preferências de cookies" do rodapé).
 */
export default function CookieConsent() {
  const isClient = useIsClient();
  const [isOpen, setIsOpen] = useState(false);
  // Reaberto depois de uma escolha: pode fechar sem mudar nada pelo X
  const [hasChoice, setHasChoice] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [terceiros, setTerceiros] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // O texto só rola em tela baixa ou com texto ampliado: só aí ele vira uma parada do Tab
  const [rola, setRola] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const uid = useId();
  const titleId = `${uid}-titulo`;
  const textId = `${uid}-texto`;
  const detailsId = `${uid}-detalhes`;
  const switchId = `${uid}-terceiros`;

  useEffect(() => {
    // Primeira visita: abre assim que a tela de carregamento sai e o site abre (antes disso ela cobre tudo)
    const stopWaiting = readConsent() ? undefined : onSiteReady(() => setIsOpen(true));

    const reopen = () => {
      stopWaiting?.();
      const saved = readConsent();
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setTerceiros(saved?.terceiros === true);
      setHasChoice(saved !== null);
      setShowDetails(true);
      setIsOpen(true);
      // Aberto por um clique: o foco vai para o aviso (o render já terá acontecido no próximo quadro)
      requestAnimationFrame(() => panelRef.current?.focus());
    };
    // Escolha feita fora do aviso (cartão do vídeo/mapa): o aviso some e passa a mostrar o valor salvo
    const onChange = () => {
      const saved = readConsent();
      if (!saved) return;
      stopWaiting?.();
      setTerceiros(saved.terceiros);
      setHasChoice(true);
      setIsOpen(false);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => {
      stopWaiting?.();
      window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
      window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
    };
  }, []);

  const close = () => {
    setIsOpen(false);
    if (returnFocus.current?.isConnected) returnFocus.current.focus();
    returnFocus.current = null;
  };

  const choose = (value: boolean) => {
    saveConsent(value);
    setTerceiros(value);
    close();
  };

  // Esc fecha de qualquer lugar da página, sem gravar nada (sem escolha salva, o aviso volta na próxima visita).
  // Assim ele pode ser dispensado sem tirar o foco de onde está, mesmo cobrindo o item focado (WCAG 2.4.11).
  // Na window, depois dos outros ouvintes: se um modal ou menu já tratou o Esc (preventDefault), ele fecha só o dele.
  const onEscape = useEffectEvent(close);
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) onEscape();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Remede quando a caixa ou o conteúdo muda de tamanho (janela, zoom, texto ampliado, opções abertas).
  // iOS < 13.4 não tem ResizeObserver: fica sem a parada (lá se rola pelo toque).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setRola(el.scrollHeight > el.clientHeight));
    observer.observe(el);
    for (const child of el.children) observer.observe(child);
    return () => observer.disconnect();
  }, [isOpen, showDetails]);

  if (!isClient || !isOpen) return null;

  // Celular: acima da barra de navegação e do botão de acessibilidade (canto inferior esquerdo).
  // No layout desktop (variante desk, que respeita o texto ampliado) o botão de acessibilidade vai para a direita e
  // a barra some: o aviso desce para o canto.
  // z-55: sobre a barra inferior (z-50), mas sob o menu do celular e os modais (z-60 e acima).
  return createPortal(
    <section
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={textId}
      tabIndex={-1}
      className="fixed inset-x-3 bottom-[calc(9rem+env(safe-area-inset-bottom))] z-55 flex max-h-[calc(100dvh-10rem-env(safe-area-inset-bottom))] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-20px_rgba(0,26,61,0.55)] ring-1 ring-[#003f7f]/10 outline-none animate-[slide-up_0.4s_ease-out] print:hidden sm:inset-x-auto sm:left-4 sm:w-[27rem] short-landscape:bottom-[calc(6.5rem+env(safe-area-inset-bottom))] short-landscape:max-h-[calc(100dvh-7.5rem-env(safe-area-inset-bottom))] desk:bottom-6 desk:left-6 desk:max-h-[calc(100dvh-3rem)]"
    >
      <div aria-hidden="true" className="h-1.5 shrink-0 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />

      {/* Quando rola, vira parada do Tab com nome para dar para rolar pelo teclado (WCAG 2.1.1) */}
      <div
        ref={scrollRef}
        {...(rola && { tabIndex: 0, role: 'group', 'aria-labelledby': titleId })}
        className="focus-inset overflow-y-auto overscroll-contain px-5 pt-5 pb-4 sm:px-6"
      >
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ffd000] text-[#003f7f] shadow-sm">
            <FaCookieBite className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-[0.14em] text-[#0066cc] uppercase">Privacidade</p>
            <h2 id={titleId} className="text-lg font-black leading-tight tracking-tight text-[#003f7f]">
              Cookies e conteúdo de terceiros
            </h2>
          </div>
          {hasChoice && (
            <button
              type="button"
              onClick={close}
              aria-label="Fechar sem alterar"
              className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-[#003f7f] hover:text-white"
            >
              <FaTimes aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <p id={textId} className="mt-4 text-sm leading-relaxed text-pretty text-gray-600">
          Não usamos cookies de publicidade nem de estatística. Guardamos no seu navegador só o necessário para o site
          funcionar. Vídeos do YouTube e o mapa do Google são de terceiros e podem gravar cookies próprios: você decide se
          quer carregá-los.
        </p>

        {showDetails && (
          <ul id={detailsId} className="mt-4 space-y-2.5 animate-[slide-down_0.2s_ease-out]">
            <li className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00a859]/15 text-[#00a859]">
                  <FaShieldAlt className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-gray-900">Necessários</h3>
                  <p className="text-xs text-gray-500">Ficam só no seu navegador</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#003f7f] ring-1 ring-[#00a859]/30">
                  <FaCheck aria-hidden="true" className="h-2.5 w-2.5 text-[#00a859]" />
                  Sempre ativo
                </span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-gray-500">
                Guardam esta escolha, suas preferências de acessibilidade (inclusive as do tradutor VLibras, se você
                ligá-lo), buscas recentes e avisos já vistos. Não identificam nem rastreiam você.
              </p>
            </li>

            <li className={`rounded-2xl p-4 ring-1 transition-colors ${terceiros ? 'bg-[#00a859]/5 ring-[#00a859]/30' : 'bg-gray-50 ring-gray-100'}`}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${terceiros ? 'bg-[#00a859]/15 text-[#00a859]' : 'bg-gray-200 text-gray-500'}`}
                >
                  <FaPlay className="h-3.5 w-3.5" />
                </span>
                <label htmlFor={switchId} className="min-w-0 flex-1 cursor-pointer">
                  <span className="block text-sm font-bold text-gray-900">Conteúdo de terceiros</span>
                  <span className="block text-xs text-gray-500">Vídeos do YouTube e mapa do Google</span>
                </label>
                <button
                  id={switchId}
                  type="button"
                  role="switch"
                  aria-checked={terceiros}
                  aria-describedby={`${switchId}-texto`}
                  onClick={() => setTerceiros((on) => !on)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${terceiros ? 'bg-[#00a859]' : 'bg-gray-300'}`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md transition-[translate] duration-200 motion-reduce:transition-none ${terceiros ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>
              <p id={`${switchId}-texto`} className="mt-2.5 text-xs leading-relaxed text-gray-500">
                Os vídeos da TV Lojista e o mapa da página de contato vêm do Google. Ao carregá-los, o Google pode gravar
                cookies e receber dados de navegação, como seu endereço IP.
              </p>
            </li>
          </ul>
        )}
      </div>

      {/* Botões */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-5 pt-4 pb-4 sm:px-6">
        <div className="flex flex-wrap gap-2.5">
          <button type="button" onClick={() => choose(false)} className={CHOICE}>
            Recusar
          </button>
          <button type="button" onClick={() => choose(showDetails ? terceiros : true)} className={CHOICE}>
            {showDetails ? 'Salvar escolhas' : 'Aceitar'}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
            aria-controls={detailsId}
            className="inline-flex min-h-8 items-center gap-1.5 rounded-lg font-bold text-[#003f7f] hover:underline"
          >
            <FaSlidersH aria-hidden="true" className="h-3 w-3" />
            {showDetails ? 'Ocultar opções' : 'Personalizar'}
            <FaChevronDown aria-hidden="true" className={`h-2.5 w-2.5 transition-[rotate] duration-200 ${showDetails ? 'rotate-180' : ''}`} />
          </button>
          {/* Mesma aba: o aviso continua aberto enquanto a pessoa lê a política */}
          <Link href="/politica-de-privacidade" className="inline-flex min-h-8 items-center rounded-lg text-gray-500 hover:text-[#003f7f] hover:underline">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </section>,
    noticeRoot()
  );
}
