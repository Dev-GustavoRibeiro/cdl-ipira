'use client';

import { useSyncExternalStore } from 'react';

/**
 * Consentimento de cookies (LGPD). O site não usa análise nem publicidade: a única categoria opcional é o
 * conteúdo de terceiros incorporado (vídeos do YouTube e mapa do Google), que grava cookies próprios ao carregar.
 * A chave continua 'cookie-consent' (qualquer valor salvo = o visitante já escolheu; as ferramentas de teste usam isso).
 */
export const CONSENT_KEY = 'cookie-consent';
/** Reabre o aviso com as escolhas atuais: window.dispatchEvent(new Event(OPEN_CONSENT_EVENT)) */
export const OPEN_CONSENT_EVENT = 'cdl:abrir-cookies';
/** Disparado a cada escolha salva, venha ela do aviso ou do cartão no lugar do vídeo/mapa */
export const CONSENT_CHANGE_EVENT = 'cdl:consentimento';

export interface Consent {
  necessary: true;
  /** Vídeos do YouTube e mapa do Google */
  terceiros: boolean;
}

/** null = ainda não escolheu (ou storage bloqueado: o aviso aparece). Formatos antigos sem 'terceiros' contam como recusa. */
export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return { necessary: true, terceiros: JSON.parse(raw)?.terceiros === true };
  } catch {
    return null;
  }
}

export function saveConsent(terceiros: boolean) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ necessary: true, terceiros, date: new Date().toISOString() }));
    // A data agora vai junto da escolha; a chave antiga só ocupava espaço
    localStorage.removeItem('cookie-consent-date');
  } catch {
    // Sem storage o aviso volta na próxima visita
  }
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  window.addEventListener('storage', onChange); // escolha feita em outra aba
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** Para embeds (YouTube, Google Maps): true só com consentimento salvo. No servidor, sempre false. */
export function useThirdPartyConsent() {
  return useSyncExternalStore(subscribe, () => readConsent()?.terceiros === true, () => false);
}
