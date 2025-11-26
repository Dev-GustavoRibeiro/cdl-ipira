'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaDownload, FaFileAlt, FaSearch, FaSpinner, FaSave, FaEye, FaEyeSlash, FaFilePdf, FaFileWord, FaFileExcel, FaFile, FaUpload, FaLink, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Documento {
  id: number;
  title: string;
  description?: string;
  type: string;
  category?: string;
  date: string;
  file_url: string;
  is_active: boolean;
}

const categorias = [
  'Prestação de Contas',
  'Relatórios Anuais',
  'Demonstrativos Financeiros',
  'Estatuto e Regimento',
  'Atas de Reunião',
  'Outros'
];

const tiposArquivo = [
  { value: 'PDF', label: 'PDF', icon: FaFilePdf, color: 'text-red-500', extensions: ['.pdf'] },
  { value: 'DOC', label: 'Word', icon: FaFileWord, color: 'text-blue-500', extensions: ['.doc', '.docx'] },
  { value: 'XLS', label: 'Excel', icon: FaFileExcel, color: 'text-green-500', extensions: ['.xls', '.xlsx'] },
  { value: 'Outro', label: 'Outro', icon: FaFile, color: 'text-gray-500', extensions: [] },
];

export default function AdminPortalTransparenciaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDocumento, setCurrentDocumento] = useState<Partial<Documento>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estados para upload de arquivo
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const fetchDocumentos = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transparency_documents')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setDocumentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      toast.error('Erro ao carregar documentos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  // Detectar tipo de arquivo pela extensão
  const detectFileType = (filename: string): string => {
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    for (const tipo of tiposArquivo) {
      if (tipo.extensions.includes(ext)) {
        return tipo.value;
      }
    }
    return 'Outro';
  };

  // Handler para seleção de arquivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar tamanho (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo permitido: 50MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Auto-detectar tipo
      const detectedType = detectFileType(file.name);
      setCurrentDocumento(prev => ({ ...prev, type: detectedType }));
      
      // Sugerir título se estiver vazio
      if (!currentDocumento.title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setCurrentDocumento(prev => ({ ...prev, title: nameWithoutExt }));
      }
    }
  };

  // Upload do arquivo para o Supabase Storage
  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data, error } = await supabase.storage
        .from('transparency-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('transparency-documents')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let fileUrl = currentDocumento.file_url;

      // Se tem arquivo selecionado, fazer upload
      if (uploadMode === 'file' && selectedFile) {
        fileUrl = await uploadFile(selectedFile);
      }

      if (!fileUrl) {
        toast.error('Por favor, selecione um arquivo ou informe uma URL');
        setIsSaving(false);
        return;
      }

      const docData = {
        title: currentDocumento.title,
        description: currentDocumento.description || null,
        type: currentDocumento.type || 'PDF',
        category: currentDocumento.category || null,
        date: currentDocumento.date,
        file_url: fileUrl,
        is_active: currentDocumento.is_active !== false,
      };

      let error;
      if (isEditing && currentDocumento.id) {
        const { error: updateError } = await supabase
          .from('transparency_documents')
          .update(docData)
          .eq('id', currentDocumento.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('transparency_documents')
          .insert([docData]);
        error = insertError;
      }

      if (error) throw error;
      
      const wasEditing = isEditing;
      await fetchDocumentos();
      closeModal();
      
      setSuccessDialog({
        isOpen: true,
        message: wasEditing 
          ? 'O documento foi atualizado com sucesso!' 
          : 'O novo documento foi cadastrado com sucesso!',
        type: wasEditing ? 'edit' : 'success'
      });
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      toast.error('Erro ao salvar documento. Verifique se o bucket de storage foi criado.');
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteDialog = (doc: Documento) => {
    setDeleteDialog({
      isOpen: true,
      id: doc.id,
      title: doc.title
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('transparency_documents')
        .delete()
        .eq('id', deleteDialog.id);

      if (error) throw error;

      setDocumentos(current => current.filter(d => d.id !== deleteDialog.id));
      setDeleteDialog({ isOpen: false, id: null, title: '' });
      
      setSuccessDialog({
        isOpen: true,
        message: 'O documento foi excluído permanentemente do sistema.',
        type: 'delete'
      });
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      setDeleteDialog({ isOpen: false, id: null, title: '' });
      toast.error('Erro ao excluir documento');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (doc: Documento) => {
    try {
      const { error } = await supabase
        .from('transparency_documents')
        .update({ is_active: !doc.is_active })
        .eq('id', doc.id);

      if (error) throw error;
      
      toast.success(doc.is_active ? 'Documento ocultado' : 'Documento ativado');
      fetchDocumentos();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const openModal = (doc?: Documento) => {
    if (doc) {
      setCurrentDocumento(doc);
      setIsEditing(true);
      setUploadMode('url'); // Em edição, mostra a URL existente
    } else {
      setCurrentDocumento({ 
        date: new Date().toISOString().split('T')[0],
        type: 'PDF',
        is_active: true
      });
      setIsEditing(false);
      setUploadMode('file'); // Em novo, começa com upload de arquivo
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDocumento({});
    setIsEditing(false);
    setSelectedFile(null);
    setUploadMode('file');
    setUploadProgress(0);
  };

  const getFileIcon = (type: string) => {
    const tipoConfig = tiposArquivo.find(t => t.value === type) || tiposArquivo[3];
    const Icon = tipoConfig.icon;
    return <Icon className={`w-5 h-5 ${tipoConfig.color}`} />;
  };

  const filteredDocumentos = documentos.filter(doc => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Formatar tamanho do arquivo
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
            Portal Transparência
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie os documentos do Portal de Transparência
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Novo Documento
        </button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-transparent">
          <div className="text-gray-500 text-xs font-bold uppercase mb-1">Total de Documentos</div>
          <div className="text-2xl font-black text-gray-900">{documentos.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-transparent">
          <div className="text-[#00a859] text-xs font-bold uppercase mb-1">Documentos Ativos</div>
          <div className="text-2xl font-black text-gray-900">{documentos.filter(d => d.is_active).length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-transparent">
          <div className="text-[#b39200] text-xs font-bold uppercase mb-1">Ocultos</div>
          <div className="text-2xl font-black text-gray-900">{documentos.filter(d => !d.is_active).length}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent bg-white"
          >
            <option value="all">Todas as categorias</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#003f7f] text-white">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Documento</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold hidden md:table-cell">Categoria</th>
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
                      <span>Carregando documentos...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredDocumentos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Nenhum documento encontrado.
                  </td>
                </tr>
              ) : (
                filteredDocumentos.map((doc) => (
                  <tr key={doc.id} className={`hover:bg-gray-50 ${!doc.is_active ? 'opacity-60' : ''}`}>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getFileIcon(doc.type)}
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-gray-900">
                            {doc.title}
                          </div>
                          {doc.description && (
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {doc.description}
                            </div>
                          )}
                          <span className="inline-block md:hidden bg-gray-100 px-2 py-0.5 rounded text-xs mt-1">
                            {doc.category || 'Sem categoria'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <span className="inline-block bg-[#003f7f]/10 text-[#003f7f] px-3 py-1 rounded-full text-xs font-bold">
                        {doc.category || 'Sem categoria'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                      {new Date(doc.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <button 
                        onClick={() => handleToggleActive(doc)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 shadow-sm ${
                          doc.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={doc.is_active ? "Clique para ocultar" : "Clique para ativar"}
                      >
                        {doc.is_active ? (
                          <>
                            <FaEye className="w-3 h-3" /> Visível
                          </>
                        ) : (
                          <>
                            <FaEyeSlash className="w-3 h-3" /> Oculto
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <a 
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors" 
                          title="Download"
                        >
                          <FaDownload className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openModal(doc)}
                          className="p-2 text-[#00a859] hover:bg-[#00a859] hover:text-white rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(doc)}
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

      {/* Modal de Edição/Criação */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Editar Documento' : 'Novo Documento'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Título do Documento *</label>
            <input
              type="text"
              required
              value={currentDocumento.title || ''}
              onChange={(e) => setCurrentDocumento({ ...currentDocumento, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              placeholder="Ex: Prestação de Contas 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
            <textarea
              value={currentDocumento.description || ''}
              onChange={(e) => setCurrentDocumento({ ...currentDocumento, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent resize-none"
              placeholder="Breve descrição do documento (opcional)"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
              <select
                value={currentDocumento.category || ''}
                onChange={(e) => setCurrentDocumento({ ...currentDocumento, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              >
                <option value="">Selecione...</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Arquivo</label>
              <select
                value={currentDocumento.type || 'PDF'}
                onChange={(e) => setCurrentDocumento({ ...currentDocumento, type: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              >
                {tiposArquivo.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Data *</label>
              <input
                type="date"
                required
                value={currentDocumento.date ? currentDocumento.date.split('T')[0] : ''}
                onChange={(e) => setCurrentDocumento({ ...currentDocumento, date: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
              />
            </div>
          </div>

          {/* Seleção de modo de upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Arquivo *</label>
            
            {/* Tabs para alternar entre upload e URL */}
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
                {/* Input hidden para o arquivo */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {/* Área de drop/seleção */}
                {!selectedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#003f7f] hover:bg-[#003f7f]/5 transition-all"
                  >
                    <FaCloudUploadAlt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium mb-1">
                      Clique para selecionar um arquivo
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, Word, Excel ou Imagens (máx. 50MB)
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        {getFileIcon(currentDocumento.type || 'Outro')}
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
                    
                    {/* Barra de progresso */}
                    {isUploading && (
                      <div className="mt-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#00a859] transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          Enviando... {uploadProgress}%
                        </p>
                      </div>
                    )}
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
                  value={currentDocumento.file_url || ''}
                  onChange={(e) => setCurrentDocumento({ ...currentDocumento, file_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Cole o link direto para o arquivo (Google Drive, Dropbox, etc.)
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="is_active"
              checked={currentDocumento.is_active !== false}
              onChange={(e) => setCurrentDocumento({ ...currentDocumento, is_active: e.target.checked })}
              className="w-5 h-5 text-[#00a859] border-gray-300 rounded focus:ring-[#00a859]"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Documento visível no site
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving || isUploading || (uploadMode === 'file' && !selectedFile && !isEditing) || (uploadMode === 'url' && !currentDocumento.file_url)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving || isUploading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {isUploading ? 'Enviando arquivo...' : 'Salvando...'}
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
              disabled={isSaving || isUploading}
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
        title="Excluir Documento"
        message={`Tem certeza que deseja excluir o documento "${deleteDialog.title}"? Esta ação não pode ser desfeita.`}
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
          successDialog.type === 'delete' ? 'Documento Excluído' :
          successDialog.type === 'edit' ? 'Documento Atualizado' :
          'Documento Cadastrado'
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
