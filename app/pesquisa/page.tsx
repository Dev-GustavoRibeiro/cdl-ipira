'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaSearch, 
  FaNewspaper, 
  FaCalendarAlt, 
  FaBriefcase, 
  FaVideo, 
  FaFileAlt,
  FaArrowRight,
  FaSpinner,
  FaTimes,
  FaExternalLinkAlt
} from 'react-icons/fa';

interface SearchResult {
  type: string;
  id: string | number;
  title: string;
  description: string;
  url: string;
  image?: string;
  date?: string;
  category?: string;
  relevance: number;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
  error?: string;
}

const typeConfig: Record<string, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  noticia: { 
    label: 'Notícia', 
    icon: FaNewspaper, 
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  evento: { 
    label: 'Evento', 
    icon: FaCalendarAlt, 
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  vaga: { 
    label: 'Vaga', 
    icon: FaBriefcase, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  video: { 
    label: 'Vídeo', 
    icon: FaVideo, 
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  page: { 
    label: 'Página', 
    icon: FaFileAlt, 
    color: 'text-[#003f7f]',
    bgColor: 'bg-blue-50'
  }
};

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] py-12 sm:py-16 md:py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#ffd000]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6">
              Pesquisa
            </h1>
            <p className="text-white/80 text-base sm:text-lg mb-8">
              Encontre notícias, eventos, vagas, vídeos e informações do site CDL Ipirá
            </p>
            
            {/* Campo de pesquisa */}
            <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <FaSearch className="absolute left-5 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="O que você está procurando?"
                  className="w-full pl-14 pr-32 py-4 sm:py-5 rounded-full text-gray-800 bg-white shadow-2xl outline-none text-base sm:text-lg placeholder:text-gray-400 focus:ring-4 focus:ring-[#ffd000]/50 transition-all"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-28 text-gray-400 hover:text-gray-600 transition-colors p-2"
                    aria-label="Limpar"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 bg-[#003f7f] hover:bg-[#002a54] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50 min-h-[50vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <FaSpinner className="w-12 h-12 text-[#003f7f] animate-spin mb-4" />
              <p className="text-gray-600 text-lg">Pesquisando...</p>
            </div>
          )}

          {/* Erro */}
          {error && !isLoading && (
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Sem query */}
          {!query && !isLoading && (
            <div className="max-w-2xl mx-auto text-center py-12">
              <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-2">Digite sua pesquisa</h2>
              <p className="text-gray-500">Use o campo acima para buscar conteúdos no site</p>
            </div>
          )}

          {/* Sem resultados */}
          {query && !isLoading && !error && results.length === 0 && (
            <div className="max-w-2xl mx-auto text-center py-12">
              <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-2">Nenhum resultado encontrado</h2>
              <p className="text-gray-500 mb-6">
                Não encontramos resultados para &quot;{query}&quot;
              </p>
              <p className="text-gray-400 text-sm">
                Tente usar palavras-chave diferentes ou mais gerais
              </p>
            </div>
          )}

          {/* Com resultados */}
          {!isLoading && !error && results.length > 0 && (
            <>
              {/* Header dos resultados */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Resultados para &quot;{query}&quot;
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {total} {total === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                  </p>
                </div>
              </div>

              {/* Filtros */}
              {Object.keys(typeCounts).length > 1 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  <button
                    onClick={() => setActiveFilter(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      !activeFilter 
                        ? 'bg-[#003f7f] text-white shadow-lg' 
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Todos ({results.length})
                  </button>
                  {Object.entries(typeCounts).map(([type, count]) => {
                    const config = typeConfig[type] || typeConfig.page;
                    const Icon = config.icon;
                    return (
                      <button
                        key={type}
                        onClick={() => setActiveFilter(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                          activeFilter === type 
                            ? `${config.bgColor} ${config.color} shadow-lg` 
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {config.label}s ({count})
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Lista de resultados */}
              <div className="space-y-4">
                {filteredResults.map((result) => {
                  const config = typeConfig[result.type] || typeConfig.page;
                  const Icon = config.icon;
                  const isExternal = result.url.startsWith('http');
                  
                  return (
                    <article
                      key={`${result.type}-${result.id}`}
                      className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#003f7f]/30 transition-all duration-300 group"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Imagem (se houver) */}
                        {result.image && (
                          <div className="sm:w-48 md:w-56 lg:w-64 flex-shrink-0">
                            <div className="relative h-40 sm:h-full w-full">
                              <Image
                                src={result.image}
                                alt={result.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* Conteúdo */}
                        <div className="flex-1 p-5 sm:p-6">
                          {/* Badge de tipo */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.color}`}>
                              <Icon className="w-3 h-3" />
                              {config.label}
                            </span>
                            {result.category && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {result.category}
                              </span>
                            )}
                            {result.date && (
                              <span className="text-xs text-gray-400 hidden sm:inline">
                                {formatDate(result.date)}
                              </span>
                            )}
                          </div>
                          
                          {/* Título */}
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-[#003f7f] transition-colors line-clamp-2">
                            {result.title}
                          </h3>
                          
                          {/* Descrição */}
                          <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-4">
                            {result.description}
                          </p>
                          
                          {/* Link */}
                          {isExternal ? (
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-[#003f7f] font-semibold hover:text-[#0066cc] transition-colors text-sm group/link"
                            >
                              Acessar
                              <FaExternalLinkAlt className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                            </a>
                          ) : (
                            <Link
                              href={result.url}
                              className="inline-flex items-center gap-2 text-[#003f7f] font-semibold hover:text-[#0066cc] transition-colors text-sm group/link"
                            >
                              Ver mais
                              <FaArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Mensagem se filtrou e não tem resultados */}
              {activeFilter && filteredResults.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    Nenhum resultado do tipo &quot;{typeConfig[activeFilter]?.label || activeFilter}&quot; encontrado
                  </p>
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="mt-4 text-[#003f7f] font-medium hover:underline"
                  >
                    Ver todos os resultados
                  </button>
                </div>
              )}
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



