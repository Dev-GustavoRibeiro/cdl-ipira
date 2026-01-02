'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaSpinner, FaImage, FaSave, FaCloudUploadAlt, FaUsers } from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/app/components/Modal';
import RegistrationListModal from '@/app/admin/components/RegistrationListModal';

interface Evento {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'past';
  time?: string;
  description?: string;
  image?: string;
  gradient?: string;
  attendees?: number;
  registrations_count?: number;
}

const CATEGORIES = ['Networking', 'Capacitação', 'Feira', 'Palestra', 'Institucional', 'Reunião'];
const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Próximo' },
  { value: 'ongoing', label: 'Em Andamento' },
  { value: 'past', label: 'Realizado' },
];

const GRADIENTS = [
  { name: 'Azul', value: 'from-[#003f7f] to-[#0066cc]' },
  { name: 'Verde', value: 'from-[#00a859] to-[#00d670]' },
  { name: 'Amarelo', value: 'from-[#ffd000] to-[#ffed4e]' },
  { name: 'Roxo', value: 'from-purple-600 to-purple-800' },
  { name: 'Vermelho', value: 'from-red-600 to-red-800' },
];

export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistrationListOpen, setIsRegistrationListOpen] = useState(false);
  const [selectedEventForList, setSelectedEventForList] = useState<{ id: number, title: string } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    location: '',
    category: '',
    status: 'upcoming',
    image: '',
    gradient: 'from-[#003f7f] to-[#0066cc]',
    attendees: 0,
  });

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchEventos();
  }, []);

  async function fetchEventos() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/eventos');
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erro ao carregar eventos');

      if (data) {
        const mappedEventos = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          date: item.date,
          location: item.location,
          category: item.category,
          status: item.status,
          time: item.time,
          description: item.description,
          image: item.image,
          gradient: item.gradient,
          attendees: item.attendees || 0,
          registrations_count: item.registrations_count || 0
        }));
        setEventos(mappedEventos as Evento[]);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setIsLoading(false);
    }
  }

  function handleDelete(id: number) {
    setEventToDelete(id);
    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!eventToDelete) return;

    try {
      const response = await fetch(`/api/admin/eventos?id=${eventToDelete}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao excluir evento');

      toast.success('Evento excluído com sucesso');
      fetchEventos();
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      toast.error('Erro ao excluir evento');
    } finally {
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    }
  }

  const handleOpenModal = (evento?: Evento) => {
    if (evento) {
      setEditingId(evento.id);
      setFormData({
        title: evento.title,
        description: evento.description || '',
        date: evento.date,
        time: evento.time || '19:00',
        location: evento.location,
        category: evento.category,
        status: evento.status,
        image: evento.image || '',
        gradient: evento.gradient || 'from-[#003f7f] to-[#0066cc]',
        attendees: evento.attendees || 0,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        location: '',
        category: '',
        status: 'upcoming',
        image: '',
        gradient: 'from-[#003f7f] to-[#0066cc]',
        attendees: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenRegistrationList = (evento: Evento) => {
    setSelectedEventForList({ id: evento.id, title: evento.title });
    setIsRegistrationListOpen(true);
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
      uploadFormData.append('bucket', 'events');

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
      toast.error('Erro ao enviar imagem. Verifique se o bucket "events" existe.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        ...(editingId && { id: editingId }),
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        category: formData.category,
        status: formData.status,
        image: formData.image,
        gradient: formData.gradient,
        attendees: formData.attendees
      };

      const response = await fetch('/api/admin/eventos', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao salvar evento');

      toast.success(editingId ? 'Evento atualizado!' : 'Evento criado!');
      setIsModalOpen(false);
      fetchEventos();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      toast.error('Erro ao salvar evento.');
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

  const filteredEventos = eventos.filter(evento =>
    evento.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return { text: 'Próximo', color: 'bg-green-100 text-green-800' };
      case 'ongoing':
        return { text: 'Em Andamento', color: 'bg-yellow-100 text-yellow-800' };
      case 'past':
        return { text: 'Realizado', color: 'bg-gray-100 text-gray-800' };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Gerenciar Eventos
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Crie, edite e gerencie os eventos do site
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-[#00a859] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#00d670] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Novo Evento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Buscar eventos..."
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
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Evento</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Data</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Local</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Categoria</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Inscritos (Real)</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Inscritos (Site)</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="flex justify-center items-center gap-2 text-[#00a859]">
                      <FaSpinner className="animate-spin" />
                      <span>Carregando eventos...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredEventos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    Nenhum evento encontrado.
                  </td>
                </tr>
              ) : (
                filteredEventos.map((evento) => {
                  const statusBadge = getStatusBadge(evento.status);
                  return (
                    <tr key={evento.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="text-sm sm:text-base font-semibold text-gray-900">
                          {evento.title}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                        {new Date(evento.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                        {evento.location}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className="inline-block bg-[#003f7f] text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                          {evento.category}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <button
                          onClick={() => handleOpenRegistrationList(evento)}
                          className="flex items-center gap-1 text-[#003f7f] hover:underline font-medium text-sm"
                        >
                          <FaUsers className="w-4 h-4" />
                          {evento.registrations_count || 0}
                        </button>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                        {evento.attendees}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/imprensa/eventos`}
                            target="_blank"
                            className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors"
                            title="Visualizar"
                          >
                            <FaEye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenModal(evento)}
                            className="p-2 text-[#00a859] hover:bg-[#00a859] hover:text-white rounded-lg transition-colors"
                            title="Editar"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(evento.id)}
                            className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                            title="Excluir"
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
        title={editingId ? 'Editar Evento' : 'Novo Evento'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          {/* ... (Mesmo formulário anterior) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Título do Evento *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                placeholder="Ex: Workshop de Gestão Financeira"
              />
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

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Horário *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Local *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                placeholder="Ex: Auditório da CDL"
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
                <option value="">Selecione uma categoria</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Nova entrada para número de participantes */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Inscritos (Exibido no Site)
              </label>
              <input
                type="number"
                name="attendees"
                value={formData.attendees || 0}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Este é o número que aparecerá no card do evento no site.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Cor de Fundo (Card)
              </label>
              <select
                name="gradient"
                value={formData.gradient}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              >
                {GRADIENTS.map(grad => (
                  <option key={grad.name} value={grad.value}>{grad.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent resize-none"
                placeholder="Digite os detalhes do evento"
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
                    placeholder="https://exemplo.com/imagem-evento.jpg"
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

      <RegistrationListModal
        isOpen={isRegistrationListOpen}
        onClose={() => setIsRegistrationListOpen(false)}
        eventId={selectedEventForList?.id || null}
        eventTitle={selectedEventForList?.title || ''}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-6">
          <p className="text-gray-600">
            Tem certeza que deseja excluir este evento? esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
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
