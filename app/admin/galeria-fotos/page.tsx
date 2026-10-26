'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaImages, FaTimes, FaCloudUploadAlt, FaCalendarAlt, FaMapMarkerAlt,
  FaBullhorn, FaArrowLeft, FaArrowRight, FaRedo, FaUpload,
} from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { formatDateBR, todayISO } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import type { Campaign } from '@/lib/campaigns';
import {
  AdminCard, AdminPageHeader, Button, Checkbox, EmptyState, FilterPills, FormField, IconButton, ImageUploadField, Input,
  ImageRightsNotice, Pagination, SearchInput, Select, StatusBadge, Textarea, cardSurface, cx, focusRing, useOpenOnNovo,
} from '@/app/admin/_components';

interface Album {
  id: number;
  title: string;
  description: string | null;
  category: string;
  date: string;
  location: string | null;
  cover_url: string | null;
  cover?: string | null;
  is_active: boolean;
  photo_count: number;
  campaign_id: number | null;
}

interface AlbumPhoto {
  id: number;
  album_id: number;
  url: string;
  title: string | null;
  display_order: number;
}

/** Arquivo escolhido + pré-visualização local (blob:), liberada ao remover. */
interface PendingFile {
  file: File;
  url: string;
}

type CampaignOption = Pick<Campaign, 'id' | 'title' | 'is_active'>;
type VisibilityFilter = 'all' | 'visible' | 'hidden';
type DeleteTarget = { type: 'album'; album: Album } | { type: 'photo'; photo: AlbumPhoto };

const CATEGORIES = ['Eventos', 'Networking', 'Capacitação', 'Institucional', 'Comercial', 'Política', 'Outros'];
const PAGE_SIZE = 9;
// ponytail: o bucket aceita 20 MB, mas o proxy.ts passa por /api/* e o Next só repassa 10 MB do corpo (proxyClientMaxBodySize)
const MAX_PHOTO_MB = 10;
// Os mesmos tipos que o /api/upload aceita (HEIC do iPhone, por exemplo, é recusado lá)
const PHOTO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const PHOTO_ACCEPT = PHOTO_TYPES.join(',');
const isAcceptedPhoto = (file: File) => PHOTO_TYPES.includes(file.type) && file.size <= MAX_PHOTO_MB * 1024 * 1024;

