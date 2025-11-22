'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { getYoutubeThumbnail } from '@/lib/youtube';

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string; // Mantém nome para compatibilidade, mas pode ser URL do youtube
  youtube_id?: string;
  date: string;
  category: string;
  duration: string;
  views: string;
}

const categories = ['Todas', 'Institucional', 'Capacitação', 'Dicas', 'Tutorial', 'Eventos', 'Entrevista'];

export default function TVLojistaPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    // TODO: Substituir por chamada de API real
    // Exemplo: fetch('/api/videos').then(res => res.json()).then(setVideos)
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (response.ok) {
            const data = await response.json();
            const formattedData = data.map((v: any) => ({
                ...v,
                // Usa thumbnail do banco ou gera do youtube
                thumbnail: v.thumbnail || (v.youtube_id ? getYoutubeThumbnail(v.youtube_id) : '/placeholder-video.jpg'),
                // Garante que videoUrl tenha valor
                videoUrl: v.youtube_id ? `https://www.youtube.com/embed/${v.youtube_id}` : v.video_url
            }));
            setVideos(formattedData);
        } else {
            setVideos([]);
        }
      } catch (error) {
        console.error('Erro ao carregar vídeos:', error);
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const filteredVideos = selectedCategory === 'Todas' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const handleVideoClick = (video: typeof videos[0]) => {
    setSelectedVideo(video);
    // Scroll suave para o player
    setTimeout(() => {
      const playerElement = document.getElementById('video-player');
      if (playerElement) {
        playerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

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
            <Link 
              href="/noticias" 
              className="hover:text-[#ffd000] transition-colors"
            >
              Imprensa
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-semibold">TV Lojista</span>
          </nav>
        </div>
      </div>

      {/* Header da Página */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <div className="inline-block bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
              📺 TV Lojista
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-3 sm:mb-4 leading-tight">
              TV Lojista
            </h1>
            <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4 text-justify">
              Acompanhe vídeos, entrevistas, tutoriais e coberturas de eventos da CDL Ipirá
            </p>
          </div>
        </div>
      </section>

      {/* Player de Vídeo (se houver vídeo selecionado) */}
      {selectedVideo && (
        <section id="video-player" className="py-8 sm:py-12 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto animate-blur-fade-in">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-[#003f7f]">
                  {selectedVideo.title}
                </h2>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2"
                  aria-label="Fechar vídeo"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-black">
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>

              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{selectedVideo.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{selectedVideo.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{selectedVideo.views} visualizações</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#003f7f] text-white px-3 py-1 rounded-full text-xs font-bold">
                      {selectedVideo.category}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-justify">
                  {selectedVideo.description}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filtros de Categoria */}
      <section className={`py-4 sm:py-6 bg-white border-b border-gray-200 ${selectedVideo ? '' : 'sticky top-[73px] sm:top-[81px] z-40 backdrop-blur-sm bg-white/95'}`}>
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

      {/* Grid de Vídeos */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg sm:text-xl">Carregando vídeos...</p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-gray-600 text-lg sm:text-xl">Nenhum vídeo encontrado nesta categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
              {filteredVideos.map((video, index) => (
                <article
                  key={video.id}
                  className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full animate-scale-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleVideoClick(video)}
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
    </>
  );
}

