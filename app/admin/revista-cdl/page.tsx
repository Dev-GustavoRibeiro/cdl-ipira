'use client';

import React, { useCallback, useEffect, useId, useState } from 'react';
import Image from 'next/image';
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaBook, FaFilePdf, FaExternalLinkAlt, FaRedo, FaCloudUploadAlt, FaSyncAlt,
} from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { fetchWithCSRF, getCSRFToken } from '@/lib/csrf-client';
import { formatDateBR, todayISO } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import {
  AdminCard, AdminPageHeader, Button, Checkbox, DataTable, EmptyState, FilterPills, FormField, IconButton, ImageUploadField,
  Input, SearchInput, StatusBadge, Textarea, cx, focusRing, type DataTableColumn,
} from '@/app/admin/_components';

interface Magazine {
  id: number;
  title: string;
  description: string | null;
  edition: string | null;
  date: string;
  cover_url: string | null;
  file_url: string;
  is_active: boolean | null;
}

type Filter = 'all' | 'visible' | 'hidden';

const PAGE_SIZE = 10;
// ponytail: o proxy.ts passa por /api/* e o Next só repassa os primeiros 10 MB do corpo (proxyClientMaxBodySize);
// acima disso o envio quebra. Para PDFs maiores, subir esse limite no next.config ou usar upload assinado no Storage.
const UPLOAD_LIMIT_MB = 10;

const emptyForm = () => ({
  title: '',
  edition: '',
  date: todayISO(),
  description: '',
  file_url: '',
  cover_url: '',
  is_active: true,
});
type FormState = ReturnType<typeof emptyForm>;
type FormErrors = Partial<Record<keyof FormState, string>>;

async function request<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetchWithCSRF(url, init);
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || `Erro ${response.status} ao falar com o servidor.`);
  return data as T;
}

/** Envio para /api/upload com progresso (o fetch não informa o andamento do upload). */
function uploadWithProgress(file: File, folder: string, onProgress: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('file', file);
    body.append('bucket', 'magazines');
    body.append('folder', folder);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');
    const csrf = getCSRFToken();
    if (csrf) xhr.setRequestHeader('x-csrf-token', csrf);
    xhr.responseType = 'json';
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      const data = xhr.response as { url?: string; error?: string } | null;
      if (xhr.status >= 200 && xhr.status < 300 && data?.url) resolve(data.url);
      else reject(new Error(data?.error || `Erro ${xhr.status} ao enviar o arquivo.`));
    };
    xhr.onerror = () => reject(new Error('Falha de conexão ao enviar o arquivo.'));
    xhr.send(body);
  });
}

