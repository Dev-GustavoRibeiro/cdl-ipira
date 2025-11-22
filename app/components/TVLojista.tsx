'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
          // Garante que thumbnail exista, se não usa do youtube
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

  // Renderiza a estrutura mesmo sem vídeos
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-[#003f7f] mb-12">TV Lojista</h2>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Carregando vídeos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-8">Nenhum vídeo disponível no momento.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {videos.map((video) => (
              <div 
                key={video.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <Link href={`/tv-lojista?video=${video.id}`}>
                <div className="relative h-48 group cursor-pointer">
                  <Image 
                    src={video.thumbnail} 
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition-all">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {video.title}
                  </h3>
                </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link 
            href="/tv-lojista"
            className="inline-block bg-[#003f7f] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#0066cc] transition-all"
          >
            Veja mais TV Lojista
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TVLojista;

