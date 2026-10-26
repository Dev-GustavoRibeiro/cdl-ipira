'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaBullhorn, FaNewspaper, FaExternalLinkAlt, FaRedo } from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/app/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { formatDateBR, todayISO } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import type { Campaign } from '@/lib/campaigns';
import {
  AdminCard, AdminPageHeader, Button, Checkbox, DataTable, EmptyState, FilterPills, FormField, IconButton,
  ImageUploadField, Input, SearchInput, Select, StatusBadge, Textarea, cx, focusRing, type DataTableColumn, useOpenOnNovo,
} from '@/app/admin/_components';

interface Noticia {
  id: number;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  date: string;
  image: string | null;
  author: string | null;
  is_published: boolean | null;
  campaign_id: number | null;
}

type CampaignOption = Pick<Campaign, 'id' | 'title' | 'is_active'>;
type StatusFilter = 'all' | 'published' | 'draft';

const CATEGORIES = ['Economia', 'Comércio', 'Agronegócio', 'Dicas', 'Eventos', 'Serviços'];
const PAGE_SIZE = 10;

const emptyForm = () => ({
  title: '',
  excerpt: '',
  content: '',
  category: '',
  date: todayISO(),
  image: '',
  author: 'CDL Ipirá',
  is_published: true,
  campaign_id: '',
});
type FormState = ReturnType<typeof emptyForm>;
type FormErrors = Partial<Record<keyof FormState, string>>;

const isPublished = (n: Pick<Noticia, 'is_published'>) => n.is_published !== false;

/** fetch + JSON com a mensagem de erro da API (em vez de um texto genérico). */
async function request<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetchWithCSRF(url, init);
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || `Erro ${response.status} ao falar com o servidor.`);
  return data as T;
}

const errorMessage = (error: unknown, fallback: string) => (error instanceof Error && error.message ? error.message : fallback);

/** Link (relativo) ou http(s) — o mesmo que a API aceita. */
const isValidLink = (value: string) => !value || /^(https?:\/\/[^\s]+|\/(?!\/)[^\s]*)$/i.test(value.trim());

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = 'Informe o título.';
  if (!form.category) errors.category = 'Escolha a categoria.';
  if (!form.date) errors.date = 'Informe a data.';
  if (!form.excerpt.trim()) errors.excerpt = 'Escreva um resumo.';
  if (!form.content.trim()) errors.content = 'Escreva o conteúdo.';
  if (!isValidLink(form.image)) errors.image = 'Use um endereço que comece com https://';
  return errors;
}

