'use client';

import { useSyncExternalStore } from 'react';

/** Qual sobreposição de navegação está aberta. Uma por vez: abrir a busca a partir do menu fecha o menu. */
export type Overlay = 'menu' | 'search' | null;

let current: Overlay = null;
const listeners = new Set<() => void>();

export function setOverlay(next: Overlay) {
  if (current === next) return;
  current = next;
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Compartilhado entre Header (hambúrguer, busca) e MobileBottomNav (botão Menu): todos abrem o mesmo menu. */
export function useOverlay() {
  return useSyncExternalStore(subscribe, () => current, () => null);
}
