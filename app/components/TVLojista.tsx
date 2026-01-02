'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaArrowRight } from 'react-icons/fa';
import { getYoutubeThumbnail } from '@/lib/youtube';

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  youtube_id: string;
  video_url?: string;
}

const TVLojista = () => {
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos?limit=3');
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map((v: any) => ({
            ...v,
            thumbnail: v.thumbnail || (v.youtube_id ? getYoutubeThumbnail(v.youtube_id) : '/placeholder-video.jpg')
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

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#003f7f] relative overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#003f7f] via-[#0052a3] to-[#003366]"></div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ffd000]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <span className="inline-block text-[#ffd000] text-sm font-bold tracking-widest uppercase mb-3">
              📺 Canal CDL Ipirá
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              TV Lojista
            </h2>
            <p className="text-white/70 mt-3 text-sm sm:text-base max-w-xl">
              Acompanhe entrevistas, dicas e conteúdos exclusivos para impulsionar seu negócio
            </p>
          </div>
          <Link
            href="/imprensa/tv-lojista"
            className="group inline-flex items-center gap-2 text-[#ffd000] font-bold hover:text-white transition-colors text-sm sm:text-base"
          >
            <span>Ver todos os vídeos</span>
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-white/20 border-t-[#ffd000] rounded-full animate-spin"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPlay className="w-8 h-8 text-white/50" />
            </div>
            <p className="text-white/70 text-lg">Nenhum vídeo disponível no momento</p>
            <p className="text-white/50 text-sm mt-1">Novos conteúdos em breve!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Video Principal - Primeiro vídeo maior */}
            {videos[0] && (
              <Link
                href={`/imprensa/tv-lojista?video=${videos[0].id}`}
                className="group block lg:row-span-2"
              >
                <article className="relative aspect-video lg:aspect-auto lg:h-full lg:min-h-[450px] rounded-2xl overflow-hidden">
                  <Image
                    src={videos[0].thumbnail}
                    alt={videos[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#ffd000] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <FaPlay className="w-8 h-8 sm:w-10 sm:h-10 text-[#003f7f] ml-1" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <span className="inline-block bg-[#ffd000] text-[#003f7f] text-xs font-bold px-3 py-1 rounded-full mb-3">
                      EM DESTAQUE
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white line-clamp-2 group-hover:text-[#ffd000] transition-colors">
                      {videos[0].title}
                    </h3>
                  </div>
                </article>
              </Link>
            )}

            {/* Videos Secundários */}
            <div className="flex flex-col gap-6 sm:gap-8">
              {videos.slice(1, 3).map((video) => (
                <Link
                  key={video.id}
                  href={`/imprensa/tv-lojista?video=${video.id}`}
                  className="group block"
                >
                  <article className="flex gap-4 sm:gap-5 bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 hover:border-[#ffd000]/50 hover:bg-white/10 transition-all duration-300">
                    {/* Thumbnail */}
                    <div className="relative w-32 sm:w-40 md:w-48 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Play Icon */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ffd000] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FaPlay className="w-4 h-4 sm:w-5 sm:h-5 text-[#003f7f] ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 group-hover:text-[#ffd000] transition-colors">
                        {video.title}
                      </h3>
                      <span className="text-white/50 text-sm mt-2 flex items-center gap-2">
                        <span className="w-5 h-5 bg-[#ffd000] rounded-full flex items-center justify-center">
                          <span className="text-[#003f7f] text-xs font-bold">C</span>
                        </span>
                        CDL Ipirá
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 sm:mt-14 text-center">
          <Link
            href="/imprensa/tv-lojista"
            className="inline-flex items-center gap-3 bg-[#ffd000] text-[#003f7f] px-8 py-4 rounded-full font-bold hover:bg-white transition-all shadow-xl hover:shadow-2xl text-sm sm:text-base group"
          >
            <span>Explorar Todos os Vídeos</span>
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TVLojista;
