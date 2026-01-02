'use client';

import React from 'react';
import Image from 'next/image';
import { FaTimes, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaMapMarkerAlt, FaImages, FaSpinner } from 'react-icons/fa';
import { Album, AlbumPhoto } from './types';

interface PhotoModalProps {
  isOpen: boolean;
  album: Album | null;
  photos: AlbumPhoto[];
  selectedPhotoIndex: number;
  isLoadingPhotos: boolean;
  onClose: () => void;
  onPrevPhoto: () => void;
  onNextPhoto: () => void;
  onSelectPhoto: (index: number) => void;
}

const PhotoModal = ({
  isOpen,
  album,
  photos,
  selectedPhotoIndex,
  isLoadingPhotos,
  onClose,
  onPrevPhoto,
  onNextPhoto,
  onSelectPhoto
}: PhotoModalProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrevPhoto();
    if (e.key === 'ArrowRight') onNextPhoto();
  };

  if (!isOpen || !album) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Botão Fechar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-[#ffd000] transition-colors z-50 bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70"
        aria-label="Fechar"
      >
        <FaTimes className="w-6 h-6" />
      </button>

      {/* Informações do Álbum */}
      <div className="absolute top-4 left-4 right-20 bg-black/50 backdrop-blur-sm rounded-xl p-4 text-white z-50">
        <h2 className="text-xl font-bold mb-2">{album.title}</h2>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="w-4 h-4" />
            <span>{new Date(album.date).toLocaleDateString('pt-BR')}</span>
          </div>
          {album.location && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="w-4 h-4" />
              <span>{album.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FaImages className="w-4 h-4" />
            <span>{selectedPhotoIndex + 1} / {photos.length}</span>
          </div>
        </div>
      </div>

      {/* Área de Fotos */}
      {isLoadingPhotos ? (
        <div className="flex items-center justify-center">
          <FaSpinner className="animate-spin w-12 h-12 text-white" />
        </div>
      ) : photos.length === 0 ? (
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
                src={photos[selectedPhotoIndex].url}
                alt={photos[selectedPhotoIndex].title || `Foto ${selectedPhotoIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Navegação */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={onPrevPhoto}
                  className="absolute left-4 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 rounded-full p-4 transition-all hover:scale-110"
                  aria-label="Foto anterior"
                >
                  <FaChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={onNextPhoto}
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
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => onSelectPhoto(index)}
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
  );
};

export default PhotoModal;



