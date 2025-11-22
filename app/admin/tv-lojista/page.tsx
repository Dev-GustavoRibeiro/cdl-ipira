'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaVideo } from 'react-icons/fa';

interface Video {
  id: number;
  title: string;
  category: string;
  date: string;
  views: string;
  duration: string;
}

export default function AdminTVLojistaPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (response.ok) {
          const data = await response.json();
          const formatted = data.map((v: any) => ({
            ...v,
            // Formata data de YYYY-MM-DD para DD/MM/YYYY
            date: v.date ? v.date.split('-').reverse().join('/') : '',
          }));
          setVideos(formatted);
        }
      } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);


  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Gerenciar Vídeos
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie os vídeos da TV Lojista
          </p>
        </div>
        <Link
          href="/admin/tv-lojista/novo"
          className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Novo Vídeo
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Buscar vídeos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#003f7f] text-white">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Vídeo</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Categoria</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Data</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Visualizações</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Duração</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVideos.map((video) => (
                <tr key={video.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">
                      {video.title}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className="inline-block bg-[#00a859] text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                      {video.category}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                    {video.date}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                    {video.views}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                    {video.duration}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/tv-lojista`}
                        target="_blank"
                        className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors"
                        title="Visualizar"
                      >
                        <FaEye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/tv-lojista/${video.id}/editar`}
                        className="p-2 text-[#00a859] hover:bg-[#00a859] hover:text-white rounded-lg transition-colors"
                        title="Editar"
                      >
                        <FaEdit className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


