'use client';

import React from 'react';
import { FaArrowRight, FaBriefcase, FaBuilding, FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaTag } from 'react-icons/fa';
import { StateBlock, primaryButton, staggerDelay } from '@/app/(site)/imprensa/noticias/components/LoadStates';
import { cardLift, cardSurface } from '../../_components/ProductUI';

interface Job {
  id: number;
  title: string;
  company: string;
  quantity: number;
  description: string;
  location?: string;
  date?: string;
  category?: string;
}

interface JobsGridProps {
  jobs: Job[];
  isLoading: boolean;
  onJobClick: (job: Job) => void;
  /** Presente quando há busca/categoria ativa: a lista vazia oferece limpar os filtros */
  onResetFilters?: () => void;
}

const chip = 'inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 sm:text-sm';

function JobsSkeleton() {
  return (
    <div role="status" aria-label="Carregando vagas" className="grid grid-cols-1 gap-4 sm:gap-5">
      {[0, 1, 2].map((i) => (
        <div key={i} aria-hidden="true" className={`p-5 sm:p-7 ${cardSurface} animate-pulse motion-reduce:animate-none`}>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-gray-200/80" />
            <div className="flex-1 space-y-2.5 pt-1">
              <div className="h-5 w-3/5 rounded-full bg-gray-200/80" />
              <div className="h-3.5 w-1/3 rounded-full bg-gray-100" />
            </div>
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-gray-100" />
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-3 w-full rounded-full bg-gray-100" />
            <div className="h-3 w-11/12 rounded-full bg-gray-100" />
          </div>
          <div className="mt-5 flex justify-between border-t border-gray-100 pt-4">
            <div className="h-3.5 w-28 rounded-full bg-gray-200/80" />
            <div className="h-3.5 w-20 rounded-full bg-gray-200/80" />
          </div>
        </div>
      ))}
    </div>
  );
}

const JobsGrid = ({ jobs, isLoading, onJobClick, onResetFilters }: JobsGridProps) => {
  if (isLoading) return <JobsSkeleton />;

  if (jobs.length === 0) {
    return onResetFilters ? (
      <StateBlock
        icon={FaSearch}
        title="Nenhuma vaga encontrada"
        description="Nenhuma vaga encontrada com os filtros selecionados. Tente outra palavra ou categoria."
      >
        <button type="button" onClick={onResetFilters} className={primaryButton}>
          Limpar filtros
        </button>
      </StateBlock>
    ) : (
      <StateBlock
        icon={FaBriefcase}
        title="Nenhuma vaga aberta no momento"
        description="Novas oportunidades são publicadas aqui assim que as empresas cadastram suas vagas. Volte em breve."
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:gap-5">
      {jobs.map((job, index) => (
        <li key={job.id} className="animate-scale-in" style={staggerDelay(index)}>
          <article className={`group relative flex h-full flex-col p-5 sm:p-7 ${cardSurface} ${cardLift} has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#003f7f] has-focus-visible:ring-2 has-focus-visible:ring-[#ffd000]`}>
            <div className="flex items-start gap-4">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#003f7f]/10 text-[#003f7f] ring-1 ring-[#003f7f]/15 transition-colors duration-300 group-hover:bg-[#003f7f] group-hover:text-white motion-reduce:transition-none sm:flex">
                <FaBriefcase aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-black leading-snug tracking-tight text-balance text-[#003f7f] sm:text-xl">
                  {/* Botão "esticado": o cartão inteiro abre os detalhes da vaga */}
                  <button
                    type="button"
                    onClick={() => onJobClick(job)}
                    aria-haspopup="dialog"
                    className="text-left after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:shadow-none! focus-visible:outline-none!"
                  >
                    {job.title}
                  </button>
                </h3>
                {job.company && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-600 sm:text-base">
                    <FaBuilding aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">{job.company}</span>
                  </p>
                )}
              </div>
              {job.quantity > 0 && (
                <div className="shrink-0 rounded-2xl bg-[#ffd000]/25 px-3 py-2 text-center ring-1 ring-[#ffd000]/50">
                  <span className="block text-xl leading-none font-black text-[#003f7f] sm:text-2xl">
                    {String(job.quantity).padStart(2, '0')}
                  </span>
                  <span className="mt-1 block text-[11px] font-bold uppercase tracking-wider text-[#003f7f]">
                    {job.quantity === 1 ? 'vaga' : 'vagas'}
                  </span>
                </div>
              )}
            </div>

            {job.description && (
              <p className="mt-4 line-clamp-3 max-w-[65ch] text-sm leading-relaxed text-gray-600 sm:text-base">{job.description}</p>
            )}

            {(job.location || job.category) && (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Detalhes da vaga">
                {job.location && (
                  <li className={chip}>
                    <FaMapMarkerAlt aria-hidden="true" className="h-3 w-3 text-[#00a859]" />
                    {job.location}
                  </li>
                )}
                {job.category && (
                  <li className={chip}>
                    <FaTag aria-hidden="true" className="h-3 w-3 text-[#003f7f]" />
                    {job.category}
                  </li>
                )}
              </ul>
            )}

            {/* Rodapé sempre embaixo: data à esquerda, chamada à direita */}
            <div className="mt-auto pt-5">
              <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 sm:text-sm">
                  {job.date && (
                    <>
                      <FaCalendarAlt aria-hidden="true" className="h-3 w-3 text-gray-400" />
                      Publicada em {job.date}
                    </>
                  )}
                </span>
                <span aria-hidden="true" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#003f7f] transition-[gap] duration-300 group-hover:gap-3 motion-reduce:transition-none sm:text-base">
                  Ver detalhes
                  <FaArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
};

export default JobsGrid;
