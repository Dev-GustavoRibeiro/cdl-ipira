import React from 'react';
import { cx } from './styles';

export type StatusVariant = 'success' | 'warning' | 'neutral' | 'danger' | 'info';

// Textos escuros sobre fundos claros: todos passam AA (4.5:1)
const VARIANTS: Record<StatusVariant, { badge: string; dot: string }> = {
  success: { badge: 'bg-[#00a859]/10 text-[#00703c] ring-[#00a859]/25', dot: 'bg-[#00a859]' },
  warning: { badge: 'bg-[#ffd000]/25 text-[#003f7f] ring-[#e6bb00]/50', dot: 'bg-[#e6bb00]' },
  neutral: { badge: 'bg-gray-100 text-gray-700 ring-gray-300/70', dot: 'bg-gray-400' },
  danger: { badge: 'bg-red-50 text-red-700 ring-red-600/20', dot: 'bg-red-500' },
  info: { badge: 'bg-[#0066cc]/10 text-[#0052a3] ring-[#0066cc]/20', dot: 'bg-[#0066cc]' },
};

interface StatusBadgeProps {
  variant?: StatusVariant;
  /** Bolinha colorida antes do texto (padrão: true) */
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Selo de status: `<StatusBadge variant="success">Publicada</StatusBadge>` */
export function StatusBadge({ variant = 'neutral', dot = true, className, children }: StatusBadgeProps) {
  const v = VARIANTS[variant];
  return (
    <span
      className={cx(
        'inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ring-1 ring-inset',
        v.badge,
        className
      )}
    >
      {dot && <span aria-hidden="true" className={cx('h-1.5 w-1.5 shrink-0 rounded-full', v.dot)} />}
      {children}
    </span>
  );
}
