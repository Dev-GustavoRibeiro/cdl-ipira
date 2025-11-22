'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSave, FaVideo, FaImage } from 'react-icons/fa';

const categories = ['Institucional', 'Capacitação', 'Dicas', 'Tutorial', 'Eventos', 'Entrevista'];

export default function NovoVideoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail: '',
    category: 'Institucional',
    duration: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erro ao cadastrar vídeo');

      router.push('/admin/tv-lojista');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cadastrar vídeo. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/tv-lojista"
          className="p-2 text-gray-600 hover:text-[#003f7f] hover:bg-gray-100 rounded-full transition-all"
        >
          <FaArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#003f7f]">
            Novo Vídeo
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Adicione um novo vídeo à TV Lojista
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              {categories.map(cat => (
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
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <Link
              href="/admin/tv-lojista"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#003f7f] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <FaSave />
                  Salvar Vídeo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


