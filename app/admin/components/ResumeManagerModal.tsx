'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaCloudUploadAlt, FaTrash, FaFilePdf, FaFileAlt, FaSpinner, FaDownload } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Resume {
  id: number;
  job_id: number;
  candidate_name: string;
  candidate_email?: string;
  candidate_phone?: string;
  file_url: string;
  created_at: string;
  notes?: string;
}

interface ResumeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: number | null;
  jobTitle: string;
}

export default function ResumeManagerModal({ isOpen, onClose, jobId, jobTitle }: ResumeManagerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const fetchResumes = useCallback(async () => {
    if (!jobId) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error('Erro ao carregar currículos:', error);
      toast.error('Erro ao carregar currículos.');
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchResumes();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, jobId, fetchResumes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Validar tamanho (ex: máx 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('O arquivo deve ter no máximo 5MB.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobId || !name) {
      toast.warning('Preencha o nome e selecione um arquivo.');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload do arquivo para o Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${jobId}/${Date.now()}_${name.replace(/\s+/g, '_').toLowerCase()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      // 3. Salvar metadados no banco
      const { error: insertError } = await supabase
        .from('resumes')
        .insert([
          {
            job_id: jobId,
            candidate_name: name,
            candidate_email: email,
            candidate_phone: phone,
            file_url: publicUrl
          }
        ]);

      if (insertError) throw insertError;

      toast.success('Currículo adicionado com sucesso!');
      
      // Resetar form
      setName('');
      setEmail('');
      setPhone('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Recarregar lista
      fetchResumes();

    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error(`Erro ao salvar currículo: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number, fileUrl: string) => {
    if (!confirm('Tem certeza que deseja excluir este currículo?')) return;

    try {
      // Tentar extrair o path do arquivo da URL para deletar do storage
      // URL típica: .../storage/v1/object/public/resumes/jobId/filename
      const path = fileUrl.split('/resumes/')[1];

      if (path) {
        const { error: storageError } = await supabase.storage
          .from('resumes')
          .remove([path]);
        
        if (storageError) console.warn('Erro ao deletar arquivo do storage (pode já não existir):', storageError);
      }

      const { error: dbError } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast.success('Currículo excluído.');
      setResumes(prev => prev.filter(r => r.id !== id));

    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error('Erro ao excluir currículo.');
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      ></div>
      
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl relative z-10 flex flex-col animate-scale-in">
        
        {/* Header */}
        <div className="bg-[#003f7f] p-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white">Gerenciar Currículos</h2>
            <p className="text-white/80 text-sm mt-1">Vaga: {jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          
          {/* Coluna Esquerda: Formulário de Adição */}
          <div className="w-full md:w-1/3 bg-gray-50 p-6 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto">
            <h3 className="text-lg font-bold text-[#003f7f] mb-4 flex items-center gap-2">
              <FaCloudUploadAlt /> Adicionar Novo
            </h3>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Candidato *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003f7f] focus:border-transparent text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003f7f] focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Telefone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003f7f] focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Arquivo (PDF/DOC) *</label>
                <div className="relative group">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,image/*"
                    className="hidden"
                    id="resume-file"
                  />
                  <label 
                    htmlFor="resume-file" 
                    className={`flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${file ? 'border-[#00a859] bg-green-50 text-[#00a859]' : 'border-gray-300 hover:border-[#003f7f] text-gray-500'}`}
                  >
                    {file ? (
                      <>
                        <FaFileAlt />
                        <span className="truncate max-w-[150px] text-xs font-medium">{file.name}</span>
                      </>
                    ) : (
                      <>
                        <FaCloudUploadAlt className="text-xl" />
                        <span className="text-xs font-medium">Escolher Arquivo</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-[#003f7f] text-white py-2.5 rounded-lg font-bold text-sm hover:bg-[#002b5c] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt /> Salvar Currículo
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Coluna Direita: Lista de Currículos */}
          <div className="w-full md:w-2/3 p-6 overflow-y-auto bg-white">
            <h3 className="text-lg font-bold text-[#003f7f] mb-4 flex items-center gap-2 justify-between">
              <span>Currículos Recebidos</span>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Total: {resumes.length}</span>
            </h3>

            {isLoading ? (
              <div className="flex justify-center items-center h-40 text-[#003f7f]">
                <FaSpinner className="animate-spin w-8 h-8" />
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <FaFileAlt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Nenhum currículo cadastrado para esta vaga.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <div key={resume.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 shrink-0">
                        <FaFilePdf className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{resume.candidate_name}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500">
                          {resume.candidate_email && <span className="truncate">{resume.candidate_email}</span>}
                          {resume.candidate_phone && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span>{resume.candidate_phone}</span>
                            </>
                          )}
                          <span className="hidden sm:inline">•</span>
                          <span>{new Date(resume.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 pl-2">
                      <a
                        href={resume.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[#003f7f] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Baixar/Visualizar"
                      >
                        <FaDownload className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(resume.id, resume.file_url)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