function Thumb({ src, alt }: { src: string | null; alt: string }) {
  return (
    <span className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#003f7f]/[0.06] text-[#003f7f]/40 ring-1 ring-gray-200">
      {src ? (
        <Image src={src} alt={alt} fill sizes="64px" className="object-cover" unoptimized={!isOptimizableImage(src)} />
      ) : (
        <FaNewspaper aria-hidden="true" className="h-4 w-4" />
      )}
    </span>
  );
}

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [campanhas, setCampanhas] = useState<CampaignOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [noticiaToDelete, setNoticiaToDelete] = useState<Noticia | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Sem setState síncrono: a lista abre como "carregando" e só muda depois da resposta
  const loadNoticias = useCallback(
    () =>
      request<Noticia[]>('/api/admin/noticias')
        .then((data) => {
          setNoticias(data);
          setLoadError(false);
        })
        .catch((error) => {
          setLoadError(true);
          toast.error(errorMessage(error, 'Erro ao carregar notícias.'));
        })
        .finally(() => setIsLoading(false)),
    []
  );

  useEffect(() => {
    loadNoticias();
    // Campanhas para o select e os selos (se falhar, o formulário segue só com "Nenhuma")
    request<CampaignOption[]>('/api/admin/campanhas')
      .then(setCampanhas)
      .catch(() => setCampanhas([]));
  }, [loadNoticias]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const openModal = (noticia?: Noticia) => {
    setEditingId(noticia?.id ?? null);
    setFormData(
      noticia
        ? {
            title: noticia.title,
            excerpt: noticia.excerpt || '',
            content: noticia.content || '',
            category: noticia.category,
            date: /^\d{4}-\d{2}-\d{2}/.test(noticia.date || '') ? noticia.date.slice(0, 10) : '',
            image: noticia.image || '',
            author: noticia.author || 'CDL Ipirá',
            is_published: isPublished(noticia),
            campaign_id: noticia.campaign_id ? String(noticia.campaign_id) : '',
          }
        : emptyForm()
    );
    setErrors({});
    setIsModalOpen(true);
  };
  // Atalhos do painel (?novo=1) abrem direto o formulário de criação
  useOpenOnNovo(() => openModal());

  const closeModal = () => {
    // Não fecha durante o envio: a imagem chegaria depois e cairia no próximo formulário aberto
    if (isSaving || isUploading) return;
    setIsModalOpen(false);
  };

  const handleImageSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({ ...current, image: 'Escolha um arquivo de imagem (PNG, JPG ou WebP).' }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors((current) => ({ ...current, image: 'A imagem passa de 10 MB. Reduza o tamanho e tente de novo.' }));
      return;
    }
    setIsUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('bucket', 'news');
      const data = await request<{ url?: string }>('/api/upload', { method: 'POST', body });
      if (!data.url) throw new Error('O envio não retornou o endereço da imagem.');
      setField('image', data.url);
      toast.success('Imagem enviada.');
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao enviar a imagem.'));
    } finally {
      setIsUploading(false);
    }
  };

  const payloadOf = (form: FormState) => ({
    title: form.title.trim(),
    excerpt: form.excerpt.trim(),
    content: form.content,
    category: form.category,
    date: form.date,
    image: form.image.trim(),
    author: form.author.trim() || 'CDL Ipirá',
    is_published: form.is_published,
    campaign_id: form.campaign_id ? Number(form.campaign_id) : null,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(formData);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`noticia-${firstInvalid}`)?.focus();
      return;
    }

    setIsSaving(true);
    try {
      await request('/api/admin/noticias', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...(editingId && { id: editingId }), ...payloadOf(formData) }),
      });
      toast.success(editingId ? 'Notícia atualizada.' : formData.is_published ? 'Notícia publicada.' : 'Rascunho salvo.');
      setIsModalOpen(false);
      loadNoticias();
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao salvar a notícia.'));
    } finally {
      setIsSaving(false);
    }
  };

  const togglePublished = async (noticia: Noticia) => {
    const publish = !isPublished(noticia);
    setTogglingId(noticia.id);
    try {
      await request('/api/admin/noticias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: noticia.id,
          title: noticia.title,
          excerpt: noticia.excerpt,
          content: noticia.content,
          category: noticia.category,
          date: noticia.date,
          image: noticia.image || '',
          author: noticia.author,
          is_published: publish,
          campaign_id: noticia.campaign_id,
        }),
      });
      setNoticias((current) => current.map((n) => (n.id === noticia.id ? { ...n, is_published: publish } : n)));
      toast.success(publish ? 'Notícia publicada.' : 'Notícia movida para rascunhos.');
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao alterar a publicação.'));
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!noticiaToDelete) return;
    setIsDeleting(true);
    try {
      await request(`/api/admin/noticias?id=${noticiaToDelete.id}`, { method: 'DELETE' });
      toast.success('Notícia excluída.');
      setNoticiaToDelete(null);
      loadNoticias();
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao excluir a notícia.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const term = searchTerm.trim().toLowerCase();
  const matchesSearch = (n: Noticia) => !term || n.title.toLowerCase().includes(term) || n.category?.toLowerCase().includes(term);
  const searched = noticias.filter(matchesSearch);
  const filtered = searched.filter((n) =>
    statusFilter === 'all' ? true : statusFilter === 'published' ? isPublished(n) : !isPublished(n)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const campaignTitle = (id: number | null) => campanhas.find((c) => c.id === id)?.title;
  const categoryOptions = formData.category && !CATEGORIES.includes(formData.category) ? [...CATEGORIES, formData.category] : CATEGORIES;

  const columns: DataTableColumn<Noticia>[] = [
    {
      key: 'title',
      header: 'Notícia',
      primary: true,
      cell: (n) => {
        const campaign = campaignTitle(n.campaign_id);
        return (
          <div className="flex min-w-0 items-center gap-3">
            <Thumb src={n.image} alt="" />
            <div className="min-w-0">
              <p className="line-clamp-3 font-semibold text-gray-900 md:line-clamp-2 md:max-w-md">{n.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <StatusBadge variant="info" dot={false}>
                  {n.category}
                </StatusBadge>
                {campaign && (
                  <StatusBadge variant="warning" dot={false}>
                    <FaBullhorn aria-hidden="true" className="h-2.5 w-2.5" />
                    <span className="truncate">{campaign}</span>
                  </StatusBadge>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      // Data e status juntos: sobra largura para o título entre 768 e 1279 px (sem rolagem na tabela)
      key: 'status',
      header: 'Publicação',
      className: 'whitespace-nowrap tabular-nums',
      cell: (n) => (
        <span className="flex flex-col items-end gap-1 md:items-start">
          {isPublished(n) ? <StatusBadge variant="success">Publicada</StatusBadge> : <StatusBadge variant="neutral">Rascunho</StatusBadge>}
          <span className="text-sm text-gray-500">{formatDateBR(n.date)}</span>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Notícias"
        description="Crie, edite e publique as notícias do site."
        actions={
          <Button icon={FaPlus} onClick={() => openModal()}>
            Nova notícia
          </Button>
        }
      />

      <AdminCard flush>
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <SearchInput
            label="Buscar notícias"
            placeholder="Buscar por título ou categoria"
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            className="w-full xl:max-w-sm"
          />
          <FilterPills<StatusFilter>
            label="Filtrar por status"
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            options={[
              { value: 'all', label: 'Todas', count: isLoading ? undefined : searched.length },
              { value: 'published', label: 'Publicadas', count: isLoading ? undefined : searched.filter(isPublished).length },
              { value: 'draft', label: 'Rascunhos', count: isLoading ? undefined : searched.filter((n) => !isPublished(n)).length },
            ]}
          />
        </div>

        <DataTable
          caption="Lista de notícias"
          columns={columns}
          rows={pageRows}
          getRowId={(n) => n.id}
          loading={isLoading}
          rowActions={(n) => (
            <>
              {isPublished(n) && (
                <a
                  href={`/imprensa/noticias/${n.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver “${n.title}” no site (abre em nova aba)`}
                  title="Ver no site"
                  className={cx(
                    'inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#003f7f] pointer-fine:size-9',
                    focusRing
                  )}
                >
                  <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              )}
              <IconButton
                icon={isPublished(n) ? FaEyeSlash : FaEye}
                label={isPublished(n) ? `Despublicar “${n.title}”` : `Publicar “${n.title}”`}
                onClick={() => togglePublished(n)}
                disabled={togglingId === n.id}
              />
              <IconButton icon={FaEdit} label={`Editar “${n.title}”`} onClick={() => openModal(n)} />
              <IconButton icon={FaTrash} variant="danger" label={`Excluir “${n.title}”`} onClick={() => setNoticiaToDelete(n)} />
            </>
          )}
          pagination={{ page: currentPage, totalPages, onPageChange: setPage, total: filtered.length, pageSize: PAGE_SIZE }}
          empty={
            loadError ? (
              <EmptyState
                icon={FaRedo}
                title="Não foi possível carregar as notícias"
                description="Verifique a conexão e tente de novo."
                action={
                  <Button
                    variant="secondary"
                    icon={FaRedo}
                    onClick={() => {
                      setIsLoading(true);
                      loadNoticias();
                    }}
                  >
                    Tentar novamente
                  </Button>
                }
              />
            ) : noticias.length === 0 ? (
              <EmptyState
                icon={FaNewspaper}
                title="Nenhuma notícia ainda"
                description="Publique a primeira notícia para ela aparecer no site."
                action={
                  <Button icon={FaPlus} onClick={() => openModal()}>
                    Nova notícia
                  </Button>
                }
              />
            ) : (
              <EmptyState
                title="Nenhuma notícia encontrada"
                description="Tente outro termo de busca ou outro filtro."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Editar notícia' : 'Nova notícia'}
        subtitle="Campos com * são obrigatórios."
      >
        <form onSubmit={handleSave} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField label="Título" id="noticia-title" required error={errors.title} className="md:col-span-2">
              <Input
                value={formData.title}
                onChange={(e) => setField('title', e.target.value)}
                required
                maxLength={500}
                placeholder="Ex.: CDL Ipirá lança a campanha Natal Premiado"
              />
            </FormField>

            <FormField label="Categoria" id="noticia-category" required error={errors.category}>
              <Select value={formData.category} onChange={(e) => setField('category', e.target.value)} required>
                <option value="">Selecione…</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Data" id="noticia-date" required error={errors.date}>
              <Input type="date" value={formData.date} onChange={(e) => setField('date', e.target.value)} required />
            </FormField>

            <FormField
              label="Resumo"
              id="noticia-excerpt"
              required
              error={errors.excerpt}
              hint={`Aparece nos cards do site. ${formData.excerpt.length}/1000 caracteres.`}
              className="md:col-span-2"
            >
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setField('excerpt', e.target.value)}
                required
                rows={3}
                maxLength={1000}
                placeholder="Uma ou duas frases que resumem a notícia"
              />
            </FormField>

            <FormField
              label="Conteúdo completo"
              id="noticia-content"
              required
              error={errors.content}
              hint="Aceita HTML simples (parágrafos, negrito, links)."
              className="md:col-span-2"
            >
              <Textarea
                value={formData.content}
                onChange={(e) => setField('content', e.target.value)}
                required
                rows={10}
                placeholder="Texto completo da notícia"
              />
            </FormField>

            <div className="space-y-3 md:col-span-2">
              <ImageUploadField
                label="Imagem de capa"
                id="noticia-image-file"
                value={formData.image && isValidLink(formData.image) ? formData.image : null}
                onSelect={handleImageSelect}
                onRemove={() => setField('image', '')}
                uploading={isUploading}
                hint="PNG, JPG ou WebP até 10 MB. Proporção 16:9 fica melhor nos cards."
              />
              <FormField label="Ou cole o endereço da imagem" id="noticia-image" error={errors.image}>
                <Input
                  type="url"
                  inputMode="url"
                  value={formData.image}
                  onChange={(e) => setField('image', e.target.value)}
                  placeholder="https://…"
                />
              </FormField>
            </div>

            <FormField label="Campanha" id="noticia-campaign" hint="Opcional. A notícia aparece também na página da campanha.">
              <Select value={formData.campaign_id} onChange={(e) => setField('campaign_id', e.target.value)}>
                <option value="">Nenhuma</option>
                {campanhas.map((campanha) => (
                  <option key={campanha.id} value={campanha.id}>
                    {campanha.title}
                    {campanha.is_active === false ? ' (oculta no site)' : ''}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Autor" id="noticia-author">
              <Input value={formData.author} onChange={(e) => setField('author', e.target.value)} maxLength={100} />
            </FormField>

            <Checkbox
              className="rounded-xl bg-gray-50 px-4 ring-1 ring-gray-200 md:col-span-2"
              label="Publicar no site"
              description="Desmarque para salvar como rascunho (não aparece no site)."
              checked={formData.is_published}
              onChange={(e) => setField('is_published', e.target.checked)}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={closeModal} disabled={isSaving || isUploading}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSaving} disabled={isUploading}>
              {isSaving ? 'Salvando…' : editingId ? 'Salvar alterações' : formData.is_published ? 'Publicar notícia' : 'Salvar rascunho'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={noticiaToDelete !== null}
        onClose={() => !isDeleting && setNoticiaToDelete(null)}
        onConfirm={confirmDelete}
        type="delete"
        title="Excluir notícia?"
        message={`“${noticiaToDelete?.title ?? ''}” será removida do site. Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        isLoading={isDeleting}
      />
    </div>
  );
}
