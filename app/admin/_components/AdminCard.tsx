'use client';

import React from 'react';
import { cardSurface, cx } from './styles';

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Remove o padding interno (tabelas, listas que vão até a borda) */
  flush?: boolean;
}

/** Cartão branco básico do painel. */
export function AdminCard({ flush = false, className, ...props }: AdminCardProps) {
  return <div className={cx(cardSurface, !flush && 'p-4 sm:p-6', className)} {...props} />;
}

interface AdminSectionProps {
  title: string;
  description?: React.ReactNode;
  /** Botões/links à direita do título */
  actions?: React.ReactNode;
  /** Corpo sem padding (tabelas e listas) */
  flush?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Cartão com cabeçalho (título h2, descrição e ações) e corpo. */
export function AdminSection({ title, description, actions, flush = false, className, children }: AdminSectionProps) {
  const titleId = React.useId();
  return (
    <section aria-labelledby={titleId} className={cx(cardSurface, 'min-w-0', className)}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 border-b border-gray-100 px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 basis-36">
          <h2 id={titleId} className="text-base font-bold text-gray-900">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <div className={cx(!flush && 'p-4 sm:p-6')}>{children}</div>
    </section>
  );
}
