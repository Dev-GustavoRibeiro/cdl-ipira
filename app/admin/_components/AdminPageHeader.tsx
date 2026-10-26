import React from 'react';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';
import { cx, focusRing } from './styles';

export interface BreadcrumbItem {
  label: string;
  /** Sem href = item atual */
  href?: string;
}

interface AdminPageHeaderProps {
  title: string;
  /** Linha pequena acima do título (ex.: data de hoje) */
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  /** Trilha de navegação para páginas internas (ex.: Conteúdo do site › Hero Carousel) */
  breadcrumb?: BreadcrumbItem[];
  /** Ação principal (ex.: <Button icon={FaPlus}>Nova notícia</Button>) */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Cabeçalho padrão das páginas do painel: trilha opcional, título (h1), descrição e ações.
 * No celular as ações descem para baixo do título e ocupam a largura toda.
 */
export function AdminPageHeader({ title, eyebrow, description, breadcrumb, actions, className }: AdminPageHeaderProps) {
  return (
    <header className={cx('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Trilha de navegação" className="mb-2">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
              {breadcrumb.map((item, i) => (
                <li key={`${item.label}-${i}`} className="flex items-center gap-1">
                  {i > 0 && <FaChevronRight aria-hidden="true" className="h-2.5 w-2.5 text-gray-400" />}
                  {item.href ? (
                    <Link href={item.href} className={cx('rounded font-medium hover:text-[#003f7f]', focusRing)}>
                      {item.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-medium text-gray-700">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">{eyebrow}</p>}
        <h1 className="text-2xl font-black tracking-tight text-balance text-[#003f7f] sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-pretty text-gray-600 sm:text-base">{description}</p>}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap gap-2 *:max-sm:flex-1">{actions}</div>
      )}
    </header>
  );
}
