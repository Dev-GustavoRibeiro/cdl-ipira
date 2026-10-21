'use client';

import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaCloudUploadAlt, FaTrash, FaFilePdf, FaFileAlt, FaDownload, FaBriefcase, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'sonner';
import { useIsClient, useModalBehavior } from '@/lib/hooks/useModalBehavior';
import { fetchWithCSRF } from '@/lib/csrf-client';
import ConfirmDialog from '@/components/ConfirmDialog';

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

const INPUT =
  'h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 transition-colors hover:border-gray-300 focus:border-[#003f7f]';
const LABEL = 'mb-1.5 block text-sm font-bold text-gray-700';

export default function ResumeManagerModal({ isOpen, onClose, jobId, jobTitle }: ResumeManagerModalProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const isClient = useIsClient();
  const titleId = useId();
  const fileHintId = useId();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Encadeado com .then (sem setState síncrono): o efeito de abertura só dispara a busca.
  // Abre como "carregando"; quem recarrega (Tentar novamente) marca isLoading antes.
  const fetchResumes = useCallback(() => {
    if (!jobId) return;
    fetch(`/api/admin/resumes?jobId=${jobId}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao carregar currículos');
        setResumes(data || []);
        setLoadError(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar currículos:', error);
        setLoadError(true);
        toast.error('Erro ao carregar currículos.');
      })
      .finally(() => setIsLoading(false));
  }, [jobId]);

  // Ao reabrir (talvez para outra vaga), mostra o carregamento em vez da lista anterior
  const handleClose = () => {
    setIsLoading(true);
    onClose();
  };

  // Trava o scroll, fecha com Esc e mantém o foco dentro do diálogo
  const dialogRef = useModalBehavior<HTMLDivElement>(isOpen, handleClose);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchResumes();
    }
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
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      uploadForm.append('bucket', 'resumes');
      uploadForm.append('folder', String(jobId));

      const uploadResponse = await fetchWithCSRF('/api/upload', {
        method: 'POST',
        body: uploadForm,
      });
      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.path) {
        throw new Error(uploadData.error || 'Erro no upload do currículo');
      }

      // 2. Salvar metadados no banco
      const response = await fetchWithCSRF('/api/admin/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          candidate_name: name,
          candidate_email: email,
          candidate_phone: phone,
          file_url: uploadData.path,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao salvar currículo');

      toast.success('Currículo adicionado com sucesso!');

      // Resetar form
      setName('');
      setEmail('');
      setPhone('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Recarregar lista
      fetchResumes();

    } catch (error: unknown) {
      console.error('Erro no upload:', error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao salvar currículo: ${message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!resumeToDelete) return;
    const { id, file_url: fileUrl } = resumeToDelete;

    setIsDeleting(true);
    try {
      const path = fileUrl.includes('/resumes/')
        ? fileUrl.split('/resumes/')[1]
        : fileUrl;

      if (path) {
        const storageResponse = await fetchWithCSRF('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bucket: 'resumes', path }),
        });

        if (!storageResponse.ok) {
          const storageData = await storageResponse.json();
          console.warn('Erro ao deletar arquivo do storage (pode já não existir):', storageData.error);
        }
      }

      const response = await fetchWithCSRF(`/api/admin/resumes?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao excluir currículo');

      toast.success('Currículo excluído.');
      setResumes(prev => prev.filter(r => r.id !== id));
      setResumeToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error('Erro ao excluir currículo.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isClient || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-end justify-center bg-[#001a3d]/60 backdrop-blur-sm sm:items-center sm:p-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_30px_80px_-20px_rgba(0,26,61,0.55)] animate-[slide-up_0.3s_ease-out] sm:h-auto sm:max-h-[90dvh] sm:max-w-5xl sm:rounded-3xl sm:animate-[scale-in_0.2s_ease-out]"
      >
        <div aria-hidden="true" className="h-1.5 shrink-0 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />

        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-8 sm:py-6">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-[#003f7f] uppercase">
              <FaBriefcase aria-hidden="true" className="h-3 w-3" />
              Balcão de Empregos
            </span>
            <h2 id={titleId} className="mt-3 text-xl font-black leading-tight tracking-tight text-balance text-[#003f7f] sm:text-2xl">
              Gerenciar currículos
            </h2>
            <p className="mt-1 line-clamp-2 max-w-[65ch] text-sm text-gray-600">
              <span className="font-semibold text-gray-700">Vaga:</span> {jobTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar gerenciador de currículos"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-[background-color,color,scale] duration-200 hover:bg-[#003f7f] hover:text-white active:scale-95 motion-reduce:transition-none"
          >
            <FaTimes aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {/* Celular: tudo rola junto (formulário primeiro, para não ficar no fim de uma lista longa). Desktop: formulário à esquerda e lista à direita, cada um com rolagem própria */}
        <div className="flex min-h-0 grow flex-col overflow-y-auto overscroll-contain md:flex-row md:overflow-hidden">

          {/* Formulário de Adição */}
          <section aria-labelledby={`${titleId}-form`} className="shrink-0 border-b border-gray-100 bg-gray-50/80 px-5 py-6 sm:px-8 md:w-80 md:overflow-y-auto md:overscroll-contain md:border-b-0 md:border-r md:px-6 lg:w-96">
            <h3 id={`${titleId}-form`} className="mb-5 flex items-center gap-2 text-lg font-black tracking-tight text-[#003f7f]">
              <FaCloudUploadAlt aria-hidden="true" className="text-[#00a859]" /> Adicionar currículo
            </h3>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label htmlFor="resume-name" className={LABEL}>Nome do candidato *</label>
                <input
                  id="resume-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  className={INPUT}
                  required
                />
              </div>

              <div>
                <label htmlFor="resume-email" className={LABEL}>E-mail</label>
                <input
                  id="resume-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  className={INPUT}
                />
              </div>

              <div>
                <label htmlFor="resume-phone" className={LABEL}>Telefone</label>
                <input
                  id="resume-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="off"
                  className={INPUT}
                />
              </div>

              <div>
                <span className={LABEL}>Arquivo *</span>
                {/* sr-only (e não hidden) para o campo continuar acessível pelo teclado; o rótulo abaixo é a área clicável */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,image/*"
                  aria-describedby={fileHintId}
                  className="peer sr-only"
                  id="resume-file"
                />
                <label
                  htmlFor="resume-file"
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed p-4 transition-colors peer-focus-visible:border-[#003f7f] peer-focus-visible:bg-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#003f7f] ${file ? 'border-[#00a859] bg-[#00a859]/5' : 'border-gray-300 bg-white hover:border-[#003f7f]'}`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${file ? 'bg-[#00a859]/15 text-[#00a859]' : 'bg-[#003f7f]/10 text-[#003f7f]'}`}
                  >
                    {file ? <FaFileAlt className="h-4 w-4" /> : <FaCloudUploadAlt className="h-5 w-5" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-gray-900">
                      {file ? file.name : 'Escolher arquivo'}
                    </span>
                    <span id={fileHintId} className="block text-xs text-gray-500">
                      {file ? 'Toque para trocar' : 'PDF, DOC ou imagem · até 5 MB'}
                    </span>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                aria-busy={isUploading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#003f7f] text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(0,63,127,0.7)] transition-[background-color,scale] duration-200 hover:bg-[#0052a3] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
              >
                {isUploading ? (
                  <>
                    <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent motion-reduce:animate-none" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt aria-hidden="true" /> Salvar currículo
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Lista de Currículos */}
          <section aria-labelledby={`${titleId}-lista`} className="bg-white px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 md:min-w-0 md:flex-1 md:overflow-y-auto md:overscroll-contain">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 id={`${titleId}-lista`} className="text-lg font-black tracking-tight text-[#003f7f]">Currículos recebidos</h3>
              {!isLoading && !loadError && (
                <span className="rounded-full bg-[#003f7f]/10 px-3 py-1 text-xs font-bold text-[#003f7f] tabular-nums">
                  {resumes.length} {resumes.length === 1 ? 'currículo' : 'currículos'}
                </span>
              )}
            </div>

            {isLoading ? (
              <div aria-busy="true" aria-label="Carregando currículos" className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-4 rounded-2xl p-4 ring-1 ring-gray-100">
                    <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-gray-200 motion-reduce:animate-none" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/5 animate-pulse rounded-full bg-gray-200 motion-reduce:animate-none" />
                      <div className="h-3 w-3/5 animate-pulse rounded-full bg-gray-100 motion-reduce:animate-none" />
                    </div>
                  </div>
                ))}
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-200 px-4 py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 ring-8 ring-red-50">
                  <FaExclamationTriangle aria-hidden="true" className="h-5 w-5" />
                </span>
                <p className="mt-5 font-black text-[#003f7f]">Não foi possível carregar os currículos</p>
                <button
                  type="button"
                  onClick={() => { setIsLoading(true); fetchResumes(); }}
                  className="mt-5 inline-flex h-10 items-center rounded-xl bg-[#003f7f] px-4 text-sm font-bold text-white transition-colors hover:bg-[#0052a3]"
                >
                  Tentar novamente
                </button>
              </div>
            ) : resumes.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 px-4 py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#003f7f]/10 text-[#003f7f] ring-8 ring-[#003f7f]/5">
                  <FaFileAlt aria-hidden="true" className="h-5 w-5" />
                </span>
                <p className="mt-5 font-black text-balance text-[#003f7f]">Nenhum currículo nesta vaga ainda</p>
                <p className="mt-1.5 max-w-[40ch] text-sm text-pretty text-gray-600">
                  Adicione os currículos recebidos pelo formulário para manter tudo num só lugar.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {resumes.map((resume) => {
                  const isPdf = /\.pdf$/i.test(resume.file_url);
                  const FileIcon = isPdf ? FaFilePdf : FaFileAlt;
                  const meta = [resume.candidate_email, resume.candidate_phone, new Date(resume.created_at).toLocaleDateString('pt-BR')].filter(Boolean);
                  return (
                    <li
                      key={resume.id}
                      className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_10px_30px_-18px_rgba(0,63,127,0.35)] ring-1 ring-gray-100 transition-shadow hover:shadow-[0_18px_40px_-18px_rgba(0,63,127,0.45)]"
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isPdf ? 'bg-red-50 text-red-600' : 'bg-[#0066cc]/10 text-[#0066cc]'}`}
                      >
                        <FileIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold leading-snug text-gray-900">{resume.candidate_name}</p>
                        {/* Celular: um dado por linha. Telas maiores: em linha, separados por ponto */}
                        <p className="mt-1 flex flex-col gap-0.5 text-xs text-gray-500 sm:flex-row sm:flex-wrap sm:gap-x-2">
                          {meta.map((item, i) => (
                            <span key={i} className="min-w-0 truncate">
                              {i > 0 && <span aria-hidden="true" className="mr-2 hidden text-gray-300 sm:inline">·</span>}
                              {item}
                            </span>
                          ))}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <a
                          href={`/api/admin/resumes/download?fileUrl=${encodeURIComponent(resume.file_url)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Baixar/Visualizar"
                          aria-label={`Baixar currículo de ${resume.candidate_name}`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-[#003f7f] ring-1 ring-[#003f7f]/15 transition-colors hover:bg-[#003f7f] hover:text-white"
                        >
                          <FaDownload aria-hidden="true" className="h-3.5 w-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => setResumeToDelete(resume)}
                          title="Excluir"
                          aria-label={`Excluir currículo de ${resume.candidate_name}`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-red-600 ring-1 ring-red-100 transition-colors hover:bg-red-50 hover:ring-red-200"
                        >
                          <FaTrash aria-hidden="true" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!resumeToDelete}
        onClose={() => setResumeToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Currículo"
        message={`Tem certeza que deseja excluir o currículo de ${resumeToDelete?.candidate_name ?? ''}? Esta ação não pode ser desfeita.`}
        type="delete"
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </div>,
    document.body
  );
}
