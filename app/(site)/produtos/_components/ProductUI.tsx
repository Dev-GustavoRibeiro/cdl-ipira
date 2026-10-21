import React from 'react';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { FaArrowRight } from 'react-icons/fa';

/* Peças visuais compartilhadas pelas páginas de produtos (SPC Brasil, Certificado Digital,
   CDL Mídia e Balcão de Empregos): hero, cabeçalho de seção, faixa de CTA, botões e cores de destaque. */

const buttonBase =
  'group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-sm font-extrabold tracking-wide transition-[translate,scale,box-shadow,background-color,color] duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:text-base';

/** Botão principal sobre fundo azul escuro */
export const btnYellow = `${buttonBase} bg-[#ffd000] text-[#003f7f] shadow-[0_14px_30px_-12px_rgba(255,208,0,0.55)] hover:bg-[#ffed4e]`;
/** Botão secundário sobre fundo azul escuro */
export const btnGlass = `${buttonBase} bg-white/10 text-white ring-1 ring-inset ring-white/40 backdrop-blur-sm hover:bg-white hover:text-[#003f7f]`;
/** Botão principal sobre fundo claro */
export const btnBlue = `${buttonBase} bg-[#003f7f] text-white shadow-[0_14px_30px_-12px_rgba(0,63,127,0.7)] hover:bg-[#0052a3]`;

/** Superfície padrão dos cartões: raio grande e sombra azulada */
export const cardSurface = 'rounded-3xl bg-white ring-1 ring-[#003f7f]/[0.06] shadow-[0_20px_50px_-20px_rgba(0,63,127,0.35)]';
/** Elevação no hover para cartões */
export const cardLift =
  'transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(0,63,127,0.5)] motion-reduce:transition-none motion-reduce:hover:translate-y-0';

/** Compensa o header fixo ao navegar por âncoras (#secao) */
export const anchorOffset = 'scroll-mt-[calc(var(--header-height,0px)+1rem)]';

export type Accent = 'blue' | 'green' | 'yellow' | 'sky';

/* tile: ícone em bloco sólido; soft: ícone em fundo suave; bar: faixa de destaque.
   O amarelo sempre leva conteúdo azul (branco no amarelo não tem contraste). */
export const ACCENTS: Record<Accent, { tile: string; soft: string; bar: string }> = {
  blue: { tile: 'bg-[#003f7f] text-white', soft: 'bg-[#003f7f]/10 text-[#003f7f] ring-[#003f7f]/15', bar: 'bg-[#003f7f]' },
  green: { tile: 'bg-[#00a859] text-white', soft: 'bg-[#00a859]/10 text-[#00a859] ring-[#00a859]/15', bar: 'bg-[#00a859]' },
  yellow: { tile: 'bg-[#ffd000] text-[#003f7f]', soft: 'bg-[#ffd000]/25 text-[#003f7f] ring-[#ffd000]/40', bar: 'bg-[#ffd000]' },
  sky: { tile: 'bg-[#0066cc] text-white', soft: 'bg-[#0066cc]/10 text-[#0066cc] ring-[#0066cc]/15', bar: 'bg-[#0066cc]' },
};

const BrandDivider = ({ center }: { center?: boolean }) => (
  <div aria-hidden="true" className={`h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] ${center ? 'mx-auto' : ''}`} />
);

interface SectionHeaderProps {
  eyebrow: string;
  icon?: IconType;
  title: string;
  subtitle?: React.ReactNode;
  id?: string;
  align?: 'center' | 'left';
  className?: string;
}

/** Cabeçalho de seção: selo amarelo, título forte, divisor nas três cores e subtítulo. */
export function SectionHeader({ eyebrow, icon: Icon, title, subtitle, id, align = 'center', className = '' }: SectionHeaderProps) {
  const center = align === 'center';
  return (
    <div className={`max-w-3xl ${center ? 'mx-auto text-center' : ''} ${className}`}>
      <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#003f7f] shadow-sm">
        {Icon && <Icon aria-hidden="true" className="h-3.5 w-3.5" />}
        {eyebrow}
      </span>
      <h2 id={id} className="mt-4 text-3xl font-black leading-[1.08] tracking-tight text-balance text-[#003f7f] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <div className="mt-5">
        <BrandDivider center={center} />
      </div>
      {subtitle && (
        <p className={`mt-5 max-w-[62ch] text-base leading-relaxed text-balance text-gray-600 md:text-lg ${center ? 'mx-auto' : ''}`}>{subtitle}</p>
      )}
    </div>
  );
}

interface ProductHeroProps {
  /** Nome da página no breadcrumb */
  crumb: string;
  eyebrow: string;
  icon: IconType;
  title: string;
  /** Parte final do título destacada em amarelo */
  highlight?: string;
  lead: string;
  description?: string;
  actions: React.ReactNode;
  chips?: { icon: IconType; label: string }[];
  aside?: React.ReactNode;
}

