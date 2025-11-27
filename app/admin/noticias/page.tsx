'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaSpinner, FaSave, FaCloudUploadAlt } from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/app/components/Modal';

interface Noticia {
  id: number;
  title: string;
  category: string;
  date: string;
  status: 'published' | 'draft';
  is_published?: boolean;
  excerpt?: string;
  content?: string;
  image?: string;
  author?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Economia': 'from-blue-600 to-blue-800',
  'Comércio': 'from-green-600 to-green-800',
  'Agronegócio': 'from-yellow-600 to-yellow-800',
  'Dicas': 'from-purple-600 to-purple-800',
  'Eventos': 'from-red-600 to-red-800',
  'Serviços': 'from-indigo-600 to-indigo-800',
};

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    author: 'CDL Ipirá',
  });

  useEffect(() => {
    fetchNoticias();
  }, []);

  async function fetchNoticias() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/noticias');
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erro ao carregar notícias');

      if (data) {
        const mappedNoticias = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          date: item.date, // Keep original format for editing
          status: item.is_published ? 'published' : 'draft',
          is_published: item.is_published,
          excerpt: item.excerpt,
          content: item.content,
          image: item.image,
          author: item.author
        }));
        setNoticias(mappedNoticias as Noticia[]);
      }
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
      toast.error('Erro ao carregar notícias');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return;

    try {
      const response = await fetch(`/api/admin/noticias?id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao excluir notícia');

      toast.success('Notícia excluída com sucesso');
      fetchNoticias();
    } catch (error) {
      console.error('Erro ao excluir notícia:', error);
      toast.error('Erro ao excluir notícia');
    }
  }

  const handleOpenModal = (noticia?: Noticia) => {
    if (noticia) {
      setEditingId(noticia.id);
      setFormData({
        title: noticia.title,
        excerpt: noticia.excerpt || '',
        content: noticia.content || '',
        category: noticia.category,
        date: noticia.date,
        image: noticia.image || '',
        author: noticia.author || 'CDL Ipirá',
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        image: '',
        author: 'CDL Ipirá',
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('bucket', 'news');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao enviar imagem');
      
      setFormData({ ...formData, image: data.url });
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      toast.error('Erro ao enviar imagem. Verifique se o bucket "news" existe.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        date: formData.date,
        image: formData.image,
        author: formData.author,
      };

      let response;

      if (editingId) {
        response = await fetch('/api/admin/noticias', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        response = await fetch('/api/admin/noticias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao salvar notícia');

      toast.success(editingId ? 'Notícia atualizada!' : 'Notícia criada!');
      setIsModalOpen(false);
      fetchNoticias();
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
      toast.error('Erro ao salvar notícia.');
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

  const filteredNoticias = noticias.filter(noticia =>
    noticia.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    noticia.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Gerenciar Notícias
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Crie, edite e gerencie as notícias do site
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Nova Notícia
        </button>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Buscar notícias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#003f7f] text-white">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Título</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Categoria</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Data</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <div className="flex justify-center items-center gap-2 text-[#003f7f]">
                      <FaSpinner className="animate-spin" />
                      <span>Carregando notícias...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredNoticias.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Nenhuma notícia encontrada.
                  </td>
                </tr>
              ) : (
                filteredNoticias.map((noticia) => (
                  <tr key={noticia.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">
                        {noticia.title}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className="inline-block bg-[#00a859] text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                        {noticia.category}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                      {new Date(noticia.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                        noticia.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {noticia.status === 'published' ? 'Publicada' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/noticias/${noticia.id}`}
                          target="_blank"
                          className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <FaEye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenModal(noticia)}
                          className="p-2 text-[#00a859] hover:bg-[#00a859] hover:text-white rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(noticia.id)}
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
        title={editingId ? 'Editar Notícia' : 'Nova Notícia'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                placeholder="Digite o título da notícia"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="Economia">Economia</option>
                <option value="Comércio">Comércio</option>
                <option value="Agronegócio">Agronegócio</option>
                <option value="Dicas">Dicas</option>
                <option value="Eventos">Eventos</option>
                <option value="Serviços">Serviços</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Data *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Resumo *
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent resize-none"
                placeholder="Digite um resumo da notícia"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Conteúdo Completo *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={10}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent resize-none font-mono text-sm"
                placeholder="Digite o conteúdo completo da notícia (HTML permitido)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Imagem de Capa
              </label>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* Opção 1: Upload de Arquivo */}
                  <div className="flex-1">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                          <FaSpinner className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                        ) : (
                          <FaCloudUploadAlt className="w-8 h-8 text-gray-400 mb-2" />
                        )}
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG ou WEBP</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  {/* Preview da Imagem */}
                  {formData.image && (
                    <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Remover imagem"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Opção 2: URL Direta */}
                <div className="flex gap-3 items-center">
                  <span className="text-sm text-gray-500">Ou cole a URL:</span>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving || isUploading}
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
