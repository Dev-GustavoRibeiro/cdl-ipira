'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaCalendarAlt, FaEye, FaBook, FaUserCircle, FaUsers, FaFileAlt } from 'react-icons/fa';

interface Service {
  id: number;
  icon: string;
  title: string;
  link: string;
  order: number;
}

const iconMap: { [key: string]: React.ReactNode } = {
  'calendar': <FaCalendarAlt className="text-5xl text-[#00a859]" />,
  'eye': <FaEye className="text-5xl text-[#00a859]" />,
  'book': <FaBook className="text-5xl text-[#00a859]" />,
  'user': <FaUserCircle className="text-5xl text-[#00a859]" />,
  'users': <FaUsers className="text-5xl text-[#00a859]" />,
  'file': <FaFileAlt className="text-5xl text-[#00a859]" />,
};

const initialServices: Service[] = [
  { id: 1, icon: 'calendar', title: 'Eventos', link: '/eventos', order: 1 },
  { id: 2, icon: 'eye', title: 'Portal Transparência', link: '/portal-transparencia', order: 2 },
  { id: 3, icon: 'book', title: 'Revista CDL', link: '/revista-cdl', order: 3 },
  { id: 4, icon: 'user', title: 'Portal do Associado', link: 'https://app.higestor.com.br/portal/cdl-ipira', order: 4 },
  { id: 5, icon: 'users', title: 'Cadastre Seu Currículo', link: '/balcao-empregos', order: 5 },
  { id: 6, icon: 'file', title: 'Compromisso da CDL', link: '/compromisso-cdl', order: 6 },
];

export default function AdminServicosPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({ ...service });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      id: Math.max(...services.map(s => s.id)) + 1,
      icon: 'calendar',
      title: '',
      link: '',
      order: services.length + 1
    });
  };

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isAdding) {
      setServices([...services, formData].sort((a, b) => a.order - b.order));
    } else {
      setServices(services.map(s => s.id === formData.id ? formData : s).sort((a, b) => a.order - b.order));
    }

    setIsSaving(false);
    setEditingId(null);
    setIsAdding(false);
    setFormData(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleChange = (field: keyof Service, value: string | number) => {
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
              Cards de Serviços
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Gerencie os cards de serviços da página inicial
            </p>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-[#00a859] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#00d670] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Novo Serviço
        </button>
      </div>

      {/* Formulário */}
      {(editingId !== null || isAdding) && formData && (
        <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 md:p-8 border-2 border-[#00a859]">
          <h2 className="text-xl font-black text-[#003f7f] mb-6">
            {isAdding ? 'Adicionar Novo Serviço' : 'Editar Serviço'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
                placeholder="Nome do serviço"
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

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ícone *</label>
              <select
                value={formData.icon}
                onChange={(e) => handleChange('icon', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
              >
                <option value="calendar">Calendário (Eventos)</option>
                <option value="eye">Olho (Transparência)</option>
                <option value="book">Livro (Revista)</option>
                <option value="user">Usuário (Portal)</option>
                <option value="users">Usuários (Currículo)</option>
                <option value="file">Arquivo (Compromisso)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Link *</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => handleChange('link', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
                placeholder="/pagina ou https://..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#00a859] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#00d670] transition-all duration-300 disabled:opacity-50"
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

      {/* Lista de Serviços */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-md p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {iconMap[service.icon]}
                <div>
                  <h3 className="text-lg font-bold text-[#003f7f]">{service.title}</h3>
                  <p className="text-xs text-gray-500">Ordem: #{service.order}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4 truncate">{service.link}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(service)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#0066cc] transition-colors text-sm"
              >
                <FaEdit />
                Editar
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




