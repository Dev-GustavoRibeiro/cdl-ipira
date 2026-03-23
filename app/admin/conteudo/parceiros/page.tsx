'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaImage, FaSpinner, FaSearch, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import { fetchWithCSRF } from '@/lib/csrf-client';

interface Partner {
  id: number;
  name: string;
  logo: string;
  website?: string;
  order: number;
}

export default function AdminParceirosPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partner>({
    id: 0,
    name: '',
    logo: '',
    website: '',
    order: 1
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPartners = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return partners;
    return partners.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.website?.toLowerCase().includes(q) ?? false)
    );
  }, [partners, searchQuery]);

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/parceiros');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao carregar associados');

      if (data) {
        const mappedPartners = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          logo: item.logo,
          website: item.website,
          order: item.order_index
        }));
        setPartners(mappedPartners);
      }
    } catch (error) {
      console.error('Erro ao carregar associados:', error);
      toast.error('Erro ao carregar associados');
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (partner: Partner) => {
    setEditingId(partner.id);
    setFormData({ ...partner });
    setIsAdding(false);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      id: 0,
      name: '',
      logo: '',
      website: '',
      order: partners.length + 1
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);

    try {
      const payload = {
        name: formData.name,
        logo: formData.logo,
        website: formData.website,
        order: formData.order
      };

      const method = isAdding ? 'POST' : 'PUT';
      const body = isAdding ? payload : { id: editingId, ...payload };

      const response = await fetchWithCSRF('/api/admin/parceiros', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Erro ao salvar');

      toast.success(isAdding ? 'Associado criado!' : 'Associado atualizado!');
      fetchPartners();
      setIsModalOpen(false);
      setEditingId(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Erro ao salvar associado:', error);
      toast.error('Erro ao salvar associado');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este associado?')) return;

    try {
      const response = await fetchWithCSRF(`/api/admin/parceiros?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao excluir');
      
      toast.success('Associado excluído!');
      fetchPartners();
    } catch (error) {
      console.error('Erro ao excluir associado:', error);
      toast.error('Erro ao excluir associado');
    }
  };

  const handleChange = (field: keyof Partner, value: string | number) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'partners');

      const response = await fetchWithCSRF('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no upload');
      }

      const data = await response.json();
      handleChange('logo', data.url);
      toast.success('Logo enviada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao enviar imagem:', error);
      toast.error(`Erro ao enviar imagem: ${error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
              Associados
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Gerencie os associados exibidos no carrossel
            </p>
          </div>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {!isLoading && partners.length > 0 && (
            <div className="relative w-full sm:w-[320px]">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar associado por nome ou site..."
                className="w-full pl-11 pr-10 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-[#003f7f] transition-all text-sm text-gray-800 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 bg-[#ffd000] text-[#003f7f] px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#ffed4e] transition-all duration-300 shadow-lg whitespace-nowrap"
          >
            <FaPlus />
            Novo Associado
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isAdding ? 'Adicionar Novo Associado' : 'Editar Associado'}
      >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
                placeholder="Nome do associado"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ordem</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => handleChange('order', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
                min="1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">URL do Logo *</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => handleChange('logo', e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
                  placeholder="/logo.png ou https://..."
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  title="Fazer upload de imagem"
                >
                  {isUploading ? <FaSpinner className="animate-spin w-5 h-5" /> : <FaImage className="w-5 h-5" />}
                </button>
              </div>
              {formData.logo && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <img src={formData.logo} alt="Preview" className="max-h-20 mx-auto" />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Website (opcional)</label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#ffd000] text-[#003f7f] px-6 py-3 rounded-lg font-bold hover:bg-[#ffed4e] transition-all duration-300 disabled:opacity-50"
            >
              <FaSave />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
          </div>
      </Modal>

      {/* Lista de Associados */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-[#003f7f] text-3xl" />
        </div>
      ) : filteredPartners.length === 0 && searchQuery ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <FaSearch className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">Nenhum associado encontrado</p>
          <p className="text-gray-400 text-sm mt-1">
            Nenhum resultado para <span className="font-bold text-gray-600">&ldquo;{searchQuery}&rdquo;</span>
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-[#003f7f] text-sm font-bold hover:underline"
          >
            Limpar pesquisa
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPartners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-32 bg-gray-100 flex items-center justify-center p-4">
                <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#003f7f] mb-1">{partner.name}</h3>
                <p className="text-xs text-gray-500 mb-4">Ordem: #{partner.order}</p>
                {partner.website && (
                  <p className="text-xs text-gray-600 mb-4 truncate">{partner.website}</p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(partner)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#0066cc] transition-colors text-sm"
                  >
                    <FaEdit />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(partner.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contador de resultados */}
      {!isLoading && partners.length > 0 && (
        <p className="text-sm text-gray-400 text-right">
          {searchQuery
            ? `${filteredPartners.length} de ${partners.length} associado${partners.length !== 1 ? 's' : ''}`
            : `${partners.length} associado${partners.length !== 1 ? 's' : ''} no total`
          }
        </p>
      )}
    </div>
  );
}
