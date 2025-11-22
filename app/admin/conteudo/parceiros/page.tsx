'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaImage } from 'react-icons/fa';

interface Partner {
  id: number;
  name: string;
  logo: string;
  website?: string;
  order: number;
}

const initialPartners: Partner[] = [
  { id: 1, name: 'Zag Seguros', logo: 'https://via.placeholder.com/200x100/003f7f/ffffff?text=ZAG+SEGUROS', order: 1 },
  { id: 2, name: 'Solturi Energia Solar', logo: 'https://via.placeholder.com/200x100/ff6600/ffffff?text=SOLTURI', order: 2 },
  { id: 3, name: 'Banco do Brasil', logo: 'https://via.placeholder.com/200x100/ffd000/003f7f?text=BANCO+DO+BRASIL', order: 3 },
  { id: 4, name: 'Sebrae', logo: 'https://via.placeholder.com/200x100/00a859/ffffff?text=SEBRAE', order: 4 },
  { id: 5, name: 'Federação CDL', logo: 'https://via.placeholder.com/200x100/003f7f/ffffff?text=FCDL', order: 5 },
];

export default function AdminParceirosPage() {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partner | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (partner: Partner) => {
    setEditingId(partner.id);
    setFormData({ ...partner });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      id: Math.max(...partners.map(p => p.id)) + 1,
      name: '',
      logo: '',
      website: '',
      order: partners.length + 1
    });
  };

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isAdding) {
      setPartners([...partners, formData].sort((a, b) => a.order - b.order));
    } else {
      setPartners(partners.map(p => p.id === formData.id ? formData : p).sort((a, b) => a.order - b.order));
    }

    setIsSaving(false);
    setEditingId(null);
    setIsAdding(false);
    setFormData(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este parceiro?')) {
      setPartners(partners.filter(p => p.id !== id));
    }
  };

  const handleChange = (field: keyof Partner, value: string | number) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
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
              Parceiros
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Gerencie os parceiros exibidos no carrossel
            </p>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-[#ffd000] text-[#003f7f] px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#ffed4e] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Novo Parceiro
        </button>
      </div>

      {/* Formulário */}
      {(editingId !== null || isAdding) && formData && (
        <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 md:p-8 border-2 border-[#ffd000]">
          <h2 className="text-xl font-black text-[#003f7f] mb-6">
            {isAdding ? 'Adicionar Novo Parceiro' : 'Editar Parceiro'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
                placeholder="Nome do parceiro"
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
                <button
                  type="button"
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FaImage className="w-5 h-5" />
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
              onClick={() => {
                setEditingId(null);
                setIsAdding(false);
                setFormData(null);
              }}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Parceiros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {partners.map((partner) => (
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
    </div>
  );
}




