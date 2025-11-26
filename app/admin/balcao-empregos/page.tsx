'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaBriefcase, FaCheckCircle, FaSpinner, FaSave, FaEnvelope, FaPhone, FaUser, FaFileAlt } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import ResumeManagerModal from '../components/ResumeManagerModal';
import { auditLog } from '@/lib/audit';

interface Vaga {
  id: number;
  title: string;
  company: string;
  quantity: number;
  date: string;
  status: 'active' | 'pending' | 'closed';
  is_active?: boolean;
  description?: string;
  location?: string;
  category?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
}

export default function AdminBalcaoEmpregosPage() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'closed'>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedJobForResumes, setSelectedJobForResumes] = useState<{id: number, title: string} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Dialog states para alertas personalizados
  const [deleteDialog, setDeleteDialog] = useState<{isOpen: boolean, id: number | null, title: string}>({
    isOpen: false,
    id: null,
    title: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [successDialog, setSuccessDialog] = useState<{isOpen: boolean, message: string, type: 'success' | 'edit' | 'delete'}>({
    isOpen: false,
    message: '',
    type: 'success'
  });
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    quantity: 1,
    description: '',
    location: '',
    category: '',
    status: 'active',
    contact_name: '',
    contact_email: '',
    contact_phone: ''
  });

  useEffect(() => {
    fetchVagas();
  }, []);

  async function fetchVagas() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedVagas = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          company: item.company,
          quantity: item.quantity,
          date: item.date ? new Date(item.date).toLocaleDateString('pt-BR') : '',
          status: item.is_active ? 'active' : 'pending',
          is_active: item.is_active,
          description: item.description,
          location: item.location,
          category: item.category,
          contact_name: item.contact_name,
          contact_email: item.contact_email,
          contact_phone: item.contact_phone
        }));
        setVagas(mappedVagas as Vaga[]);
      }
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
      toast.error('Erro ao carregar vagas');
    } finally {
      setIsLoading(false);
    }
  }

  function openDeleteDialog(vaga: Vaga) {
    setDeleteDialog({
      isOpen: true,
      id: vaga.id,
      title: vaga.title
    });
  }

  async function handleConfirmDelete() {
    if (!deleteDialog.id) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', deleteDialog.id);

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }

      // Registrar auditoria
      auditLog.delete('jobs', deleteDialog.id.toString(), deleteDialog.title);

      // Atualiza o estado local removendo a vaga
      setVagas(currentVagas => currentVagas.filter(v => v.id !== deleteDialog.id));
      
      // Fecha o dialog de confirmação
      setDeleteDialog({ isOpen: false, id: null, title: '' });
      
      // Mostra o dialog de sucesso
      setSuccessDialog({
        isOpen: true,
        message: 'A vaga foi excluída permanentemente do sistema.',
        type: 'delete'
      });
    } catch (error) {
      console.error('Erro ao excluir vaga:', error);
      setDeleteDialog({ isOpen: false, id: null, title: '' });
      toast.error('Erro ao excluir vaga. Verifique as permissões no banco de dados.');
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleToggleStatus(id: number, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(currentStatus ? 'Vaga desativada' : 'Vaga ativada com sucesso');
      fetchVagas();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  }

  const handleOpenResumes = (vaga: Vaga) => {
    setSelectedJobForResumes({ id: vaga.id, title: vaga.title });
    setIsResumeModalOpen(true);
  };

  const handleOpenModal = (vaga?: Vaga) => {
    if (vaga) {
      setEditingId(vaga.id);
      setFormData({
        title: vaga.title,
        company: vaga.company,
        quantity: vaga.quantity,
        description: vaga.description || '',
        location: vaga.location || '',
        category: vaga.category || '',
        status: vaga.is_active ? 'active' : 'pending',
        contact_name: vaga.contact_name || '',
        contact_email: vaga.contact_email || '',
        contact_phone: vaga.contact_phone || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        company: '',
        quantity: 1,
        description: '',
        location: '',
        category: '',
        status: 'active',
        contact_name: '',
        contact_email: '',
        contact_phone: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        title: formData.title,
        company: formData.company,
        quantity: formData.quantity,
        description: formData.description,
        location: formData.location,
        category: formData.category,
        is_active: formData.status === 'active',
        date: editingId ? undefined : new Date().toISOString().split('T')[0],
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone
      };

      let error;
      let newId: number | null = null;
      const wasEditing = !!editingId;

      if (editingId) {
        const { error: updateError } = await supabase
          .from('jobs')
          .update(payload)
          .eq('id', editingId);
        error = updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('jobs')
          .insert([payload])
          .select('id')
          .single();
        error = insertError;
        newId = data?.id;
      }

      if (error) throw error;

      // Registrar auditoria
      if (wasEditing && editingId) {
        auditLog.update('jobs', editingId.toString(), formData.title);
      } else if (newId) {
        auditLog.create('jobs', newId.toString(), formData.title);
      }

      setIsModalOpen(false);
      fetchVagas();
      
      // Mostra o dialog de sucesso
      setSuccessDialog({
        isOpen: true,
        message: wasEditing 
          ? 'A vaga foi atualizada com sucesso!' 
          : 'A nova vaga foi cadastrada com sucesso!',
        type: wasEditing ? 'edit' : 'success'
      });
    } catch (error) {
      console.error('Erro ao salvar vaga:', error);
      toast.error('Erro ao salvar vaga.');
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

  const filteredVagas = vagas.filter(vaga => {
    const matchesSearch = vaga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vaga.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'active') return matchesSearch && vaga.is_active;
    if (filterStatus === 'pending') return matchesSearch && !vaga.is_active;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Gerenciar Vagas
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Aprove vagas pendentes e gerencie as existentes
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Nova Vaga
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setFilterStatus('all')}
          className={`bg-white p-4 rounded-xl shadow-sm border-2 cursor-pointer transition-all ${filterStatus === 'all' ? 'border-[#003f7f] ring-2 ring-[#003f7f]/20' : 'border-transparent hover:border-gray-200'}`}
        >
          <div className="text-gray-500 text-xs font-bold uppercase mb-1">Total de Vagas</div>
          <div className="text-2xl font-black text-gray-900">{vagas.length}</div>
        </div>
        <div 
          onClick={() => setFilterStatus('active')}
          className={`bg-white p-4 rounded-xl shadow-sm border-2 cursor-pointer transition-all ${filterStatus === 'active' ? 'border-[#00a859] ring-2 ring-[#00a859]/20' : 'border-transparent hover:border-gray-200'}`}
        >
          <div className="text-[#00a859] text-xs font-bold uppercase mb-1">Vagas Ativas</div>
          <div className="text-2xl font-black text-gray-900">{vagas.filter(v => v.is_active).length}</div>
        </div>
        <div 
          onClick={() => setFilterStatus('pending')}
          className={`bg-white p-4 rounded-xl shadow-sm border-2 cursor-pointer transition-all ${filterStatus === 'pending' ? 'border-[#ffd000] ring-2 ring-[#ffd000]/20' : 'border-transparent hover:border-gray-200'}`}
        >
          <div className="text-[#b39200] text-xs font-bold uppercase mb-1">Pendentes/Inativas</div>
          <div className="text-2xl font-black text-gray-900">{vagas.filter(v => !v.is_active).length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Buscar por vaga ou empresa..."
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
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Vaga / Empresa</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Contato</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    <div className="flex justify-center items-center gap-2 text-[#003f7f]">
                      <FaSpinner className="animate-spin" />
                      <span>Carregando vagas...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredVagas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    Nenhuma vaga encontrada.
                  </td>
                </tr>
              ) : (
                filteredVagas.map((vaga) => (
                  <tr key={vaga.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-base">{vaga.title}</span>
                        <span className="text-sm text-gray-600">{vaga.company}</span>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{vaga.quantity} vaga(s)</span>
                          <span>{vaga.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      {(vaga.contact_name || vaga.contact_email || vaga.contact_phone) ? (
                        <div className="text-sm text-gray-600 space-y-1">
                          {vaga.contact_name && (
                            <div className="flex items-center gap-1.5">
                              <FaUser className="w-3 h-3 text-gray-400" />
                              {vaga.contact_name}
                            </div>
                          )}
                          {vaga.contact_email && (
                            <div className="flex items-center gap-1.5">
                              <FaEnvelope className="w-3 h-3 text-gray-400" />
                              {vaga.contact_email}
                            </div>
                          )}
                          {vaga.contact_phone && (
                            <div className="flex items-center gap-1.5">
                              <FaPhone className="w-3 h-3 text-gray-400" />
                              {vaga.contact_phone}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Sem contato</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <button 
                        onClick={() => handleToggleStatus(vaga.id, !!vaga.is_active)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 shadow-sm ${
                          vaga.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                        title={vaga.is_active ? "Clique para desativar" : "Clique para ativar (aprovar)"}
                      >
                        {vaga.is_active ? (
                          <>
                            <FaCheckCircle /> Ativa
                          </>
                        ) : (
                          <>
                            <FaSpinner /> Pendente
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenResumes(vaga)}
                          className="p-2 text-[#003f7f] bg-blue-50 hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors"
                          title="Gerenciar Currículos"
                        >
                          <FaFileAlt className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/produtos/balcao-empregos`}
                          target="_blank"
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Visualizar no site"
                        >
                          <FaEye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenModal(vaga)}
                          className="p-2 text-[#00a859] hover:bg-[#00a859] hover:text-white rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(vaga)}
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
        title={editingId ? 'Editar Vaga' : 'Nova Vaga'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Título da Vaga *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                placeholder="Ex: Vendedor Externo"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Empresa *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                placeholder="Nome da Empresa"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Quantidade *
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Local
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                placeholder="Ex: Centro, Ipirá"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              >
                <option value="active">Ativa (Visível no site)</option>
                <option value="pending">Pendente (Oculta)</option>
              </select>
            </div>

            <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
              <h4 className="font-bold text-[#003f7f] mb-3">Informações de Contato (Interno)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nome do Contato
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Telefone do Contato
                  </label>
                  <input
                    type="text"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email do Contato
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Descrição da Vaga *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent resize-none"
                placeholder="Descreva os requisitos e benefícios da vaga"
              />
            </div>
          </div>

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

      {selectedJobForResumes && (
        <ResumeManagerModal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
          jobId={selectedJobForResumes.id}
          jobTitle={selectedJobForResumes.title}
        />
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null, title: '' })}
        onConfirm={handleConfirmDelete}
        title="Excluir Vaga"
        message={`Tem certeza que deseja excluir a vaga "${deleteDialog.title}"? Esta ação não pode ser desfeita.`}
        type="delete"
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />

      {/* Dialog de Sucesso */}
      <ConfirmDialog
        isOpen={successDialog.isOpen}
        onClose={() => setSuccessDialog({ isOpen: false, message: '', type: 'success' })}
        title={
          successDialog.type === 'delete' ? 'Vaga Excluída' :
          successDialog.type === 'edit' ? 'Vaga Atualizada' :
          'Vaga Cadastrada'
        }
        message={successDialog.message}
        type={successDialog.type === 'delete' ? 'success' : successDialog.type}
        confirmText="OK"
        showCancel={false}
        onConfirm={() => setSuccessDialog({ isOpen: false, message: '', type: 'success' })}
      />
    </div>
  );
}
