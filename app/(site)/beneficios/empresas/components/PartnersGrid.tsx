'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaStore, FaGlobe, FaExternalLinkAlt } from 'react-icons/fa';
import { isOptimizableImage } from '@/lib/images';
import { StateBlock, primaryButton } from '@/app/(site)/imprensa/noticias/components/LoadStates';
import { Parceiro } from './types';

// Só http(s): evita javascript:/data: vindos do cadastro; aceita "www.loja.com" sem protocolo
function getSafeWebsite(website?: string | null): string | null {
  const value = website?.trim();
  if (!value) return null;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

interface PartnersGridProps {
  parceiros: Parceiro[];
  isLoading: boolean;
  searchTerm: string;
  totalCount: number;
  /** Limpa a busca quando nada é encontrado */
  onClearSearch?: () => void;
}

const GRID = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5';

const PartnersGrid = ({ parceiros, isLoading, searchTerm, totalCount, onClearSearch }: PartnersGridProps) => {
  const isSearching = searchTerm.trim() !== '';
  const sectionRef = useRef<HTMLElement>(null);

  // Busca digitada com a lista já rolada: volta ao topo dos resultados
  // (senão a lista encolhe e na tela sobram só o rodapé e o CTA)
  useEffect(() => {
    const section = sectionRef.current;
    if (section && section.getBoundingClientRect().top < 0) section.scrollIntoView({ block: 'start' });
  }, [searchTerm]);

  return (
    <section
      ref={sectionRef}
      className="pt-6 sm:pt-10 pb-12 md:pb-16 bg-linear-to-b from-white to-gray-50 scroll-mt-[calc(var(--header-height,0px)+4.5rem)] sm:scroll-mt-[calc(var(--header-height,0px)+5.5rem)]"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contagem (anunciada a cada busca) */}
        <div className="flex items-center justify-between gap-3 mb-5 sm:mb-8 min-h-7" aria-live="polite">
          {!isLoading && totalCount > 0 && (
            <p className="text-sm sm:text-base text-gray-600">
              {isSearching ? (
                <>
                  <strong className="font-black text-[#003f7f]">{parceiros.length}</strong>{' '}
                  {parceiros.length === 1 ? 'empresa encontrada' : 'empresas encontradas'} de {totalCount}
                </>
              ) : (
                <>
                  <strong className="font-black text-[#003f7f]">{totalCount}</strong> empresas associadas
                </>
              )}
            </p>
          )}
        </div>

        {isLoading ? (
          <ul role="status" aria-label="Carregando associados" className={GRID}>
            {Array.from({ length: 12 }, (_, index) => (
              <li
                key={index}
                aria-hidden="true"
                className="rounded-2xl bg-white p-2 sm:p-3 pb-4 sm:pb-4 ring-1 ring-gray-100 animate-pulse motion-reduce:animate-none"
              >
                <div className="aspect-video rounded-xl bg-gray-200/80" />
                <div className="mx-auto mt-3 h-3.5 w-3/4 rounded-full bg-gray-200/80" />
              </li>
            ))}
          </ul>
        ) : parceiros.length === 0 ? (
          <StateBlock
            icon={FaStore}
            title={isSearching ? 'Nenhum associado encontrado' : 'Nenhum associado cadastrado ainda'}
            description={isSearching ? 'Confira a grafia ou busque só por parte do nome da empresa.' : 'Em breve as empresas associadas aparecerão aqui.'}
          >
            {isSearching && onClearSearch && (
              <button type="button" onClick={onClearSearch} className={primaryButton}>
                Ver todos os associados
              </button>
            )}
          </StateBlock>
        ) : (
          <ul className={GRID}>
            {parceiros.map((parceiro) => {
              const website = getSafeWebsite(parceiro.website);
              return (
                <li
                  key={parceiro.id}
                  className="group flex flex-col rounded-2xl bg-white p-2 sm:p-3 pb-4 sm:pb-4 ring-1 ring-gray-200/70 shadow-[0_8px_24px_-18px_rgba(0,63,127,0.4)] transition-[transform,translate,scale,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(0,63,127,0.45)] hover:ring-[#003f7f]/25 motion-reduce:hover:translate-y-0"
                >
                  {/* As artes são 16:9 com fundo branco: a caixa segue a proporção e o logo aparece inteiro (contain) */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                    {parceiro.logo ? (
                      <Image
                        src={parceiro.logo}
                        alt={`Logo ${parceiro.name}`}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                        unoptimized={!isOptimizableImage(parceiro.logo)}
                        className="object-contain"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#003f7f]/5">
                        <FaStore className="w-8 h-8 text-[#003f7f]/30" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  <h3 className="mt-2 px-1 text-center text-xs sm:text-sm font-bold leading-snug text-[#003f7f] line-clamp-2">
                    {parceiro.name}
                  </h3>

                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visitar site de ${parceiro.name} (abre em nova aba)`}
                      className="mt-2 mx-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#00a859] hover:text-[#003f7f] transition-colors"
                    >
                      <FaGlobe className="w-3 h-3" aria-hidden="true" />
                      Visitar site
                      <FaExternalLinkAlt className="w-2.5 h-2.5" aria-hidden="true" />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Estatísticas */}
        {!isLoading && totalCount > 0 && (
          <div className="mt-10 sm:mt-14 rounded-3xl bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] px-4 py-6 sm:p-10 shadow-[0_24px_60px_-28px_rgba(0,63,127,0.6)]">
            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
              <div>
                <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white tabular-nums">{totalCount}</p>
                <p className="mt-1 text-xs sm:text-base font-semibold text-white/80">Empresas Associadas</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#00d670]">30+</p>
                <p className="mt-1 text-xs sm:text-base font-semibold text-white/80">Anos de Parceria</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#ffd000]">100%</p>
                <p className="mt-1 text-xs sm:text-base font-semibold text-white/80">Comprometidos com o Comércio</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PartnersGrid;
