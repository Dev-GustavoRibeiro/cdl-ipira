'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  FaCloudUploadAlt, FaEdit, FaExclamationTriangle, FaExternalLinkAlt, FaEye, FaEyeSlash, FaFile, FaFileAlt, FaFileExcel,
  FaFilePdf, FaFileWord, FaLink, FaPlus, FaRedo, FaSearch, FaTimes, FaTrash,
} from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { formatDateBR, todayISO } from '@/lib/date';
import {
  AdminCard, AdminPageHeader, Button, Checkbox, DataTable, EmptyState, FilterPills, FormField, IconButton, Input, SearchInput,
  Select, StatusBadge, Textarea, buttonClass, cx, focusRing, type DataTableColumn,
} from '../_components';

interface Documento {
  id: number;
  title: string;
  description?: string | null;
  type: string;
  category?: string | null;
  date: string;
  file_url: string;
  is_active: boolean;
}

interface FormState {
  id?: number;
  title: string;
  description: string;
  type: string;
  category: string;
  date: string;
  file_url: string;
  is_active: boolean;
}

const CATEGORIAS = [
  'Prestação de Contas',
  'Relatórios Anuais',
  'Demonstrativos Financeiros',
  'Estatuto e Regimento',
  'Atas de Reunião',
  'Outros',
];

// Mesmos ícones e cores do site (DocumentsSection)
const TIPOS: Record<string, { label: string; icon: IconType; tile: string; extensions: string[] }> = {
  PDF: { label: 'PDF', icon: FaFilePdf, tile: 'bg-[#003f7f]/[0.07] text-[#003f7f]', extensions: ['pdf'] },
  DOC: { label: 'Word', icon: FaFileWord, tile: 'bg-[#0066cc]/10 text-[#0066cc]', extensions: ['doc', 'docx'] },
  XLS: { label: 'Excel', icon: FaFileExcel, tile: 'bg-[#00a859]/10 text-[#00703c]', extensions: ['xls', 'xlsx'] },
  Outro: { label: 'Outro', icon: FaFile, tile: 'bg-gray-100 text-gray-500', extensions: [] },
};

const tipoOf = (type: string) => TIPOS[type] ?? TIPOS.Outro;
const detectType = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return Object.keys(TIPOS).find((t) => TIPOS[t].extensions.includes(ext)) ?? 'Outro';
};

const NO_CATEGORY = '__none__';
const MAX_MB = 50;

