'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaBullhorn, FaCalendarAlt, FaRedo, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/app/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import RegistrationListModal from '@/app/admin/components/RegistrationListModal';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { formatDateBR, isTodayOrFuture, todayISO } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import type { Campaign } from '@/lib/campaigns';
import {
  AdminCard, AdminPageHeader, Button, Checkbox, DataTable, EmptyState, FilterPills, FormField, IconButton, ImageUploadField,
  Input, SearchInput, Select, StatusBadge, Textarea, cx, focusRing, type DataTableColumn, type StatusVariant, useOpenOnNovo,
} from '@/app/admin/_components';

type EventStatus = 'upcoming' | 'ongoing' | 'past';

interface Evento {
  id: number;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  location: string;
  category: string;
  status: EventStatus | null;
  image: string | null;
  gradient: string | null;
  attendees: number | null;
  registrations_count?: number;
  campaign_id: number | null;
  registration_enabled: boolean;
}

type CampaignOption = Pick<Campaign, 'id' | 'title' | 'is_active'>;
type Filter = 'all' | 'upcoming' | 'past';

const CATEGORIES = ['Networking', 'Capacitação', 'Feira', 'Palestra', 'Institucional', 'Reunião'];
const STATUS: Record<EventStatus, { label: string; variant: StatusVariant }> = {
  upcoming: { label: 'Próximo', variant: 'info' },
  ongoing: { label: 'Em andamento', variant: 'warning' },
  past: { label: 'Realizado', variant: 'neutral' },
};
// Só as cores da marca
const GRADIENTS = [
  { name: 'Azul', value: 'from-[#003f7f] to-[#0066cc]' },
  { name: 'Verde', value: 'from-[#00a859] to-[#00d670]' },
  { name: 'Amarelo', value: 'from-[#ffd000] to-[#ffed4e]' },
];
const PAGE_SIZE = 10;

const emptyForm = () => ({
  title: '',
  description: '',
  date: todayISO(),
  time: '19:00',
  location: '',
  category: '',
  status: 'upcoming' as EventStatus,
  image: '',
  gradient: GRADIENTS[0].value,
  attendees: '0',
  campaign_id: '',
  registration_enabled: true,
});
type FormState = ReturnType<typeof emptyForm>;
type FormErrors = Partial<Record<keyof FormState, string>>;

/** A coluna status não muda sozinha: evento com data passada é "Realizado". */
const statusOf = (e: Pick<Evento, 'date' | 'status'>): EventStatus =>
  isTodayOrFuture(e.date) ? (e.status === 'ongoing' || e.status === 'past' ? e.status : 'upcoming') : 'past';

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
  if (!form.title.trim()) errors.title = 'Informe o título do evento.';
  if (!form.date) errors.date = 'Informe a data.';
  if (!form.time) errors.time = 'Informe o horário.';
  if (!form.location.trim()) errors.location = 'Informe o local.';
  if (!form.category) errors.category = 'Escolha a categoria.';
  if (!/^\d+$/.test(form.attendees)) errors.attendees = 'Use um número inteiro (0 ou mais).';
  if (!form.description.trim()) errors.description = 'Descreva o evento.';
  if (!isValidLink(form.image)) errors.image = 'Use um endereço que comece com https://';
  return errors;
}

function Thumb({ evento }: { evento: Evento }) {
  return (
    <span
      className={cx(
        'relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br text-white/80 ring-1 ring-gray-200',
        evento.gradient || GRADIENTS[0].value
      )}
    >
      {evento.image ? (
        <Image src={evento.image} alt="" fill sizes="64px" className="object-cover" unoptimized={!isOptimizableImage(evento.image)} />
      ) : (
        <FaCalendarAlt aria-hidden="true" className="h-4 w-4" />
      )}
    </span>
  );
}

