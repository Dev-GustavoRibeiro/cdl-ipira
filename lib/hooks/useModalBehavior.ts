'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

// Bloqueio de scroll com contagem: só libera quando o último modal/menu aberto fechar
let scrollLocks = 0;
let previousOverflow = '';

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (scrollLocks++ === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (--scrollLocks === 0) document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}

const subscribeNoop = () => () => {};

/** true apenas no cliente (após a hidratação). Substitui o padrão `mounted` + setState em effect para usar createPortal. */
export function useIsClient() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

// Pilha de modais abertos: só o do topo responde a Esc/Tab (ex.: inscrição aberta sobre o evento)
const openModals: object[] = [];

/**
 * Comportamento padrão de diálogo modal:
 * - trava o scroll do body (com contagem);
 * - Esc chama onClose (se informado);
 * - move o foco para dentro ao abrir, mantém o Tab preso no diálogo e devolve o foco ao fechar.
 * Coloque o ref retornado no painel do diálogo (com tabIndex={-1}).
 */
export function useModalBehavior<T extends HTMLElement = HTMLDivElement>(isOpen: boolean, onClose?: () => void) {
  const dialogRef = useRef<T>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const token = {};
    openModals.push(token);
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const getFocusable = () =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => el.getClientRects().length > 0
      );

    const dialog = dialogRef.current;
    if (dialog && !dialog.contains(document.activeElement)) {
      (getFocusable()[0] ?? dialog).focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (openModals[openModals.length - 1] !== token) return;

      if (e.key === 'Escape' && onCloseRef.current) {
        e.preventDefault();
        onCloseRef.current();
        return;
      }

      const container = dialogRef.current;
      if (e.key !== 'Tab' || !container) return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const outside = !container.contains(active);

      if (e.shiftKey && (active === first || active === container || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      openModals.splice(openModals.indexOf(token), 1);
      // Devolve o foco para quem abriu o modal
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [isOpen]);

  return dialogRef;
}
