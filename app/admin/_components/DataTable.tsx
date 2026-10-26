import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { EmptyState } from './EmptyState';
import { cx, focusRing } from './styles';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  /** Classes extras da célula na tabela (ex.: 'w-40', 'whitespace-nowrap') */
  className?: string;
  /** Título do cartão no celular (padrão: a primeira coluna) */
  primary?: boolean;
  /** Não mostra no cartão do celular */
  hideOnMobile?: boolean;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Total de itens (mostra "1–20 de 132") */
  total?: number;
  pageSize?: number;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  /** Legenda da tabela para leitores de tela (ex.: "Lista de notícias") */
  caption: string;
  /** Botões por linha (use IconButton com label) */
  rowActions?: (row: T) => React.ReactNode;
  loading?: boolean;
  /** Linhas-esqueleto durante o carregamento (padrão 5) */
  skeletonRows?: number;
  /** Conteúdo quando não há linhas (padrão: EmptyState genérico) */
  empty?: React.ReactNode;
  pagination?: PaginationProps;
  className?: string;
}

const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' };

/**
 * Tabela responsiva: tabela a partir de md, cartões empilhados no celular.
 * Atenção: as células são renderizadas duas vezes (tabela e cartão, uma delas oculta por CSS);
 * evite ids fixos dentro de `cell`.
 *
 * ```tsx
 * <DataTable
 *   caption="Lista de notícias"
 *   rows={news}
 *   getRowId={(n) => n.id}
 *   loading={isLoading}
 *   columns={[
 *     { key: 'title', header: 'Título', cell: (n) => n.title, primary: true },
 *     { key: 'status', header: 'Status', cell: (n) => <StatusBadge variant="success">Publicada</StatusBadge> },
 *   ]}
 *   rowActions={(n) => <IconButton icon={FaEdit} label={`Editar ${n.title}`} onClick={() => edit(n)} />}
 *   empty={<EmptyState title="Nenhuma notícia" description="Crie a primeira notícia." />}
 * />
 * ```
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  caption,
  rowActions,
  loading = false,
  skeletonRows = 5,
  empty,
  pagination,
  className,
}: DataTableProps<T>) {
  const primary = columns.find((c) => c.primary) ?? columns[0];
  const secondary = columns.filter((c) => c !== primary && !c.hideOnMobile);
  const isEmpty = !loading && rows.length === 0;
  const skeletons = Array.from({ length: skeletonRows }, (_, i) => i);

  return (
    <div className={cx('min-w-0', className)} aria-busy={loading || undefined}>
      {loading && <span className="sr-only" role="status">Carregando…</span>}

      {isEmpty ? (
        empty ?? <EmptyState title="Nada por aqui ainda" description="Nenhum item encontrado." />
      ) : (
        <>
          {/* Desktop/tablet: tabela */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{caption}</caption>
              <thead className="border-b border-gray-200 bg-gray-50/80">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className={cx('px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase first:pl-6', ALIGN[col.align ?? 'left'])}
                    >
                      {col.header}
                    </th>
                  ))}
                  {rowActions && (
                    <th scope="col" className="px-4 py-3 pr-6 text-right text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Ações
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading
                  ? skeletons.map((i) => (
                      <tr key={i} aria-hidden="true">
                        {columns.map((col, c) => (
                          <td key={col.key} className="px-4 py-4 first:pl-6">
                            <span className={cx('block h-4 animate-pulse rounded bg-gray-100', c === 0 ? 'w-3/4' : 'w-1/2')} />
                          </td>
                        ))}
                        {rowActions && (
                          <td className="px-4 py-4 pr-6">
                            <span className="ml-auto block h-8 w-20 animate-pulse rounded-lg bg-gray-100" />
                          </td>
                        )}
                      </tr>
                    ))
                  : rows.map((row) => (
                      <tr key={getRowId(row)} className="transition-colors hover:bg-[#003f7f]/[0.025]">
                        {columns.map((col) => (
                          <td key={col.key} className={cx('px-4 py-3.5 align-middle text-gray-700 first:pl-6', ALIGN[col.align ?? 'left'], col.className)}>
                            {col.cell(row)}
                          </td>
                        ))}
                        {rowActions && (
                          <td className="px-4 py-2 pr-6 align-middle">
                            <div className="flex items-center justify-end gap-1">{rowActions(row)}</div>
                          </td>
                        )}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Celular: cartões empilhados */}
          <ul className="divide-y divide-gray-100 md:hidden" aria-label={caption}>
            {loading
              ? skeletons.map((i) => (
                  <li key={i} aria-hidden="true" className="space-y-3 px-4 py-4">
                    <span className="block h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                    <span className="block h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                  </li>
                ))
              : rows.map((row) => (
                  <li key={getRowId(row)} className="px-4 py-4">
                    <div className="min-w-0 font-semibold text-gray-900">{primary.cell(row)}</div>
                    {secondary.length > 0 && (
                      <dl className="mt-3 space-y-2 text-sm">
                        {secondary.map((col) => (
                          <div key={col.key} className="flex min-w-0 items-start justify-between gap-4">
                            <dt className="shrink-0 text-gray-500">{col.header}</dt>
                            <dd className="min-w-0 text-right text-gray-700">{col.cell(row)}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {rowActions && <div className="mt-3 flex flex-wrap justify-end gap-1 border-t border-gray-100 pt-2">{rowActions(row)}</div>}
                  </li>
                ))}
          </ul>
        </>
      )}

      {pagination && !isEmpty && pagination.totalPages > 1 && <Pagination {...pagination} />}
    </div>
  );
}

/** Paginação simples (anterior/próxima + contagem). Também usada sozinha. */
export function Pagination({ page, totalPages, onPageChange, total, pageSize, className }: PaginationProps) {
  const from = total !== undefined && pageSize ? (page - 1) * pageSize + 1 : null;
  const to = total !== undefined && pageSize ? Math.min(page * pageSize, total) : null;
  const navButton = cx(
    'inline-flex size-11 items-center justify-center rounded-xl text-gray-600 ring-1 ring-inset ring-gray-300 bg-white pointer-fine:size-9',
    'transition-colors hover:text-[#003f7f] hover:ring-[#003f7f]/40 disabled:pointer-events-none disabled:opacity-40',
    focusRing
  );

  return (
    <nav aria-label="Paginação" className={cx('flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 sm:px-6', className)}>
      <p className="text-sm text-gray-500 tabular-nums">
        {from !== null && to !== null ? (
          <>
            <span className="font-semibold text-gray-700">
              {from}–{to}
            </span>{' '}
            de {total!.toLocaleString('pt-BR')}
          </>
        ) : (
          <>
            Página <span className="font-semibold text-gray-700">{page}</span> de {totalPages}
          </>
        )}
      </p>
      <div className="flex items-center gap-2">
        <button type="button" className={navButton} onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Página anterior">
          <FaChevronLeft aria-hidden="true" className="h-3 w-3" />
        </button>
        <button type="button" className={navButton} onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Próxima página">
          <FaChevronRight aria-hidden="true" className="h-3 w-3" />
        </button>
      </div>
    </nav>
  );
}
