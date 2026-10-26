'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaVideo, FaYoutube, FaExternalLinkAlt, FaRedo, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { formatDateBR } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import {
  AdminCard, AdminPageHeader, Button, DataTable, EmptyState, FilterPills, FormField, IconButton, ImageUploadField, Input,
  SearchInput, Select, StatusBadge, Textarea, cx, focusRing, type DataTableColumn,
} from '@/app/admin/_components';

interface Video {
  id: number;
  title: string;
  description: string | null;
  video_url: string | null;
  youtube_id: string | null;
  thumbnail: string | null;
  category: string;
  date: string;
  duration: string | null;
  views: string | null;
}

const CATEGORIES = ['Institucional', 'Capacitação', 'Dicas', 'Tutorial', 'Eventos', 'Entrevista'];
const PAGE_SIZE = 10;
const DURATION = /^\d{1,3}(:[0-5]\d){1,2}$/;

const emptyForm = () => ({
  title: '',
  description: '',
  video_url: '',
  thumbnail: '',
  category: 'Institucional',
  duration: '',
});
type FormState = ReturnType<typeof emptyForm>;
type FormErrors = Partial<Record<keyof FormState, string>>;

/** ID do vídeo em links do YouTube: watch?v=, youtu.be/, /embed/, /shorts/, /live/ (mesma regra da API). */
function getYoutubeId(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase().replace(/^(www|m)\./, '');
  let id: string | null | undefined = null;
  if (host === 'youtu.be') id = url.pathname.split('/')[1];
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'music.youtube.com') {
    id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/)?.[1];
  }
  return id && /^[\w-]{11}$/.test(id) ? id : null;
}

const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

async function request<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetchWithCSRF(url, init);
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || `Erro ${response.status} ao falar com o servidor.`);
  return data as T;
}

const errorMessage = (error: unknown, fallback: string) => (error instanceof Error && error.message ? error.message : fallback);
const isValidLink = (value: string) => !value || /^(https?:\/\/[^\s]+|\/(?!\/)[^\s]*)$/i.test(value.trim());

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.video_url.trim()) errors.video_url = 'Cole o link do vídeo no YouTube.';
  else if (!getYoutubeId(form.video_url)) errors.video_url = 'Link do YouTube não reconhecido. Copie o endereço da página do vídeo.';
  if (!form.title.trim()) errors.title = 'Informe o título do vídeo.';
  if (form.duration && !DURATION.test(form.duration.trim())) errors.duration = 'Use minutos:segundos (5:30) ou horas:minutos:segundos (1:05:30).';
  if (!isValidLink(form.thumbnail)) errors.thumbnail = 'Use um endereço que comece com https://';
  return errors;
}

function Thumb({ video }: { video: Video }) {
  const src = video.thumbnail || (video.youtube_id ? ytThumb(video.youtube_id) : null);
  return (
    <span className="relative flex aspect-video w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#001a3d] text-white/60 ring-1 ring-gray-200">
      {src ? (
        <Image src={src} alt="" fill sizes="80px" className="object-cover" unoptimized={!isOptimizableImage(src)} />
      ) : (
        <FaVideo aria-hidden="true" className="h-4 w-4" />
      )}
      {video.duration && (
        <span className="absolute right-1 bottom-1 rounded bg-black/75 px-1 text-[10px] leading-4 font-semibold text-white tabular-nums">
          {video.duration}
        </span>
      )}
    </span>
  );
}

