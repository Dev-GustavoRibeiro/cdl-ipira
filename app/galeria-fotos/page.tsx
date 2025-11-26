'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaTimes, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaMapMarkerAlt, FaImages, FaSpinner, FaSearch, FaDownload } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

interface AlbumPhoto {
  id: number;
  album_id: number;
  url: string;
  title?: string;
  display_order: number;
}

interface Album {
  id: number;
  title: string;
  description?: string;
  cover_url?: string;
  cover?: string; // Compatibilidade com nome alternativo da coluna
  date: string;
  location?: string;
  category: string;
  is_active?: boolean;
  photo_count?: number;
}

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

  const categories = ['Todos', 'Eventos', 'Networking', 'Capacitação', 'Institucional', 'Comercial', 'Política', 'Outros'];

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setIsLoading(true);
    try {
      // Primeiro tenta buscar com is_active, se falhar busca sem filtro
      let albumsData: any[] = [];
      
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Erro na query:', error);
        throw error;
      }
      
      // Debug: mostrar dados brutos
      console.log('Dados do Supabase:', data);
      
      // Filtrar apenas álbuns ativos (se a coluna existir)
      albumsData = (data || []).filter(album => {
        const isActive = album.is_active === undefined || album.is_active === true || album.is_active === 'true';
        console.log(`Álbum ${album.id} - ${album.title}: is_active = ${album.is_active}, filtrado: ${isActive}`);
        return isActive;
      });

      // Buscar contagem de fotos
      const albumsWithCount = await Promise.all(
        albumsData.map(async (album) => {
          const { count } = await supabase
            .from('album_photos')
            .select('*', { count: 'exact', head: true })
            .eq('album_id', album.id);
          
          // Normalizar cover_url (pode vir como 'cover' ou 'cover_url')
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003f7f] via-[#0066cc] to-[#003f7f] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <div className="inline-block bg-[#ffd000] text-[#003f7f] px-6 py-3 rounded-full text-sm font-black mb-6 shadow-2xl">
              📸 Galeria de Fotos
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 drop-shadow-2xl">
              Momentos CDL Ipirá
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Reviva os melhores momentos dos nossos eventos, encontros e celebrações
            </p>
          </div>
        </div>
      </section>

      {/* Busca e Filtros */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-[73px] z-40 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Busca */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar álbuns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Categorias */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#003f7f] text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria de Álbuns */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-20">
              <FaSpinner className="animate-spin w-12 h-12 text-[#003f7f] mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Carregando álbuns...</p>
            </div>
          ) : filteredAlbums.length === 0 ? (
            <div className="text-center py-20">
              <FaImages className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">Nenhum álbum encontrado.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAlbums.map((album) => (
                <article
                  key={album.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                  onClick={() => openModal(album)}
                >
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#003f7f] to-[#0052a3]">
                    {album.cover_url ? (
                      <Image
                        src={album.cover_url}
                        alt={album.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FaImages className="w-20 h-20 text-white/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <FaImages className="w-4 h-4" />
                          <span className="text-sm font-semibold">Ver {album.photo_count || 0} fotos</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold">
                      {album.photo_count || 0} fotos
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#003f7f] text-white px-3 py-1 rounded-full text-xs font-bold">
                        {album.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#003f7f] transition-colors line-clamp-2">
                      {album.title}
                    </h3>
                    <div className="flex flex-col gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4 text-[#00a859]" />
                        <span>{new Date(album.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                      </div>
                      {album.location && (
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="w-4 h-4 text-[#ffd000]" />
                          <span className="line-clamp-1">{album.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de Visualização de Fotos */}
      {isModalOpen && selectedAlbum && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Botão Fechar */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-[#ffd000] transition-colors z-50 bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70"
            aria-label="Fechar"
          >
            <FaTimes className="w-6 h-6" />
          </button>

          {/* Informações do Álbum */}
          <div className="absolute top-4 left-4 right-20 bg-black/50 backdrop-blur-sm rounded-xl p-4 text-white z-50">
            <h2 className="text-xl font-bold mb-2">{selectedAlbum.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="w-4 h-4" />
                <span>{new Date(selectedAlbum.date).toLocaleDateString('pt-BR')}</span>
              </div>
              {selectedAlbum.location && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  <span>{selectedAlbum.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FaImages className="w-4 h-4" />
                <span>{selectedPhotoIndex + 1} / {albumPhotos.length}</span>
              </div>
            </div>
          </div>

          {/* Área de Fotos */}
          {isLoadingPhotos ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin w-12 h-12 text-white" />
            </div>
          ) : albumPhotos.length === 0 ? (
            <div className="text-center text-white">
              <FaImages className="w-20 h-20 mx-auto mb-4 opacity-50" />
              <p className="text-xl">Nenhuma foto neste álbum ainda.</p>
            </div>
          ) : (
            <>
              {/* Foto Principal */}
              <div className="relative max-w-7xl w-full h-full flex items-center justify-center pt-20 pb-32">
                <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
                  <Image
                    src={albumPhotos[selectedPhotoIndex].url}
                    alt={albumPhotos[selectedPhotoIndex].title || `Foto ${selectedPhotoIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Navegação */}
                {albumPhotos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-4 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 rounded-full p-4 transition-all hover:scale-110"
                      aria-label="Foto anterior"
                    >
                      <FaChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-4 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 rounded-full p-4 transition-all hover:scale-110"
                      aria-label="Próxima foto"
                    >
                      <FaChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Miniaturas */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 max-w-4xl w-full px-4">
                <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
                  {albumPhotos.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedPhotoIndex
                          ? 'border-[#ffd000] scale-110'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={photo.url}
                        alt={photo.title || `Miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GaleriaFotosPage;
