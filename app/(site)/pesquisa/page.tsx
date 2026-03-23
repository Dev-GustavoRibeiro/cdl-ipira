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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Buscar quando o query muda
  useEffect(() => {
    if (query && query.length >= 2) {
      performSearch(query);
    } else {
      setResults([]);
      setTotal(0);
    }
  }, [query]);

  const performSearch = async (term: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      const data: SearchResponse = await response.json();
      
      if (data.error) {
        setError(data.error);
        setResults([]);
        setTotal(0);
      } else {
        setResults(data.results);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Erro na busca:', err);
      setError('Ocorreu um erro ao realizar a pesquisa. Tente novamente.');
      setResults([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

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
