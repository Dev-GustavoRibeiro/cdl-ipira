'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaVideo, FaSpinner, FaSave, FaImage } from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/components/Modal';

interface Video {
  id: number;
  title: string;
  category: string;
  date: string;
  views: string;
  duration: string;
  description?: string;
  video_url?: string;
  thumbnail?: string;
}

const CATEGORIES = ['Institucional', 'Capacitação', 'Dicas', 'Tutorial', 'Eventos', 'Entrevista'];

export default function AdminTVLojistaPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail: '',
    category: 'Institucional',
    duration: ''
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/videos');
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erro ao buscar vídeos');

      if (data) {
        const formatted = data.map((v: any) => ({
          id: v.id,
          title: v.title,
          category: v.category,
          date: v.date,
          views: v.views || '0',
          duration: v.duration || '',
          description: v.description,
          video_url: v.video_url,
          thumbnail: v.thumbnail
        }));
        setVideos(formatted);
      }
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
      toast.error('Erro ao buscar vídeos');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este vídeo?')) return;

    try {
      const response = await fetch(`/api/admin/videos?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao excluir vídeo');

      toast.success('Vídeo excluído com sucesso');
      fetchVideos();
    } catch (error) {
      console.error('Erro ao excluir vídeo:', error);
      toast.error('Erro ao excluir vídeo');
    }
  }

  const handleOpenModal = (video?: Video) => {
    if (video) {
      setEditingId(video.id);
      setFormData({
        title: video.title,
        description: video.description || '',
        video_url: video.video_url || '',
        thumbnail: video.thumbnail || '',
        category: video.category,
        duration: video.duration || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        video_url: '',
        thumbnail: '',
        category: 'Institucional',
        duration: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        ...(editingId && { id: editingId }),
        title: formData.title,
        description: formData.description,
        video_url: formData.video_url,
        thumbnail: formData.thumbnail,
        category: formData.category,
        duration: formData.duration || '00:00'
      };

      const response = await fetch('/api/admin/videos', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao salvar vídeo');

      toast.success(editingId ? 'Vídeo atualizado!' : 'Vídeo criado!');
      setIsModalOpen(false);
      fetchVideos();
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error);
      toast.error('Erro ao salvar vídeo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Novo Vídeo
        </button>
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex justify-center items-center gap-2 text-[#003f7f]">
                      <FaSpinner className="animate-spin" />
                      <span>Carregando vídeos...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredVideos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhum vídeo encontrado.
                  </td>
                </tr>
              ) : (
                filteredVideos.map((video) => (
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
                      {new Date(video.date).toLocaleDateString('pt-BR')}
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
                        <button
                          onClick={() => handleOpenModal(video)}
                          className="p-2 text-[#00a859] hover:bg-[#00a859] hover:text-white rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Vídeo' : 'Novo Vídeo'}
      >
        <form onSubmit={handleSave} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Título do Vídeo *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              placeholder="Digite o título do vídeo"
            />
          </div>

          {/* URL e Duração */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Link do YouTube *
              </label>
              <div className="relative">
                <FaVideo className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="video_url"
                  required
                  value={formData.video_url}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Cole o link completo do vídeo do YouTube</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Duração
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                placeholder="Ex: 5:30"
              />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Thumbnail (Opcional se for YouTube) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Thumbnail Personalizada (Opcional)
            </label>
            <div className="relative">
              <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                placeholder="URL da imagem de capa (se vazio, usará a do YouTube)"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent resize-none"
              placeholder="Digite uma descrição para o vídeo..."
            ></textarea>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all duration-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
