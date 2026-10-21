'use client';

import React from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaDownload, FaFilePdf, FaFileWord, FaFileExcel, FaFile, FaFolderOpen, FaSearch } from 'react-icons/fa';
import { formatDateBR } from '@/lib/date';
import { StateBlock } from '@/app/(site)/imprensa/noticias/components/LoadStates';
import { btnPrimary, btnSecondary, shadowCard } from '../../_components/ui';
import { Documento } from './types';

interface DocumentsSectionProps {
  documentos: Documento[];
  isLoading: boolean;
  filterCategory: string;
  /** Há busca ou categoria ativa (muda a mensagem da lista vazia) */
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

// Ícone e sigla por tipo de arquivo (tipos do painel: PDF, DOC, XLS e Outro), nas cores da marca
const tiposArquivo: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  PDF: { icon: FaFilePdf, color: 'text-[#003f7f]', label: 'PDF' },
  DOC: { icon: FaFileWord, color: 'text-[#0066cc]', label: 'DOC' },
  XLS: { icon: FaFileExcel, color: 'text-[#00a859]', label: 'XLS' },
  Outro: { icon: FaFile, color: 'text-gray-500', label: 'Arq' },
};

const getFileIcon = (type: string) => tiposArquivo[type?.toUpperCase()] || tiposArquivo.Outro;

/** Grade das colunas no desktop (mesma no cabeçalho e nas linhas, como uma tabela) */
const rowGrid = 'md:grid md:grid-cols-[minmax(0,1fr)_8.5rem_9rem] md:items-center md:gap-6';

const DocumentRow = ({ doc }: { doc: Documento }) => {
  const { icon: Icon, color, label } = getFileIcon(doc.type);
  const date = formatDateBR(doc.date);
  const type = doc.type || 'Arquivo';

  return (
    <li className={`flex flex-col gap-4 p-4 transition-colors hover:bg-[#003f7f]/[0.02] sm:p-5 md:px-6 ${rowGrid}`}>
      <div className="flex min-w-0 items-start gap-4">
        {/* Tipo do arquivo */}
        <span className="flex h-14 w-12 shrink-0 flex-col items-center justify-center gap-1 rounded-xl bg-[#003f7f]/[0.05] ring-1 ring-[#003f7f]/[0.08]">
          <Icon aria-hidden="true" className={`h-5 w-5 ${color}`} />
          <span className="text-[10px] leading-none font-black tracking-wide text-[#003f7f] uppercase">{label}</span>
        </span>
        <div className="min-w-0">
          <h3 className="text-base leading-snug font-bold text-balance text-gray-900 sm:text-lg">{doc.title}</h3>
          {doc.description && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-600">{doc.description}</p>}
          {/* Data no celular (no desktop ela tem coluna própria) */}
          {date && (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-gray-500 md:hidden">
              <FaCalendarAlt aria-hidden="true" className="h-3 w-3" />
              <time dateTime={doc.date}>{date}</time>
            </p>
          )}
        </div>
      </div>

      <p className="hidden items-center gap-2 text-sm text-gray-600 md:flex">
        <FaCalendarAlt aria-hidden="true" className="h-3.5 w-3.5 text-gray-400" />
        {date ? <time dateTime={doc.date}>{date}</time> : '—'}
      </p>

      <a
        href={doc.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#003f7f] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(0,63,127,0.8)] transition-[background-color,translate,scale] duration-200 hover:-translate-y-0.5 hover:bg-[#0052a3] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto sm:self-start md:self-center md:justify-self-end"
      >
        <FaDownload aria-hidden="true" className="h-3.5 w-3.5" />
        Baixar
        <span className="sr-only">
          {' '}
          {doc.title} ({type}, abre em nova aba)
        </span>
      </a>
    </li>
  );
};

/** Lista com cabeçalho de colunas (desktop) */
const DocumentList = ({ docs }: { docs: Documento[] }) => (
  <div className={`overflow-hidden rounded-3xl bg-white ring-1 ring-[#003f7f]/[0.07] ${shadowCard}`}>
    <div aria-hidden="true" className={`hidden border-b border-gray-100 bg-gray-50/80 px-6 py-3 text-xs font-bold tracking-[0.12em] text-gray-500 uppercase ${rowGrid}`}>
      <span>Documento</span>
      <span>Data</span>
      <span className="text-right">Arquivo</span>
    </div>
    <ul className="divide-y divide-gray-100">
      {docs.map((doc) => (
        <DocumentRow key={doc.id} doc={doc} />
      ))}
    </ul>
  </div>
);

const ListSkeleton = () => (
  <div role="status" aria-label="Carregando documentos" className={`overflow-hidden rounded-3xl bg-white ring-1 ring-[#003f7f]/[0.07] ${shadowCard}`}>
    <div className="hidden h-11 border-b border-gray-100 bg-gray-50/80 md:block" />
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} aria-hidden="true" className="flex items-center gap-4 border-b border-gray-100 p-4 last:border-0 sm:p-5 md:px-6">
        <div className="h-14 w-12 shrink-0 animate-pulse rounded-xl bg-gray-200/80 motion-reduce:animate-none" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 w-3/5 animate-pulse rounded-full bg-gray-200/80 motion-reduce:animate-none" />
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-gray-100 motion-reduce:animate-none" />
        </div>
        <div className="hidden h-3.5 w-24 animate-pulse rounded-full bg-gray-100 motion-reduce:animate-none md:block" />
        <div className="hidden h-10 w-28 animate-pulse rounded-full bg-gray-200/80 motion-reduce:animate-none sm:block" />
      </div>
    ))}
  </div>
);

