'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  HeroSection,
  FiltersSection,
  AlbumsGrid,
  PhotoModal,
  Album,
  AlbumPhoto
} from './components';

const GaleriaFotosPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  
  // Modal state
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Erro na query:', error);
        throw error;
      }
      
      const albumsData = (data || []).filter(album => {
        const isActive = album.is_active === undefined || album.is_active === true || album.is_active === 'true';
        return isActive;
      });

      const albumsWithCount = await Promise.all(
        albumsData.map(async (album) => {
          const { count } = await supabase
            .from('album_photos')
            .select('*', { count: 'exact', head: true })
            .eq('album_id', album.id);
          
          return { 
            ...album, 
            cover_url: album.cover_url || album.cover,
            photo_count: count || 0 
          };
        })
      );

      setAlbums(albumsWithCount);
    } catch (error) {
      console.error('Erro ao carregar álbuns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAlbumPhotos = async (albumId: number) => {
    setIsLoadingPhotos(true);
    try {
      const { data, error } = await supabase
        .from('album_photos')
        .select('*')
        .eq('album_id', albumId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setAlbumPhotos(data || []);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  const filteredAlbums = albums.filter(album => {
    const matchesSearch = album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (album.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || album.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const openModal = async (album: Album) => {
    setSelectedAlbum(album);
    setSelectedPhotoIndex(0);
    setIsModalOpen(true);
    await fetchAlbumPhotos(album.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlbum(null);
    setAlbumPhotos([]);
    setSelectedPhotoIndex(0);
  };

  const nextPhoto = () => {
    if (albumPhotos.length > 0) {
      setSelectedPhotoIndex((prev) => 
        prev === albumPhotos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (albumPhotos.length > 0) {
      setSelectedPhotoIndex((prev) => 
        prev === 0 ? albumPhotos.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <HeroSection />
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <AlbumsGrid
        albums={filteredAlbums}
        isLoading={isLoading}
        onOpenModal={openModal}
      />
      <PhotoModal
        isOpen={isModalOpen}
        album={selectedAlbum}
        photos={albumPhotos}
        selectedPhotoIndex={selectedPhotoIndex}
        isLoadingPhotos={isLoadingPhotos}
        onClose={closeModal}
        onPrevPhoto={prevPhoto}
        onNextPhoto={nextPhoto}
        onSelectPhoto={setSelectedPhotoIndex}
      />
    </div>
  );
};

export default GaleriaFotosPage;
