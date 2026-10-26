import React from 'react';
import type { IconType } from 'react-icons';
import { FaInbox } from 'react-icons/fa';
import { cx } from './styles';

interface EmptyStateProps {
  icon?: IconType;
  title: string;
  description?: React.ReactNode;
  /** Ex.: <Button icon={FaPlus}>Nova notícia</Button> */
  action?: React.ReactNode;
  className?: string;
}

/** Estado vazio desenhado (lista sem itens, busca sem resultado). */
export function EmptyState({ icon: Icon = FaInbox, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cx('flex flex-col items-center px-6 py-12 text-center sm:py-16', className)}>
      <span className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#003f7f]/[0.06] text-[#003f7f] ring-1 ring-[#003f7f]/10">
        <Icon aria-hidden="true" className="h-6 w-6" />
        <span aria-hidden="true" className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-[#ffd000] ring-4 ring-white" />
      </span>
      <h3 className="text-base font-bold text-gray-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
