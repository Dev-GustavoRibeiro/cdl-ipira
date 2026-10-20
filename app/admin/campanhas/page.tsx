'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaSpinner, FaSave, FaCloudUploadAlt, FaStar } from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/app/components/Modal';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { Campaign, getCampaignStatus, CAMPAIGN_STATUS_LABEL } from '@/lib/campaigns';
import { formatDateBR, todayISO } from '@/lib/date';

interface Campanha extends Campaign {
  news_count: number;
  events_count: number;
  albums_count: number;
}

const emptyForm = () => ({
  title: '',
  summary: '',
  description: '',
  cover_image: '',
  start_date: todayISO(),
  end_date: '',
  is_featured: false,
  is_active: true,
});

const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent';

export default function AdminCampanhasPage() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  // Delete modal state
  const [campanhaToDelete, setCampanhaToDelete] = useState<Campanha | null>(null);

  useEffect(() => {
    fetchCampanhas();
  }, []);

  async function fetchCampanhas() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/campanhas');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao carregar campanhas');
      setCampanhas(data);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
      toast.error('Erro ao carregar campanhas');
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmDelete() {
    if (!campanhaToDelete) return;

    try {
      const response = await fetchWithCSRF(`/api/admin/campanhas?id=${campanhaToDelete.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao excluir campanha');

      toast.success('Campanha excluída com sucesso');
      fetchCampanhas();
    } catch (error) {
      console.error('Erro ao excluir campanha:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir campanha');
    } finally {
      setCampanhaToDelete(null);
    }
  }

  const handleOpenModal = (campanha?: Campanha) => {
    if (campanha) {
      setEditingId(campanha.id);
      setFormData({
        title: campanha.title,
        summary: campanha.summary || '',
        description: campanha.description || '',
        cover_image: campanha.cover_image || '',
        start_date: campanha.start_date,
        end_date: campanha.end_date || '',
        is_featured: campanha.is_featured,
        is_active: campanha.is_active,
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm());
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('bucket', 'gallery');
      uploadFormData.append('folder', 'campaigns');

      const response = await fetchWithCSRF('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });

      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || 'Erro ao enviar imagem');

      setFormData((current) => ({ ...current, cover_image: data.url }));
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar imagem');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetchWithCSRF('/api/admin/campanhas', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...(editingId && { id: editingId }), ...formData })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao salvar campanha');

      toast.success(editingId ? 'Campanha atualizada!' : 'Campanha criada!');
      setIsModalOpen(false);
      fetchCampanhas();
    } catch (error) {
      console.error('Erro ao salvar campanha:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar campanha.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const filteredCampanhas = campanhas.filter(campanha =>
    campanha.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Gerenciar Campanhas
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Crie campanhas e vincule notícias, eventos e álbuns a elas
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-[#00a859] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#00d670] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Nova Campanha
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Buscar campanhas..."
            aria-label="Buscar campanhas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#00a859] text-white">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Campanha</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Período</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Destaque</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Conteúdos</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex justify-center items-center gap-2 text-[#00a859]">
                      <FaSpinner className="animate-spin" />
                      <span>Carregando campanhas...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCampanhas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhuma campanha encontrada.
                  </td>
                </tr>
              ) : (
                filteredCampanhas.map((campanha) => {
                  const statusBadge = CAMPAIGN_STATUS_LABEL[getCampaignStatus(campanha)];
                  return (
                    <tr key={campanha.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="text-sm sm:text-base font-semibold text-gray-900">
                          {campanha.title}
                        </div>
                        {!campanha.is_active && (
                          <span className="inline-block mt-1 bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-bold">
                            Oculta no site
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 whitespace-nowrap">
                        {formatDateBR(campanha.start_date)}
                        {campanha.end_date ? ` a ${formatDateBR(campanha.end_date)}` : ' (sem término)'}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        {campanha.is_featured ? (
                          <FaStar className="w-4 h-4 text-[#ffd000]" role="img" aria-label="Em destaque" />
                        ) : (
                          <span className="text-gray-400"><span aria-hidden="true">—</span><span className="sr-only">Sem destaque</span></span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 whitespace-nowrap">
                        {campanha.news_count} notícias · {campanha.events_count} eventos · {campanha.albums_count} álbuns
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/imprensa/campanhas/${campanha.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors"
                            title="Visualizar"
                            aria-label={`Visualizar ${campanha.title} no site`}
                          >
                            <FaEye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenModal(campanha)}
                            className="p-2 text-[#00a859] hover:bg-[#00a859] hover:text-white rounded-lg transition-colors"
                            title="Editar"
                            aria-label={`Editar ${campanha.title}`}
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCampanhaToDelete(campanha)}
                            className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                            title="Excluir"
                            aria-label={`Excluir ${campanha.title}`}
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Campanha' : 'Nova Campanha'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label htmlFor="campanha-title" className="block text-sm font-bold text-gray-700 mb-2">
                Título da Campanha *
              </label>
              <input
                id="campanha-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={150}
                className={inputClass}
                placeholder="Ex: Natal Premiado 2026"
              />
            </div>

            <div>
              <label htmlFor="campanha-start" className="block text-sm font-bold text-gray-700 mb-2">
                Data de Início *
              </label>
              <input
                id="campanha-start"
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="campanha-end" className="block text-sm font-bold text-gray-700 mb-2">
                Data de Término
              </label>
              <input
                id="campanha-end"
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date}
                className={inputClass}
              />
              <p className="text-xs text-gray-500 mt-1">
                Deixe em branco se a campanha não tiver data para acabar.
              </p>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="campanha-summary" className="block text-sm font-bold text-gray-700 mb-2">
                Resumo
              </label>
              <textarea
                id="campanha-summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={2}
                maxLength={300}
                className={`${inputClass} resize-none`}
                placeholder="Uma frase que aparece nos cards da campanha"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="campanha-description" className="block text-sm font-bold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                id="campanha-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                maxLength={5000}
                className={`${inputClass} resize-none`}
                placeholder="Regulamento, prêmios, lojas participantes..."
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="campanha-cover-file" className="block text-sm font-bold text-gray-700 mb-2">
                Imagem de Capa
              </label>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* Opção 1: Upload de Arquivo */}
                  <div className="flex-1">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors focus-within:ring-2 focus-within:ring-[#003f7f]">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                          <FaSpinner className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                        ) : (
                          <FaCloudUploadAlt className="w-8 h-8 text-gray-400 mb-2" />
                        )}
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Clique para enviar</span> uma imagem
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG ou WEBP</p>
                      </div>
                      <input
                        id="campanha-cover-file"
                        type="file"
                        className="sr-only"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  {/* Preview da Imagem */}
                  {formData.cover_image && (
                    <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.cover_image}
                        alt="Prévia da capa"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, cover_image: '' })}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Remover imagem"
                        aria-label="Remover imagem"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Opção 2: URL Direta */}
                <div className="flex gap-3 items-center">
                  <label htmlFor="campanha-cover-url" className="text-sm text-gray-500">Ou cole a URL:</label>
                  <input
                    id="campanha-cover-url"
                    type="url"
                    name="cover_image"
                    value={formData.cover_image}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                    placeholder="https://exemplo.com/capa-campanha.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="campanha-featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-5 h-5 text-[#00a859] border-gray-300 rounded"
              />
              <label htmlFor="campanha-featured" className="text-sm font-medium text-gray-700">Campanha em destaque</label>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="campanha-active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 text-[#00a859] border-gray-300 rounded"
              />
              <label htmlFor="campanha-active" className="text-sm font-medium text-gray-700">Visível no site</label>
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

      <Modal
        isOpen={campanhaToDelete !== null}
        onClose={() => setCampanhaToDelete(null)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-6">
          <p className="text-gray-600">
            Tem certeza que deseja excluir a campanha &quot;{campanhaToDelete?.title}&quot;? As notícias, eventos e álbuns vinculados
            continuam no site, apenas sem campanha. Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setCampanhaToDelete(null)}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors shadow-lg shadow-red-200"
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