export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [campanhas, setCampanhas] = useState<CampaignOption[]>([]);
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

  const [registrationsFor, setRegistrationsFor] = useState<Pick<Evento, 'id' | 'title'> | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Evento | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEventos = useCallback(
    () =>
      request<Evento[]>('/api/admin/eventos')
        .then((data) => {
          setEventos(data);
          setLoadError(false);
        })
        .catch((error) => {
          setLoadError(true);
          toast.error(errorMessage(error, 'Erro ao carregar eventos.'));
        })
        .finally(() => setIsLoading(false)),
    []
  );

  useEffect(() => {
    loadEventos();
    request<CampaignOption[]>('/api/admin/campanhas')
      .then(setCampanhas)
      .catch(() => setCampanhas([]));
  }, [loadEventos]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const openModal = (evento?: Evento) => {
    setEditingId(evento?.id ?? null);
    setFormData(
      evento
        ? {
            title: evento.title,
            description: evento.description || '',
            date: /^\d{4}-\d{2}-\d{2}/.test(evento.date || '') ? evento.date.slice(0, 10) : '',
            time: (evento.time || '19:00').slice(0, 5),
            location: evento.location || '',
            category: evento.category || '',
            status: evento.status === 'ongoing' || evento.status === 'past' ? evento.status : 'upcoming',
            image: evento.image || '',
            gradient: evento.gradient || GRADIENTS[0].value,
            attendees: String(evento.attendees ?? 0),
            campaign_id: evento.campaign_id ? String(evento.campaign_id) : '',
            registration_enabled: evento.registration_enabled !== false,
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
      body.append('bucket', 'events');
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(formData);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`evento-${firstInvalid}`)?.focus();
      return;
    }

    setIsSaving(true);
    try {
      await request('/api/admin/eventos', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(editingId && { id: editingId }),
          title: formData.title.trim(),
          description: formData.description.trim(),
          date: formData.date,
          time: formData.time,
          location: formData.location.trim(),
          category: formData.category,
          status: formData.status,
          image: formData.image.trim(),
          gradient: formData.gradient,
          attendees: Number(formData.attendees),
          campaign_id: formData.campaign_id ? Number(formData.campaign_id) : null,
          registration_enabled: formData.registration_enabled,
        }),
      });
      toast.success(editingId ? 'Evento atualizado.' : 'Evento criado.');
      setIsModalOpen(false);
      loadEventos();
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao salvar o evento.'));
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    try {
      await request(`/api/admin/eventos?id=${eventToDelete.id}`, { method: 'DELETE' });
      toast.success('Evento excluído.');
      setEventToDelete(null);
      loadEventos();
    } catch (error) {
      toast.error(errorMessage(error, 'Erro ao excluir o evento.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const term = searchTerm.trim().toLowerCase();
  const searched = eventos.filter(
    (e) => !term || [e.title, e.category, e.location].some((v) => v?.toLowerCase().includes(term))
  );
  const isPast = (e: Evento) => statusOf(e) === 'past';
  const filtered = searched.filter((e) => (filter === 'all' ? true : filter === 'past' ? isPast(e) : !isPast(e)));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const campaignTitle = (id: number | null) => campanhas.find((c) => c.id === id)?.title;
  const categoryOptions = formData.category && !CATEGORIES.includes(formData.category) ? [...CATEGORIES, formData.category] : CATEGORIES;
  const gradientOptions = GRADIENTS.some((g) => g.value === formData.gradient)
    ? GRADIENTS
    : [...GRADIENTS, { name: 'Cor atual', value: formData.gradient }];

  const columns: DataTableColumn<Evento>[] = [
    {
      key: 'title',
      header: 'Evento',
      primary: true,
      cell: (e) => {
        const campaign = campaignTitle(e.campaign_id);
        return (
          <div className="flex min-w-0 items-center gap-3">
            <Thumb evento={e} />
            <div className="min-w-0">
              <p className="line-clamp-3 font-semibold text-gray-900 md:line-clamp-2 md:max-w-sm">{e.title}</p>
              <p className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2.5 text-xs font-normal text-gray-500">
                <span className="font-semibold text-gray-600">{e.category}</span>
                {e.location && (
                  <span className="inline-flex min-w-0 items-center gap-1">
                    <FaMapMarkerAlt aria-hidden="true" className="h-3 w-3 shrink-0" />
                    {e.location}
                  </span>
                )}
              </p>
              {campaign && (
                <StatusBadge variant="warning" dot={false} className="mt-1">
                  <FaBullhorn aria-hidden="true" className="h-2.5 w-2.5" />
                  <span className="truncate">{campaign}</span>
                </StatusBadge>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'date',
      header: 'Quando',
      className: 'whitespace-nowrap tabular-nums',
      cell: (e) => {
        const s = STATUS[statusOf(e)];
        return (
          <span className="flex flex-col items-end gap-1 md:items-start">
            <span>
              {formatDateBR(e.date)}
              {e.time && <span className="ml-1.5 text-gray-500">{e.time.slice(0, 5)}</span>}
            </span>
            <StatusBadge variant={s.variant}>{s.label}</StatusBadge>
          </span>
        );
      },
    },
    {
      key: 'registrations',
      header: 'Inscrições',
      cell: (e) => (
        <span className="flex flex-col items-end gap-1 md:items-start">
          <button
            type="button"
            onClick={() => setRegistrationsFor({ id: e.id, title: e.title })}
            aria-label={`Ver os ${e.registrations_count ?? 0} inscritos de “${e.title}”`}
            title="Ver lista de inscritos"
            className={cx(
              'inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold whitespace-nowrap text-[#0052a3] ring-1 ring-inset ring-gray-200 transition-colors hover:bg-[#003f7f]/[0.04] hover:ring-[#003f7f]/40 pointer-fine:min-h-9',
              focusRing
            )}
          >
            <FaUsers aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="tabular-nums">{e.registrations_count ?? 0}</span>
          </button>
          <span className="text-xs whitespace-nowrap text-gray-500 tabular-nums">
            {e.registration_enabled === false ? 'Entrada livre' : `${e.attendees ?? 0} no site`}
          </span>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Eventos"
        description="Crie eventos, acompanhe as inscrições e exporte a lista de inscritos."
        actions={
          <Button icon={FaPlus} onClick={() => openModal()}>
            Novo evento
          </Button>
        }
      />

      <AdminCard flush>
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <SearchInput
            label="Buscar eventos"
            placeholder="Buscar por título, local ou categoria"
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            className="w-full xl:max-w-sm"
          />
          <FilterPills<Filter>
            label="Filtrar eventos"
            value={filter}
            onChange={(value) => {
              setFilter(value);
              setPage(1);
            }}
            options={[
              { value: 'all', label: 'Todos', count: isLoading ? undefined : searched.length },
              { value: 'upcoming', label: 'Próximos', count: isLoading ? undefined : searched.filter((e) => !isPast(e)).length },
              { value: 'past', label: 'Realizados', count: isLoading ? undefined : searched.filter(isPast).length },
            ]}
          />
        </div>

        <DataTable
          caption="Lista de eventos"
          columns={columns}
          rows={pageRows}
          getRowId={(e) => e.id}
          loading={isLoading}
          rowActions={(e) => (
            <>
              <IconButton icon={FaEdit} label={`Editar “${e.title}”`} onClick={() => openModal(e)} />
              <IconButton icon={FaTrash} variant="danger" label={`Excluir “${e.title}”`} onClick={() => setEventToDelete(e)} />
            </>
          )}
          pagination={{ page: currentPage, totalPages, onPageChange: setPage, total: filtered.length, pageSize: PAGE_SIZE }}
          empty={
            loadError ? (
              <EmptyState
                icon={FaRedo}
                title="Não foi possível carregar os eventos"
                description="Verifique a conexão e tente de novo."
                action={
                  <Button
                    variant="secondary"
                    icon={FaRedo}
                    onClick={() => {
                      setIsLoading(true);
                      loadEventos();
                    }}
                  >
                    Tentar novamente
                  </Button>
                }
              />
            ) : eventos.length === 0 ? (
              <EmptyState
                icon={FaCalendarAlt}
                title="Nenhum evento ainda"
                description="Crie o primeiro evento para abrir as inscrições no site."
                action={
                  <Button icon={FaPlus} onClick={() => openModal()}>
                    Novo evento
                  </Button>
                }
              />
            ) : (
              <EmptyState
                title="Nenhum evento encontrado"
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

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Editar evento' : 'Novo evento'} subtitle="Campos com * são obrigatórios.">
        <form onSubmit={handleSave} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField label="Título do evento" id="evento-title" required error={errors.title} className="md:col-span-2">
              <Input
                value={formData.title}
                onChange={(e) => setField('title', e.target.value)}
                required
                maxLength={500}
                placeholder="Ex.: Workshop de Gestão Financeira"
              />
            </FormField>

            <FormField label="Data" id="evento-date" required error={errors.date}>
              <Input type="date" value={formData.date} onChange={(e) => setField('date', e.target.value)} required />
            </FormField>

            <FormField label="Horário" id="evento-time" required error={errors.time}>
              <Input type="time" value={formData.time} onChange={(e) => setField('time', e.target.value)} required />
            </FormField>

            <FormField label="Local" id="evento-location" required error={errors.location} className="md:col-span-2">
              <Input
                value={formData.location}
                onChange={(e) => setField('location', e.target.value)}
                required
                maxLength={300}
                placeholder="Ex.: Auditório da CDL Ipirá"
              />
            </FormField>

            <FormField label="Categoria" id="evento-category" required error={errors.category}>
              <Select value={formData.category} onChange={(e) => setField('category', e.target.value)} required>
                <option value="">Selecione…</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Status" id="evento-status" hint="Depois da data, o evento aparece como realizado.">
              <Select value={formData.status} onChange={(e) => setField('status', e.target.value as EventStatus)}>
                {(Object.keys(STATUS) as EventStatus[]).map((value) => (
                  <option key={value} value={value}>
                    {STATUS[value].label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Campanha" id="evento-campaign" hint="Opcional. O evento aparece também na página da campanha.">
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

            <FormField
              label="Inscritos exibidos no site"
              id="evento-attendees"
              error={errors.attendees}
              hint="Número mostrado no card do evento. Sobe sozinho a cada inscrição."
            >
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={formData.attendees}
                onChange={(e) => setField('attendees', e.target.value)}
              />
            </FormField>

            {/* role=switch: leitores de tela anunciam ligado/desligado */}
            <Checkbox
              role="switch"
              id="evento-registration"
              label="Aceita inscrições"
              description="Desligue para eventos de entrada livre (sorteio, feira): o site mostra “Entrada livre” e não abre o formulário."
              checked={formData.registration_enabled}
              onChange={(e) => setField('registration_enabled', e.target.checked)}
              className="md:col-span-2"
            />

            <fieldset className="min-w-0 md:col-span-2">
              <legend className="mb-1.5 block text-sm font-semibold text-gray-700">Cor do card</legend>
              <div className="flex flex-wrap gap-2">
                {gradientOptions.map((g) => (
                  <label
                    key={g.value}
                    className={cx(
                      'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-white py-1.5 pr-3.5 pl-1.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 transition-shadow',
                      'has-checked:ring-2 has-checked:ring-[#003f7f] has-focus-visible:ring-2 has-focus-visible:ring-[#0066cc]'
                    )}
                  >
                    <input
                      type="radio"
                      name="evento-gradient"
                      value={g.value}
                      checked={formData.gradient === g.value}
                      onChange={() => setField('gradient', g.value)}
                      className="sr-only"
                    />
                    <span aria-hidden="true" className={cx('size-8 rounded-lg bg-linear-to-br', g.value)} />
                    {g.name}
                  </label>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-gray-500">Fundo do card quando o evento não tem imagem.</p>
            </fieldset>

            <FormField label="Descrição" id="evento-description" required error={errors.description} className="md:col-span-2">
              <Textarea
                value={formData.description}
                onChange={(e) => setField('description', e.target.value)}
                required
                rows={4}
                maxLength={5000}
                placeholder="Programação, público, o que levar…"
              />
            </FormField>

            <div className="space-y-3 md:col-span-2">
              <ImageUploadField
                label="Imagem de capa"
                id="evento-image-file"
                value={formData.image && isValidLink(formData.image) ? formData.image : null}
                onSelect={handleImageSelect}
                onRemove={() => setField('image', '')}
                uploading={isUploading}
                hint="PNG, JPG ou WebP até 10 MB."
              />
              <FormField label="Ou cole o endereço da imagem" id="evento-image" error={errors.image}>
                <Input type="url" inputMode="url" value={formData.image} onChange={(e) => setField('image', e.target.value)} placeholder="https://…" />
              </FormField>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={closeModal} disabled={isSaving || isUploading}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSaving} disabled={isUploading}>
              {isSaving ? 'Salvando…' : editingId ? 'Salvar alterações' : 'Criar evento'}
            </Button>
          </div>
        </form>
      </Modal>

      <RegistrationListModal
        isOpen={registrationsFor !== null}
        onClose={() => setRegistrationsFor(null)}
        eventId={registrationsFor?.id ?? null}
        eventTitle={registrationsFor?.title ?? ''}
        onChanged={loadEventos}
      />

      <ConfirmDialog
        isOpen={eventToDelete !== null}
        onClose={() => !isDeleting && setEventToDelete(null)}
        onConfirm={confirmDelete}
        type="delete"
        title="Excluir evento?"
        message={`“${eventToDelete?.title ?? ''}” será removido do site${
          eventToDelete?.registrations_count ? ` junto com ${eventToDelete.registrations_count} inscrição(ões)` : ''
        }. Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        isLoading={isDeleting}
      />
    </div>
  );
}
