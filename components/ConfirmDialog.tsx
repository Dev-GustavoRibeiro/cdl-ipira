'use client';

import React, { useEffect, useRef } from 'react';
import { FaTimes, FaExclamationTriangle, FaCheckCircle, FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';

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

const typeConfig = {
  delete: {
    icon: FaTrash,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    confirmBg: 'bg-red-600 hover:bg-red-700',
    headerBg: 'bg-gradient-to-r from-red-500 to-red-600',
  },
  success: {
    icon: FaCheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    confirmBg: 'bg-green-600 hover:bg-green-700',
    headerBg: 'bg-gradient-to-r from-green-500 to-green-600',
  },
  edit: {
    icon: FaEdit,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    confirmBg: 'bg-blue-600 hover:bg-blue-700',
    headerBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
  },
  warning: {
    icon: FaExclamationTriangle,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
    headerBg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
  },
  info: {
    icon: FaInfoCircle,
    iconBg: 'bg-[#003f7f]/10',
    iconColor: 'text-[#003f7f]',
    confirmBg: 'bg-[#003f7f] hover:bg-[#0066cc]',
    headerBg: 'bg-gradient-to-r from-[#003f7f] to-[#0052a3]',
  },
};

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
  const modalRef = useRef<HTMLDivElement>(null);
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: 'scaleIn 0.2s ease-out' }}
      >
        {/* Header com gradiente */}
        <div className={`${config.headerBg} p-4 relative`}>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
          >
            <FaTimes className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`${config.iconBg} p-3 rounded-xl`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <p className="text-gray-600 text-base leading-relaxed">{message}</p>
        </div>

        {/* Botões */}
        <div className="px-6 pb-6 flex flex-col-reverse sm:flex-row gap-3">
          {showCancel && (
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-5 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-5 py-3 ${config.confirmBg} text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processando...
                </>
              ) : (
                <>
                  <Icon className="w-4 h-4" />
                  {confirmText}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}



