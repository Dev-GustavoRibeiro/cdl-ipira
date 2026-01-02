'use client';

import React from 'react';
import Image from 'next/image';
import { NewsItem } from './types';

interface NewsGridProps {
  news: NewsItem[];
  isLoading: boolean;
  onOpenModal: (item: NewsItem) => void;
}

const NewsGrid = ({ news, isLoading, onOpenModal }: NewsGridProps) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg sm:text-xl">Carregando notícias...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-600 text-lg sm:text-xl">Nenhuma notícia encontrada nesta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {news.map((item, index) => (
            <article
              key={item.id}
              className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Seção superior colorida */}
              <div 
                onClick={() => onOpenModal(item)}
                className={`relative h-48 xs:h-52 sm:h-56 md:h-64 bg-linear-to-br ${item.color || 'from-blue-600 to-blue-800'} overflow-hidden shrink-0 cursor-pointer`}
              >
                 {item.image && (
                    <>
                      <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    </>
                 )}

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

              {/* Conteúdo */}
              <div className="p-4 sm:p-5 md:p-6 relative flex flex-col grow bg-white">
                <h3 
                  onClick={() => onOpenModal(item)}
                  className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-[#003f7f] transition-colors line-clamp-2 leading-tight cursor-pointer"
                >
                  {item.title}
                </h3>
                
                <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed line-clamp-3 grow text-justify">
                  {item.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{item.author || 'CDL Ipirá'}</span>
                  </div>
                  <button
                    onClick={() => onOpenModal(item)}
                    className="group/btn inline-flex items-center gap-1.5 sm:gap-2 text-[#00a859] font-bold hover:gap-3 transition-all duration-300 text-xs sm:text-sm"
                  >
                    <span className="relative">
                      Leia mais
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00a859] group-hover/btn:w-full transition-all duration-300"></span>
                    </span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
            ))}
          </div>
        )}

        {/* Paginação - Placeholder por enquanto já que estamos listando todas */}
        {news.length > 9 && (
          <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2 sm:gap-3">
            {/* Lógica de paginação real seria implementada aqui se necessário */}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsGrid;



