import React from 'react';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { FaChevronDown, FaChevronRight, FaHome, FaListOl, FaRegCalendarCheck } from 'react-icons/fa';
import { PageHero, shadowCard } from '../../institucional/_components/ui';

/* Estrutura comum da Política de Privacidade e dos Termos de Uso: cabeçalho institucional, sumário com âncoras
   (fixo ao lado no desktop, recolhível no celular), seções numeradas com linha de até ~70 caracteres e impressão limpa. */

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalDocumentProps {
  /** Nome curto da página (breadcrumb) */
  current: string;
  icon: IconType;
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  /** Data por extenso e em ISO (para o <time>) */
  updated: { label: string; iso: string };
  sections: LegalSection[];
}

// Tipografia do texto corrido (parágrafos, listas, links e destaques), aplicada a partir do contêiner de cada seção
const PROSE =
  'text-base leading-relaxed text-gray-700 sm:text-[1.0625rem] [&_a]:font-semibold [&_a]:text-[#003f7f] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-[#0066cc] [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-900 [&_li]:mt-2 [&_li]:pl-1 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li::marker]:text-[#00a859]';

// O cabeçalho do site é fixo: âncoras e sumário param logo abaixo dele
const BELOW_HEADER = 'scroll-mt-[calc(var(--header-height,5rem)+1.5rem)]';

/** Tabela de dados. No celular cada linha vira um bloco com o nome da coluna acima do valor (sem rolagem lateral). */
export function LegalTable({ caption, head, rows }: { caption: string; head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-gray-200">
      <table className="w-full border-collapse text-left text-sm leading-relaxed">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-[#003f7f]/[0.04] text-xs font-bold tracking-wide text-[#003f7f] uppercase max-sm:sr-only">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 align-top">
          {rows.map((cells, i) => (
            <tr key={i} className="max-sm:block max-sm:px-4 max-sm:py-3.5">
              {cells.map((cell, j) =>
                j === 0 ? (
                  <th key={j} scope="row" className="font-semibold break-words text-gray-900 max-sm:block sm:px-4 sm:py-3">
                    {cell}
                  </th>
                ) : (
                  <td
                    key={j}
                    data-label={head[j]}
                    className="text-gray-600 max-sm:mt-2 max-sm:block max-sm:before:block max-sm:before:text-[11px] max-sm:before:font-bold max-sm:before:tracking-wide max-sm:before:text-[#003f7f] max-sm:before:uppercase max-sm:before:content-[attr(data-label)] sm:px-4 sm:py-3"
                  >
                    {cell}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Toc({ sections }: { sections: LegalSection[] }) {
  return (
    <ol className="space-y-0.5 text-sm">
      {sections.map(({ id, title }, i) => (
        <li key={id}>
          <a
            href={`#${id}`}
            className="flex min-h-10 items-baseline gap-2.5 rounded-xl px-3 py-2 text-gray-600 transition-colors hover:bg-[#003f7f]/[0.05] hover:text-[#003f7f]"
          >
            {/* Verde escuro da marca: o #00a859 em texto pequeno fica abaixo de 4.5:1 sobre o branco */}
            <span className="w-5 shrink-0 text-right font-bold text-[#00703c] tabular-nums">{i + 1}.</span>
            <span>{title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function LegalDocument({ current, icon, eyebrow, title, description, updated, sections }: LegalDocumentProps) {
  return (
    <>
      {/* Impressão limpa: só o documento. Cabeçalho, rodapé, barra inferior e avisos flutuantes (portais no body) ficam fora. */}
      <style>{'@media print { body > :not(main) { display: none !important; } }'}</style>

      <div className="bg-[#003f7f] text-white print:hidden">
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex min-w-0 items-center gap-2 py-3.5 text-xs text-white/75 sm:py-3 sm:text-sm">
            <li className="shrink-0">
              <Link href="/" className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-[#ffd000]">
                <FaHome aria-hidden="true" className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Início
              </Link>
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

      <PageHero icon={icon} eyebrow={eyebrow} title={title} description={description}>
        <p className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-[#003f7f]/10">
            <FaRegCalendarCheck aria-hidden="true" className="h-3.5 w-3.5 text-[#00a859]" />
            <span>
              Última atualização: <time dateTime={updated.iso}>{updated.label}</time>
            </span>
          </span>
        </p>
      </PageHero>

      <div className="bg-white pt-4 pb-20 sm:pb-24 lg:pt-8 lg:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
            <aside className="print:hidden">
              {/* Celular: sumário recolhível no topo */}
              <details className={`group rounded-2xl bg-white ring-1 ring-[#003f7f]/[0.08] lg:hidden ${shadowCard}`}>
                <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 font-bold text-[#003f7f] [&::-webkit-details-marker]:hidden">
                  <FaListOl aria-hidden="true" className="h-4 w-4 text-[#00a859]" />
                  Sumário
                  <span className="ml-auto text-xs font-semibold text-gray-500">{sections.length} seções</span>
                  <FaChevronDown aria-hidden="true" className="h-3 w-3 text-gray-500 transition-[rotate] duration-200 group-open:rotate-180 motion-reduce:transition-none" />
                </summary>
                <nav aria-label="Sumário" className="border-t border-gray-100 p-2">
                  <Toc sections={sections} />
                </nav>
              </details>

              {/* Desktop: fixo ao lado enquanto o texto rola */}
              <nav
                aria-label="Sumário"
                className="sticky top-[calc(var(--header-height,5rem)+1.5rem)] hidden max-h-[calc(100dvh-var(--header-height,5rem)-3rem)] overflow-y-auto overscroll-contain lg:block"
              >
                <p className="mb-2 flex items-center gap-2 px-3 text-xs font-bold tracking-[0.14em] text-[#003f7f] uppercase">
                  <FaListOl aria-hidden="true" className="h-3 w-3 text-[#00a859]" />
                  Nesta página
                </p>
                <Toc sections={sections} />
              </nav>
            </aside>

            <article className="max-w-[70ch] min-w-0 space-y-10">
              {sections.map(({ id, title: sectionTitle, content }, i) => (
                <section
                  key={id}
                  id={id}
                  aria-labelledby={`${id}-titulo`}
                  className={`${BELOW_HEADER} border-t border-gray-100 pt-10 first:border-0 first:pt-0`}
                >
                  <h2 id={`${id}-titulo`} className="flex items-baseline gap-3 text-2xl leading-tight font-black tracking-tight text-balance text-[#003f7f] sm:text-[1.75rem] print:break-after-avoid">
                    <span className="shrink-0 text-[#00a859] tabular-nums">{i + 1}.</span>
                    {sectionTitle}
                  </h2>
                  <div className={PROSE}>{content}</div>
                </section>
              ))}
            </article>
          </div>
        </div>
      </div>
    </>
  );
}
