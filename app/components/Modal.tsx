'use client';

import React, { useId } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import { useIsClient, useModalBehavior } from '@/lib/hooks/useModalBehavior';

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
 * Celular: folha que sobe da base. Desktop: cartão central (largo para formulários, estreito para confirmações).
 * Sem fechar no clique fora, para não perder o que foi digitado (Esc e o X fecham).
 */
export default function Modal({ isOpen, onClose, title, subtitle, children }: ModalProps) {
  const isClient = useIsClient();
  const titleId = useId();
  const dialogRef = useModalBehavior<HTMLDivElement>(isOpen, onClose);

  if (!isClient || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-end justify-center bg-[#001a3d]/60 backdrop-blur-sm sm:items-center sm:p-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_30px_80px_-20px_rgba(0,26,61,0.55)] animate-[slide-up_0.3s_ease-out] sm:max-h-[90dvh] sm:max-w-lg sm:rounded-3xl sm:has-[input,select,textarea]:max-w-2xl sm:animate-[scale-in_0.2s_ease-out]"
      >
        <div aria-hidden="true" className="h-1.5 shrink-0 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />

        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-8 sm:py-5">
          <div className="min-w-0">
            <h2 id={titleId} className="text-xl font-black leading-tight tracking-tight text-balance text-[#003f7f] sm:text-2xl">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm text-pretty text-gray-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-[background-color,color,scale] duration-200 hover:bg-[#003f7f] hover:text-white active:scale-95 motion-reduce:transition-none"
          >
            <FaTimes aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className={`grow overflow-y-auto overscroll-contain px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-7 ${STICKY_ACTIONS}`}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
