'use client';

import React from 'react';
import Image from 'next/image';
import { Video } from './types';

interface VideosGridProps {
  videos: Video[];
  isLoading: boolean;
  onVideoClick: (video: Video) => void;
}

const VideosGrid = ({ videos, isLoading, onVideoClick }: VideosGridProps) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg sm:text-xl">Carregando vídeos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-600 text-lg sm:text-xl">Nenhum vídeo encontrado nesta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {videos.map((video, index) => (
              <article
                key={video.id}
                className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full animate-scale-in cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onVideoClick(video)}
              >
                {/* Thumbnail do Vídeo */}
                <div className="relative h-48 xs:h-52 sm:h-56 md:h-64 overflow-hidden bg-linear-to-br from-[#003f7f] to-[#0066cc]">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>
                  
                  {/* Badge categoria */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-[#003f7f] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] xs:text-xs font-black shadow-lg">
                      {video.category}
                    </span>
                  </div>

                  {/* Botão Play */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 sm:p-5 md:p-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#003f7f]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Duração */}
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10">
                    <div className="bg-black/80 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-lg text-xs font-bold">
                      {video.duration}
                    </div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4 sm:p-5 md:p-6 relative flex flex-col grow bg-white">
                  <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-[#003f7f] transition-colors line-clamp-2 leading-tight">
                    {video.title}
                  </h3>
                  
                  <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed line-clamp-3 grow text-justify">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{video.views}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span>{video.date}</span>
                    </div>
                    <span className="text-[#00a859] font-bold text-xs sm:text-sm group-hover:gap-2 transition-all inline-flex items-center gap-1">
                      Assistir
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
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
  );
};

export default VideosGrid;



