'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import {
  HeroSection,
  LoadingState,
  ErrorState,
  EmptyQueryState,
  NoResultsState,
  ResultsHeader,
  ResultsFilters,
  ResultsList,
  SearchResult,
  SearchResponse
} from './components';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  // Resposta da última busca, guardada junto com o termo a que pertence
  const [response, setResponse] = useState<{ query: string; results: SearchResult[]; total: number; error: string | null } | null>(null);

  // Mantém o campo e o filtro em sincronia com o ?q= atual (voltar/avançar ou nova busca pelo header)
  const [syncedQuery, setSyncedQuery] = useState(query);
  if (syncedQuery !== query) {
    setSyncedQuery(query);
    setSearchTerm(query);
    setActiveFilter(null);
  }

  // Buscar quando o query muda
  useEffect(() => {
    if (query.length < 2) return;

    // Cancela a busca anterior: uma resposta antiga não pode sobrescrever a mais recente
    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((res) => res.json() as Promise<SearchResponse>)
      .then((data) => {
        if (controller.signal.aborted) return;
        setResponse(data.error
          ? { query, results: [], total: 0, error: data.error }
          : { query, results: data.results || [], total: data.total || 0, error: null });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error('Erro na busca:', err);
        setResponse({ query, results: [], total: 0, error: 'Ocorreu um erro ao realizar a pesquisa. Tente novamente.' });
      });

    return () => controller.abort();
  }, [query]);

  // Só vale a resposta do termo atual
  const current = query.length >= 2 && response?.query === query ? response : null;
  const isLoading = query.length >= 2 && !current;
  const results = current?.results ?? [];
  const total = current?.total ?? 0;
  const error = current?.error ?? null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length >= 2) {
      router.push(`/pesquisa?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    router.push('/pesquisa');
  };

  // Filtrar resultados
  const filteredResults = activeFilter 
    ? results.filter(r => r.type === activeFilter)
    : results;

  // Contar por tipo
  const typeCounts = results.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <HeroSection
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSubmit={handleSubmit}
        onClear={handleClear}
      />

      {/* Resultados */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50 min-h-[50vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading */}
          {isLoading && <LoadingState />}

          {/* Erro */}
          {error && !isLoading && <ErrorState error={error} />}

          {/* Sem query */}
          {!query && !isLoading && <EmptyQueryState />}

          {/* Sem resultados */}
          {query && !isLoading && !error && results.length === 0 && (
            <NoResultsState query={query} />
          )}

          {/* Com resultados */}
          {!isLoading && !error && results.length > 0 && (
            <>
              <ResultsHeader query={query} total={total} />
              
              <ResultsFilters
                typeCounts={typeCounts}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                totalResults={results.length}
              />

              <ResultsList
                results={filteredResults}
                activeFilter={activeFilter}
                onClearFilter={() => setActiveFilter(null)}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default function PesquisaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="w-12 h-12 text-[#003f7f] animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