const errorMessage = (error: unknown, fallback: string) => (error instanceof Error && error.message ? error.message : fallback);
const isValidLink = (value: string) => !value || /^(https?:\/\/[^\s]+|\/(?!\/)[^\s]*)$/i.test(value.trim());
const isVisible = (m: Pick<Magazine, 'is_active'>) => m.is_active !== false;
const formatSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`);
const fileNameOf = (url: string) => {
  try {
    return decodeURIComponent(new URL(url, 'https://x').pathname.split('/').pop() || '') || url;
  } catch {
    return url;
  }
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = 'Informe o título da edição.';
  if (!form.date) errors.date = 'Informe a data.';
  if (!form.file_url.trim()) errors.file_url = 'Envie o PDF ou cole o link da revista.';
  else if (!isValidLink(form.file_url)) errors.file_url = 'Use um endereço que comece com https://';
  if (!isValidLink(form.cover_url)) errors.cover_url = 'Use um endereço que comece com https://';
  return errors;
}

/** Campo do PDF: área de envio, progresso e arquivo atual (abrir, trocar, remover). */
function PdfField({
  value,
  uploadedName,
  progress,
  error,
  onSelect,
  onRemove,
}: {
  value: string;
  uploadedName: string | null;
  progress: number | null;
  error?: string;
  onSelect: (file: File) => void;
  onRemove: () => void;
}) {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);
  const uploading = progress !== null;
  const input = (
    <input
      id={inputId}
      type="file"
      accept="application/pdf,.pdf"
      className="sr-only"
      disabled={uploading}
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onSelect(file);
        e.target.value = '';
      }}
    />
  );

  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-sm font-semibold text-gray-700">
        Arquivo PDF
        <span aria-hidden="true" className="ml-0.5 text-red-600">
          *
        </span>
      </p>

      {uploading ? (
        <div role="status" className="space-y-2 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-200">
          <div className="flex justify-between gap-3 text-sm font-medium text-gray-700">
            <span className="truncate">Enviando {uploadedName ?? 'PDF'}…</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full rounded-full bg-[#00a859] transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : value && isValidLink(value) ? (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-gray-200">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <FaFilePdf aria-hidden="true" className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1 basis-40">
            <p className="truncate text-sm font-semibold text-gray-900" title={value}>
              {uploadedName ?? fileNameOf(value)}
            </p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className={cx('inline-flex items-center gap-1.5 rounded text-xs font-semibold text-[#0052a3] hover:underline', focusRing)}
            >
              Abrir arquivo
              <FaExternalLinkAlt aria-hidden="true" className="h-2.5 w-2.5" />
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          </div>
          <div className="flex gap-1">
            <label
              htmlFor={inputId}
              className={cx(
                'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-white px-3.5 text-sm font-semibold text-[#003f7f] ring-1 ring-inset ring-gray-300 hover:ring-[#003f7f]/40 pointer-fine:min-h-9',
                'has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-[#0066cc]'
              )}
            >
              <FaSyncAlt aria-hidden="true" className="h-3 w-3" />
              Trocar
              {input}
            </label>
            <IconButton icon={FaTrash} variant="danger" label="Remover arquivo" onClick={onRemove} />
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) onSelect(file);
          }}
          className={cx(
            'flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-5 text-center transition-colors',
            'has-[input:focus-visible]:border-[#0066cc] has-[input:focus-visible]:ring-4 has-[input:focus-visible]:ring-[#0066cc]/15',
            dragging ? 'border-[#0066cc] bg-[#0066cc]/5' : error ? 'border-red-400 bg-red-50/40' : 'border-gray-300 bg-gray-50/60 hover:border-[#003f7f]/40'
          )}
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-white text-[#003f7f] ring-1 ring-gray-200">
            <FaCloudUploadAlt aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold text-gray-800">
            <span className="text-[#0052a3]">Clique para enviar o PDF</span> ou arraste o arquivo
          </span>
          <span className="text-xs text-gray-500">Até {UPLOAD_LIMIT_MB} MB. Maior que isso? Hospede o PDF e cole o link abaixo.</span>
          {input}
        </label>
      )}
    </div>
  );
}

export default function AdminRevistaCDLPage() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<number | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [magazineToDelete, setMagazineToDelete] = useState<Magazine | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Promessa encadeada: nenhum setState síncrono dentro do efeito (react-hooks/set-state-in-effect)
  const loadMagazines = useCallback(
    () =>
      request<Magazine[]>('/api/admin/magazines')
        .then((data) => {
          setMagazines(data);
          setLoadError(false);
        })
        .catch((error) => {
          setLoadError(true);
          toast.error(errorMessage(error, 'Erro ao carregar as revistas.'));
        })
        .finally(() => setIsLoading(false)),
    []
  );

  useEffect(() => {
    loadMagazines();
  }, [loadMagazines]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const openModal = (magazine?: Magazine) => {
    setEditingId(magazine?.id ?? null);
    setFormData(
      magazine
        ? {
            title: magazine.title,
            edition: magazine.edition || '',
            date: /^\d{4}-\d{2}-\d{2}/.test(magazine.date || '') ? magazine.date.slice(0, 10) : '',
            description: magazine.description || '',
            file_url: magazine.file_url || '',
            cover_url: magazine.cover_url || '',
            is_active: isVisible(magazine),
          }
        : emptyForm()
    );
    setErrors({});
    setPdfName(null);
    setPdfProgress(null);
    setIsModalOpen(true);
  };

  const uploading = pdfProgress !== null || isUploadingCover;
  const closeModal = () => {
    if (!isSaving && !uploading) setIsModalOpen(false);
  };

  const handlePdfSelect = async (file: File) => {
    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      setErrors((current) => ({ ...current, file_url: 'Escolha um arquivo PDF.' }));
      return;
    }
    if (file.size > UPLOAD_LIMIT_MB * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        file_url: `O PDF tem ${formatSize(file.size)} e o limite de envio é ${UPLOAD_LIMIT_MB} MB. Comprima o arquivo ou hospede-o (ex.: Google Drive) e cole o link abaixo.`,
      }));
      return;
    }
    setPdfName(file.name);
    setPdfProgress(0);
    try {
      const url = await uploadWithProgress(file, 'pdfs', setPdfProgress);
      setField('file_url', url);
      // Sugere o título pelo nome do arquivo, se ainda estiver vazio
      setFormData((current) => (current.title.trim() ? current : { ...current, title: file.name.replace(/\.pdf$/i, '').slice(0, 255) }));
      toast.success(`PDF enviado (${formatSize(file.size)}).`);
    } catch (error) {
      setPdfName(null);
      toast.error(errorMessage(error, 'Erro ao enviar o PDF.'));
    } finally {
      setPdfProgress(null);
    }
  };

  const handleCoverSelect = async (file: File) => {
    if (!file.type.startsWith('image/') || file.size > UPLOAD_LIMIT_MB * 1024 * 1024) {
      setErrors((current) => ({ ...current, cover_url: `Use uma imagem PNG, JPG ou WebP de até ${UPLOAD_LIMIT_MB} MB.` }));
      return;
    }
    setIsUploadingCover(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('bucket', 'magazines');
      body.append('folder', 'covers');
      const data = await request<{ url?: string }>('/api/upload', { method: 'POST', body });
      if (!data.url) throw new Error('O envio não retornou o endereço da imagem.');
      setField('cover_url', data.url);
      toast.success('Capa enviada.');
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao enviar a capa.'));
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(formData);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`revista-${firstInvalid}`)?.focus();
      return;
    }

    setIsSaving(true);
    try {
      await request('/api/admin/magazines', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(editingId && { id: editingId }),
          title: formData.title.trim(),
          edition: formData.edition.trim() || null,
          date: formData.date,
          description: formData.description.trim() || null,
          file_url: formData.file_url.trim(),
          cover_url: formData.cover_url.trim() || null,
          is_active: formData.is_active,
        }),
      });
      toast.success(editingId ? 'Edição atualizada.' : 'Edição cadastrada.');
      setIsModalOpen(false);
      loadMagazines();
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao salvar a revista.'));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVisible = async (magazine: Magazine) => {
    const show = !isVisible(magazine);
    setTogglingId(magazine.id);
    try {
      await request('/api/admin/magazines', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...magazine, is_active: show }),
      });
      setMagazines((current) => current.map((m) => (m.id === magazine.id ? { ...m, is_active: show } : m)));
      toast.success(show ? 'Edição visível no site.' : 'Edição ocultada do site.');
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao alterar a visibilidade.'));
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!magazineToDelete) return;
    setIsDeleting(true);
    try {
      await request(`/api/admin/magazines?id=${magazineToDelete.id}`, { method: 'DELETE' });
      toast.success('Edição excluída.');
      setMagazineToDelete(null);
      loadMagazines();
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao excluir a revista.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const term = searchTerm.trim().toLowerCase();
  const searched = magazines.filter((m) => !term || m.title?.toLowerCase().includes(term) || m.edition?.toLowerCase().includes(term));
  const filtered = searched.filter((m) => (filter === 'all' ? true : filter === 'visible' ? isVisible(m) : !isVisible(m)));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const columns: DataTableColumn<Magazine>[] = [
    {
      key: 'title',
      header: 'Edição',
      primary: true,
      cell: (m) => (
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#003f7f]/[0.06] text-[#003f7f]/40 ring-1 ring-gray-200">
            {m.cover_url ? (
              <Image src={m.cover_url} alt="" fill sizes="48px" className="object-cover" unoptimized={!isOptimizableImage(m.cover_url)} />
            ) : (
              <FaBook aria-hidden="true" className="h-4 w-4" />
            )}
          </span>
          <div className="min-w-0">
            <p className="line-clamp-3 font-semibold text-gray-900 md:line-clamp-2 md:max-w-md">{m.title}</p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs font-medium text-gray-500">
              {m.edition && <span>{m.edition}</span>}
              <span className="inline-flex items-center gap-1">
                <FaFilePdf aria-hidden="true" className="h-3 w-3 text-red-600" />
                {/\.pdf($|\?)/i.test(m.file_url) ? 'PDF' : 'Link externo'}
              </span>
            </p>
          </div>
        </div>
      ),
    },
    { key: 'date', header: 'Data', className: 'whitespace-nowrap tabular-nums', cell: (m) => formatDateBR(m.date) },
    {
      key: 'status',
      header: 'Status',
      cell: (m) => (isVisible(m) ? <StatusBadge variant="success">Visível</StatusBadge> : <StatusBadge variant="neutral">Oculta</StatusBadge>),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Revista CDL"
        description="Edições da revista disponíveis para leitura e download no site."
        actions={
          <Button icon={FaPlus} onClick={() => openModal()}>
            Nova edição
          </Button>
        }
      />

      <AdminCard flush>
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <SearchInput
            label="Buscar edições"
            placeholder="Buscar por título ou edição"
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            className="w-full xl:max-w-sm"
          />
          <FilterPills<Filter>
            label="Filtrar por visibilidade"
            value={filter}
            onChange={(value) => {
              setFilter(value);
              setPage(1);
            }}
            options={[
              { value: 'all', label: 'Todas', count: isLoading ? undefined : searched.length },
              { value: 'visible', label: 'Visíveis', count: isLoading ? undefined : searched.filter(isVisible).length },
              { value: 'hidden', label: 'Ocultas', count: isLoading ? undefined : searched.filter((m) => !isVisible(m)).length },
            ]}
          />
        </div>

        <DataTable
          caption="Lista de edições da revista"
          columns={columns}
          rows={pageRows}
          getRowId={(m) => m.id}
          loading={isLoading}
          rowActions={(m) => (
            <>
              <a
                href={m.file_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir o arquivo de “${m.title}” (abre em nova aba)`}
                title="Abrir arquivo"
                className={cx(
                  'inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#003f7f] pointer-fine:size-9',
                  focusRing
                )}
              >
                <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
              <IconButton
                icon={isVisible(m) ? FaEyeSlash : FaEye}
                label={isVisible(m) ? `Ocultar “${m.title}” do site` : `Mostrar “${m.title}” no site`}
                onClick={() => toggleVisible(m)}
                disabled={togglingId === m.id}
              />
              <IconButton icon={FaEdit} label={`Editar “${m.title}”`} onClick={() => openModal(m)} />
              <IconButton icon={FaTrash} variant="danger" label={`Excluir “${m.title}”`} onClick={() => setMagazineToDelete(m)} />
            </>
          )}
          pagination={{ page: currentPage, totalPages, onPageChange: setPage, total: filtered.length, pageSize: PAGE_SIZE }}
          empty={
            loadError ? (
              <EmptyState
                icon={FaRedo}
                title="Não foi possível carregar as revistas"
                description="Verifique a conexão e tente de novo."
                action={
                  <Button
                    variant="secondary"
                    icon={FaRedo}
                    onClick={() => {
                      setIsLoading(true);
                      loadMagazines();
                    }}
                  >
                    Tentar novamente
                  </Button>
                }
              />
            ) : magazines.length === 0 ? (
              <EmptyState
                icon={FaBook}
                title="Nenhuma edição ainda"
                description="Envie o PDF da primeira edição da Revista CDL."
                action={
                  <Button icon={FaPlus} onClick={() => openModal()}>
                    Nova edição
                  </Button>
                }
              />
            ) : (
              <EmptyState
                title="Nenhuma edição encontrada"
                description="Tente outro termo de busca ou outro filtro."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearchTerm('');
                      setFilter('all');
                    }}
                  >
                    Limpar filtros
                  </Button>
                }
              />
            )
          }
        />
      </AdminCard>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Editar revista' : 'Nova edição'} subtitle="Campos com * são obrigatórios.">
        <form onSubmit={handleSave} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-3 md:col-span-2">
              <PdfField
                value={formData.file_url}
                uploadedName={pdfName}
                progress={pdfProgress}
                error={errors.file_url}
                onSelect={handlePdfSelect}
                onRemove={() => {
                  setPdfName(null);
                  setField('file_url', '');
                }}
              />
              <FormField label="Ou cole o link do PDF" id="revista-file_url" error={errors.file_url}>
                <Input
                  type="url"
                  inputMode="url"
                  value={formData.file_url}
                  onChange={(e) => {
                    setPdfName(null);
                    setField('file_url', e.target.value);
                  }}
                  placeholder="https://…"
                />
              </FormField>
            </div>

            <FormField label="Título" id="revista-title" required error={errors.title} className="md:col-span-2">
              <Input
                value={formData.title}
                onChange={(e) => setField('title', e.target.value)}
                required
                maxLength={255}
                placeholder="Ex.: Revista CDL — Edição de Outubro"
              />
            </FormField>

            <FormField label="Edição" id="revista-edition" hint="Ex.: Ed. 24 ou Outubro/2026.">
              <Input value={formData.edition} onChange={(e) => setField('edition', e.target.value)} maxLength={50} />
            </FormField>

            <FormField label="Data de publicação" id="revista-date" required error={errors.date}>
              <Input type="date" value={formData.date} onChange={(e) => setField('date', e.target.value)} required />
            </FormField>

            <FormField label="Descrição" id="revista-description" className="md:col-span-2">
              <Textarea
                value={formData.description}
                onChange={(e) => setField('description', e.target.value)}
                rows={3}
                maxLength={2000}
                placeholder="Destaques desta edição"
              />
            </FormField>

            <ImageUploadField
              label="Capa"
              id="revista-cover_url"
              className="md:col-span-2"
              aspect="square"
              value={formData.cover_url && isValidLink(formData.cover_url) ? formData.cover_url : null}
              onSelect={handleCoverSelect}
              onRemove={() => setField('cover_url', '')}
              uploading={isUploadingCover}
              error={errors.cover_url}
              hint={`Opcional. PNG, JPG ou WebP até ${UPLOAD_LIMIT_MB} MB, de preferência em pé (3:4).`}
            />

            <Checkbox
              className="rounded-xl bg-gray-50 px-4 ring-1 ring-gray-200 md:col-span-2"
              label="Visível no site"
              description="Desmarque para ocultar a edição sem excluir."
              checked={formData.is_active}
              onChange={(e) => setField('is_active', e.target.checked)}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={closeModal} disabled={isSaving || uploading}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSaving} disabled={uploading}>
              {isSaving ? 'Salvando…' : editingId ? 'Salvar alterações' : 'Cadastrar edição'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={magazineToDelete !== null}
        onClose={() => !isDeleting && setMagazineToDelete(null)}
        onConfirm={confirmDelete}
        type="delete"
        title="Excluir edição?"
        message={`“${magazineToDelete?.title ?? ''}” será removida do site. Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        isLoading={isDeleting}
      />
    </div>
  );
}