const emptyForm = () => ({
  title: '',
  description: '',
  category: 'Eventos',
  date: todayISO(),
  location: '',
  cover_url: '',
  campaign_id: '',
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

const errorMessage = (error: unknown, fallback: string) => (error instanceof Error && error.message ? error.message : fallback);

async function uploadImage(file: File, folder: string): Promise<string> {
  const body = new FormData();
  body.append('file', file);
  body.append('bucket', 'gallery');
  body.append('folder', folder);
  const data = await request<{ url?: string }>('/api/upload', { method: 'POST', body });
  if (!data.url) throw new Error('O envio não retornou o endereço da imagem.');
  return data.url;
}

/** Separa imagens válidas (tipo e tamanho) e avisa sobre as recusadas. */
function acceptImages(list: FileList | null): PendingFile[] {
  const files = Array.from(list ?? []);
  const ok = files.filter(isAcceptedPhoto);
  const rejected = files.length - ok.length;
  if (rejected > 0) {
    toast.error(`${rejected} arquivo(s) ignorado(s): use imagens PNG, JPG ou WebP de até ${MAX_PHOTO_MB} MB.`);
  }
  return ok.map((file) => ({ file, url: URL.createObjectURL(file) }));
}

const revokeAll = (files: PendingFile[]) => files.forEach((f) => URL.revokeObjectURL(f.url));
const fileTitle = (file: File) => file.name.replace(/\.[^/.]+$/, '').slice(0, 200);

/** Sobe os arquivos um a um e grava cada foto; continua se um falhar e devolve quantos falharam (e o primeiro motivo). */
async function uploadPhotos(albumId: number, files: PendingFile[], startOrder: number, onProgress: (done: number) => void) {
  let failed = 0;
  let firstError = '';
  for (const [index, { file }] of files.entries()) {
    try {
      const url = await uploadImage(file, `albums/${albumId}`);
      await request('/api/admin/album-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ album_id: albumId, url, title: fileTitle(file), display_order: startOrder + index - failed }),
      });
    } catch (error) {
      failed++;
      firstError ||= errorMessage(error, '');
      console.error(`Erro ao enviar ${file.name}:`, error);
    }
    onProgress(index + 1);
  }
  return { failed, reason: firstError ? ` Motivo: ${firstError}` : '' };
}

function ProgressBar({ done, total, label }: { done: number; total: number; label: string }) {
  const percent = total ? Math.round((done / total) * 100) : 0;
  return (
    <div role="status" className="space-y-1.5">
      <div className="flex justify-between text-sm font-medium text-gray-700">
        <span>{label}</span>
        <span className="tabular-nums">
          {done} de {total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-[#00a859] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

/** Área de escolha de várias fotos (clique, teclado ou arrastar). */
function PhotoDropZone({ onFiles, disabled, label }: { onFiles: (files: PendingFile[]) => void; disabled?: boolean; label: string }) {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);
  return (
    <div>
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
          if (!disabled) onFiles(acceptImages(e.dataTransfer.files));
        }}
        className={cx(
          'flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-5 text-center transition-colors',
          'has-[input:focus-visible]:border-[#0066cc] has-[input:focus-visible]:ring-4 has-[input:focus-visible]:ring-[#0066cc]/15',
          dragging ? 'border-[#0066cc] bg-[#0066cc]/5' : 'border-gray-300 bg-gray-50/60 hover:border-[#003f7f]/40 hover:bg-[#003f7f]/[0.03]',
          disabled && 'pointer-events-none opacity-60'
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-white text-[#003f7f] ring-1 ring-gray-200">
          <FaCloudUploadAlt aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold text-gray-800">
          <span className="text-[#0052a3]">{label}</span> ou arraste as imagens
        </span>
        <span className="text-xs text-gray-500">Várias de uma vez · PNG, JPG ou WebP até {MAX_PHOTO_MB} MB cada</span>
        <input
          id={inputId}
          type="file"
          accept={PHOTO_ACCEPT}
          multiple
          className="sr-only"
          disabled={disabled}
          aria-describedby={`${inputId}-rights`}
          onChange={(e) => {
            onFiles(acceptImages(e.target.files));
            e.target.value = '';
          }}
        />
      </label>
      <ImageRightsNotice id={`${inputId}-rights`} />
    </div>
  );
}

/** Miniaturas das fotos escolhidas (ainda não enviadas), com remover. */
function PendingGrid({ files, onRemove, disabled }: { files: PendingFile[]; onRemove: (index: number) => void; disabled?: boolean }) {
  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {files.map(({ file, url }, index) => (
        <li key={url} className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200">
          <Image src={url} alt={file.name} fill sizes="120px" className="object-cover" unoptimized />
          <button
            type="button"
            onClick={() => onRemove(index)}
            disabled={disabled}
            aria-label={`Remover ${file.name}`}
            title="Remover"
            className={cx(
              'absolute top-1 right-1 flex size-11 items-center justify-center rounded-full pointer-fine:size-8 bg-white/95 text-gray-700 shadow ring-1 ring-gray-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-50',
              focusRing
            )}
          >
            <FaTimes aria-hidden="true" className="h-3 w-3" />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function AdminGaleriaFotosPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [campanhas, setCampanhas] = useState<CampaignOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibility, setVisibility] = useState<VisibilityFilter>('all');
  const [page, setPage] = useState(1);

  // Formulário do álbum
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [initialPhotos, setInitialPhotos] = useState<PendingFile[]>([]);

  // Fotos do álbum
  const [photosAlbum, setPhotosAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [newPhotos, setNewPhotos] = useState<PendingFile[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Pré-visualizações ainda abertas, liberadas se a página for desmontada
  const pendingRef = useRef<PendingFile[]>([]);
  useEffect(() => {
    pendingRef.current = [...initialPhotos, ...newPhotos];
  });
  useEffect(() => () => revokeAll(pendingRef.current), []);

  const loadAlbums = useCallback(
    () =>
      request<Album[]>('/api/admin/albums')
        .then((data) => {
          setAlbums(data);
          setLoadError(false);
        })
        .catch((error) => {
          setLoadError(true);
          toast.error(errorMessage(error, 'Erro ao carregar álbuns.'));
        })
        .finally(() => setIsLoading(false)),
    []
  );

  useEffect(() => {
    loadAlbums();
    request<CampaignOption[]>('/api/admin/campanhas')
      .then(setCampanhas)
      .catch(() => setCampanhas([]));
  }, [loadAlbums]);

  const loadPhotos = (albumId: number) =>
    request<AlbumPhoto[]>(`/api/admin/album-photos?albumId=${albumId}`)
      .then(setAlbumPhotos)
      .catch((error) => toast.error(errorMessage(error, 'Erro ao carregar as fotos.')))
      .finally(() => setIsLoadingPhotos(false));

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  // ===== Álbum =====
  const openAlbumModal = (album?: Album) => {
    setEditingId(album?.id ?? null);
    setFormData(
      album
        ? {
            title: album.title?.trim() || '',
            description: album.description || '',
            category: album.category || 'Eventos',
            date: /^\d{4}-\d{2}-\d{2}/.test(album.date || '') ? album.date.slice(0, 10) : '',
            location: album.location || '',
            cover_url: album.cover_url || '',
            campaign_id: album.campaign_id ? String(album.campaign_id) : '',
            is_active: album.is_active !== false,
          }
        : emptyForm()
    );
    setErrors({});
    revokeAll(initialPhotos);
    setInitialPhotos([]);
    setIsModalOpen(true);
  };
  // Atalhos do painel (?novo=1) abrem direto o formulário de criação
  useOpenOnNovo(() => openAlbumModal());

  const closeAlbumModal = () => {
    if (isSaving || isUploadingCover) return;
    revokeAll(initialPhotos);
    setInitialPhotos([]);
    setIsModalOpen(false);
  };

  const handleCoverSelect = async (file: File) => {
    if (!isAcceptedPhoto(file)) {
      setErrors((current) => ({ ...current, cover_url: `Use uma imagem PNG, JPG ou WebP de até ${MAX_PHOTO_MB} MB.` }));
      return;
    }
    setIsUploadingCover(true);
    try {
      setField('cover_url', await uploadImage(file, 'covers'));
      toast.success('Capa enviada.');
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao enviar a capa.'));
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: FormErrors = {};
    if (!formData.title.trim()) found.title = 'Informe o título do álbum.';
    if (!formData.category) found.category = 'Escolha a categoria.';
    if (!formData.date) found.date = 'Informe a data.';
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`album-${firstInvalid}`)?.focus();
      return;
    }

    setIsSaving(true);
    try {
      const saved = await request<{ data?: { id: number } }>('/api/admin/albums', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(editingId && { id: editingId }),
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          category: formData.category,
          date: formData.date,
          location: formData.location.trim() || null,
          cover_url: formData.cover_url,
          cover: formData.cover_url,
          is_active: formData.is_active,
          campaign_id: formData.campaign_id ? Number(formData.campaign_id) : null,
        }),
      });

      const albumId = editingId ?? saved.data?.id;
      let failed = 0;
      let reason = '';
      if (!editingId && albumId && initialPhotos.length > 0) {
        setProgress({ done: 0, total: initialPhotos.length });
        const result = await uploadPhotos(albumId, initialPhotos, 0, (done) => setProgress({ done, total: initialPhotos.length }));
        failed = result.failed;
        reason = result.reason;
      }

      const sent = initialPhotos.length - failed;
      if (failed > 0) toast.error(`Álbum criado, mas ${failed} foto(s) não foram enviadas. Tente de novo em “Fotos”.${reason}`);
      else toast.success(editingId ? 'Álbum atualizado.' : sent > 0 ? `Álbum criado com ${sent} foto(s).` : 'Álbum criado.');

      revokeAll(initialPhotos);
      setInitialPhotos([]);
      setIsModalOpen(false);
      loadAlbums();
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao salvar o álbum.'));
    } finally {
      setIsSaving(false);
      setProgress(null);
    }
  };

  const toggleActive = async (album: Album) => {
    setTogglingId(album.id);
    try {
      await request('/api/admin/albums', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: album.id,
          title: album.title,
          description: album.description,
          category: album.category,
          date: album.date,
          location: album.location,
          cover_url: album.cover_url,
          cover: album.cover ?? album.cover_url,
          is_active: !album.is_active,
        }),
      });
      setAlbums((current) => current.map((a) => (a.id === album.id ? { ...a, is_active: !album.is_active } : a)));
      toast.success(album.is_active ? 'Álbum ocultado do site.' : 'Álbum visível no site.');
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao alterar a visibilidade.'));
    } finally {
      setTogglingId(null);
    }
  };

  // ===== Fotos =====
  const openPhotos = (album: Album) => {
    setPhotosAlbum(album);
    setAlbumPhotos([]);
    setIsLoadingPhotos(true);
    setOrderMessage('');
    loadPhotos(album.id);
  };

  const closePhotos = () => {
    if (progress) return; // envio em andamento
    revokeAll(newPhotos);
    setNewPhotos([]);
    setPhotosAlbum(null);
    setAlbumPhotos([]);
  };

  const handleUploadPhotos = async () => {
    if (!photosAlbum || newPhotos.length === 0) return;
    const files = newPhotos;
    const startOrder = albumPhotos.reduce((max, p) => Math.max(max, (p.display_order ?? 0) + 1), 0);
    setProgress({ done: 0, total: files.length });
    const { failed, reason } = await uploadPhotos(photosAlbum.id, files, startOrder, (done) => setProgress({ done, total: files.length }));
    setProgress(null);

    if (failed > 0) toast.error(`${files.length - failed} de ${files.length} foto(s) enviadas. ${failed} falharam; tente de novo.${reason}`);
    else toast.success(`${files.length} foto(s) enviada(s).`);

    revokeAll(files);
    setNewPhotos([]);
    loadPhotos(photosAlbum.id);
    loadAlbums();
  };

  const movePhoto = async (index: number, direction: -1 | 1) => {
    if (!photosAlbum) return;
    const target = index + direction;
    if (target < 0 || target >= albumPhotos.length) return;
    const previous = albumPhotos;
    const next = [...albumPhotos];
    [next[index], next[target]] = [next[target], next[index]];
    setAlbumPhotos(next);
    setIsReordering(true);
    try {
      await request('/api/admin/album-photos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ album_id: photosAlbum.id, ids: next.map((p) => p.id) }),
      });
      setOrderMessage(`Foto movida para a posição ${target + 1} de ${next.length}.`);
    } catch (error) {
      setAlbumPhotos(previous);
      toast.error(errorMessage(error, 'Erro ao salvar a nova ordem.'));
    } finally {
      setIsReordering(false);
    }
  };

  // ===== Exclusão =====
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === 'album') {
        await request(`/api/admin/albums?id=${deleteTarget.album.id}`, { method: 'DELETE' });
        toast.success('Álbum excluído.');
        loadAlbums();
      } else {
        const { photo } = deleteTarget;
        await request(`/api/admin/album-photos?id=${photo.id}`, { method: 'DELETE' });
        setAlbumPhotos((current) => current.filter((p) => p.id !== photo.id));
        toast.success('Foto excluída.');
        loadAlbums();
      }
      setDeleteTarget(null);
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao excluir.'));
    } finally {
      setIsDeleting(false);
    }
  };

  // ===== Lista =====
  const term = searchTerm.trim().toLowerCase();
  const searched = albums.filter(
    (a) =>
      (!term || a.title?.toLowerCase().includes(term) || a.location?.toLowerCase().includes(term)) &&
      (categoryFilter === 'all' || a.category === categoryFilter)
  );
  const filtered = searched.filter((a) => (visibility === 'all' ? true : visibility === 'visible' ? a.is_active : !a.is_active));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageAlbums = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPhotos = albums.reduce((sum, a) => sum + (a.photo_count || 0), 0);
  const campaignTitle = (id: number | null) => campanhas.find((c) => c.id === id)?.title;
  const categoryOptions = formData.category && !CATEGORIES.includes(formData.category) ? [...CATEGORIES, formData.category] : CATEGORIES;
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setVisibility('all');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Galeria de fotos"
        description={
          isLoading
            ? 'Álbuns e fotos exibidos na galeria do site.'
            : `${albums.length} ${albums.length === 1 ? 'álbum' : 'álbuns'} · ${totalPhotos.toLocaleString('pt-BR')} fotos no total.`
        }
        actions={
          <Button icon={FaPlus} onClick={() => openAlbumModal()}>
            Novo álbum
          </Button>
        }
      />

      <AdminCard flush>
        <div className="flex flex-col gap-3 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-row xl:max-w-xl">
            <SearchInput
              label="Buscar álbuns"
              placeholder="Buscar por título ou local"
              value={searchTerm}
              onChange={(value) => {
                setSearchTerm(value);
                setPage(1);
              }}
              className="w-full"
            />
            <div className="sm:w-52 sm:shrink-0">
              <Select
                aria-label="Filtrar por categoria"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Todas as categorias</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <FilterPills<VisibilityFilter>
            label="Filtrar por visibilidade"
            value={visibility}
            onChange={(value) => {
              setVisibility(value);
              setPage(1);
            }}
            options={[
              { value: 'all', label: 'Todos', count: isLoading ? undefined : searched.length },
              { value: 'visible', label: 'Visíveis', count: isLoading ? undefined : searched.filter((a) => a.is_active).length },
              { value: 'hidden', label: 'Ocultos', count: isLoading ? undefined : searched.filter((a) => !a.is_active).length },
            ]}
          />
        </div>
      </AdminCard>

      {isLoading ? (
        <ul aria-busy="true" aria-label="Carregando álbuns" className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} aria-hidden="true" className={cx(cardSurface, 'overflow-hidden')}>
              <div className="aspect-[16/10] animate-pulse bg-gray-100 motion-reduce:animate-none" />
              <div className="space-y-3 p-4">
                <span className="block h-3 w-1/3 animate-pulse rounded bg-gray-100 motion-reduce:animate-none" />
                <span className="block h-4 w-3/4 animate-pulse rounded bg-gray-100 motion-reduce:animate-none" />
                <span className="block h-9 w-full animate-pulse rounded-xl bg-gray-100 motion-reduce:animate-none" />
              </div>
            </li>
          ))}
        </ul>
      ) : pageAlbums.length === 0 ? (
        <AdminCard flush>
          {loadError ? (
            <EmptyState
              icon={FaRedo}
              title="Não foi possível carregar os álbuns"
              description="Verifique a conexão e tente de novo."
              action={
                <Button
                  variant="secondary"
                  icon={FaRedo}
                  onClick={() => {
                    setIsLoading(true);
                    loadAlbums();
                  }}
                >
                  Tentar novamente
                </Button>
              }
            />
          ) : albums.length === 0 ? (
            <EmptyState
              icon={FaImages}
              title="Nenhum álbum ainda"
              description="Crie um álbum e envie as fotos do evento de uma vez."
              action={
                <Button icon={FaPlus} onClick={() => openAlbumModal()}>
                  Novo álbum
                </Button>
              }
            />
          ) : (
            <EmptyState
              title="Nenhum álbum encontrado"
              description="Tente outro termo de busca ou outro filtro."
              action={
                <Button variant="secondary" onClick={resetFilters}>
                  Limpar filtros
                </Button>
              }
            />
          )}
        </AdminCard>
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3" aria-label="Álbuns">
            {pageAlbums.map((album) => {
              const campaign = campaignTitle(album.campaign_id);
              return (
                <li key={album.id} className={cx(cardSurface, 'flex min-w-0 flex-col overflow-hidden')}>
                  <div className="relative aspect-[16/10] bg-linear-to-br from-[#003f7f] to-[#0052a3]">
                    {album.cover_url ? (
                      <Image
                        src={album.cover_url}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                        className={cx('object-cover', !album.is_active && 'opacity-50 grayscale')}
                        unoptimized={!isOptimizableImage(album.cover_url)}
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-white/30">
                        <FaImages aria-hidden="true" className="h-12 w-12" />
                      </span>
                    )}
                    <div className="absolute inset-x-3 top-3 flex flex-wrap gap-1.5">
                      <StatusBadge variant={album.is_active ? 'success' : 'neutral'} className="bg-white! shadow-sm">
                        {album.is_active ? 'Visível' : 'Oculto'}
                      </StatusBadge>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#001a3d]/80 px-2.5 py-0.5 text-xs font-semibold text-white tabular-nums backdrop-blur-sm">
                        <FaImages aria-hidden="true" className="h-3 w-3" />
                        {album.photo_count} {album.photo_count === 1 ? 'foto' : 'fotos'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex flex-wrap gap-1.5">
                      <StatusBadge variant="info" dot={false}>
                        {album.category}
                      </StatusBadge>
                      {campaign && (
                        <StatusBadge variant="warning" dot={false}>
                          <FaBullhorn aria-hidden="true" className="h-2.5 w-2.5" />
                          <span className="truncate">{campaign}</span>
                        </StatusBadge>
                      )}
                    </div>
                    <h2 className="mt-2 line-clamp-2 text-base font-bold text-gray-900">{album.title}</h2>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <FaCalendarAlt aria-hidden="true" className="h-3 w-3" />
                        {formatDateBR(album.date)}
                      </span>
                      {album.location && (
                        <span className="inline-flex min-w-0 items-center gap-1.5">
                          <FaMapMarkerAlt aria-hidden="true" className="h-3 w-3 shrink-0" />
                          <span className="truncate">{album.location}</span>
                        </span>
                      )}
                    </p>

                    <div className="mt-auto flex items-center gap-1 pt-4">
                      <Button variant="secondary" size="sm" icon={FaImages} className="flex-1" onClick={() => openPhotos(album)}>
                        Fotos
                        <span className="sr-only"> de {album.title}</span>
                      </Button>
                      <IconButton
                        icon={album.is_active ? FaEyeSlash : FaEye}
                        label={album.is_active ? `Ocultar “${album.title}” do site` : `Mostrar “${album.title}” no site`}
                        onClick={() => toggleActive(album)}
                        disabled={togglingId === album.id}
                      />
                      <IconButton icon={FaEdit} label={`Editar “${album.title}”`} onClick={() => openAlbumModal(album)} />
                      <IconButton
                        icon={FaTrash}
                        variant="danger"
                        label={`Excluir “${album.title}”`}
                        onClick={() => setDeleteTarget({ type: 'album', album })}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {totalPages > 1 && (
            <AdminCard flush>
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                total={filtered.length}
                pageSize={PAGE_SIZE}
                className="border-t-0!"
              />
            </AdminCard>
          )}
        </>
      )}

      {/* Formulário do álbum */}
      <Modal isOpen={isModalOpen} onClose={closeAlbumModal} title={editingId ? 'Editar álbum' : 'Novo álbum'} subtitle="Campos com * são obrigatórios.">
        <form onSubmit={handleSaveAlbum} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField label="Título" id="album-title" required error={errors.title} className="md:col-span-2">
              <Input
                value={formData.title}
                onChange={(e) => setField('title', e.target.value)}
                required
                maxLength={200}
                placeholder="Ex.: Encontro de Lojistas 2026"
              />
            </FormField>

            <FormField label="Categoria" id="album-category" required error={errors.category}>
              <Select value={formData.category} onChange={(e) => setField('category', e.target.value)} required>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Data" id="album-date" required error={errors.date}>
              <Input type="date" value={formData.date} onChange={(e) => setField('date', e.target.value)} required />
            </FormField>

            <FormField label="Local" id="album-location">
              <Input value={formData.location} onChange={(e) => setField('location', e.target.value)} maxLength={200} placeholder="Ex.: CDL Ipirá" />
            </FormField>

            <FormField label="Campanha" id="album-campaign" hint="Opcional.">
              <Select value={formData.campaign_id} onChange={(e) => setField('campaign_id', e.target.value)}>
                <option value="">Nenhuma</option>
                {campanhas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                    {c.is_active === false ? ' (oculta no site)' : ''}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Descrição" id="album-description" className="md:col-span-2">
              <Textarea
                value={formData.description}
                onChange={(e) => setField('description', e.target.value)}
                rows={2}
                maxLength={2000}
                placeholder="Sobre o que são as fotos"
              />
            </FormField>

            <ImageUploadField
              label="Imagem de capa"
              id="album-cover"
              className="md:col-span-2"
              value={formData.cover_url || null}
              onSelect={handleCoverSelect}
              onRemove={() => setField('cover_url', '')}
              uploading={isUploadingCover}
              accept={PHOTO_ACCEPT}
              error={errors.cover_url}
              hint={`PNG, JPG ou WebP até ${MAX_PHOTO_MB} MB. Sem capa, o site usa um fundo azul.`}
              // Álbum novo: o aviso de direito de imagem já aparece logo abaixo, no campo das fotos
              rightsNotice={!!editingId}
            />

            {!editingId && (
              <div className="space-y-3 md:col-span-2">
                <p className="text-sm font-semibold text-gray-700">
                  Fotos do álbum <span className="font-normal text-gray-500">(opcional)</span>
                </p>
                <PhotoDropZone
                  label="Escolher fotos"
                  disabled={isSaving}
                  onFiles={(files) => setInitialPhotos((current) => [...current, ...files])}
                />
                {initialPhotos.length > 0 && (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-gray-700">{initialPhotos.length} foto(s) para enviar ao salvar</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isSaving}
                        onClick={() => {
                          revokeAll(initialPhotos);
                          setInitialPhotos([]);
                        }}
                      >
                        Remover todas
                      </Button>
                    </div>
                    <PendingGrid
                      files={initialPhotos}
                      disabled={isSaving}
                      onRemove={(index) =>
                        setInitialPhotos((current) => {
                          URL.revokeObjectURL(current[index].url);
                          return current.filter((_, i) => i !== index);
                        })
                      }
                    />
                  </>
                )}
              </div>
            )}

            <Checkbox
              className="rounded-xl bg-gray-50 px-4 ring-1 ring-gray-200 md:col-span-2"
              label="Visível no site"
              description="Desmarque para ocultar o álbum sem excluir."
              checked={formData.is_active}
              onChange={(e) => setField('is_active', e.target.checked)}
            />

            {isSaving && progress && (
              <div className="md:col-span-2">
                <ProgressBar done={progress.done} total={progress.total} label="Enviando fotos…" />
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={closeAlbumModal} disabled={isSaving || isUploadingCover}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSaving} disabled={isUploadingCover}>
              {isSaving ? 'Salvando…' : editingId ? 'Salvar alterações' : initialPhotos.length > 0 ? `Criar álbum e enviar ${initialPhotos.length} foto(s)` : 'Criar álbum'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Fotos do álbum */}
      <Modal
        isOpen={photosAlbum !== null}
        onClose={closePhotos}
        title="Fotos do álbum"
        subtitle={photosAlbum ? `${photosAlbum.title} · ${albumPhotos.length} ${albumPhotos.length === 1 ? 'foto' : 'fotos'}` : undefined}
      >
        <div className="space-y-6">
          <section aria-label="Adicionar fotos" className="space-y-3">
            <PhotoDropZone label="Adicionar fotos" disabled={progress !== null} onFiles={(files) => setNewPhotos((current) => [...current, ...files])} />
            {newPhotos.length > 0 && (
              <>
                <PendingGrid
                  files={newPhotos}
                  disabled={progress !== null}
                  onRemove={(index) =>
                    setNewPhotos((current) => {
                      URL.revokeObjectURL(current[index].url);
                      return current.filter((_, i) => i !== index);
                    })
                  }
                />
                {progress ? (
                  <ProgressBar done={progress.done} total={progress.total} label="Enviando fotos…" />
                ) : (
                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        revokeAll(newPhotos);
                        setNewPhotos([]);
                      }}
                    >
                      Limpar seleção
                    </Button>
                    <Button icon={FaUpload} onClick={handleUploadPhotos}>
                      Enviar {newPhotos.length} foto(s)
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>

          <section aria-labelledby="album-photos-heading">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h3 id="album-photos-heading" className="text-sm font-bold text-gray-900">
                Fotos publicadas
              </h3>
              {albumPhotos.length > 1 && <p className="text-xs text-gray-500">Use as setas para mudar a ordem no site.</p>}
            </div>
            <p aria-live="polite" className="sr-only">
              {orderMessage}
            </p>

            {isLoadingPhotos ? (
              <ul aria-busy="true" aria-label="Carregando fotos" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <li key={i} aria-hidden="true" className="aspect-square animate-pulse rounded-xl bg-gray-100 motion-reduce:animate-none" />
                ))}
              </ul>
            ) : albumPhotos.length === 0 ? (
              <EmptyState icon={FaImages} title="Nenhuma foto neste álbum" description="Adicione fotos acima para elas aparecerem na galeria." className="py-8! sm:py-10!" />
            ) : (
              <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {albumPhotos.map((photo, index) => (
                  <li key={photo.id} className="overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={photo.url}
                        alt={photo.title || `Foto ${index + 1}`}
                        fill
                        sizes="(min-width: 640px) 200px, 45vw"
                        className="object-cover"
                        unoptimized={!isOptimizableImage(photo.url)}
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-[#001a3d]/80 px-2 py-0.5 text-xs font-bold text-white tabular-nums">
                        {index + 1}
                      </span>
                      {index === 0 && (
                        <span className="absolute top-2 right-2 rounded-full bg-[#ffd000] px-2 py-0.5 text-[11px] font-bold text-[#003f7f]">1ª no site</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-1 p-1">
                      <div className="flex">
                        <IconButton
                          icon={FaArrowLeft}
                          label={`Mover foto ${index + 1} para antes`}
                          onClick={() => movePhoto(index, -1)}
                          disabled={index === 0 || isReordering}
                        />
                        <IconButton
                          icon={FaArrowRight}
                          label={`Mover foto ${index + 1} para depois`}
                          onClick={() => movePhoto(index, 1)}
                          disabled={index === albumPhotos.length - 1 || isReordering}
                        />
                      </div>
                      <IconButton icon={FaTrash} variant="danger" label={`Excluir foto ${index + 1}`} onClick={() => setDeleteTarget({ type: 'photo', photo })} />
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <div className="flex justify-end border-t border-gray-100 pt-4">
            <Button variant="secondary" onClick={closePhotos} disabled={progress !== null}>
              Fechar
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        type="delete"
        title={deleteTarget?.type === 'photo' ? 'Excluir foto?' : 'Excluir álbum?'}
        message={
          deleteTarget?.type === 'album'
            ? `“${deleteTarget.album.title}” e ${deleteTarget.album.photo_count} foto(s) serão removidos do site. Esta ação não pode ser desfeita.`
            : 'A foto será removida do álbum. Esta ação não pode ser desfeita.'
        }
        confirmText="Excluir"
        isLoading={isDeleting}
      />
    </div>
  );
}
