'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FaExclamationTriangle } from 'react-icons/fa';
import {
  HeroSection,
  FiltersSection,
  AlbumsGrid,
  PhotoModal,
  Album,
  AlbumPhoto
} from './components';
import { StateBlock, primaryButton } from '../noticias/components/LoadStates';

// Abre o álbum de ?album=ID (links da home) quando a lista carregar.
// Isolado em <Suspense> para o restante da página continuar pré-renderizado.
function AlbumParamReader({ albums, onOpen }: { albums: Album[]; onOpen: (album: Album) => void }) {
  const albumId = Number(useSearchParams().get('album'));
  const openedRef = useRef<number | null>(null);
  useEffect(() => {
    if (!albumId || openedRef.current === albumId) return;
    const album = albums.find((a) => a.id === albumId);
    if (!album) return;
    openedRef.current = albumId;
    onOpen(album);
  }, [albumId, albums, onOpen]);
  return null;
}

const GaleriaFotosPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  
  // Modal state
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);

  // Recarrega a lista quando reloadKey muda (botão "Tentar novamente")
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        // Contagem de fotos embutida na mesma consulta (evita uma query por álbum)
        const { data, error } = await supabase
          .from('albums')
          .select('*, album_photos(count)')
          .eq('is_active', true)
          .order('date', { ascending: false });

        if (error) throw error;

        setAlbums((data || []).map(({ album_photos, ...album }) => ({
          ...album,
          cover_url: album.cover_url || album.cover,
          photo_count: album_photos?.[0]?.count ?? 0,
        })));
      } catch (error) {
        console.error('Erro ao carregar álbuns:', error);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlbums();
  }, [reloadKey]);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(false);
    setReloadKey((key) => key + 1);
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

  // Só as categorias que têm álbum (filtro que leva a lista vazia frustra)
  const categories = ['Todos', ...[...new Set(albums.map((album) => album.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'))];

  const filteredAlbums = albums.filter(album => {
    const matchesSearch = (album.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (album.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || album.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
    <>
      <HeroSection />
      <FiltersSection
        categories={categories}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <Suspense fallback={null}>
        <AlbumParamReader albums={albums} onOpen={openModal} />
      </Suspense>
      {loadError ? (
        <section className="py-10 sm:py-12 md:py-16">
          <div className="container mx-auto px-4">
            <StateBlock
              icon={FaExclamationTriangle}
              title="Não foi possível carregar os álbuns"
              description="Verifique sua conexão e tente novamente."
            >
              <button type="button" onClick={handleRetry} className={primaryButton}>
                Tentar novamente
              </button>
            </StateBlock>
          </div>
        </section>
      ) : (
        <AlbumsGrid
          albums={filteredAlbums}
          isLoading={isLoading}
          onOpenModal={openModal}
          onResetFilters={() => {
            setSearchTerm('');
            setActiveCategory('Todos');
          }}
        />
      )}
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
    </>
  );
};

export default GaleriaFotosPage;
