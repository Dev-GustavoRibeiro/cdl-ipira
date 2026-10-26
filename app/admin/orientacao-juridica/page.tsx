'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { FaChevronDown, FaEdit, FaEnvelope, FaExclamationTriangle, FaGavel, FaPlus, FaRedo, FaSearch, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { fetchWithCSRF } from '@/lib/csrf-client';
import {
  AdminCard, AdminPageHeader, Button, DataTable, EmptyState, FilterPills, FormField, IconButton, Input, SearchInput, Select,
  Textarea, cx, focusRing, whatsappHref, type DataTableColumn, type StatusVariant,
} from '../_components';

type Status = 'pending' | 'in_progress' | 'completed';

interface Solicitacao {
  id: number;
  nome: string;
  empresa: string;
  assunto: string;
  status: Status;
  created_at?: string;
  // Enviados pelo formulário público (/api/juridico)
  telefone?: string | null;
  email?: string | null;
  descricao?: string | null;
}

type FormState = Omit<Solicitacao, 'id' | 'created_at'> & { id?: number };

const EMPTY_FORM: FormState = { nome: '', empresa: '', assunto: '', status: 'pending', telefone: '', email: '', descricao: '' };

const STATUS: Record<Status, { label: string; variant: StatusVariant }> = {
  pending: { label: 'Pendente', variant: 'warning' },
  in_progress: { label: 'Em andamento', variant: 'info' },
  completed: { label: 'Concluída', variant: 'success' },
};

// Mesmas cores do StatusBadge do kit (texto escuro sobre fundo claro, AA)
const STATUS_SELECT: Record<Status, string> = {
  pending: 'bg-[#ffd000]/25 text-[#003f7f] ring-[#e6bb00]/50',
  in_progress: 'bg-[#0066cc]/10 text-[#0052a3] ring-[#0066cc]/20',
  completed: 'bg-[#00a859]/10 text-[#00703c] ring-[#00a859]/25',
};

type Filter = 'all' | Status;

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

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Bahia' }) : '—';

// relative: o texto sr-only fica preso ao link (senão escapa da rolagem da tabela e cria rolagem na página)
const iconLink = cx(
  'relative inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-gray-500 pointer-fine:size-9',
  'transition-[background-color,color] duration-200 motion-reduce:transition-none',
  focusRing
);

