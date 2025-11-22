'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  color: string;
  author: string;
}

const categories = ['Todas', 'Economia', 'Comércio', 'Agronegócio', 'Dicas', 'Eventos', 'Serviços'];

export default function NoticiasPage() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/noticias');
        if (response.ok) {
          const data = await response.json();
          // Formatar data para DD/MM/YYYY
          const formattedNews = data.map((item: any) => {
            // Se a data vier como YYYY-MM-DD
            if (item.date && item.date.includes('-')) {
              const [year, month, day] = item.date.split('-');
              return {
                ...item,
                date: `${day}/${month}/${year}`
              };
            }
            return item;
          });
          setAllNews(formattedNews);
        } else {
          console.error('Erro na resposta da API');
          setAllNews([]);
        }
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        setAllNews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = selectedCategory === 'Todas' 
    ? allNews 
    : allNews.filter(news => news.category === selectedCategory);

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-[#003f7f] text-white py-2.5 sm:py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm" aria-label="Breadcrumb">
            <Link 
              href="/" 
              className="hover:text-[#ffd000] transition-colors flex items-center gap-1 group"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-[-2px] transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Início</span>
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-semibold">Notícias</span>
          </nav>
        </div>
      </div>

      {/* Header da Página */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <div className="inline-block bg-[#ffd000] text-[#003f7f] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
              📰 Últimas Notícias
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-3 sm:mb-4 leading-tight">
              Fique por Dentro
            </h1>
            <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4 text-justify">
              Acompanhe as principais notícias sobre economia, comércio, eventos e muito mais
            </p>
          </div>
        </div>
      </section>

      {/* Filtros de Categoria */}
      <section className="py-4 sm:py-6 bg-white border-b border-gray-200 sticky top-[73px] sm:top-[81px] z-40 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-[#003f7f] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-[#003f7f] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de Notícias */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg sm:text-xl">Carregando notícias...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-gray-600 text-lg sm:text-xl">Nenhuma notícia encontrada nesta categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
              {filteredNews.map((item, index) => (
              <article
                key={item.id}
                className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Seção superior colorida */}
                <Link href={`/noticias/${item.id}`} className="block">
                  <div className={`relative h-48 xs:h-52 sm:h-56 md:h-64 bg-linear-to-br ${item.color} overflow-hidden shrink-0`}>
                    {/* Badge categoria */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                      <span className="bg-white/90 backdrop-blur-sm text-[#003f7f] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] xs:text-xs font-black shadow-lg flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#00a859] rounded-full"></span>
                        {item.category}
                      </span>
                    </div>

                    {/* Data flutuante */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                      <div className="bg-white rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-3 shadow-lg">
                        <div className="text-[#003f7f] text-sm xs:text-base sm:text-lg font-bold text-center leading-none">
                          {item.date.split('/')[0]}
                        </div>
                        <div className="text-[#00a859] text-[10px] xs:text-xs font-semibold mt-0.5 sm:mt-1">
                          {item.date.split('/')[1]}/{item.date.split('/')[2]}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Conteúdo */}
                <div className="p-4 sm:p-5 md:p-6 relative flex flex-col grow bg-white">
                  <Link href={`/noticias/${item.id}`}>
                    <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-[#003f7f] transition-colors line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                  </Link>
                  
                  <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed line-clamp-3 grow text-justify">
                    {item.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{item.author}</span>
                    </div>
                    <Link
                      href={`/noticias/${item.id}`}
                      className="group/btn inline-flex items-center gap-1.5 sm:gap-2 text-[#00a859] font-bold hover:gap-3 transition-all duration-300 text-xs sm:text-sm"
                    >
                      <span className="relative">
                        Leia mais
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00a859] group-hover/btn:w-full transition-all duration-300"></span>
                      </span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
              ))}
            </div>
          )}

          {/* Paginação */}
          <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2 sm:gap-3">
            <button className="px-3 sm:px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="px-4 sm:px-5 py-2 rounded-lg bg-[#003f7f] text-white font-bold text-sm sm:text-base shadow-lg">
              1
            </button>
            <button className="px-4 sm:px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all duration-300 font-bold text-sm sm:text-base">
              2
            </button>
            <button className="px-4 sm:px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all duration-300 font-bold text-sm sm:text-base">
              3
            </button>
            <button className="px-3 sm:px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all duration-300 text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

