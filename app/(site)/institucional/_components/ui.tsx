import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { FaChevronRight, FaHome, FaQuoteLeft, FaRocket, FaUsers } from 'react-icons/fa';
import AnimatedCounter from './AnimatedCounter';

/* Peças visuais compartilhadas pelas páginas institucionais (mesmo padrão da home):
   breadcrumb, hero, cabeçalho de seção, citação, painel de números e faixa de chamada. */

export const shadowCard = 'shadow-[0_20px_50px_-24px_rgba(0,63,127,0.35)]';
export const shadowCardHover = 'hover:shadow-[0_28px_60px_-24px_rgba(0,63,127,0.5)]';

/** Cartão branco padrão com elevação no hover (use em links/cartões interativos). */
export const liftCard = `rounded-3xl bg-white ring-1 ring-[#003f7f]/[0.07] ${shadowCard} transition-[translate,scale,box-shadow] duration-300 ease-out hover:-translate-y-1 ${shadowCardHover} motion-reduce:transition-none motion-reduce:hover:translate-y-0`;

const buttonBase =
  'group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-[translate,scale,box-shadow,background-color,color,border-color] duration-300 hover:-translate-y-0.5 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0';

export const btnPrimary = `${buttonBase} bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)]`;
export const btnSecondary = `${buttonBase} border-2 border-[#003f7f]/15 bg-white py-3 text-[#003f7f] hover:border-[#003f7f]`;
/** Botões para fundos azuis escuros */
export const btnYellow = `${buttonBase} bg-[#ffd000] text-[#003f7f] shadow-[0_14px_30px_-12px_rgba(255,208,0,0.7)] hover:bg-[#ffed4e]`;
export const btnGhostDark = `${buttonBase} border-2 border-white/30 bg-white/10 py-3 text-white hover:border-white hover:bg-white hover:text-[#003f7f]`;

export const brandDivider = 'h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]';

/** Textura de pontos discreta (fica atrás do conteúdo, some nas bordas). */
const dotTexture = (color: string): React.CSSProperties => ({
  backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
  backgroundSize: '22px 22px',
  maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
  WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
});

/* ---------------------------------------------------------------- Breadcrumb */

interface BreadcrumbProps {
  current: string;
  /** Na própria página de História o item "Institucional" não vira link */
  linkSection?: boolean;
}

export function InstitucionalBreadcrumb({ current, linkSection = true }: BreadcrumbProps) {
  const linkClass = 'rounded transition-colors hover:text-[#ffd000]';
  return (
    <div className="bg-[#003f7f] text-white">
      <nav aria-label="Breadcrumb" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex min-w-0 items-center gap-2 py-3.5 text-xs text-white/75 sm:py-3 sm:text-sm">
          <li className="shrink-0">
            <Link href="/" className={`inline-flex items-center gap-1.5 ${linkClass}`}>
              <FaHome aria-hidden="true" className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Início
            </Link>
          </li>
          <li aria-hidden="true" className="shrink-0 text-white/40">
            <FaChevronRight className="h-2 w-2" />
          </li>
          <li className="shrink-0">
            {linkSection ? (
              <Link href="/institucional/historia" className={linkClass}>
                Institucional
              </Link>
            ) : (
              'Institucional'
            )}
          </li>
          <li aria-hidden="true" className="shrink-0 text-white/40">
            <FaChevronRight className="h-2 w-2" />
          </li>
          <li className="min-w-0 truncate font-semibold text-white" aria-current="page">
            {current}
          </li>
        </ol>
      </nav>
    </div>
  );
}

/* ---------------------------------------------------------------- Hero */

interface PageHeroProps {
  icon: IconType;
  eyebrow: string;
  /** Conteúdo do h1 (pode incluir <HeroHighlight>) */
  title: React.ReactNode;
  description: React.ReactNode;
  /** Com imagem o hero fica escuro (foto com véu azul); sem imagem, claro com textura da marca */
  image?: { src: string; alt: string };
  /** CTAs ou painel de números abaixo do texto */
  children?: React.ReactNode;
  /** Espaço extra embaixo para um painel "subir" sobre o hero */
  overlapBottom?: boolean;
}

