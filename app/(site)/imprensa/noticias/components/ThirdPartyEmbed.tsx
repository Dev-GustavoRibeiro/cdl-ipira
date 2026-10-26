'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FaCookieBite, FaExternalLinkAlt } from 'react-icons/fa';
import { OPEN_CONSENT_EVENT, saveConsent, useThirdPartyConsent } from '@/lib/consent';

/* Embed de terceiros (vídeo do YouTube, mapa do Google) só com consentimento (LGPD). Compartilhado pela TV Lojista e
   pelo mapa do contato, como o LoadStates ao lado. */

const BUTTON =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-[background-color,scale] duration-200 active:scale-[0.98] motion-reduce:transition-none';
const LINK = 'inline-flex min-h-8 items-center gap-1.5 rounded-lg font-semibold text-white/85 underline-offset-4 hover:text-[#ffd000] hover:underline';

interface ThirdPartyEmbedProps {
  /** Dono do conteúdo, como aparece no aviso ("YouTube", "Google") */
  provider: string;
  /** Ver no site de origem: continua funcionando sem o embed */
  link?: { href: string; label: string };
  /** Tamanho e cantos do cartão no lugar do embed */
  className?: string;
  children: React.ReactNode;
}

/**
 * Sem consentimento salvo, mostra um cartão no lugar do embed: carregar só desta vez (fica nesta tela) ou permitir
 * sempre (salva a escolha). Mudar as preferências de cookies vale na hora, sem recarregar a página.
 */
export default function ThirdPartyEmbed({ provider, link, className = '', children }: ThirdPartyEmbedProps) {
  const allowed = useThirdPartyConsent();
  const [once, setOnce] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const focusOnLoad = useRef(false);
  const show = allowed || once;

  // O botão clicado some: o foco vai para o embed (no vídeo, o teclado já controla o player)
  useEffect(() => {
    if (!show || !focusOnLoad.current) return;
    focusOnLoad.current = false;
    boxRef.current?.querySelector('iframe')?.focus();
  }, [show]);

  const load = (always: boolean) => {
    focusOnLoad.current = true;
    if (always) saveConsent(true);
    else setOnce(true);
  };

  return (
    <div ref={boxRef} className="contents">
      {show ? (
        children
      ) : (
        <div className={`flex flex-col items-center justify-center gap-4 bg-linear-to-br from-[#001a3d] to-[#003f7f] px-5 py-8 text-center text-white sm:px-8 ${className}`}>
          <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#ffd000] text-[#003f7f] shadow-sm">
            <FaCookieBite className="h-5 w-5" />
          </span>
          <p className="max-w-md text-base leading-snug font-bold text-balance sm:text-lg">
            Este conteúdo é do {provider} e pode gravar cookies no seu navegador.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <button type="button" onClick={() => load(false)} className={`${BUTTON} bg-[#ffd000] text-[#001a3d] hover:bg-[#ffdb33]`}>
              Carregar só desta vez
            </button>
            <button type="button" onClick={() => load(true)} className={`${BUTTON} bg-white/10 text-white ring-1 ring-white/35 hover:bg-white/20`}>
              Permitir sempre
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm">
            {link && (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                {link.label}
                <FaExternalLinkAlt aria-hidden="true" className="h-3 w-3" />
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            )}
            {/* Se a permissão vier pelo aviso, este botão some: o foco segue para o embed */}
            <button
              type="button"
              onClick={() => {
                focusOnLoad.current = true;
                window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
              }}
              className={LINK}
            >
              Preferências de cookies
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