const DocumentsSection = ({ documentos, isLoading, filterCategory, hasActiveFilters, onClearFilters }: DocumentsSectionProps) => {
  // Agrupar documentos por categoria
  const documentosPorCategoria = documentos.reduce((acc, doc) => {
    const cat = doc.category || 'Outros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {} as Record<string, Documento[]>);

  return (
    <section className="bg-linear-to-b from-gray-50 to-white py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {isLoading ? (
            <ListSkeleton />
          ) : documentos.length === 0 ? (
            hasActiveFilters ? (
              <StateBlock icon={FaSearch} title="Nenhum documento encontrado" description="Tente outro termo de busca ou escolha outra categoria.">
                {onClearFilters && (
                  <button type="button" onClick={onClearFilters} className={btnPrimary}>
                    Limpar filtros
                  </button>
                )}
              </StateBlock>
            ) : (
              <StateBlock
                icon={FaFolderOpen}
                title="Nenhum documento publicado ainda"
                description="Os relatórios e demonstrativos da CDL Ipirá aparecerão aqui assim que forem publicados."
              >
                <Link href="/imprensa/contato" className={btnSecondary}>
                  Fale com a CDL
                </Link>
              </StateBlock>
            )
          ) : filterCategory === 'all' ? (
            // Exibir agrupado por categoria
            <div className="space-y-10 sm:space-y-12">
              {Object.entries(documentosPorCategoria).map(([categoria, docs]) => (
                <div key={categoria} className="animate-blur-fade-in">
                  <div className="mb-4 flex flex-wrap items-center gap-3 sm:mb-5">
                    <h2 className="text-xl font-black tracking-tight text-[#003f7f] sm:text-2xl">{categoria}</h2>
                    <span className="rounded-full bg-[#003f7f]/[0.07] px-3 py-1 text-xs font-bold text-[#003f7f]">
                      {docs.length} {docs.length === 1 ? 'documento' : 'documentos'}
                    </span>
                  </div>
                  <DocumentList docs={docs} />
                </div>
              ))}
            </div>
          ) : (
            // Lista simples quando filtrado por categoria
            <div className="animate-blur-fade-in">
              <p className="mb-4 text-sm font-semibold text-gray-600" role="status">
                {documentos.length} {documentos.length === 1 ? 'documento' : 'documentos'} em <span className="text-[#003f7f]">{filterCategory}</span>
              </p>
              <DocumentList docs={documentos} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;