/** Trecho do título em destaque: amarelo no hero escuro, verde escuro no claro (o #00a859 dá 2,8–3,0:1 no fundo cinza; o #00703c, 5,6:1). */
export function HeroHighlight({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={`block ${dark ? 'text-[#ffd000]' : 'text-[#00703c]'}`}>{children}</span>;
}

export function PageHero({ icon: Icon, eyebrow, title, description, image, children, overlapBottom }: PageHeroProps) {
  if (image) {
    return (
      <section className="relative isolate overflow-hidden bg-[#001a3d]">
        <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="-z-20 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#001a3d]/95 via-[#003f7f]/85 to-[#003f7f]/55" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-[#001a3d]/70 via-transparent to-transparent" />
        <div aria-hidden="true" className="absolute -top-24 right-0 -z-10 h-80 w-80 rounded-full bg-[#ffd000]/15 blur-3xl" />
        <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${overlapBottom ? 'pt-16 pb-28 sm:pt-24 sm:pb-36 lg:pt-28 lg:pb-40' : 'py-16 sm:py-24 lg:py-28'}`}>
          <div className="max-w-3xl animate-blur-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-black tracking-[0.14em] text-[#003f7f] uppercase shadow-[0_12px_30px_-12px_rgba(255,208,0,0.9)]">
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              {eyebrow}
            </span>
            <h1 className="mt-5 text-4xl leading-[1.02] font-black tracking-tight text-balance text-white sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <div aria-hidden="true" className="mt-6 h-1.5 w-24 rounded-full bg-linear-to-r from-white via-[#00d670] to-[#ffd000]" />
            <p className="mt-6 max-w-[56ch] text-base leading-relaxed text-pretty text-white/85 sm:text-lg md:text-xl">{description}</p>
            {children && <div className="mt-9">{children}</div>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden bg-linear-to-b from-white via-gray-50 to-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 mask-b-from-50%">
        <div className="absolute -top-28 -left-20 h-80 w-80 rounded-full bg-[#0066cc]/10 blur-3xl" />
        <div className="absolute -top-10 -right-24 h-72 w-72 rounded-full bg-[#ffd000]/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[#00a859]/[0.07] blur-3xl" />
        <div className="absolute inset-0" style={dotTexture('rgba(0,63,127,0.09)')} />
      </div>
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center animate-blur-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-black tracking-[0.14em] text-[#003f7f] uppercase shadow-[0_12px_30px_-12px_rgba(255,208,0,0.9)]">
            <Icon aria-hidden="true" className="h-3.5 w-3.5" />
            {eyebrow}
          </span>
          <h1 className="mt-5 text-4xl leading-[1.05] font-black tracking-tight text-balance text-[#003f7f] sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <div aria-hidden="true" className={`mx-auto mt-6 ${brandDivider}`} />
          <p className="mx-auto mt-6 max-w-[60ch] text-base leading-relaxed text-pretty text-gray-600 md:text-lg">{description}</p>
        </div>
        {children && <div className="mt-10 sm:mt-12">{children}</div>}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Cabeçalho de seção */

interface SectionHeaderProps {
  icon?: IconType;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'center' | 'left';
  /** dark: para seções com fundo azul */
  tone?: 'light' | 'dark';
  id?: string;
  className?: string;
}

export function SectionHeader({ icon: Icon, eyebrow, title, description, align = 'center', tone = 'light', id, className = 'mb-10 md:mb-14' }: SectionHeaderProps) {
  const center = align === 'center';
  const dark = tone === 'dark';
  return (
    <div className={`${center ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'} ${className}`}>
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.14em] uppercase shadow-sm ${
            dark ? 'bg-[#ffd000] text-[#003f7f]' : 'bg-[#003f7f] text-white'
          }`}
        >
          {Icon && <Icon aria-hidden="true" className={dark ? 'text-[#003f7f]' : 'text-[#ffd000]'} />}
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className={`${eyebrow ? 'mt-4' : ''} text-3xl leading-[1.08] font-black tracking-tight text-balance sm:text-4xl lg:text-5xl ${dark ? 'text-white' : 'text-[#003f7f]'}`}
      >
        {title}
      </h2>
      <div
        aria-hidden="true"
        className={`mt-5 h-1.5 w-24 rounded-full bg-linear-to-r ${dark ? 'from-white via-[#00d670] to-[#ffd000]' : 'from-[#003f7f] via-[#00a859] to-[#ffd000]'} ${center ? 'mx-auto' : ''}`}
      />
      {description && (
        <p className={`mt-5 max-w-[60ch] text-base leading-relaxed text-pretty md:text-lg ${center ? 'mx-auto' : ''} ${dark ? 'text-white/80' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Citação */

/** Destaque tipo "marca-texto" amarelo dentro da citação. */
export function Mark({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-[linear-gradient(transparent_60%,rgba(255,208,0,0.55)_60%)] px-0.5 font-bold text-[#003f7f] [box-decoration-break:clone]">
      {children}
    </span>
  );
}

export function QuoteBlock({ children, cite }: { children: React.ReactNode; cite: string }) {
  return (
    <section className="bg-white py-12 sm:py-14 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <figure className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-linear-to-br from-[#003f7f]/[0.04] via-white to-[#ffd000]/[0.08] px-6 py-10 text-center ring-1 ring-[#003f7f]/[0.07] sm:px-12 sm:py-14">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffd000] text-[#003f7f] shadow-[0_12px_24px_-12px_rgba(255,208,0,0.9)]">
            <FaQuoteLeft aria-hidden="true" className="h-5 w-5" />
          </span>
          <blockquote className="mt-6">
            <p className="mx-auto max-w-[44ch] text-xl leading-relaxed font-medium text-balance text-gray-800 sm:text-2xl md:text-[1.75rem] md:leading-snug">
              {children}
            </p>
          </blockquote>
          <figcaption className="mt-7 flex items-center justify-center gap-3 text-sm font-bold text-[#003f7f] sm:text-base">
            <span aria-hidden="true" className="h-px w-8 bg-[#003f7f]/30" />
            {cite}
            <span aria-hidden="true" className="h-px w-8 bg-[#003f7f]/30" />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Painel de números */

export interface StatItem {
  icon: IconType;
  end: number;
  suffix: string;
  label: string;
}

export function StatsPanel({ items, className = '' }: { items: StatItem[]; className?: string }) {
  return (
    <dl
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-gray-100 ring-1 ring-[#003f7f]/[0.07] lg:grid-cols-4 ${shadowCard} ${className}`}
    >
      {items.map(({ icon: Icon, end, suffix, label }) => (
        <div key={label} className="flex flex-col items-center bg-white px-3 py-7 text-center sm:px-6 sm:py-9">
          {/* dt vem antes no HTML (termo + valor) e aparece embaixo na tela */}
          <dt className="order-last mt-2 text-sm font-semibold text-balance text-gray-600 sm:text-base">{label}</dt>
          <dd className="flex flex-col items-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#003f7f]/[0.07] text-[#003f7f] ring-1 ring-[#003f7f]/10 sm:h-14 sm:w-14">
              <Icon aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <span className="mt-4 text-4xl leading-none font-black tracking-tight text-[#003f7f] tabular-nums sm:text-5xl">
              <AnimatedCounter end={end} suffix={suffix} />
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------------------------------------------------------------- Faixa de chamada (associe-se) */

interface CtaBandProps {
  title: string;
  highlight: string;
  description: string;
  /** Padding da seção (logo após outra seção branca, use menos espaço em cima) */
  className?: string;
}

export function CtaBand({ title, highlight, description, className = 'py-16 sm:py-20 lg:py-24' }: CtaBandProps) {
  return (
    <section className={`bg-white ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-linear-to-br from-[#001a3d] via-[#003f7f] to-[#0052a3] px-6 py-12 text-center shadow-[0_30px_70px_-30px_rgba(0,26,61,0.75)] sm:px-12 sm:py-16 lg:py-20">
          <div aria-hidden="true" className="absolute -top-24 -right-16 -z-10 h-72 w-72 rounded-full bg-[#ffd000]/20 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-28 -left-16 -z-10 h-72 w-72 rounded-full bg-[#00a859]/15 blur-3xl" />
          <div aria-hidden="true" className="absolute inset-0 -z-10" style={dotTexture('rgba(255,255,255,0.12)')} />

          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-[0.14em] text-white uppercase ring-1 ring-white/20">
            <FaRocket aria-hidden="true" className="text-[#ffd000]" />
            Seja um associado
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl leading-[1.08] font-black tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
            {title}
            <span className="block text-[#ffd000]">{highlight}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-pretty text-white/85 sm:text-lg md:text-xl">{description}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <a href="https://app.higestor.com.br/inscricao/empresa/cdl-ipira" target="_blank" rel="noopener noreferrer" className={btnYellow}>
              Associe-se Agora
              <FaRocket aria-hidden="true" className="transition-[translate] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
            <Link href="/institucional/diretoria" className={btnGhostDark}>
              <FaUsers aria-hidden="true" />
              Conheça a Diretoria
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
