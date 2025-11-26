'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaEye, FaBook, FaSearch, FaSpinner, FaSave, FaEyeSlash, FaUpload, FaLink, FaCloudUploadAlt, FaTimes, FaDownload, FaImage } from 'react-icons/fa';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Magazine {
  id: number;
  title: string;
  description?: string;
  edition?: string;
  date: string;
  cover_url?: string;
  file_url: string;
  is_active: boolean;
}

export default function AdminRevistaCDLPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMagazine, setCurrentMagazine] = useState<Partial<Magazine>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estados para upload de arquivos
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

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

  const fetchMagazines = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('magazines')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setMagazines(data || []);
    } catch (error) {
      console.error('Erro ao carregar revistas:', error);
      toast.error('Erro ao carregar revistas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMagazines();
  }, []);

  // Handler para seleção do arquivo PDF
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo permitido: 100MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        toast.error('Por favor, selecione um arquivo PDF');
        return;
      }
      setSelectedFile(file);
      
      // Sugerir título se estiver vazio
      if (!currentMagazine.title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setCurrentMagazine(prev => ({ ...prev, title: nameWithoutExt }));
      }
    }
  };

  // Handler para seleção da capa
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setSelectedCover(file);
    }
  };

  // Upload do arquivo para o Supabase Storage
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('magazines')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('magazines')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsUploading(true);

    try {
      let fileUrl = currentMagazine.file_url;
      let coverUrl = currentMagazine.cover_url;

      // Upload do PDF
      if (uploadMode === 'file' && selectedFile) {
        fileUrl = await uploadFile(selectedFile, 'pdfs');
      }

      // Upload da capa
      if (selectedCover) {
        coverUrl = await uploadFile(selectedCover, 'covers');
      }

      if (!fileUrl) {
        toast.error('Por favor, selecione um arquivo PDF ou informe uma URL');
        setIsSaving(false);
        setIsUploading(false);
        return;
      }

      const magazineData = {
        title: currentMagazine.title,
        description: currentMagazine.description || null,
        edition: currentMagazine.edition || null,
        date: currentMagazine.date,
        cover_url: coverUrl || null,
        file_url: fileUrl,
        is_active: currentMagazine.is_active !== false,
      };

      let error;
      if (isEditing && currentMagazine.id) {
        const { error: updateError } = await supabase
          .from('magazines')
          .update(magazineData)
          .eq('id', currentMagazine.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('magazines')
          .insert([magazineData]);
        error = insertError;
      }

      if (error) throw error;
      
      const wasEditing = isEditing;
      await fetchMagazines();
      closeModal();
      
      setSuccessDialog({
        isOpen: true,
        message: wasEditing 
          ? 'A revista foi atualizada com sucesso!' 
          : 'A nova edição foi cadastrada com sucesso!',
        type: wasEditing ? 'edit' : 'success'
      });
    } catch (error) {
      console.error('Erro ao salvar revista:', error);
      toast.error('Erro ao salvar revista. Verifique se o bucket de storage foi criado.');
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const openDeleteDialog = (magazine: Magazine) => {
    setDeleteDialog({
      isOpen: true,
      id: magazine.id,
      title: magazine.title
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('magazines')
        .delete()
        .eq('id', deleteDialog.id);

      if (error) throw error;

      setMagazines(current => current.filter(m => m.id !== deleteDialog.id));
      setDeleteDialog({ isOpen: false, id: null, title: '' });
      
      setSuccessDialog({
        isOpen: true,
        message: 'A revista foi excluída permanentemente do sistema.',
        type: 'delete'
      });
    } catch (error) {
      console.error('Erro ao excluir revista:', error);
      setDeleteDialog({ isOpen: false, id: null, title: '' });
      toast.error('Erro ao excluir revista');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (magazine: Magazine) => {
    try {
      const { error } = await supabase
        .from('magazines')
        .update({ is_active: !magazine.is_active })
        .eq('id', magazine.id);

      if (error) throw error;
      
      toast.success(magazine.is_active ? 'Revista ocultada' : 'Revista ativada');
      fetchMagazines();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const openModal = (magazine?: Magazine) => {
    if (magazine) {
      setCurrentMagazine(magazine);
      setIsEditing(true);
      setUploadMode('url');
    } else {
      setCurrentMagazine({ 
        date: new Date().toISOString().split('T')[0],
        is_active: true
      });
      setIsEditing(false);
      setUploadMode('file');
    }
    setSelectedFile(null);
    setSelectedCover(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMagazine({});
    setIsEditing(false);
    setSelectedFile(null);
    setSelectedCover(null);
    setUploadMode('file');
  };

  const filteredMagazines = magazines.filter(mag =>
    mag.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Revista CDL
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie as edições da Revista CDL
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Nova Edição
        </button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-transparent">
          <div className="text-gray-500 text-xs font-bold uppercase mb-1">Total de Edições</div>
          <div className="text-2xl font-black text-gray-900">{magazines.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-transparent">
          <div className="text-[#00a859] text-xs font-bold uppercase mb-1">Edições Ativas</div>
          <div className="text-2xl font-black text-gray-900">{magazines.filter(m => m.is_active).length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-transparent">
          <div className="text-[#b39200] text-xs font-bold uppercase mb-1">Ocultas</div>
          <div className="text-2xl font-black text-gray-900">{magazines.filter(m => !m.is_active).length}</div>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Buscar edições..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          />
        </div>
      </div>

      {/* Grid de revistas */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="flex items-center gap-3 text-[#003f7f]">
            <FaSpinner className="animate-spin w-6 h-6" />
            <span className="text-lg font-medium">Carregando revistas...</span>
          </div>
        </div>
      ) : filteredMagazines.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhuma edição encontrada</h3>
          <p className="text-gray-500">Clique em "Nova Edição" para adicionar uma revista.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredMagazines.map((magazine) => (
            <div 
              key={magazine.id} 
              className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ${!magazine.is_active ? 'opacity-60' : ''}`}
            >
              {/* Capa */}
              <div className="relative h-56 bg-gradient-to-br from-[#003f7f] to-[#0052a3] flex items-center justify-center overflow-hidden">
                {magazine.cover_url ? (
                  <Image
                    src={magazine.cover_url}
                    alt={magazine.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <FaBook className="w-20 h-20 text-white/30" />
                )}
                {/* Badge de status */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${
                  magazine.is_active 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-500 text-white'
                }`}>
                  {magazine.is_active ? 'Ativo' : 'Oculto'}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-1 line-clamp-2">
                  {magazine.title}
                </h3>
                {magazine.edition && (
                  <p className="text-sm text-gray-500 mb-1">Edição: {magazine.edition}</p>
                )}
                <p className="text-sm text-gray-600 mb-4">
                  {new Date(magazine.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </p>

                {/* Ações */}
                <div className="flex items-center gap-2">
                  <a
                    href={magazine.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-3 py-2 rounded-lg font-bold hover:bg-[#0066cc] transition-colors text-sm"
                  >
                    <FaDownload className="w-3 h-3" />
                    PDF
                  </a>
                  <button
                    onClick={() => handleToggleActive(magazine)}
                    className={`p-2 rounded-lg transition-colors ${
                      magazine.is_active 
                        ? 'text-green-600 hover:bg-green-100' 
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    title={magazine.is_active ? 'Ocultar' : 'Ativar'}
                  >
                    {magazine.is_active ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openModal(magazine)}
                    className="p-2 text-[#00a859] hover:bg-[#00a859] hover:text-white rounded-lg transition-colors"
                    title="Editar"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteDialog(magazine)}
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

      {/* Modal de Edição/Criação */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Editar Revista' : 'Nova Edição'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Título *</label>
            <input
              type="text"
              required
              value={currentMagazine.title || ''}
              onChange={(e) => setCurrentMagazine({ ...currentMagazine, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              placeholder="Ex: Revista CDL - Edição Janeiro 2025"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Edição</label>
              <input
                type="text"
                value={currentMagazine.edition || ''}
                onChange={(e) => setCurrentMagazine({ ...currentMagazine, edition: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                placeholder="Ex: 01/2025"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Data *</label>
              <input
                type="date"
                required
                value={currentMagazine.date ? currentMagazine.date.split('T')[0] : ''}
                onChange={(e) => setCurrentMagazine({ ...currentMagazine, date: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
            <textarea
              value={currentMagazine.description || ''}
              onChange={(e) => setCurrentMagazine({ ...currentMagazine, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent resize-none"
              placeholder="Breve descrição do conteúdo (opcional)"
            />
          </div>

          {/* Upload de Capa */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Imagem da Capa</label>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverSelect}
              className="hidden"
            />
            
            {!selectedCover && !currentMagazine.cover_url ? (
              <div
                onClick={() => coverInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#003f7f] hover:bg-[#003f7f]/5 transition-all"
              >
                <FaImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm font-medium">Clique para selecionar uma imagem de capa</p>
                <p className="text-xs text-gray-500">JPG, PNG ou WebP (máx. 10MB)</p>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                <div className="w-16 h-20 bg-gray-200 rounded-lg overflow-hidden relative">
                  {selectedCover ? (
                    <Image
                      src={URL.createObjectURL(selectedCover)}
                      alt="Nova capa"
                      fill
                      className="object-cover"
                    />
                  ) : currentMagazine.cover_url ? (
                    <Image
                      src={currentMagazine.cover_url}
                      alt="Capa atual"
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {selectedCover ? selectedCover.name : 'Capa atual'}
                  </p>
                  {selectedCover && (
                    <p className="text-sm text-gray-500">{formatFileSize(selectedCover.size)}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCover(null);
                    if (!isEditing) setCurrentMagazine(prev => ({ ...prev, cover_url: undefined }));
                  }}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="mt-2 text-sm text-[#003f7f] hover:underline"
            >
              {selectedCover || currentMagazine.cover_url ? 'Trocar imagem' : ''}
            </button>
          </div>

          {/* Upload de PDF */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Arquivo PDF *</label>
            
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                  uploadMode === 'file'
                    ? 'bg-[#003f7f] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaUpload className="w-4 h-4" />
                Upload do Computador
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                  uploadMode === 'url'
                    ? 'bg-[#003f7f] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaLink className="w-4 h-4" />
                Informar URL
              </button>
            </div>

            {uploadMode === 'file' ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {!selectedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#003f7f] hover:bg-[#003f7f]/5 transition-all"
                  >
                    <FaCloudUploadAlt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium mb-1">Clique para selecionar o PDF</p>
                    <p className="text-xs text-gray-500">Máximo 100MB</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <FaBook className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  {selectedFile ? 'Trocar arquivo' : 'Selecionar arquivo'}
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  value={currentMagazine.file_url || ''}
                  onChange={(e) => setCurrentMagazine({ ...currentMagazine, file_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">Cole o link direto para o arquivo PDF</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="is_active"
              checked={currentMagazine.is_active !== false}
              onChange={(e) => setCurrentMagazine({ ...currentMagazine, is_active: e.target.checked })}
              className="w-5 h-5 text-[#00a859] border-gray-300 rounded focus:ring-[#00a859]"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Revista visível no site
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving || (uploadMode === 'file' && !selectedFile && !isEditing) || (uploadMode === 'url' && !currentMagazine.file_url)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {isUploading ? 'Enviando arquivos...' : 'Salvando...'}
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
        onClose={() => setDeleteDialog({ isOpen: false, id: null, title: '' })}
        onConfirm={handleConfirmDelete}
        title="Excluir Revista"
        message={`Tem certeza que deseja excluir "${deleteDialog.title}"? Esta ação não pode ser desfeita.`}
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
          successDialog.type === 'delete' ? 'Revista Excluída' :
          successDialog.type === 'edit' ? 'Revista Atualizada' :
          'Revista Cadastrada'
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
