'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaTimes, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaMapMarkerAlt, FaImages } from 'react-icons/fa';

interface Photo {
  id: number;
  url: string;
  title: string;
  thumbnail: string;
}

interface Album {
  id: number;
  title: string;
  cover: string;
  photos: Photo[];
  date: string;
  location: string;
  category: string;
}

const GaleriaFotosPage = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Substituir por chamada de API real
    // Exemplo: fetch('/api/albums').then(res => res.json()).then(setAlbums)
    const fetchAlbums = async () => {
      try {
        // const response = await fetch('/api/albums');
        // const data = await response.json();
        // setAlbums(data);
        setAlbums([]); // Array vazio até implementar a API
      } catch (error) {
        console.error('Erro ao carregar álbuns:', error);
        setAlbums([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  const categories = ['Todos', 'Networking', 'Evento', 'Política', 'Capacitação', 'Comercial', 'Institucional'];

  const filteredAlbums = activeCategory === 'Todos' 
    ? albums 
    : albums.filter(album => album.category === activeCategory);

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

  const openModal = (album: Album, photoIndex: number = 0) => {
    setSelectedAlbum(album);
    setSelectedPhotoIndex(photoIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlbum(null);
    setSelectedPhotoIndex(0);
  };

  const nextPhoto = () => {
    if (selectedAlbum) {
      setSelectedPhotoIndex((prev) => 
        prev === selectedAlbum.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (selectedAlbum) {
      setSelectedPhotoIndex((prev) => 
        prev === 0 ? selectedAlbum.photos.length - 1 : prev - 1
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#003f7f] py-20 relative overflow-hidden">
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

        {/* Filtros de Categoria */}
        <section className="py-8 bg-white border-b border-gray-200 sticky top-[73px] z-40 shadow-sm">
          <div className="container mx-auto px-4">
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Carregando álbuns...</p>
              </div>
            ) : (
              <>
                {filteredAlbums.length === 0 ? (
                  <div className="text-center py-20">
                    <FaImages className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">Nenhum álbum encontrado nesta categoria.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAlbums.map((album) => (
                      <article
                        key={album.id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                        onClick={() => openModal(album, 0)}
                      >
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={album.cover}
                            alt={album.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                              <div className="flex items-center gap-2 mb-2">
                                <FaImages className="w-4 h-4" />
                                <span className="text-sm font-semibold">{album.photos.length} fotos</span>
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold">
                            {album.photos.length} fotos
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
                              <span>{album.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaMapMarkerAlt className="w-4 h-4 text-[#ffd000]" />
                              <span className="line-clamp-1">{album.location}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
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
                <span>{selectedAlbum.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="w-4 h-4" />
                <span>{selectedAlbum.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaImages className="w-4 h-4" />
                <span>{selectedPhotoIndex + 1} / {selectedAlbum.photos.length}</span>
              </div>
            </div>
          </div>

          {/* Foto Principal */}
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full max-h-[90vh] flex items-center justify-center">
              <Image
                src={selectedAlbum.photos[selectedPhotoIndex].url}
                alt={selectedAlbum.photos[selectedPhotoIndex].title}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Navegação */}
            {selectedAlbum.photos.length > 1 && (
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

            {/* Título da Foto */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-xl px-6 py-3 text-white text-center">
              <p className="font-semibold">{selectedAlbum.photos[selectedPhotoIndex].title}</p>
            </div>
          </div>

          {/* Miniaturas Inferiores */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 max-w-4xl w-full px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
              {selectedAlbum.photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedPhotoIndex
                      ? 'border-[#ffd000] scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={photo.thumbnail}
                    alt={photo.title}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
  );
};

export default GaleriaFotosPage;