export default function AdminOrientacaoJuridicaPage() {
  const [version, setVersion] = useState(0);
  const [list, setList] = useState<{ v: number; rows: Solicitacao[]; error?: string }>({ v: -1, rows: [] });
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState<FormState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Solicitacao | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    api<Solicitacao[]>('/api/admin/legal-requests').then(
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

  const counts = useMemo(() => {
    const c = { all: rows.length, pending: 0, in_progress: 0, completed: 0 };
    rows.forEach((r) => c[r.status]++);
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === 'all' || r.status === filter) &&
        (!q || [r.nome, r.empresa, r.assunto, r.email, r.telefone].some((v) => v?.toLowerCase().includes(q)))
    );
  }, [rows, filter, search]);

  const openEdit = (r: Solicitacao) =>
    setForm({ id: r.id, nome: r.nome, empresa: r.empresa, assunto: r.assunto, status: r.status, telefone: r.telefone ?? '', email: r.email ?? '', descricao: r.descricao ?? '' });

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => (f ? { ...f, [key]: value } : f));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setIsSaving(true);
    const { id, ...payload } = form;
    try {
      await api('/api/admin/legal-requests', jsonInit(id ? 'PUT' : 'POST', id ? { id, ...payload } : payload));
      toast.success(id ? 'Solicitação atualizada.' : 'Solicitação cadastrada.');
      setForm(null);
      reload();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const changeStatus = async (row: Solicitacao, status: Status) => {
    const previous = row.status;
    setList((l) => ({ ...l, rows: l.rows.map((r) => (r.id === row.id ? { ...r, status } : r)) }));
    try {
      await api('/api/admin/legal-requests', jsonInit('PATCH', { id: row.id, status }));
      toast.success(`Status alterado para "${STATUS[status].label}".`);
    } catch (error) {
      setList((l) => ({ ...l, rows: l.rows.map((r) => (r.id === row.id ? { ...r, status: previous } : r)) }));
      toast.error(errorMessage(error));
    }
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await api(`/api/admin/legal-requests?id=${toDelete.id}`, { method: 'DELETE' });
      setList((l) => ({ ...l, rows: l.rows.filter((r) => r.id !== toDelete.id) }));
      toast.success('Solicitação excluída.');
      setToDelete(null);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: DataTableColumn<Solicitacao>[] = [
    {
      key: 'solicitacao',
      header: 'Solicitação',
      primary: true,
      cell: (r) => (
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{r.assunto}</p>
          <p className="mt-0.5 text-sm font-normal text-gray-700">
            {r.nome} <span aria-hidden="true" className="text-gray-300">·</span> <span className="text-gray-500">{r.empresa}</span>
          </p>
          {r.descricao && <p className="mt-1 line-clamp-2 max-w-prose text-xs font-normal text-gray-500">{r.descricao}</p>}
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs font-normal text-gray-500 tabular-nums">
            <span>Recebida em {formatDate(r.created_at)}</span>
            {r.telefone && <span className="whitespace-nowrap">{r.telefone}</span>}
            {!r.telefone && !r.email && <span>Sem contato</span>}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (r) => (
        <span className="relative inline-flex">
          <select
            aria-label={`Status da solicitação de ${r.nome}`}
            value={r.status}
            onChange={(e) => changeStatus(r, e.target.value as Status)}
            className={cx(
              'min-h-11 cursor-pointer appearance-none rounded-full py-1 pr-8 pl-3 text-xs font-semibold ring-1 ring-inset pointer-fine:min-h-8',
              STATUS_SELECT[r.status],
              focusRing
            )}
          >
            {(Object.keys(STATUS) as Status[]).map((s) => (
              <option key={s} value={s}>
                {STATUS[s].label}
              </option>
            ))}
          </select>
          <FaChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 h-2.5 w-2.5 -translate-y-1/2 opacity-70" />
        </span>
      ),
    },
  ];

  const rowActions = (r: Solicitacao) => {
    const wa = r.telefone
      ? whatsappHref(r.telefone, `Olá, ${r.nome.split(' ')[0]}! Aqui é da CDL Ipirá, sobre sua solicitação de orientação jurídica: "${r.assunto}".`)
      : null;
    return (
      <>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" title="WhatsApp" className={cx(iconLink, 'hover:bg-[#00a859]/10 hover:text-[#00703c]')}>
            <FaWhatsapp aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">Conversar com {r.nome} no WhatsApp (abre em nova aba)</span>
          </a>
        )}
        {r.email && (
          <a
            href={`mailto:${r.email}?subject=${encodeURIComponent(`CDL Ipirá - Orientação Jurídica: ${r.assunto}`)}`}
            title="Enviar e-mail"
            className={cx(iconLink, 'hover:bg-gray-100 hover:text-[#003f7f]')}
          >
            <FaEnvelope aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">Enviar e-mail para {r.nome}</span>
          </a>
        )}
        <IconButton icon={FaEdit} label={`Ver e editar a solicitação de ${r.nome}`} onClick={() => openEdit(r)} />
        <IconButton icon={FaTrash} variant="danger" label={`Excluir a solicitação de ${r.nome}`} onClick={() => setToDelete(r)} />
      </>
    );
  };

  const hasFilters = filter !== 'all' || search.trim() !== '';

  const empty = list.error && rows.length === 0 ? (
    <EmptyState
      icon={FaExclamationTriangle}
      title="Não foi possível carregar as solicitações"
      description={list.error}
      action={<Button icon={FaRedo} onClick={reload}>Tentar novamente</Button>}
    />
  ) : hasFilters ? (
    <EmptyState
      icon={FaSearch}
      title="Nenhuma solicitação encontrada"
      description="Tente outro termo de busca ou outro status."
      action={
        <Button variant="secondary" onClick={() => { setFilter('all'); setSearch(''); }}>
          Limpar filtros
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={FaGavel}
      title="Nenhuma solicitação ainda"
      description="As solicitações enviadas pelo formulário de Orientação Jurídica do site aparecem aqui."
    />
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="Orientação Jurídica"
        description="Solicitações dos associados enviadas pelo site. Responda pelo WhatsApp ou e-mail e acompanhe o status."
        actions={
          <Button icon={FaPlus} onClick={() => setForm({ ...EMPTY_FORM })}>
            Nova solicitação
          </Button>
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
              { value: 'pending', label: 'Pendentes', count: counts.pending },
              { value: 'in_progress', label: 'Em andamento', count: counts.in_progress },
              { value: 'completed', label: 'Concluídas', count: counts.completed },
            ]}
          />
          <SearchInput label="Buscar por nome, empresa, assunto ou contato" placeholder="Buscar solicitação…" value={search} onChange={setSearch} className="xl:w-80" />
        </div>
        <DataTable
          caption="Solicitações de orientação jurídica"
          rows={filtered}
          getRowId={(r) => r.id}
          columns={columns}
          rowActions={rowActions}
          loading={isLoading}
          empty={empty}
        />
      </AdminCard>

      <Modal
        isOpen={!!form}
        onClose={() => !isSaving && setForm(null)}
        title={form?.id ? 'Solicitação jurídica' : 'Nova solicitação'}
        subtitle={form?.id ? 'Confira os dados enviados, ajuste o que precisar e atualize o status.' : 'Registre um atendimento recebido por telefone ou presencialmente.'}
      >
        {form && (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Nome do solicitante" required>
                <Input value={form.nome} onChange={(e) => setField('nome', e.target.value)} required maxLength={120} autoComplete="off" />
              </FormField>
              <FormField label="Empresa" required>
                <Input value={form.empresa} onChange={(e) => setField('empresa', e.target.value)} required maxLength={150} autoComplete="off" />
              </FormField>
              <FormField label="Telefone / WhatsApp">
                <Input type="tel" inputMode="tel" value={form.telefone ?? ''} onChange={(e) => setField('telefone', e.target.value)} maxLength={30} placeholder="(75) 99999-9999" autoComplete="off" />
              </FormField>
              <FormField label="E-mail">
                <Input type="email" value={form.email ?? ''} onChange={(e) => setField('email', e.target.value)} maxLength={254} autoComplete="off" />
              </FormField>
              <FormField label="Assunto" required className="sm:col-span-2">
                <Input value={form.assunto} onChange={(e) => setField('assunto', e.target.value)} required maxLength={200} />
              </FormField>
              <FormField label="Descrição da situação" className="sm:col-span-2" hint="Até 3.000 caracteres.">
                <Textarea value={form.descricao ?? ''} onChange={(e) => setField('descricao', e.target.value)} rows={5} maxLength={3000} />
              </FormField>
              <FormField label="Status" className="sm:col-span-2">
                <Select value={form.status} onChange={(e) => setField('status', e.target.value as Status)}>
                  {(Object.keys(STATUS) as Status[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS[s].label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setForm(null)} disabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" loading={isSaving}>
                {isSaving ? 'Salvando…' : form.id ? 'Salvar alterações' : 'Cadastrar solicitação'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir solicitação"
        message={`Excluir a solicitação de ${toDelete?.nome ?? ''} (${toDelete?.assunto ?? ''})? Esta ação não pode ser desfeita.`}
        type="delete"
        confirmText="Sim, excluir"
        isLoading={isDeleting}
      />
    </div>
  );
}
