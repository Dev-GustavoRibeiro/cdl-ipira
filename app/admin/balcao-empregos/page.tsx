'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  FaBriefcase, FaEdit, FaExclamationTriangle, FaExternalLinkAlt, FaEye, FaEyeSlash, FaFileAlt, FaMapMarkerAlt, FaPlus,
  FaRedo, FaSearch, FaTrash, FaUsers,
} from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import ResumeManagerModal from '../components/ResumeManagerModal';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { formatDateBR, todayISO } from '@/lib/date';
import {
  AdminCard, AdminPageHeader, Button, Checkbox, DataTable, EmptyState, FilterPills, FormField, IconButton, Input, SearchInput,
  StatusBadge, Textarea, buttonClass, type DataTableColumn,
} from '../_components';

interface Vaga {
  id: number;
  title: string;
  company: string;
  quantity: number;
  date: string | null;
  is_active: boolean;
  description?: string | null;
  location?: string | null;
  category?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
}

interface FormState {
  id?: number;
  title: string;
  company: string;
  quantity: string;
  description: string;
  location: string;
  category: string;
  is_active: boolean;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
}

const EMPTY_FORM: FormState = {
  title: '', company: '', quantity: '1', description: '', location: '', category: '', is_active: true,
  contact_name: '', contact_email: '', contact_phone: '',
};

const CATEGORY_SUGGESTIONS = ['Vendas', 'Comércio', 'Administrativo', 'Atendimento', 'Logística', 'Saúde', 'Serviços', 'Indústria'];

type Filter = 'all' | 'active' | 'inactive';

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

/** Corpo do PUT/POST a partir de uma vaga (o PUT regrava todos os campos) */
const toPayload = (v: Vaga | FormState) => ({
  title: v.title,
  company: v.company,
  quantity: Number(v.quantity),
  description: v.description ?? '',
  location: v.location ?? '',
  category: v.category ?? '',
  is_active: v.is_active,
  contact_name: v.contact_name ?? '',
  contact_email: v.contact_email ?? '',
  contact_phone: v.contact_phone ?? '',
});

