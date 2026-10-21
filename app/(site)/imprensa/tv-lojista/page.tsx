'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';
import { getYoutubeThumbnail } from '@/lib/youtube';
import {
  Breadcrumb,
  HeroSection,
  VideoPlayer,
  CategoriesFilter,
  VideosGrid,
  Video
} from './components';
import { StateBlock, primaryButton, scrollBehavior } from '../noticias/components/LoadStates';

// Abre o vídeo de ?video=ID (links da home) quando a lista carregar.
// Isolado em <Suspense> para o restante da página continuar pré-renderizado.
function VideoParamReader({ videos, onOpen }: { videos: Video[]; onOpen: (video: Video) => void }) {
  const videoId = Number(useSearchParams().get('video'));
  const openedRef = useRef<number | null>(null);
  useEffect(() => {
    if (!videoId || openedRef.current === videoId) return;
    const video = videos.find((v) => v.id === videoId);
    if (!video) return;
    openedRef.current = videoId;
    onOpen(video);
  }, [videoId, videos, onOpen]);
  return null;
}

export default function TVLojistaPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Recarrega a lista quando reloadKey muda (botão "Tentar novamente")
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (response.ok) {
            const data = await response.json();
            const formattedData = data.map((v: { id: number; title: string; description: string; thumbnail?: string; youtube_id?: string; video_url?: string; date: string; category: string; duration?: string }) => ({
                ...v,
                thumbnail: v.thumbnail || (v.youtube_id ? getYoutubeThumbnail(v.youtube_id) : '/cdl-ipira-sede.jpg'),
                videoUrl: v.youtube_id ? `https://www.youtube.com/embed/${v.youtube_id}` : v.video_url
            }));
            setVideos(formattedData);
        } else {
            setVideos([]);
            setLoadError(true);
        }
      } catch (error) {
        console.error('Erro ao carregar vídeos:', error);
        setVideos([]);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, [reloadKey]);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(false);
    setReloadKey((key) => key + 1);
  };

  const filteredVideos = selectedCategory === 'Todas' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setTimeout(() => {
      const playerElement = document.getElementById('video-player');
      if (playerElement) {
        playerElement.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
      }
    }, 100);
  };

  return (
    <>
      <Breadcrumb />
      <HeroSection />
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
      <CategoriesFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        hasSelectedVideo={!!selectedVideo}
      />
      <Suspense fallback={null}>
        <VideoParamReader videos={videos} onOpen={handleVideoClick} />
      </Suspense>
      {loadError ? (
        <section className="py-10 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <StateBlock
              icon={FaExclamationTriangle}
              title="Não foi possível carregar os vídeos"
              description="Verifique sua conexão e tente novamente."
            >
              <button type="button" onClick={handleRetry} className={primaryButton}>
                Tentar novamente
              </button>
            </StateBlock>
          </div>
        </section>
      ) : (
        <VideosGrid
          videos={filteredVideos}
          isLoading={isLoading}
          onVideoClick={handleVideoClick}
          onResetFilter={() => setSelectedCategory('Todas')}
        />
      )}
    </>
  );
}