/** Hero das páginas de produto: fundo azul profundo, proposta de valor, CTAs e painel lateral. */
export function ProductHero({ crumb, eyebrow, icon: Icon, title, highlight, lead, description, actions, chips, aside }: ProductHeroProps) {
  return (
    <section aria-labelledby="produto-titulo" className="relative isolate overflow-hidden bg-[#001a3d] text-white">
      {/* Fundo: gradiente da marca, brilhos suaves e textura de pontos */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-br from-[#001a3d] via-[#003f7f] to-[#0052a3]" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-32 -z-10 h-112 w-112 rounded-full bg-[#0066cc]/45 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-32 -z-10 h-96 w-96 rounded-full bg-[#00a859]/20 blur-3xl" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] bg-size-[22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <div className="container mx-auto px-4 pt-5 pb-14 sm:px-6 sm:pt-6 md:pb-20 lg:px-8 lg:pb-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/75 sm:gap-2 sm:text-sm">
            <li>
              <Link href="/" className="rounded transition-colors hover:text-[#ffd000]">
                Início
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/40">/</li>
            <li>Produtos</li>
            <li aria-hidden="true" className="text-white/40">/</li>
            <li aria-current="page" className="font-semibold text-white">
              {crumb}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid items-center gap-10 sm:mt-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
          <div className="animate-blur-fade-in lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#003f7f] shadow-[0_12px_30px_-12px_rgba(255,208,0,0.8)]">
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              {eyebrow}
            </span>
            <h1 id="produto-titulo" className="mt-5 text-4xl font-black leading-[1.02] tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
              {title}
              {/* <em> e não <span>: o globals.css força line-height 1.5 em todo span e abriria um vão entre as linhas */}
              {highlight && <> <em className="text-[#ffd000] not-italic">{highlight}</em></>}
            </h1>
            <div className="mt-6">
              <BrandDivider />
            </div>
            <p className="mt-6 max-w-[40ch] text-lg font-semibold leading-snug text-balance text-white sm:text-xl lg:text-2xl">{lead}</p>
            {description && <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-white/80 sm:text-lg">{description}</p>}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div>

            {chips && chips.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Destaques">
                {chips.map(({ icon: ChipIcon, label }) => (
                  <li key={label} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15 sm:text-sm">
                    <ChipIcon aria-hidden="true" className="h-3.5 w-3.5 text-[#ffd000]" />
                    {label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {aside && <div className="animate-blur-fade-in [animation-delay:120ms] lg:col-span-5">{aside}</div>}
        </div>
      </div>
    </section>
  );
}

interface HeroPanelItem {
  icon: IconType;
  title: string;
  text: string;
  accent: Accent;
  /** Âncora ou rota: a linha vira link */
  href?: string;
}

/** Painel de vidro do hero: lista curta do que o produto oferece (com atalhos para as seções). */
export function HeroPanel({ title, description, items }: { title: string; description?: string; items: HeroPanelItem[] }) {
  return (
    <div className="rounded-3xl bg-white/[0.07] p-5 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/15 backdrop-blur-md sm:p-7">
      <h2 className="text-lg font-black tracking-tight text-balance text-white sm:text-xl">{title}</h2>
      {description && <p className="mt-2 text-sm leading-relaxed text-white/75 sm:text-[15px]">{description}</p>}
      <ul className="mt-5 space-y-2.5">
        {items.map(({ icon: ItemIcon, title: itemTitle, text, accent, href }) => {
          const content = (
            <>
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${ACCENTS[accent].tile}`}>
                <ItemIcon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold leading-snug text-white">{itemTitle}</span>
                <span className="block text-sm leading-snug text-white/70">{text}</span>
              </span>
              {href && (
                <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-white/50 transition-[translate,color] duration-200 group-hover:translate-x-1 group-hover:text-[#ffd000] motion-reduce:transition-none" />
              )}
            </>
          );
          const row = 'flex items-center gap-4 rounded-2xl bg-white/[0.06] p-3 ring-1 ring-white/10';
          return (
            <li key={itemTitle}>
              {href ? (
                <a href={href} className={`group ${row} transition-colors duration-200 hover:bg-white/[0.12]`}>
                  {content}
                </a>
              ) : (
                <div className={row}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface CTABandProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions: React.ReactNode;
  /** Fundo da seção ao redor do cartão (alternância com a seção anterior) */
  className?: string;
}

/** Faixa final de chamada para ação, igual em todas as páginas de produto. */
export function CTABand({ eyebrow = 'Fale com a CDL Ipirá', title, description, actions, className = 'bg-white' }: CTABandProps) {
  return (
    <section aria-labelledby="cta-titulo" className={`py-14 md:py-20 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-[#001a3d] via-[#003f7f] to-[#0052a3] px-6 py-12 text-white shadow-[0_30px_70px_-30px_rgba(0,63,127,0.7)] sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-20 -z-10 h-80 w-80 rounded-full bg-[#0066cc]/50 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-16 -z-10 h-72 w-72 rounded-full bg-[#00a859]/25 blur-3xl" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 bg-linear-to-r from-[#0066cc] via-[#00a859] to-[#ffd000]" />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#ffd000]">{eyebrow}</p>
              <h2 id="cta-titulo" className="mt-3 text-3xl font-black leading-[1.08] tracking-tight text-balance sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-white/80 sm:text-lg">{description}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">{actions}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
