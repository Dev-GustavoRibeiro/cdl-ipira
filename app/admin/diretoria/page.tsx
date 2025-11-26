'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaUsers, FaUser, FaPlus, FaEdit, FaTrash, FaSearch, FaSave, FaSpinner, FaEye, FaEyeSlash, FaUpload, FaArrowUp, FaArrowDown, FaCrown, FaBriefcase, FaUserTie } from 'react-icons/fa';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface TeamMember {
  id: number;
  name: string;
  role: 'presidente' | 'diretor' | 'colaborador';
  position: string;
  photo_url?: string;
  bio?: string;
  contribution?: string;
  function_description?: string;
  display_order: number;
  is_active: boolean;
}

const roleConfig = {
  presidente: { label: 'Presidente', icon: FaCrown, color: 'bg-[#ffd000] text-[#003f7f]' },
  diretor: { label: 'Diretor', icon: FaUserTie, color: 'bg-[#003f7f] text-white' },
  colaborador: { label: 'Colaborador', icon: FaBriefcase, color: 'bg-[#00a859] text-white' },
};

export default function AdminDiretoriaPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'presidente' | 'diretor' | 'colaborador'>('presidente');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<TeamMember>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Upload states
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{isOpen: boolean, id: number | null, name: string}>({
    isOpen: false,
    id: null,
    name: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [successDialog, setSuccessDialog] = useState<{isOpen: boolean, message: string, type: 'success' | 'edit' | 'delete'}>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
      toast.error('Erro ao carregar membros da equipe');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Imagem muito grande. Máximo permitido: 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem');
        return;
      }
      setSelectedPhoto(file);
    }
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `photos/${fileName}`;

    const { error } = await supabase.storage
      .from('team-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('team-photos')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsUploading(true);

    try {
      let photoUrl = currentMember.photo_url;

      if (selectedPhoto) {
        photoUrl = await uploadPhoto(selectedPhoto);
      }

      const memberData = {
        name: currentMember.name,
        role: currentMember.role || activeTab,
        position: currentMember.position,
        photo_url: photoUrl || null,
        bio: currentMember.bio || null,
        contribution: currentMember.contribution || null,
        function_description: currentMember.function_description || null,
        display_order: currentMember.display_order || 0,
        is_active: currentMember.is_active !== false,
      };

      let error;
      if (isEditing && currentMember.id) {
        const { error: updateError } = await supabase
          .from('team_members')
          .update(memberData)
          .eq('id', currentMember.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('team_members')
          .insert([memberData]);
        error = insertError;
      }

      if (error) throw error;

      const wasEditing = isEditing;
      await fetchMembers();
      closeModal();

      setSuccessDialog({
        isOpen: true,
        message: wasEditing
          ? 'O membro foi atualizado com sucesso!'
          : 'O novo membro foi cadastrado com sucesso!',
        type: wasEditing ? 'edit' : 'success'
      });
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
      toast.error('Erro ao salvar. Verifique se o bucket de storage foi criado.');
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const openDeleteDialog = (member: TeamMember) => {
    setDeleteDialog({
      isOpen: true,
      id: member.id,
      name: member.name
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', deleteDialog.id);

      if (error) throw error;

      setMembers(current => current.filter(m => m.id !== deleteDialog.id));
      setDeleteDialog({ isOpen: false, id: null, name: '' });

      setSuccessDialog({
        isOpen: true,
        message: 'O membro foi removido permanentemente do sistema.',
        type: 'delete'
      });
    } catch (error) {
      console.error('Erro ao excluir membro:', error);
      setDeleteDialog({ isOpen: false, id: null, name: '' });
      toast.error('Erro ao excluir membro');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ is_active: !member.is_active })
        .eq('id', member.id);

      if (error) throw error;

      toast.success(member.is_active ? 'Membro ocultado' : 'Membro ativado');
      fetchMembers();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleChangeOrder = async (member: TeamMember, direction: 'up' | 'down') => {
    const currentRoleMembers = members.filter(m => m.role === member.role);
    const currentIndex = currentRoleMembers.findIndex(m => m.id === member.id);

    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === currentRoleMembers.length - 1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapMember = currentRoleMembers[swapIndex];

    try {
      await supabase
        .from('team_members')
        .update({ display_order: swapMember.display_order })
        .eq('id', member.id);

      await supabase
        .from('team_members')
        .update({ display_order: member.display_order })
        .eq('id', swapMember.id);

      fetchMembers();
    } catch (error) {
      console.error('Erro ao reordenar:', error);
      toast.error('Erro ao reordenar');
    }
  };

  const openModal = (member?: TeamMember) => {
    if (member) {
      setCurrentMember(member);
      setIsEditing(true);
    } else {
      const maxOrder = members.filter(m => m.role === activeTab).length;
      setCurrentMember({
        role: activeTab,
        is_active: true,
        display_order: maxOrder
      });
      setIsEditing(false);
    }
    setSelectedPhoto(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMember({});
    setIsEditing(false);
    setSelectedPhoto(null);
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = m.role === activeTab;
    return matchesSearch && matchesRole;
  });

  const presidente = members.find(m => m.role === 'presidente' && m.is_active);
  const diretoresCount = members.filter(m => m.role === 'diretor').length;
  const colaboradoresCount = members.filter(m => m.role === 'colaborador').length;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Diretoria
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie presidente, diretores e colaboradores
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Novo Membro
        </button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('presidente')}
          className={`bg-white p-4 rounded-xl shadow-sm border-2 cursor-pointer transition-all ${activeTab === 'presidente' ? 'border-[#ffd000] ring-2 ring-[#ffd000]/20' : 'border-transparent hover:border-gray-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ffd000] rounded-lg flex items-center justify-center">
              <FaCrown className="w-5 h-5 text-[#003f7f]" />
            </div>
            <div>
              <div className="text-gray-500 text-xs font-bold uppercase">Presidente</div>
              <div className="text-xl font-black text-gray-900">{presidente ? '1' : '0'}</div>
            </div>
          </div>
        </div>
        <div
          onClick={() => setActiveTab('diretor')}
          className={`bg-white p-4 rounded-xl shadow-sm border-2 cursor-pointer transition-all ${activeTab === 'diretor' ? 'border-[#003f7f] ring-2 ring-[#003f7f]/20' : 'border-transparent hover:border-gray-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#003f7f] rounded-lg flex items-center justify-center">
              <FaUserTie className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-gray-500 text-xs font-bold uppercase">Diretores</div>
              <div className="text-xl font-black text-gray-900">{diretoresCount}</div>
            </div>
          </div>
        </div>
        <div
          onClick={() => setActiveTab('colaborador')}
          className={`bg-white p-4 rounded-xl shadow-sm border-2 cursor-pointer transition-all ${activeTab === 'colaborador' ? 'border-[#00a859] ring-2 ring-[#00a859]/20' : 'border-transparent hover:border-gray-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00a859] rounded-lg flex items-center justify-center">
              <FaBriefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-gray-500 text-xs font-bold uppercase">Colaboradores</div>
              <div className="text-xl font-black text-gray-900">{colaboradoresCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder={`Buscar ${roleConfig[activeTab].label.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de membros */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`px-6 py-4 ${roleConfig[activeTab].color}`}>
          <h2 className="text-lg font-bold flex items-center gap-2">
            {React.createElement(roleConfig[activeTab].icon, { className: 'w-5 h-5' })}
            {activeTab === 'presidente' ? 'Presidente' : activeTab === 'diretor' ? 'Diretores' : 'Colaboradores'}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex items-center gap-3 text-[#003f7f]">
              <FaSpinner className="animate-spin w-6 h-6" />
              <span className="text-lg font-medium">Carregando...</span>
            </div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-16">
            <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Nenhum {roleConfig[activeTab].label.toLowerCase()} cadastrado
            </h3>
            <p className="text-gray-500 mb-4">Clique em &quot;Novo Membro&quot; para adicionar.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredMembers.map((member, index) => (
              <div key={member.id} className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${!member.is_active ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4">
                  {/* Foto */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    {member.photo_url ? (
                      <Image
                        src={member.photo_url}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FaUser className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.position}</p>
                    {member.function_description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{member.function_description}</p>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    {activeTab !== 'presidente' && (
                      <>
                        <button
                          onClick={() => handleChangeOrder(member, 'up')}
                          disabled={index === 0}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
                          title="Mover para cima"
                        >
                          <FaArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleChangeOrder(member, 'down')}
                          disabled={index === filteredMembers.length - 1}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
                          title="Mover para baixo"
                        >
                          <FaArrowDown className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleToggleActive(member)}
                      className={`p-2 rounded-lg transition-colors ${
                        member.is_active
                          ? 'text-green-600 hover:bg-green-100'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                      title={member.is_active ? 'Ocultar' : 'Ativar'}
                    >
                      {member.is_active ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openModal(member)}
                      className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors"
                      title="Editar"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteDialog(member)}
                      className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Edição/Criação */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Editar Membro' : 'Novo Membro'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          {/* Foto */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Foto</label>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />

            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 shrink-0">
                {selectedPhoto ? (
                  <Image
                    src={URL.createObjectURL(selectedPhoto)}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : currentMember.photo_url ? (
                  <Image
                    src={currentMember.photo_url}
                    alt="Foto atual"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FaUser className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <FaUpload className="w-4 h-4" />
                  {selectedPhoto ? 'Trocar foto' : 'Selecionar foto'}
                </button>
                {selectedPhoto && (
                  <p className="text-xs text-gray-500 mt-2">{selectedPhoto.name} ({formatFileSize(selectedPhoto.size)})</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome *</label>
              <input
                type="text"
                required
                value={currentMember.name || ''}
                onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tipo *</label>
              <select
                value={currentMember.role || activeTab}
                onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value as 'presidente' | 'diretor' | 'colaborador' })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              >
                <option value="presidente">Presidente</option>
                <option value="diretor">Diretor</option>
                <option value="colaborador">Colaborador</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Cargo *</label>
            <input
              type="text"
              required
              value={currentMember.position || ''}
              onChange={(e) => setCurrentMember({ ...currentMember, position: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              placeholder="Ex: Vice-Presidente, Diretor Financeiro, Secretária"
            />
          </div>

          {currentMember.role === 'presidente' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Biografia</label>
              <textarea
                value={currentMember.bio || ''}
                onChange={(e) => setCurrentMember({ ...currentMember, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent resize-none"
                placeholder="Breve biografia do presidente"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Função</label>
            <input
              type="text"
              value={currentMember.function_description || ''}
              onChange={(e) => setCurrentMember({ ...currentMember, function_description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              placeholder="Descrição das funções"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Contribuição</label>
            <textarea
              value={currentMember.contribution || ''}
              onChange={(e) => setCurrentMember({ ...currentMember, contribution: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent resize-none"
              placeholder="Principais contribuições"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="is_active"
              checked={currentMember.is_active !== false}
              onChange={(e) => setCurrentMember({ ...currentMember, is_active: e.target.checked })}
              className="w-5 h-5 text-[#00a859] border-gray-300 rounded focus:ring-[#00a859]"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Membro visível no site
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {isUploading ? 'Enviando foto...' : 'Salvando...'}
                </>
              ) : (
                <>
                  <FaSave />
                  Salvar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={closeModal}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* Dialog de Confirmação de Exclusão */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null, name: '' })}
        onConfirm={handleConfirmDelete}
        title="Excluir Membro"
        message={`Tem certeza que deseja excluir ${deleteDialog.name}? Esta ação não pode ser desfeita.`}
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
          successDialog.type === 'delete' ? 'Membro Removido' :
          successDialog.type === 'edit' ? 'Membro Atualizado' :
          'Membro Cadastrado'
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
