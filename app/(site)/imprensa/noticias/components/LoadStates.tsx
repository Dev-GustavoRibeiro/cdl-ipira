import React from 'react';
import type { IconType } from 'react-icons';

/* Estados de carregamento, lista vazia e erro compartilhados pelas páginas internas
   (notícias, eventos, galeria, TV Lojista, revista, campanhas e empresas associadas). */

export const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-full bg-[#003f7f] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#0052a3] active:scale-[0.98] motion-reduce:hover:translate-y-0';

export const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#003f7f] px-6 py-2.5 text-sm font-bold text-[#003f7f] transition-[translate,scale,background-color,color] duration-200 hover:bg-[#003f7f] hover:text-white active:scale-[0.98]';

interface StateBlockProps {
  icon: IconType;
  title: string;
  description?: string;
  /** Botões ou links de ação (ex.: "Tentar novamente") */
  children?: React.ReactNode;
}

/** Bloco compacto para lista vazia ou erro: ícone em círculo, mensagem e uma ação útil. */
export function StateBlock({ icon: Icon, title, description, children }: StateBlockProps) {
  return (
    <div
      role="status"
      className="mx-auto max-w-lg rounded-3xl border border-gray-100 bg-linear-to-b from-white to-gray-50 px-6 py-10 text-center shadow-[0_20px_50px_-24px_rgba(0,63,127,0.35)] sm:px-10 sm:py-12 animate-scale-in"
    >
      <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#003f7f]/10 text-[#003f7f] ring-8 ring-[#003f7f]/5">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="text-xl font-black tracking-[-0.015em] text-[#003f7f] sm:text-2xl">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-600 sm:text-base">{description}</p>}
      {children && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{children}</div>}
    </div>
  );
}

/** Esqueleto de cartões (imagem + textos) no mesmo grid das listas. */
export function CardsSkeleton({ label, count = 6 }: { label: string; count?: number }) {
  return (
    <div role="status" aria-label={label} className="cards-grid gap-5 sm:gap-6 md:gap-8">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_-18px_rgba(0,63,127,0.3)] ring-1 ring-gray-100 animate-pulse motion-reduce:animate-none"
        >
          <div className="h-48 bg-gray-200/80 sm:h-56 md:h-64" />
          <div className="flex flex-col gap-3 p-5 sm:p-6">
            <div className="h-5 w-4/5 rounded-full bg-gray-200/80" />
            <div className="h-5 w-3/5 rounded-full bg-gray-200/80" />
            <div className="mt-2 h-3 w-full rounded-full bg-gray-100" />
            <div className="h-3 w-11/12 rounded-full bg-gray-100" />
            <div className="h-3 w-2/3 rounded-full bg-gray-100" />
            <div className="mt-3 flex justify-between border-t border-gray-100 pt-4">
              <div className="h-3.5 w-24 rounded-full bg-gray-200/80" />
              <div className="h-3.5 w-16 rounded-full bg-gray-200/80" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Rolagem suave, exceto quando o sistema pede movimento reduzido (só no navegador). */
export const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

/** Atraso de entrada dos cartões: escalonado, mas limitado para listas longas. */
export const staggerDelay = (index: number) => ({ animationDelay: `${Math.min(index, 8) * 60}ms` });

/** Classes do cartão padrão: raio, sombra azulada e elevação no hover. */
export const cardClass =
  'group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100 shadow-[0_10px_30px_-18px_rgba(0,63,127,0.35)] transition-[translate,scale,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-20px_rgba(0,63,127,0.45)] motion-reduce:hover:translate-y-0 animate-scale-in';