export default function AdminTVLojistaPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadVideos = useCallback(
    () =>
      request<Video[]>('/api/admin/videos')
        .then((data) => {
          setVideos(data);
          setLoadError(false);
        })
        .catch((error) => {
          setLoadError(true);
          toast.error(errorMessage(error, 'Erro ao carregar vídeos.'));
        })
        .finally(() => setIsLoading(false)),
    []
  );

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const openModal = (video?: Video) => {
    setEditingId(video?.id ?? null);
    setFormData(
      video
        ? {
            title: video.title,
            description: video.description || '',
            video_url: video.video_url || '',
            thumbnail: video.thumbnail || '',
            category: video.category || 'Institucional',
            duration: video.duration && video.duration !== '00:00' ? video.duration : '',
          }
        : emptyForm()
    );
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!isSaving && !isUploading) setIsModalOpen(false);
  };

  const handleThumbSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({ ...current, thumbnail: 'Escolha um arquivo de imagem (PNG, JPG ou WebP).' }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors((current) => ({ ...current, thumbnail: 'A imagem passa de 10 MB. Reduza o tamanho e tente de novo.' }));
      return;
    }
    setIsUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('bucket', 'gallery');
      body.append('folder', 'videos');
      const data = await request<{ url?: string }>('/api/upload', { method: 'POST', body });
      if (!data.url) throw new Error('O envio não retornou o endereço da imagem.');
      setField('thumbnail', data.url);
      toast.success('Capa enviada.');
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao enviar a capa.'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(formData);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`video-${firstInvalid}`)?.focus();
      return;
    }

    setIsSaving(true);
    try {
      await request('/api/admin/videos', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(editingId && { id: editingId }),
          title: formData.title.trim(),
          description: formData.description.trim(),
          video_url: formData.video_url.trim(),
          thumbnail: formData.thumbnail.trim(),
          category: formData.category,
          duration: formData.duration.trim() || '00:00',
        }),
      });
      toast.success(editingId ? 'Vídeo atualizado.' : 'Vídeo adicionado.');
      setIsModalOpen(false);
      loadVideos();
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao salvar o vídeo.'));
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;
    setIsDeleting(true);
    try {
      await request(`/api/admin/videos?id=${videoToDelete.id}`, { method: 'DELETE' });
      toast.success('Vídeo excluído.');
      setVideoToDelete(null);
      loadVideos();
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao excluir o vídeo.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const term = searchTerm.trim().toLowerCase();
  const searched = videos.filter((v) => !term || v.title.toLowerCase().includes(term) || v.category?.toLowerCase().includes(term));
  const filtered = searched.filter((v) => category === 'all' || v.category === category);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const usedCategories = [...new Set(videos.map((v) => v.category).filter(Boolean))];
  const categoryOptions = formData.category && !CATEGORIES.includes(formData.category) ? [...CATEGORIES, formData.category] : CATEGORIES;
  const previewId = getYoutubeId(formData.video_url);

  const columns: DataTableColumn<Video>[] = [
    {
      key: 'title',
      header: 'Vídeo',
      primary: true,
      cell: (v) => (
        <div className="flex min-w-0 items-center gap-3">
          <Thumb video={v} />
          <div className="min-w-0">
            <p className="line-clamp-3 font-semibold text-gray-900 md:line-clamp-2 md:max-w-md">{v.title}</p>
            <StatusBadge variant="info" dot={false} className="mt-1">
              {v.category}
            </StatusBadge>
          </div>
        </div>
      ),
    },
    { key: 'date', header: 'Publicado em', className: 'whitespace-nowrap tabular-nums', cell: (v) => formatDateBR(v.date) },
    { key: 'views', header: 'Visualizações', align: 'right', className: 'tabular-nums', hideOnMobile: true, cell: (v) => v.views || '0' },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="TV Lojista"
        description="Vídeos do YouTube exibidos na TV Lojista do site."
        actions={
          <Button icon={FaPlus} onClick={() => openModal()}>
            Novo vídeo
          </Button>
        }
      />

      <AdminCard flush>
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <SearchInput
            label="Buscar vídeos"
            placeholder="Buscar por título ou categoria"
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            className="w-full xl:max-w-sm"
          />
          <FilterPills
            label="Filtrar por categoria"
            value={category}
            onChange={(value) => {
              setCategory(value);
              setPage(1);
            }}
            options={[
              { value: 'all', label: 'Todos', count: isLoading ? undefined : searched.length },
              ...usedCategories.map((c) => ({ value: c, label: c, count: isLoading ? undefined : searched.filter((v) => v.category === c).length })),
            ]}
          />
        </div>

        <DataTable
          caption="Lista de vídeos"
          columns={columns}
          rows={pageRows}
          getRowId={(v) => v.id}
          loading={isLoading}
          rowActions={(v) => (
            <>
              {v.video_url && (
                <a
                  href={v.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir “${v.title}” no YouTube (abre em nova aba)`}
                  title="Abrir no YouTube"
                  className={cx(
                    'inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#003f7f] pointer-fine:size-9',
                    focusRing
                  )}
                >
                  <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              )}
              <IconButton icon={FaEdit} label={`Editar “${v.title}”`} onClick={() => openModal(v)} />
              <IconButton icon={FaTrash} variant="danger" label={`Excluir “${v.title}”`} onClick={() => setVideoToDelete(v)} />
            </>
          )}
          pagination={{ page: currentPage, totalPages, onPageChange: setPage, total: filtered.length, pageSize: PAGE_SIZE }}
          empty={
            loadError ? (
              <EmptyState
                icon={FaRedo}
                title="Não foi possível carregar os vídeos"
                description="Verifique a conexão e tente de novo."
                action={
                  <Button
                    variant="secondary"
                    icon={FaRedo}
                    onClick={() => {
                      setIsLoading(true);
                      loadVideos();
                    }}
                  >
                    Tentar novamente
                  </Button>
                }
              />
            ) : videos.length === 0 ? (
              <EmptyState
                icon={FaVideo}
                title="Nenhum vídeo ainda"
                description="Cole o link de um vídeo do YouTube para ele aparecer na TV Lojista."
                action={
                  <Button icon={FaPlus} onClick={() => openModal()}>
                    Novo vídeo
                  </Button>
                }
              />
            ) : (
              <EmptyState
                title="Nenhum vídeo encontrado"
                description="Tente outro termo de busca ou outra categoria."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearchTerm('');
                      setCategory('all');
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

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Editar vídeo' : 'Novo vídeo'} subtitle="Campos com * são obrigatórios.">
        <form onSubmit={handleSave} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-3 md:col-span-2">
              <FormField
                label="Link do YouTube"
                id="video-video_url"
                required
                error={errors.video_url}
                hint="Aceita links de vídeo, Shorts, youtu.be e transmissões ao vivo."
              >
                <Input
                  type="url"
                  inputMode="url"
                  value={formData.video_url}
                  onChange={(e) => setField('video_url', e.target.value)}
                  onBlur={() => {
                    if (formData.video_url.trim() && !getYoutubeId(formData.video_url)) {
                      setErrors((current) => ({ ...current, video_url: 'Link do YouTube não reconhecido. Copie o endereço da página do vídeo.' }));
                    }
                  }}
                  required
                  placeholder="https://www.youtube.com/watch?v=…"
                />
              </FormField>
              {previewId && (
                <div className="flex items-center gap-3 rounded-xl bg-[#00a859]/[0.06] p-2.5 ring-1 ring-[#00a859]/20" role="status">
                  <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-[#001a3d]">
                    <Image src={ytThumb(previewId)} alt="Miniatura do vídeo no YouTube" fill sizes="112px" className="object-cover" />
                  </span>
                  <span className="min-w-0 text-sm">
                    <span className="flex items-center gap-1.5 font-semibold text-[#00703c]">
                      <FaCheckCircle aria-hidden="true" className="h-3.5 w-3.5" />
                      Vídeo reconhecido
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-gray-600">
                      <FaYoutube aria-hidden="true" className="h-3.5 w-3.5 text-gray-400" />
                      ID {previewId}
                    </span>
                  </span>
                </div>
              )}
            </div>

            <FormField label="Título do vídeo" id="video-title" required error={errors.title} className="md:col-span-2">
              <Input
                value={formData.title}
                onChange={(e) => setField('title', e.target.value)}
                required
                maxLength={500}
                placeholder="Ex.: Como organizar o fluxo de caixa"
              />
            </FormField>

            <FormField label="Categoria" id="video-category" required>
              <Select value={formData.category} onChange={(e) => setField('category', e.target.value)} required>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Duração" id="video-duration" error={errors.duration} hint="Ex.: 5:30 ou 1:05:30.">
              <Input
                value={formData.duration}
                onChange={(e) => setField('duration', e.target.value)}
                inputMode="numeric"
                maxLength={9}
                placeholder="5:30"
              />
            </FormField>

            <FormField label="Descrição" id="video-description" className="md:col-span-2">
              <Textarea
                value={formData.description}
                onChange={(e) => setField('description', e.target.value)}
                rows={4}
                maxLength={5000}
                placeholder="Do que trata o vídeo"
              />
            </FormField>

            <div className="space-y-3 md:col-span-2">
              <ImageUploadField
                label="Capa personalizada"
                id="video-thumbnail-file"
                value={formData.thumbnail && isValidLink(formData.thumbnail) ? formData.thumbnail : null}
                onSelect={handleThumbSelect}
                onRemove={() => setField('thumbnail', '')}
                uploading={isUploading}
                hint="Opcional. Sem capa, o site usa a miniatura do YouTube."
              />
              <FormField label="Ou cole o endereço da capa" id="video-thumbnail" error={errors.thumbnail}>
                <Input
                  type="url"
                  inputMode="url"
                  value={formData.thumbnail}
                  onChange={(e) => setField('thumbnail', e.target.value)}
                  placeholder="https://…"
                />
              </FormField>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={closeModal} disabled={isSaving || isUploading}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSaving} disabled={isUploading}>
              {isSaving ? 'Salvando…' : editingId ? 'Salvar alterações' : 'Adicionar vídeo'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={videoToDelete !== null}
        onClose={() => !isDeleting && setVideoToDelete(null)}
        onConfirm={confirmDelete}
        type="delete"
        title="Excluir vídeo?"
        message={`“${videoToDelete?.title ?? ''}” sai da TV Lojista do site. O vídeo continua no YouTube. Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        isLoading={isDeleting}
      />
    </div>
  );
}
