'use client';

import React, { useId } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaExclamationTriangle, FaCheckCircle, FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { useIsClient, useModalBehavior } from '@/lib/hooks/useModalBehavior';

type DialogType = 'delete' | 'success' | 'edit' | 'warning' | 'info';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  showCancel?: boolean;
}

// Texto branco só sobre azul-escuro/vermelho (contraste AA); o verde da marca fica no ícone
const typeConfig = {
  delete: {
    icon: FaTrash,
    iconWrap: 'bg-red-100 text-red-600 ring-red-50',
    confirm: 'bg-red-600 text-white hover:bg-red-700 shadow-[0_14px_30px_-14px_rgba(220,38,38,0.7)]',
  },
  success: {
    icon: FaCheckCircle,
    iconWrap: 'bg-[#00a859]/15 text-[#00a859] ring-[#00a859]/5',
    confirm: 'bg-[#003f7f] text-white hover:bg-[#0052a3] shadow-[0_14px_30px_-14px_rgba(0,63,127,0.7)]',
  },
  edit: {
    icon: FaEdit,
    iconWrap: 'bg-[#0066cc]/10 text-[#0066cc] ring-[#0066cc]/5',
    confirm: 'bg-[#003f7f] text-white hover:bg-[#0052a3] shadow-[0_14px_30px_-14px_rgba(0,63,127,0.7)]',
  },
  warning: {
    icon: FaExclamationTriangle,
    iconWrap: 'bg-[#ffd000] text-[#003f7f] ring-[#ffd000]/25',
    confirm: 'bg-[#ffd000] text-[#003f7f] hover:bg-[#ffed4e] shadow-[0_14px_30px_-14px_rgba(255,208,0,0.9)]',
  },
  info: {
    icon: FaInfoCircle,
    iconWrap: 'bg-[#003f7f]/10 text-[#003f7f] ring-[#003f7f]/5',
    confirm: 'bg-[#003f7f] text-white hover:bg-[#0052a3] shadow-[0_14px_30px_-14px_rgba(0,63,127,0.7)]',
  },
};

const BUTTON =
  'inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition-[background-color,box-shadow,scale] duration-200 active:scale-[0.98] motion-reduce:transition-none';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
  showCancel = true,
}: ConfirmDialogProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const isClient = useIsClient();
  const titleId = useId();
  const messageId = useId();
  // Esc não fecha enquanto a ação está em andamento (mesma regra do botão fechar)
  const dialogRef = useModalBehavior<HTMLDivElement>(isOpen, isLoading ? undefined : onClose);

  if (!isClient || !isOpen) return null;

  // No body (acima de qualquer modal do painel, que fica em z-100)
  return createPortal(
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-[#001a3d]/60 p-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role={type === 'delete' || type === 'warning' ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-3xl bg-white px-6 pt-9 pb-6 text-center shadow-[0_30px_80px_-20px_rgba(0,26,61,0.55)] animate-[scale-in_0.2s_ease-out] sm:px-8 sm:pb-8"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Fechar"
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-[background-color,color,scale] duration-200 hover:bg-[#003f7f] hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none"
        >
          <FaTimes aria-hidden="true" className="h-4 w-4" />
        </button>

        <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ring-8 ${config.iconWrap}`}>
          <Icon aria-hidden="true" className="h-6 w-6" />
        </span>

        <h2 id={titleId} className="mt-6 text-xl font-black tracking-tight text-balance text-[#003f7f] sm:text-2xl">
          {title}
        </h2>
        <p id={messageId} className="mx-auto mt-3 max-w-[42ch] text-[15px] leading-relaxed text-pretty text-gray-600">
          {message}
        </p>

        {(showCancel || onConfirm) && (
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
            {showCancel && (
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className={`${BUTTON} bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {cancelText}
              </button>
            )}
            {/* Em andamento: mantém a cor cheia (texto legível) e mostra o spinner */}
            {onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                aria-busy={isLoading}
                className={`${BUTTON} ${config.confirm} disabled:cursor-wait`}
              >
                {isLoading ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
                    />
                    Processando...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