export default function AdminBalcaoEmpregosPage() {
  const [version, setVersion] = useState(0);
  const [list, setList] = useState<{ v: number; rows: Vaga[]; error?: string }>({ v: -1, rows: [] });
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState<FormState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Vaga | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [resumesFor, setResumesFor] = useState<Vaga | null>(null);

  useEffect(() => {
    let active = true;
    api<Vaga[]>('/api/admin/jobs').then(
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

  const counts = useMemo(
    () => ({ all: rows.length, active: rows.filter((r) => r.is_active).length, inactive: rows.filter((r) => !r.is_active).length }),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === 'all' || (filter === 'active') === r.is_active) &&
        (!q || [r.title, r.company, r.location, r.category, r.contact_name].some((v) => v?.toLowerCase().includes(q)))
    );
  }, [rows, filter, search]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => (f ? { ...f, [key]: value } : f));

  const openForm = (vaga?: Vaga) =>
    setForm(
      vaga
        ? {
            id: vaga.id,
            title: vaga.title,
            company: vaga.company,
            quantity: String(vaga.quantity ?? 1),
            description: vaga.description ?? '',
            location: vaga.location ?? '',
            category: vaga.category ?? '',
            is_active: vaga.is_active,
            contact_name: vaga.contact_name ?? '',
            contact_email: vaga.contact_email ?? '',
            contact_phone: vaga.contact_phone ?? '',
          }
        : { ...EMPTY_FORM }
    );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setIsSaving(true);
    try {
      const body = form.id ? { id: form.id, ...toPayload(form) } : { ...toPayload(form), date: todayISO() };
      await api('/api/admin/jobs', jsonInit(form.id ? 'PUT' : 'POST', body));
      toast.success(form.id ? 'Vaga atualizada.' : form.is_active ? 'Vaga publicada no site.' : 'Vaga cadastrada (oculta no site).');
      setForm(null);
      reload();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (vaga: Vaga) => {
    setTogglingId(vaga.id);
    try {
      await api('/api/admin/jobs', jsonInit('PUT', { id: vaga.id, ...toPayload({ ...vaga, is_active: !vaga.is_active }) }));
      setList((l) => ({ ...l, rows: l.rows.map((r) => (r.id === vaga.id ? { ...r, is_active: !vaga.is_active } : r)) }));
      toast.success(vaga.is_active ? 'Vaga ocultada do site.' : 'Vaga publicada no site.');
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
      await api(`/api/admin/jobs?id=${toDelete.id}`, { method: 'DELETE' });
      setList((l) => ({ ...l, rows: l.rows.filter((r) => r.id !== toDelete.id) }));
      toast.success('Vaga excluída.');
      setToDelete(null);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: DataTableColumn<Vaga>[] = [
    {
      key: 'vaga',
      header: 'Vaga',
      primary: true,
      cell: (v) => (
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{v.title}</p>
          <p className="text-sm font-normal text-gray-500">{v.company}</p>
          <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs font-medium text-gray-600">
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5">
              <FaUsers aria-hidden="true" className="h-3 w-3 text-gray-400" />
              {v.quantity} {v.quantity === 1 ? 'vaga' : 'vagas'}
            </span>
            {v.location && (
              <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5">
                <FaMapMarkerAlt aria-hidden="true" className="h-3 w-3 text-gray-400" />
                {v.location}
              </span>
            )}
            {v.category && <span className="rounded-md bg-[#003f7f]/[0.06] px-2 py-0.5 text-[#003f7f]">{v.category}</span>}
          </p>
          <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs font-normal text-gray-500">
            <span className="tabular-nums">Publicada em {formatDateBR(v.date) || '—'}</span>
            {(v.contact_name || v.contact_phone) && (
              <span>
                Contato: {[v.contact_name, v.contact_phone].filter(Boolean).join(' · ')}
              </span>
            )}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (v) => (v.is_active ? <StatusBadge variant="success">Ativa</StatusBadge> : <StatusBadge variant="neutral">Inativa</StatusBadge>),
    },
  ];

  const rowActions = (v: Vaga) => (
    <>
      <Button variant="secondary" size="sm" icon={FaFileAlt} onClick={() => setResumesFor(v)} aria-label={`Currículos da vaga ${v.title}`}>
        Currículos
      </Button>
      <IconButton
        icon={v.is_active ? FaEyeSlash : FaEye}
        label={v.is_active ? `Ocultar a vaga ${v.title} do site` : `Publicar a vaga ${v.title} no site`}
        onClick={() => toggleActive(v)}
        disabled={togglingId === v.id}
      />
      <IconButton icon={FaEdit} label={`Editar a vaga ${v.title}`} onClick={() => openForm(v)} />
      <IconButton icon={FaTrash} variant="danger" label={`Excluir a vaga ${v.title}`} onClick={() => setToDelete(v)} />
    </>
  );

  const hasFilters = filter !== 'all' || search.trim() !== '';

  const empty = list.error && rows.length === 0 ? (
    <EmptyState
      icon={FaExclamationTriangle}
      title="Não foi possível carregar as vagas"
      description={list.error}
      action={<Button icon={FaRedo} onClick={reload}>Tentar novamente</Button>}
    />
  ) : hasFilters ? (
    <EmptyState
      icon={FaSearch}
      title="Nenhuma vaga encontrada"
      description="Tente outro termo de busca ou outro filtro."
      action={
        <Button variant="secondary" onClick={() => { setFilter('all'); setSearch(''); }}>
          Limpar filtros
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={FaBriefcase}
      title="Nenhuma vaga cadastrada"
      description="Cadastre as vagas enviadas pelas empresas associadas para divulgar no Balcão de Empregos."
      action={<Button icon={FaPlus} onClick={() => openForm()}>Nova vaga</Button>}
    />
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="Balcão de Empregos"
        description="Vagas divulgadas no site e currículos recebidos para cada uma."
        actions={
          <>
            <a href="/produtos/balcao-empregos" target="_blank" rel="noopener noreferrer" className={buttonClass('secondary')}>
              <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5" />
              Ver no site
              <span className="sr-only">(abre em nova aba)</span>
            </a>
            <Button icon={FaPlus} onClick={() => openForm()}>
              Nova vaga
            </Button>
          </>
        }
      />

      <AdminCard flush>
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <FilterPills<Filter>
            label="Filtrar por status"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'Todas', count: counts.all },
              { value: 'active', label: 'Ativas', count: counts.active },
              { value: 'inactive', label: 'Inativas', count: counts.inactive },
            ]}
          />
          <SearchInput label="Buscar por vaga, empresa ou local" placeholder="Buscar vaga ou empresa…" value={search} onChange={setSearch} className="xl:w-80" />
        </div>
        <DataTable caption="Vagas do Balcão de Empregos" rows={filtered} getRowId={(v) => v.id} columns={columns} rowActions={rowActions} loading={isLoading} empty={empty} />
      </AdminCard>

      <Modal
        isOpen={!!form}
        onClose={() => !isSaving && setForm(null)}
        title={form?.id ? 'Editar vaga' : 'Nova vaga'}
        subtitle="Título, empresa, local e descrição aparecem no site. O contato é só para uso da CDL."
      >
        {form && (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Título da vaga" required className="sm:col-span-2">
                <Input value={form.title} onChange={(e) => setField('title', e.target.value)} required maxLength={150} placeholder="Ex.: Vendedor(a) externo" />
              </FormField>
              <FormField label="Empresa" required>
                <Input value={form.company} onChange={(e) => setField('company', e.target.value)} required maxLength={150} />
              </FormField>
              <FormField label="Quantidade de vagas" required>
                <Input type="number" inputMode="numeric" min={1} max={9999} step={1} value={form.quantity} onChange={(e) => setField('quantity', e.target.value)} required />
              </FormField>
              <FormField label="Local">
                <Input value={form.location} onChange={(e) => setField('location', e.target.value)} maxLength={150} placeholder="Ex.: Centro, Ipirá" />
              </FormField>
              <FormField label="Área" hint="Escolha uma sugestão ou digite.">
                <Input list="job-categories" value={form.category} onChange={(e) => setField('category', e.target.value)} maxLength={80} />
              </FormField>
              <datalist id="job-categories">
                {CATEGORY_SUGGESTIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <FormField label="Descrição" required className="sm:col-span-2" hint="Requisitos, atividades e benefícios.">
                <Textarea value={form.description} onChange={(e) => setField('description', e.target.value)} required rows={5} maxLength={5000} />
              </FormField>
            </div>

            <fieldset className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-200/80 sm:p-5">
              <legend className="sr-only">Contato da empresa</legend>
              <p aria-hidden="true" className="text-sm font-bold text-gray-900">Contato da empresa</p>
              <p className="mb-4 text-xs text-gray-500">Uso interno: não aparece no site.</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Nome">
                  <Input value={form.contact_name} onChange={(e) => setField('contact_name', e.target.value)} maxLength={120} autoComplete="off" />
                </FormField>
                <FormField label="Telefone">
                  <Input type="tel" inputMode="tel" value={form.contact_phone} onChange={(e) => setField('contact_phone', e.target.value)} maxLength={30} autoComplete="off" />
                </FormField>
                <FormField label="E-mail" className="sm:col-span-2">
                  <Input type="email" value={form.contact_email} onChange={(e) => setField('contact_email', e.target.value)} maxLength={254} autoComplete="off" />
                </FormField>
              </div>
            </fieldset>

            <Checkbox
              label="Vaga ativa (visível no site)"
              description="Desmarque para guardar a vaga sem divulgar."
              checked={form.is_active}
              onChange={(e) => setField('is_active', e.target.checked)}
            />

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setForm(null)} disabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" loading={isSaving}>
                {isSaving ? 'Salvando…' : form.id ? 'Salvar alterações' : 'Cadastrar vaga'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ResumeManagerModal
        isOpen={!!resumesFor}
        onClose={() => setResumesFor(null)}
        jobId={resumesFor?.id ?? null}
        jobTitle={resumesFor ? `${resumesFor.title} · ${resumesFor.company}` : ''}
      />

      <ConfirmDialog
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir vaga"
        message={`Excluir a vaga "${toDelete?.title ?? ''}" (${toDelete?.company ?? ''})? Esta ação não pode ser desfeita.`}
        type="delete"
        confirmText="Sim, excluir"
        isLoading={isDeleting}
      />
    </div>
  );
}