/** fetch + JSON; erro com a mensagem da API */
async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await (init ? fetchWithCSRF(url, init) : fetch(url));
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.details?.join(' ') || data?.error || 'Não foi possível concluir a operação.');
  return data as T;
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Não foi possível concluir a operação.');
const isLink = (value: string) => /^https?:\/\/\S+$/i.test(value) || (value.startsWith('/') && !value.startsWith('//'));
const formatSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`);

const toPayload = (d: Documento | FormState) => ({
  title: d.title,
  description: d.description ?? '',
  type: d.type || 'PDF',
  category: d.category ?? '',
  date: d.date?.slice(0, 10),
  file_url: d.file_url,
  is_active: d.is_active,
});

export default function AdminPortalTransparenciaPage() {
  const [version, setVersion] = useState(0);
  const [list, setList] = useState<{ v: number; rows: Documento[]; error?: string }>({ v: -1, rows: [] });
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState<FormState | null>(null);
  const [fileMode, setFileMode] = useState<'upload' | 'link'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Documento | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const fileInputId = useId();

  useEffect(() => {
    let active = true;
    api<Documento[]>('/api/admin/transparency-documents').then(
      (rows) => active && setList({ v: version, rows: rows || [] }),
      (error) => active && setList((prev) => ({ v: version, rows: prev.rows, error: errorMessage(error) }))
    );
    return () => {
      active = false;
    };
  }, [version]);

  const reload = () => setVersion((v) => v + 1);
  const isLoading = list.v === -1;
  const rows = list.rows;

  const categoryOptions = useMemo(() => {
    const count = (c: string) => rows.filter((r) => (c === NO_CATEGORY ? !r.category : r.category === c)).length;
    const extra = [...new Set(rows.map((r) => r.category).filter((c): c is string => !!c && !CATEGORIAS.includes(c)))];
    const opts = [...CATEGORIAS, ...extra].map((c) => ({ value: c, label: c, count: count(c) })).filter((o) => o.count > 0);
    const none = count(NO_CATEGORY);
    return [{ value: 'all', label: 'Todas', count: rows.length }, ...opts, ...(none ? [{ value: NO_CATEGORY, label: 'Sem categoria', count: none }] : [])];
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (category === 'all' || (category === NO_CATEGORY ? !r.category : r.category === category)) &&
        (!q || [r.title, r.description, r.category].some((v) => v?.toLowerCase().includes(q)))
    );
  }, [rows, category, search]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => (f ? { ...f, [key]: value } : f));

  const openForm = (doc?: Documento) => {
    setForm(
      doc
        ? {
            id: doc.id,
            title: doc.title,
            description: doc.description ?? '',
            type: doc.type || 'PDF',
            category: doc.category ?? '',
            date: doc.date?.slice(0, 10) ?? todayISO(),
            file_url: doc.file_url,
            is_active: doc.is_active,
          }
        : { title: '', description: '', type: 'PDF', category: '', date: todayISO(), file_url: '', is_active: true }
    );
    setFileMode('upload');
    setFile(null);
    setFileError(null);
  };

  const pickFile = (picked: File | undefined) => {
    if (!picked) return;
    if (picked.size > MAX_MB * 1024 * 1024) {
      setFileError(`Arquivo muito grande. Máximo: ${MAX_MB} MB.`);
      return;
    }
    setFile(picked);
    setFileError(null);
    setForm((f) => (f ? { ...f, type: detectType(picked.name), title: f.title || picked.name.replace(/\.[^/.]+$/, '') } : f));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // Arquivo: novo upload, link informado ou o arquivo atual (edição)
    if (fileMode === 'upload' && !file && !form.file_url) {
      setFileError('Escolha o arquivo do documento.');
      return;
    }
    if (fileMode === 'link' && !isLink(form.file_url.trim())) {
      setFileError('Informe um link começando com https:// (ou um caminho do site, como /documentos/ata.pdf).');
      return;
    }

    setIsSaving(true);
    try {
      let fileUrl = form.file_url.trim();
      if (fileMode === 'upload' && file) {
        const body = new FormData();
        body.append('file', file);
        body.append('bucket', 'transparency-documents');
        body.append('folder', 'documents');
        const uploaded = await api<{ url?: string }>('/api/upload', { method: 'POST', body });
        if (!uploaded.url) throw new Error('O envio do arquivo não retornou o endereço.');
        fileUrl = uploaded.url;
      }
      const payload = toPayload({ ...form, file_url: fileUrl });
      await api('/api/admin/transparency-documents', jsonInit(form.id ? 'PUT' : 'POST', form.id ? { id: form.id, ...payload } : payload));
      toast.success(form.id ? 'Documento atualizado.' : 'Documento cadastrado.');
      setForm(null);
      reload();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (doc: Documento) => {
    setTogglingId(doc.id);
    try {
      await api('/api/admin/transparency-documents', jsonInit('PUT', { id: doc.id, ...toPayload({ ...doc, is_active: !doc.is_active }) }));
      setList((l) => ({ ...l, rows: l.rows.map((r) => (r.id === doc.id ? { ...r, is_active: !doc.is_active } : r)) }));
      toast.success(doc.is_active ? 'Documento ocultado do site.' : 'Documento visível no site.');
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await api(`/api/admin/transparency-documents?id=${toDelete.id}`, { method: 'DELETE' });
      setList((l) => ({ ...l, rows: l.rows.filter((r) => r.id !== toDelete.id) }));
      toast.success('Documento excluído.');
      setToDelete(null);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: DataTableColumn<Documento>[] = [
    {
      key: 'doc',
      header: 'Documento',
      primary: true,
      cell: (d) => {
        const { icon: Icon, tile, label } = tipoOf(d.type);
        return (
          <div className="flex min-w-0 items-start gap-3">
            <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-xl', tile)}>
              <Icon aria-hidden="true" className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">{d.title}</p>
              {d.description && <p className="mt-0.5 line-clamp-2 max-w-prose text-sm font-normal text-gray-500">{d.description}</p>}
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-normal text-gray-500 tabular-nums">
                {d.category ? (
                  <span className="rounded-full bg-[#003f7f]/[0.06] px-2 py-0.5 font-semibold text-[#003f7f] ring-1 ring-[#003f7f]/10 ring-inset">{d.category}</span>
                ) : (
                  <span>Sem categoria</span>
                )}
                <span>{label}</span>
                <span>{formatDateBR(d.date) || '—'}</span>
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      cell: (d) => (d.is_active ? <StatusBadge variant="success">Visível</StatusBadge> : <StatusBadge variant="neutral">Oculto</StatusBadge>),
    },
  ];

  const rowActions = (d: Documento) => (
    <>
      <a
        href={d.file_url}
        target="_blank"
        rel="noopener noreferrer"
        title="Abrir arquivo"
        className={cx(
          'relative inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#003f7f] pointer-fine:size-9',
          focusRing
        )}
      >
        <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5" />
        <span className="sr-only">Abrir {d.title} (nova aba)</span>
      </a>
      <IconButton
        icon={d.is_active ? FaEyeSlash : FaEye}
        label={d.is_active ? `Ocultar ${d.title} do site` : `Mostrar ${d.title} no site`}
        onClick={() => toggleActive(d)}
        disabled={togglingId === d.id}
      />
      <IconButton icon={FaEdit} label={`Editar ${d.title}`} onClick={() => openForm(d)} />
      <IconButton icon={FaTrash} variant="danger" label={`Excluir ${d.title}`} onClick={() => setToDelete(d)} />
    </>
  );

  const hasFilters = category !== 'all' || search.trim() !== '';

  const empty = list.error && rows.length === 0 ? (
    <EmptyState
      icon={FaExclamationTriangle}
      title="Não foi possível carregar os documentos"
      description={list.error}
      action={<Button icon={FaRedo} onClick={reload}>Tentar novamente</Button>}
    />
  ) : hasFilters ? (
    <EmptyState
      icon={FaSearch}
      title="Nenhum documento encontrado"
      description="Tente outro termo de busca ou outra categoria."
      action={
        <Button variant="secondary" onClick={() => { setCategory('all'); setSearch(''); }}>
          Limpar filtros
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={FaFileAlt}
      title="Nenhum documento publicado"
      description="Publique prestações de contas, atas e relatórios para os associados consultarem no site."
      action={<Button icon={FaPlus} onClick={() => openForm()}>Novo documento</Button>}
    />
  );

  const currentTipo = form ? tipoOf(form.type) : TIPOS.Outro;

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="Portal da Transparência"
        description="Documentos públicos da CDL Ipirá: prestação de contas, relatórios, estatuto e atas."
        actions={
          <>
            <a href="/institucional/portal-transparencia" target="_blank" rel="noopener noreferrer" className={buttonClass('secondary')}>
              <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5" />
              Ver no site
              <span className="sr-only">(abre em nova aba)</span>
            </a>
            <Button icon={FaPlus} onClick={() => openForm()}>
              Novo documento
            </Button>
          </>
        }
      />

      <AdminCard flush>
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:p-5">
          <SearchInput label="Buscar documentos" placeholder="Buscar documento…" value={search} onChange={setSearch} className="lg:max-w-md" />
          {rows.length > 0 && <FilterPills label="Filtrar por categoria" value={category} onChange={setCategory} options={categoryOptions} className="lg:flex-wrap" />}
        </div>
        <DataTable caption="Documentos do Portal da Transparência" rows={filtered} getRowId={(d) => d.id} columns={columns} rowActions={rowActions} loading={isLoading} empty={empty} />
      </AdminCard>

      <Modal isOpen={!!form} onClose={() => !isSaving && setForm(null)} title={form?.id ? 'Editar documento' : 'Novo documento'}>
        {form && (
          <form onSubmit={handleSave} className="space-y-5">
            <FormField label="Título" required>
              <Input value={form.title} onChange={(e) => setField('title', e.target.value)} required maxLength={200} placeholder="Ex.: Prestação de Contas 2025" />
            </FormField>
            <FormField label="Descrição" hint="Opcional. Aparece abaixo do título no site.">
              <Textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={2} maxLength={500} />
            </FormField>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <FormField label="Categoria">
                <Select value={form.category} onChange={(e) => setField('category', e.target.value)}>
                  <option value="">Sem categoria</option>
                  {[...CATEGORIAS, ...(form.category && !CATEGORIAS.includes(form.category) ? [form.category] : [])].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Tipo de arquivo">
                <Select value={form.type} onChange={(e) => setField('type', e.target.value)}>
                  {Object.entries(TIPOS).map(([value, t]) => (
                    <option key={value} value={value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Data do documento" required>
                <Input type="date" value={form.date} onChange={(e) => setField('date', e.target.value)} required />
              </FormField>
            </div>

            {/* Arquivo: enviar ou link */}
            <fieldset className="min-w-0">
              <legend className="mb-1.5 text-sm font-semibold text-gray-700">
                Arquivo<span aria-hidden="true" className="ml-0.5 text-red-600">*</span>
              </legend>
              <div role="group" aria-label="Origem do arquivo" className="mb-3 inline-flex rounded-xl bg-gray-100 p-1">
                {(
                  [
                    ['upload', 'Enviar arquivo', FaCloudUploadAlt],
                    ['link', 'Usar um link', FaLink],
                  ] as const
                ).map(([mode, label, Icon]) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={fileMode === mode}
                    onClick={() => {
                      setFileMode(mode);
                      setFileError(null);
                    }}
                    className={cx(
                      'inline-flex min-h-11 items-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition-colors pointer-fine:min-h-9',
                      fileMode === mode ? 'bg-white text-[#003f7f] shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:text-gray-900',
                      focusRing
                    )}
                  >
                    <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {fileMode === 'upload' ? (
                <div className="space-y-3">
                  {(file || form.file_url) && (
                    <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3 ring-1 ring-gray-200">
                      <span className={cx('flex size-11 shrink-0 items-center justify-center rounded-xl', currentTipo.tile)}>
                        <currentTipo.icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">{file ? file.name : 'Arquivo atual'}</p>
                        <p className="truncate text-xs text-gray-500">
                          {file ? `${formatSize(file.size)} · será enviado ao salvar` : form.file_url.split('/').pop()}
                        </p>
                      </div>
                      {file ? (
                        <IconButton icon={FaTimes} label="Remover arquivo escolhido" onClick={() => setFile(null)} />
                      ) : (
                        <a href={form.file_url} target="_blank" rel="noopener noreferrer" className={buttonClass('ghost', 'sm')}>
                          Abrir
                          <span className="sr-only">arquivo atual (nova aba)</span>
                        </a>
                      )}
                    </div>
                  )}
                  <label
                    htmlFor={fileInputId}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      pickFile(e.dataTransfer.files?.[0]);
                    }}
                    className={cx(
                      'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors',
                      'has-[input:focus-visible]:border-[#0066cc] has-[input:focus-visible]:ring-4 has-[input:focus-visible]:ring-[#0066cc]/15',
                      fileError ? 'border-red-400 bg-red-50/40' : 'border-gray-300 bg-gray-50/60 hover:border-[#003f7f]/40 hover:bg-[#003f7f]/[0.03]'
                    )}
                  >
                    <FaCloudUploadAlt aria-hidden="true" className="h-6 w-6 text-[#003f7f]" />
                    <span className="text-sm font-semibold text-gray-800">
                      <span className="text-[#0052a3]">{file || form.file_url ? 'Trocar arquivo' : 'Clique para escolher'}</span> ou arraste aqui
                    </span>
                    <span className="text-xs text-gray-500">PDF, Word, Excel ou imagem · até {MAX_MB} MB</span>
                    <input
                      id={fileInputId}
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                      className="sr-only"
                      aria-invalid={fileError ? true : undefined}
                      onChange={(e) => {
                        pickFile(e.target.files?.[0]);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
              ) : (
                <Input
                  type="url"
                  aria-label="Link do arquivo"
                  value={form.file_url}
                  onChange={(e) => {
                    setField('file_url', e.target.value);
                    setFileError(null);
                  }}
                  invalid={!!fileError}
                  placeholder="https://…"
                />
              )}
              {fileError ? (
                <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">
                  {fileError}
                </p>
              ) : (
                fileMode === 'link' && <p className="mt-1.5 text-xs text-gray-500">Link direto para o arquivo (Google Drive, Dropbox…) com acesso público.</p>
              )}
            </fieldset>

            <Checkbox label="Documento visível no site" checked={form.is_active} onChange={(e) => setField('is_active', e.target.checked)} />

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setForm(null)} disabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" loading={isSaving}>
                {isSaving ? (file ? 'Enviando arquivo…' : 'Salvando…') : form.id ? 'Salvar alterações' : 'Publicar documento'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir documento"
        message={`Excluir "${toDelete?.title ?? ''}" do Portal da Transparência? Esta ação não pode ser desfeita.`}
        type="delete"
        confirmText="Sim, excluir"
        isLoading={isDeleting}
      />
    </div>
  );
}
