'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaStar, FaBullhorn, FaExternalLinkAlt, FaRedo, FaEyeSlash, FaNewspaper, FaCalendarAlt, FaImages } from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/app/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { type Campaign, type CampaignStatus, getCampaignStatus } from '@/lib/campaigns';
import { formatDateBR, todayISO } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import {
  AdminCard, AdminPageHeader, Button, Checkbox, DataTable, EmptyState, FilterPills, FormField, IconButton, ImageUploadField,
  Input, SearchInput, StatusBadge, Textarea, cx, focusRing, type DataTableColumn, type StatusVariant, useOpenOnNovo,
} from '@/app/admin/_components';

interface Campanha extends Campaign {
  news_count: number;
  events_count: number;
  albums_count: number;
}

type Filter = 'all' | CampaignStatus;

const STATUS: Record<CampaignStatus, { label: string; variant: StatusVariant }> = {
  active: { label: 'Em andamento', variant: 'success' },
  upcoming: { label: 'Em breve', variant: 'info' },
  finished: { label: 'Realizada', variant: 'neutral' },
};
const PAGE_SIZE = 10;

const emptyForm = () => ({
  title: '',
  summary: '',
  description: '',
  cover_image: '',
  start_date: todayISO(),
  end_date: '',
  is_featured: false,
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
const isValidLink = (value: string) => !value || /^(https?:\/\/[^\s]+|\/(?!\/)[^\s]*)$/i.test(value.trim());
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = 'Informe o título da campanha.';
  if (!form.start_date) errors.start_date = 'Informe a data de início.';
  if (form.end_date && form.start_date && form.end_date < form.start_date) errors.end_date = 'O término deve ser igual ou depois do início.';
  if (!isValidLink(form.cover_image)) errors.cover_image = 'Use um endereço que comece com https://';
  return errors;
}

function Thumb({ src }: { src: string | null }) {
  return (
    <span className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#ffd000]/25 text-[#003f7f]/50 ring-1 ring-gray-200">
      {src ? (
        <Image src={src} alt="" fill sizes="64px" className="object-cover" unoptimized={!isOptimizableImage(src)} />
      ) : (
        <FaBullhorn aria-hidden="true" className="h-4 w-4" />
      )}
    </span>
  );
}

export default function AdminCampanhasPage() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
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
  const [isUploading, setIsUploading] = useState(false);

  const [campanhaToDelete, setCampanhaToDelete] = useState<Campanha | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCampanhas = useCallback(
    () =>
      request<Campanha[]>('/api/admin/campanhas')
        .then((data) => {
          setCampanhas(data);
          setLoadError(false);
        })
        .catch((error) => {
          setLoadError(true);
          toast.error(errorMessage(error, 'Erro ao carregar campanhas.'));
        })
        .finally(() => setIsLoading(false)),
    []
  );

  useEffect(() => {
    loadCampanhas();
  }, [loadCampanhas]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const openModal = (campanha?: Campanha) => {
    setEditingId(campanha?.id ?? null);
    setFormData(
      campanha
        ? {
            title: campanha.title,
            summary: campanha.summary || '',
            description: campanha.description || '',
            cover_image: campanha.cover_image || '',
            start_date: campanha.start_date,
            end_date: campanha.end_date || '',
            is_featured: campanha.is_featured,
            is_active: campanha.is_active,
          }
        : emptyForm()
    );
    setErrors({});
    setIsModalOpen(true);
  };
  // Atalhos do painel (?novo=1) abrem direto o formulário de criação
  useOpenOnNovo(() => openModal());

  const closeModal = () => {
    if (!isSaving && !isUploading) setIsModalOpen(false);
  };

  const handleImageSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({ ...current, cover_image: 'Escolha um arquivo de imagem (PNG, JPG ou WebP).' }));
      return;
    }
    // Limite real de envio pelo painel: 10 MB (proxy do Next), mesmo o bucket aceitando 20 MB
    if (file.size > 10 * 1024 * 1024) {
      setErrors((current) => ({ ...current, cover_image: 'A imagem passa de 10 MB. Reduza o tamanho e tente de novo.' }));
      return;
    }
    setIsUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('bucket', 'gallery');
      body.append('folder', 'campaigns');
      const data = await request<{ url?: string }>('/api/upload', { method: 'POST', body });
      if (!data.url) throw new Error('O envio não retornou o endereço da imagem.');
      setField('cover_image', data.url);
      toast.success('Imagem enviada.');
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao enviar a imagem.'));
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
      document.getElementById(`campanha-${firstInvalid}`)?.focus();
      return;
    }

    setIsSaving(true);
    try {
      await request('/api/admin/campanhas', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...(editingId && { id: editingId }), ...formData, cover_image: formData.cover_image.trim() }),
      });
      toast.success(editingId ? 'Campanha atualizada.' : 'Campanha criada.');
      setIsModalOpen(false);
      loadCampanhas();
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao salvar a campanha.'));
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!campanhaToDelete) return;
    setIsDeleting(true);
    try {
      await request(`/api/admin/campanhas?id=${campanhaToDelete.id}`, { method: 'DELETE' });
      toast.success('Campanha excluída.');
      setCampanhaToDelete(null);
      loadCampanhas();
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao excluir a campanha.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const today = todayISO();
  const statusOf = (c: Campanha) => getCampaignStatus(c, today);
  const term = searchTerm.trim().toLowerCase();
  const searched = campanhas.filter((c) => !term || c.title.toLowerCase().includes(term) || c.summary?.toLowerCase().includes(term));
  const filtered = searched.filter((c) => filter === 'all' || statusOf(c) === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const countBy = (status: CampaignStatus) => searched.filter((c) => statusOf(c) === status).length;

  const columns: DataTableColumn<Campanha>[] = [
    {
      key: 'title',
      header: 'Campanha',
      primary: true,
      cell: (c) => (
        <div className="flex min-w-0 items-center gap-3">
          <Thumb src={c.cover_image} />
          <div className="min-w-0">
            <p className="line-clamp-3 font-semibold text-gray-900 md:line-clamp-2 md:max-w-sm">{c.title}</p>
            {c.summary && <p className="mt-0.5 line-clamp-1 text-xs font-normal text-gray-500 md:max-w-sm">{c.summary}</p>}
            {(c.is_featured || !c.is_active) && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {c.is_featured && (
                  <StatusBadge variant="warning" dot={false}>
                    <FaStar aria-hidden="true" className="h-2.5 w-2.5" />
                    Destaque
                  </StatusBadge>
                )}
                {!c.is_active && (
                  <StatusBadge variant="neutral" dot={false}>
                    <FaEyeSlash aria-hidden="true" className="h-2.5 w-2.5" />
                    Oculta no site
                  </StatusBadge>
                )}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'period',
      header: 'Período',
      className: 'tabular-nums',
      cell: (c) => {
        const s = STATUS[statusOf(c)];
        return (
          <span className="flex flex-col items-end gap-1 md:items-start">
            <span>
              <span className="whitespace-nowrap">{formatDateBR(c.start_date)}</span>{' '}
              <span className="whitespace-nowrap text-gray-500">{c.end_date ? `até ${formatDateBR(c.end_date)}` : 'sem término'}</span>
            </span>
            <StatusBadge variant={s.variant}>{s.label}</StatusBadge>
          </span>
        );
      },
    },
    {
      key: 'content',
      header: 'Conteúdos',
      cell: (c) => (
        <span className="inline-flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-sm text-gray-600 tabular-nums md:justify-start">
          {(
            [
              [FaNewspaper, c.news_count, plural(c.news_count, 'notícia', 'notícias')],
              [FaCalendarAlt, c.events_count, plural(c.events_count, 'evento', 'eventos')],
              [FaImages, c.albums_count, plural(c.albums_count, 'álbum', 'álbuns')],
            ] as const
          ).map(([Icon, count, label]) => (
            <span key={label} title={label} className="inline-flex items-center gap-1">
              <Icon aria-hidden="true" className="h-3 w-3 text-gray-400" />
              <span aria-hidden="true">{count}</span>
              <span className="sr-only">{label}</span>
            </span>
          ))}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Campanhas"
        description="Crie campanhas e vincule notícias, eventos e álbuns a elas."
        actions={
          <Button icon={FaPlus} onClick={() => openModal()}>
            Nova campanha
          </Button>
        }
      />

      <AdminCard flush>
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <SearchInput
            label="Buscar campanhas"
            placeholder="Buscar por título ou resumo"
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            className="w-full xl:max-w-sm"
          />
          <FilterPills<Filter>
            label="Filtrar por status"
            value={filter}
            onChange={(value) => {
              setFilter(value);
              setPage(1);
            }}
            options={[
              { value: 'all', label: 'Todas', count: isLoading ? undefined : searched.length },
              { value: 'active', label: 'Em andamento', count: isLoading ? undefined : countBy('active') },
              { value: 'upcoming', label: 'Em breve', count: isLoading ? undefined : countBy('upcoming') },
              { value: 'finished', label: 'Realizadas', count: isLoading ? undefined : countBy('finished') },
            ]}
          />
        </div>

        <DataTable
          caption="Lista de campanhas"
          columns={columns}
          rows={pageRows}
          getRowId={(c) => c.id}
          loading={isLoading}
          rowActions={(c) => (
            <>
              {c.is_active && (
                <a
                  href={`/imprensa/campanhas/${c.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver “${c.title}” no site (abre em nova aba)`}
                  title="Ver no site"
                  className={cx(
                    'inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#003f7f] pointer-fine:size-9',
                    focusRing
                  )}
                >
                  <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              )}
              <IconButton icon={FaEdit} label={`Editar “${c.title}”`} onClick={() => openModal(c)} />
              <IconButton icon={FaTrash} variant="danger" label={`Excluir “${c.title}”`} onClick={() => setCampanhaToDelete(c)} />
            </>
          )}
          pagination={{ page: currentPage, totalPages, onPageChange: setPage, total: filtered.length, pageSize: PAGE_SIZE }}
          empty={
            loadError ? (
              <EmptyState
                icon={FaRedo}
                title="Não foi possível carregar as campanhas"
                description="Verifique a conexão e tente de novo."
                action={
                  <Button
                    variant="secondary"
                    icon={FaRedo}
                    onClick={() => {
                      setIsLoading(true);
                      loadCampanhas();
                    }}
                  >
                    Tentar novamente
                  </Button>
                }
              />
            ) : campanhas.length === 0 ? (
              <EmptyState
                icon={FaBullhorn}
                title="Nenhuma campanha ainda"
                description="Crie uma campanha para agrupar notícias, eventos e álbuns."
                action={
                  <Button icon={FaPlus} onClick={() => openModal()}>
                    Nova campanha
                  </Button>
                }
              />
            ) : (
              <EmptyState
                title="Nenhuma campanha encontrada"
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

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Editar campanha' : 'Nova campanha'} subtitle="Campos com * são obrigatórios.">
        <form onSubmit={handleSave} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField label="Título da campanha" id="campanha-title" required error={errors.title} className="md:col-span-2">
              <Input
                value={formData.title}
                onChange={(e) => setField('title', e.target.value)}
                required
                maxLength={150}
                placeholder="Ex.: Natal Premiado 2026"
              />
            </FormField>

            <FormField label="Data de início" id="campanha-start_date" required error={errors.start_date}>
              <Input type="date" value={formData.start_date} onChange={(e) => setField('start_date', e.target.value)} required />
            </FormField>

            <FormField label="Data de término" id="campanha-end_date" error={errors.end_date} hint="Deixe em branco se não tiver data para acabar.">
              <Input
                type="date"
                value={formData.end_date}
                min={formData.start_date || undefined}
                onChange={(e) => setField('end_date', e.target.value)}
              />
            </FormField>

            <FormField
              label="Resumo"
              id="campanha-summary"
              hint={`Frase que aparece nos cards da campanha. ${formData.summary.length}/300.`}
              className="md:col-span-2"
            >
              <Textarea
                value={formData.summary}
                onChange={(e) => setField('summary', e.target.value)}
                rows={2}
                maxLength={300}
                placeholder="Compre no comércio local e concorra a prêmios"
              />
            </FormField>

            <FormField label="Descrição" id="campanha-description" className="md:col-span-2">
              <Textarea
                value={formData.description}
                onChange={(e) => setField('description', e.target.value)}
                rows={6}
                maxLength={5000}
                placeholder="Regulamento, prêmios, lojas participantes…"
              />
            </FormField>

            <div className="space-y-3 md:col-span-2">
              <ImageUploadField
                label="Imagem de capa"
                id="campanha-cover-file"
                value={formData.cover_image && isValidLink(formData.cover_image) ? formData.cover_image : null}
                onSelect={handleImageSelect}
                onRemove={() => setField('cover_image', '')}
                uploading={isUploading}
                hint="PNG, JPG ou WebP até 10 MB."
              />
              <FormField label="Ou cole o endereço da imagem" id="campanha-cover_image" error={errors.cover_image}>
                <Input
                  type="url"
                  inputMode="url"
                  value={formData.cover_image}
                  onChange={(e) => setField('cover_image', e.target.value)}
                  placeholder="https://…"
                />
              </FormField>
            </div>

            <Checkbox
              className="rounded-xl bg-gray-50 px-4 ring-1 ring-gray-200"
              label="Campanha em destaque"
              description="Aparece em evidência na página de campanhas."
              checked={formData.is_featured}
              onChange={(e) => setField('is_featured', e.target.checked)}
            />
            <Checkbox
              className="rounded-xl bg-gray-50 px-4 ring-1 ring-gray-200"
              label="Visível no site"
              description="Desmarque para ocultar sem excluir."
              checked={formData.is_active}
              onChange={(e) => setField('is_active', e.target.checked)}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={closeModal} disabled={isSaving || isUploading}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSaving} disabled={isUploading}>
              {isSaving ? 'Salvando…' : editingId ? 'Salvar alterações' : 'Criar campanha'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={campanhaToDelete !== null}
        onClose={() => !isDeleting && setCampanhaToDelete(null)}
        onConfirm={confirmDelete}
        type="delete"
        title="Excluir campanha?"
        message={`“${campanhaToDelete?.title ?? ''}” será excluída. As notícias, eventos e álbuns vinculados continuam no site, só que sem campanha. Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        isLoading={isDeleting}
      />
    </div>
  );
}
