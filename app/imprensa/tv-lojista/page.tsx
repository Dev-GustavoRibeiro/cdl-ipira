'use client';

import React, { useState, useEffect } from 'react';
import { getYoutubeThumbnail } from '@/lib/youtube';
import {
  Breadcrumb,
  HeroSection,
  VideoPlayer,
  CategoriesFilter,
  VideosGrid,
  Video
} from './components';

export default function TVLojistaPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (response.ok) {
            const data = await response.json();
            const formattedData = data.map((v: { id: number; title: string; description: string; thumbnail?: string; youtube_id?: string; video_url?: string; date: string; category: string; duration?: string }) => ({
                ...v,
                thumbnail: v.thumbnail || (v.youtube_id ? getYoutubeThumbnail(v.youtube_id) : '/placeholder-video.jpg'),
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

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setTimeout(() => {
      const playerElement = document.getElementById('video-player');
      if (playerElement) {
        playerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      <VideosGrid
        videos={filteredVideos}
        isLoading={isLoading}
        onVideoClick={handleVideoClick}
      />
    </>
  );
}
