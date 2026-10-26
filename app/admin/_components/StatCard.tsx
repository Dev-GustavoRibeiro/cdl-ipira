import React from 'react';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { FaArrowRight, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { cx, focusRing } from './styles';

export type StatTone = 'navy' | 'blue' | 'green' | 'yellow' | 'gray';

const TONES: Record<StatTone, string> = {
  navy: 'bg-[#003f7f]/[0.08] text-[#003f7f] ring-[#003f7f]/10',
  blue: 'bg-[#0066cc]/10 text-[#0066cc] ring-[#0066cc]/10',
  green: 'bg-[#00a859]/10 text-[#00a859] ring-[#00a859]/15',
  yellow: 'bg-[#ffd000]/30 text-[#003f7f] ring-[#ffd000]/40',
  gray: 'bg-gray-100 text-gray-600 ring-gray-200',
};

const TREND = {
  up: { icon: FaArrowUp, className: 'text-[#00703c]' },
  down: { icon: FaArrowDown, className: 'text-red-700' },
  flat: { icon: FaMinus, className: 'text-gray-500' },
};

interface StatCardProps {
  icon: IconType;
  label: string;
  /** null = sem dado (mostra "—") */
  value: number | string | null;
  tone?: StatTone;
  /** Linha de apoio abaixo do rótulo (ex.: "3 publicadas este mês") */
  hint?: React.ReactNode;
  trend?: { label: string; direction: 'up' | 'down' | 'flat' };
  /** Torna o cartão inteiro um link */
  href?: string;
  /** Destaca o cartão (ex.: pendências que pedem atenção) */
  highlight?: boolean;
  loading?: boolean;
  /** No celular vira uma linha (ícone, número/rótulo e seta lado a lado); empilha a partir de sm */
  compact?: boolean;
  className?: string;
}

/** Cartão de métrica: ícone, número grande (tabular-nums), rótulo, tendência/dica e link opcional. */
export function StatCard({
  icon: Icon,
  label,
  value,
  tone = 'navy',
  hint,
  trend,
  href,
  highlight = false,
  loading = false,
  compact = false,
  className,
}: StatCardProps) {
  const TrendIcon = trend ? TREND[trend.direction].icon : null;
  const display = value === null ? '—' : typeof value === 'number' ? value.toLocaleString('pt-BR') : value;

  const body = (
    <>
      {/* compact: no celular esta linha "some" (contents) e ícone/seta viram itens da linha do cartão */}
      <div className={cx('flex items-start justify-between gap-3', compact && 'max-sm:contents')}>
        <span className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-11 sm:w-11', TONES[tone])}>
          <Icon aria-hidden="true" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        </span>
        {href && (
          <FaArrowRight
            aria-hidden="true"
            className={cx(
              'mt-1 h-3.5 w-3.5 shrink-0 text-gray-300 transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:text-[#003f7f] motion-reduce:transition-none',
              compact && 'max-sm:order-last max-sm:mt-0'
            )}
          />
        )}
      </div>
      <div className={cx('mt-4 min-w-0', compact && 'max-sm:mt-0 max-sm:flex-1')}>
        {loading ? (
          <span aria-hidden="true" className="block h-8 w-16 animate-pulse rounded-lg bg-gray-100" />
        ) : (
          <p className="text-2xl leading-8 font-black tracking-tight text-gray-900 tabular-nums sm:text-[28px]">{display}</p>
        )}
        <p className="mt-0.5 line-clamp-2 text-sm font-medium text-gray-600">{label}</p>
        {(trend || hint) && !loading && (
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
            {trend && TrendIcon && (
              <span className={cx('inline-flex items-center gap-1 font-semibold', TREND[trend.direction].className)}>
                <TrendIcon aria-hidden="true" className="h-2.5 w-2.5" />
                {trend.label}
              </span>
            )}
            {hint}
          </p>
        )}
      </div>
    </>
  );

  const classes = cx(
    'group relative flex min-w-0 flex-col rounded-2xl bg-white p-4 ring-1 sm:p-5',
    compact && 'max-sm:flex-row max-sm:items-center max-sm:gap-4',
    highlight ? 'ring-[#e6bb00] shadow-[0_0_0_3px_rgba(255,208,0,0.25)]' : 'ring-gray-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)]',
    className
  );

  if (!href) {
    return (
      <div className={classes} aria-busy={loading || undefined}>
        {body}
      </div>
    );
  }

  return (
    <Link
      href={href}
      aria-busy={loading || undefined}
      className={cx(
        classes,
        'transition-[translate,scale,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(0,63,127,0.5)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        focusRing
      )}
    >
      {body}
    </Link>
  );
}
