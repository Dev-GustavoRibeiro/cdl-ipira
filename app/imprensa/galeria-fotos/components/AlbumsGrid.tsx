'use client';

import React from 'react';
import Image from 'next/image';
import { FaCalendarAlt, FaMapMarkerAlt, FaImages, FaSpinner } from 'react-icons/fa';
import { Album } from './types';

interface AlbumsGridProps {
  albums: Album[];
  isLoading: boolean;
  onOpenModal: (album: Album) => void;
}

const AlbumsGrid = ({ albums, isLoading, onOpenModal }: AlbumsGridProps) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="text-center py-20">
            <FaSpinner className="animate-spin w-12 h-12 text-[#003f7f] mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Carregando álbuns...</p>
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20">
            <FaImages className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Nenhum álbum encontrado.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <article
                key={album.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                onClick={() => onOpenModal(album)}
              >
                <div className="relative h-64 overflow-hidden bg-linear-to-br from-[#003f7f] to-[#0052a3]">
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
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
  );
};

export default AlbumsGrid;



