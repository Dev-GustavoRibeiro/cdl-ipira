'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaTimes, FaPlusSquare, FaEllipsisV, FaCheck, FaBolt, FaMobileAlt } from 'react-icons/fa';
import { IoShareOutline } from 'react-icons/io5';
import { useIsClient, useModalBehavior } from '@/lib/hooks/useModalBehavior';

type DeviceType = 'ios' | 'android' | 'unknown';

// Ícone em destaque ao lado de cada passo, imitando o botão que a pessoa vai procurar na tela
const STEPS = {
  ios: [
    { icon: IoShareOutline, text: <>Toque em <strong>Compartilhar</strong> na barra inferior do Safari.</> },
    { icon: FaPlusSquare, text: <>Role a lista e escolha <strong>&quot;Adicionar à Tela de Início&quot;</strong>.</> },
    { icon: FaCheck, text: <>Toque em <strong>&quot;Adicionar&quot;</strong>, no canto superior direito, para finalizar.</> },
  ],
  android: [
    { icon: FaEllipsisV, text: <>Toque nos <strong>três pontinhos</strong> no canto superior direito do Chrome.</> },
    { icon: FaPlusSquare, text: <>Escolha <strong>&quot;Adicionar à tela inicial&quot;</strong> ou <strong>&quot;Instalar aplicativo&quot;</strong>.</> },
    { icon: FaCheck, text: <>Toque em <strong>&quot;Adicionar&quot;</strong> para confirmar e criar o atalho.</> },
  ],
};

export default function InstallAppPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const isClient = useIsClient();
  const [deviceType, setDeviceType] = useState<DeviceType>('unknown');
  const pathname = usePathname();
  const firstPathname = useRef(pathname);

  useEffect(() => {
    // Avisos de primeira visita em sequência: nunca na primeira página vista,
    // só depois que o visitante navegou e já respondeu ao aviso de cookies
    if (pathname === firstPathname.current) return;

    let shouldShow = false;
    try {
      const lastShown = localStorage.getItem('install-prompt-shown');
      const weekInMs = 24 * 60 * 60 * 1000 * 7; // 7 dias
      shouldShow = Boolean(localStorage.getItem('cookie-consent'))
        && (!lastShown || (Date.now() - parseInt(lastShown)) > weekInMs);
    } catch {
      // Storage bloqueado: não insiste com o convite
    }
    if (!shouldShow) return;

    // Detectar tipo de dispositivo
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    // Verificar se é um app instalado (PWA standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone || !(isIOS || isAndroid)) return;

    // Mostrar após 3 segundos na nova página
    const timer = setTimeout(() => {
      setDeviceType(isIOS ? 'ios' : 'android');
      setIsOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [pathname]);

  const remember = (timestamp: number) => {
    try {
      localStorage.setItem('install-prompt-shown', timestamp.toString());
    } catch {
      // Sem storage o convite pode voltar em outra visita
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    remember(Date.now());
  };

  const dialogRef = useModalBehavior<HTMLDivElement>(isOpen, handleClose);

  const handleNeverShow = () => {
    setIsOpen(false);
    // Marcar para não mostrar mais (data muito no futuro)
    remember(Date.now() + 365 * 24 * 60 * 60 * 1000 * 10);
  };

  if (!isClient || !isOpen) return null;

  const steps = deviceType === 'ios' ? STEPS.ios : STEPS.android;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-[#001a3d]/60 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        ref={dialogRef}
        className="relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-white shadow-[0_-20px_60px_-20px_rgba(0,26,61,0.5)] animate-[slide-up_0.3s_ease-out] sm:max-w-md sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-prompt-title"
        aria-describedby="install-prompt-desc"
        tabIndex={-1}
      >
        {/* Alça visual da folha (celular) */}
        <div aria-hidden="true" className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-gray-200 sm:hidden" />

        <button
          type="button"
          onClick={handleClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-[background-color,color,scale] duration-200 hover:bg-[#003f7f] hover:text-white active:scale-95 motion-reduce:transition-none"
        >
          <FaTimes aria-hidden="true" className="h-4 w-4" />
        </button>

        <div className="px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {/* Ícone do app + título */}
          <div className="flex flex-col items-center text-center">
            <Image
              src="/icons/icon-192.png"
              alt=""
              width={72}
              height={72}
              className="h-18 w-18 rounded-[1.25rem] shadow-[0_14px_30px_-12px_rgba(0,63,127,0.55)] ring-1 ring-black/5"
            />
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-[#003f7f] uppercase">
              App gratuito
            </span>
            <h2 id="install-prompt-title" className="mt-3 text-2xl font-black leading-tight tracking-tight text-balance text-[#003f7f]">
              Instale o CDL Ipirá
            </h2>
            <div aria-hidden="true" className="mt-3 h-1.5 w-16 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
            <p id="install-prompt-desc" className="mt-3 max-w-[32ch] text-sm text-pretty text-gray-600">
              Tenha acesso rápido ao nosso site direto da tela inicial, como um aplicativo.
            </p>
            <ul className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-semibold text-[#003f7f]">
              <li className="inline-flex items-center gap-1.5 rounded-full bg-[#003f7f]/5 px-3 py-1.5">
                <FaBolt aria-hidden="true" className="h-3 w-3 text-[#00a859]" /> Abre em um toque
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full bg-[#003f7f]/5 px-3 py-1.5">
                <FaMobileAlt aria-hidden="true" className="h-3 w-3 text-[#00a859]" /> Sem loja de apps
              </li>
            </ul>
          </div>

          {/* Passos */}
          <ol className="mt-6 space-y-2.5">
            {steps.map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-center gap-3.5 rounded-2xl bg-gray-50 p-3.5 ring-1 ring-gray-100">
                <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#003f7f] text-xs font-black text-white">
                  {i + 1}
                </span>
                <p className="flex-1 text-sm leading-snug text-gray-700">
                  <span className="sr-only">Passo {i + 1}: </span>
                  {text}
                </p>
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0066cc] shadow-sm ring-1 ring-gray-100">
                  <Icon className="h-5 w-5" />
                </span>
              </li>
            ))}
          </ol>

          {/* Ações */}
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#003f7f] px-5 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(0,63,127,0.7)] transition-[background-color,scale] duration-200 hover:bg-[#0052a3] active:scale-[0.98] motion-reduce:transition-none"
            >
              Entendi
            </button>
            <button
              type="button"
              onClick={handleNeverShow}
              className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              Não mostrar novamente
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
