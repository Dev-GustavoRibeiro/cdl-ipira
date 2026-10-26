'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  FaCheckCircle, FaEnvelope, FaEnvelopeOpenText, FaExclamationTriangle, FaInbox, FaRedo, FaSearch, FaTrash, FaUndo, FaUserShield,
  FaWhatsapp,
} from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { fetchWithCSRF } from '@/lib/csrf-client';
import {
  AdminCard, AdminPageHeader, Button, CONTACT_MESSAGES_EVENT, DataTable, EmptyState, FilterPills, IconButton, SearchInput, Select,
  StatusBadge, buttonClass, cx, whatsappHref, type DataTableColumn, type StatusVariant,
} from '../_components';

type Status = 'new' | 'read' | 'answered';

interface ContactMessage {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
  status: Status;
  created_at: string;
}

interface Counts {
  all: number;
  unread: number;
  answered: number;
  privacyOpen: number;
}

interface ListResponse {
  data: ContactMessage[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  counts: Counts;
}

const STATUS: Record<Status, { label: string; variant: StatusVariant }> = {
  new: { label: 'Não lida', variant: 'warning' },
  read: { label: 'Lida', variant: 'info' },
  answered: { label: 'Respondida', variant: 'success' },
};

// Mesmos valores do formulário público (/imprensa/contato)
const SUBJECTS: Record<string, string> = {
  privacidade: 'Privacidade e meus dados (LGPD)',
  associacao: 'Associação',
  spc: 'Consulta SPC',
  certificado: 'Certificado Digital',
  eventos: 'Eventos',
  duvidas: 'Dúvidas gerais',
  outros: 'Outros',
};

const PAGE_SIZE = 20;
const TZ = 'America/Bahia';
// LGPD, art. 19: resposta completa ao titular em até 15 dias
const PRIVACY_DEADLINE_DAYS = 15;

const subjectLabel = (assunto: string) => SUBJECTS[assunto] ?? assunto;
const isPrivacy = (assunto: string) => /privacidade|lgpd/i.test(assunto);
const firstName = (nome: string) => nome.trim().split(/\s+/)[0] || nome;

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: TZ });

/** Prazo de resposta de um pedido do titular e se já venceu. */
function privacyDeadline(createdAt: string) {
  const deadline = new Date(new Date(createdAt).getTime() + PRIVACY_DEADLINE_DAYS * 24 * 60 * 60 * 1000);
  return {
    label: deadline.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TZ }),
    overdue: Date.now() > deadline.getTime(),
  };
}

/** fetch + JSON; erro com a mensagem da API */
async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await (init ? fetchWithCSRF(url, init) : fetch(url));
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || 'Não foi possível concluir a operação.');
  return data as T;
}

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Não foi possível concluir a operação.');

/** Avisa o menu do painel: com delta ajusta o contador de não lidas na hora; sem delta, o menu busca o total de novo. */
const notifyMenu = (delta?: number) => window.dispatchEvent(new CustomEvent(CONTACT_MESSAGES_EVENT, { detail: delta }));

function mailtoHref(m: ContactMessage) {
  const subject = `Re: ${subjectLabel(m.assunto)} — CDL Ipirá`;
  const body = `Olá, ${firstName(m.nome)}!\n\n`;
  // Endereço codificado (menos o @): um "?" ou "&" gravado no e-mail não vira parâmetro extra do mailto
  return `mailto:${encodeURIComponent(m.email).replace('%40', '@')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function PrivacyBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#003f7f] px-2 py-0.5 text-[11px] font-bold tracking-wide text-white">
      <FaUserShield aria-hidden="true" className="h-2.5 w-2.5" />
      LGPD
    </span>
  );
}

type StatusFilter = 'all' | Status;

interface Query {
  page: number;
  status: StatusFilter;
  assunto: string;
  search: string;
}

const INITIAL_QUERY: Query = { page: 1, status: 'all', assunto: '', search: '' };

export default function AdminFaleConoscoPage() {
  const [query, setQuery] = useState<Query>(INITIAL_QUERY);
  const [searchInput, setSearchInput] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [result, setResult] = useState<{ key: string; data?: ListResponse; error?: string } | null>(null);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [toDelete, setToDelete] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const params = new URLSearchParams({ page: String(query.page), limit: String(PAGE_SIZE) });
  if (query.status !== 'all') params.set('status', query.status);
  if (query.assunto) params.set('assunto', query.assunto);
  if (query.search) params.set('search', query.search);
  const key = params.toString();

  // reloadToken recarrega a mesma página em segundo plano (após marcar/apagar), sem voltar ao esqueleto
  useEffect(() => {
    let active = true;
    api<ListResponse>(`/api/admin/contact-messages?${key}`).then(
      (data) => {
        if (!active) return;
        // A página passou do fim (o último item dela foi apagado ou saiu do filtro): vai para a última que existe
        const last = Math.max(data.pagination.totalPages, 1);
        if (data.pagination.page > last) setQuery((q) => ({ ...q, page: last }));
        else setResult({ key, data });
      },
      (error) => active && setResult({ key, error: errorMessage(error) })
    );
    return () => {
      active = false;
    };
  }, [key, reloadToken]);

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  const isLoading = result?.key !== key;
  const rows = isLoading ? [] : (result?.data?.data ?? []);
  const pagination = result?.data?.pagination;
  const counts = result?.data?.counts;
  const error = !isLoading ? result?.error : undefined;

  const reload = () => setReloadToken((n) => n + 1);

  const onSearch = (value: string) => {
    setSearchInput(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setQuery((q) => ({ ...q, search: value.trim(), page: 1 })), 350);
  };

  const hasFilters = query.status !== 'all' || !!query.assunto || !!query.search;
  const clearFilters = () => {
    clearTimeout(searchTimer.current);
    setSearchInput('');
    setQuery(INITIAL_QUERY);
  };

  /** Troca o status já na tela e confirma no servidor (desfaz se falhar). */
  const updateStatus = async (message: ContactMessage, status: Status, silent = false) => {
    const apply = (s: Status) => {
      setResult((r) => (r?.data ? { ...r, data: { ...r.data, data: r.data.data.map((m) => (m.id === message.id ? { ...m, status: s } : m)) } } : r));
      setSelected((m) => (m?.id === message.id ? { ...m, status: s } : m));
    };
    apply(status);
    if (!silent) setSavingStatus(true);
    try {
      await api('/api/admin/contact-messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: message.id, status }),
      });
      if (silent) {
        // Leitura automática ao abrir: só desconta a não lida na tela e no menu, sem recarregar a lista
        // (economiza requisições do limite do painel e não tira a linha da lista filtrada)
        setResult((r) => (r?.data ? { ...r, data: { ...r.data, counts: { ...r.data.counts, unread: Math.max(r.data.counts.unread - 1, 0) } } } : r));
        notifyMenu(-1);
      } else {
        toast.success(`Mensagem marcada como "${STATUS[status].label.toLowerCase()}".`);
        notifyMenu();
        reload();
      }
    } catch (err) {
      apply(message.status);
      if (!silent) toast.error(errorMessage(err));
    } finally {
      if (!silent) setSavingStatus(false);
    }
  };

  // Abrir uma mensagem nova já a marca como lida
  const openMessage = (message: ContactMessage) => {
    setSelected(message);
    if (message.status === 'new') updateStatus(message, 'read', true);
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await api(`/api/admin/contact-messages?id=${encodeURIComponent(toDelete.id)}`, { method: 'DELETE' });
      toast.success('Mensagem apagada.');
      setToDelete(null);
      setSelected(null);
      notifyMenu();
      // Se era a última da página, o carregamento volta para a última página que existe
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: DataTableColumn<ContactMessage>[] = [
    {
      key: 'mensagem',
      header: 'Mensagem',
      primary: true,
      cell: (m) => {
        const privacy = isPrivacy(m.assunto);
        const deadline = privacy && m.status !== 'answered' ? privacyDeadline(m.created_at) : null;
        return (
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {m.status === 'new' && <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[#e6bb00]" />}
              <span className={cx('text-gray-900', m.status === 'new' ? 'font-bold' : 'font-semibold')}>{m.nome}</span>
              {privacy && <PrivacyBadge />}
            </p>
            <p className="mt-0.5 text-sm font-medium text-gray-700">{subjectLabel(m.assunto)}</p>
            <p className="mt-1 line-clamp-2 max-w-prose text-xs font-normal break-words text-gray-500">{m.mensagem}</p>
            <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs font-normal text-gray-500 tabular-nums">
              <span>Recebida em {formatDateTime(m.created_at)}</span>
              {deadline && (
                <span className={cx('font-semibold', deadline.overdue ? 'text-red-700' : 'text-[#0052a3]')}>
                  {deadline.overdue ? `Prazo LGPD vencido em ${deadline.label}` : `Responder até ${deadline.label}`}
                </span>
              )}
            </p>
          </div>
        );
      },
    },
    {
      key: 'contato',
      header: 'Contato',
      cell: (m) => (
        <span className="inline-flex max-w-56 flex-col leading-tight md:items-start">
          <span className="truncate text-gray-800">{m.email}</span>
          {m.telefone && <span className="text-xs whitespace-nowrap text-gray-500 tabular-nums">{m.telefone}</span>}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (m) => <StatusBadge variant={STATUS[m.status]?.variant ?? 'neutral'}>{STATUS[m.status]?.label ?? m.status}</StatusBadge>,
    },
  ];

  const rowActions = (m: ContactMessage) => (
    <>
      <IconButton icon={FaEnvelopeOpenText} label={`Abrir a mensagem de ${m.nome}`} onClick={() => openMessage(m)} />
      <IconButton icon={FaTrash} variant="danger" label={`Apagar a mensagem de ${m.nome}`} onClick={() => setToDelete(m)} />
    </>
  );

  const empty = error ? (
    <EmptyState
      icon={FaExclamationTriangle}
      title="Não foi possível carregar as mensagens"
      description={error}
      action={
        <Button icon={FaRedo} onClick={() => { setResult(null); reload(); }}>
          Tentar novamente
        </Button>
      }
    />
  ) : hasFilters ? (
    <EmptyState
      icon={FaSearch}
      title="Nenhuma mensagem encontrada"
      description="Tente outro termo de busca, status ou assunto."
      action={<Button variant="secondary" onClick={clearFilters}>Limpar filtros</Button>}
    />
  ) : (
    <EmptyState icon={FaInbox} title="Nenhuma mensagem ainda" description="As mensagens enviadas pelo formulário de contato do site aparecem aqui." />
  );

  const read = counts ? Math.max(counts.all - counts.unread - counts.answered, 0) : undefined;
  const selectedPrivacy = selected ? isPrivacy(selected.assunto) : false;
  const selectedDeadline = selected && selectedPrivacy ? privacyDeadline(selected.created_at) : null;
  const selectedWhatsapp = selected?.telefone
    ? whatsappHref(selected.telefone, `Olá, ${firstName(selected.nome)}! Aqui é da CDL Ipirá, sobre a mensagem que você enviou pelo Fale Conosco do site.`)
    : null;

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="Fale Conosco"
        description="Mensagens enviadas pelo formulário de contato do site, inclusive os pedidos de privacidade (LGPD). Responda por e-mail ou WhatsApp e marque como respondida."
        eyebrow={counts ? `${counts.unread} ${counts.unread === 1 ? 'não lida' : 'não lidas'}` : undefined}
      />

      {counts && counts.privacyOpen > 0 && query.assunto !== 'privacidade' && (
        <div role="status" className="flex flex-col gap-3 rounded-2xl bg-[#003f7f]/[0.05] p-4 ring-1 ring-[#003f7f]/15 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <p className="flex items-start gap-3 text-sm text-gray-700">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#003f7f] text-white">
              <FaUserShield aria-hidden="true" className="h-4 w-4" />
            </span>
            <span>
              <strong className="font-semibold text-gray-900">
                {counts.privacyOpen} {counts.privacyOpen === 1 ? 'pedido de privacidade aguardando' : 'pedidos de privacidade aguardando'} resposta.
              </strong>{' '}
              A LGPD prevê resposta ao titular em até {PRIVACY_DEADLINE_DAYS} dias.
            </span>
          </p>
          {/* Mostra também os já respondidos (não há filtro "em aberto"); os pendentes trazem o prazo na linha */}
          <Button variant="secondary" size="sm" onClick={() => setQuery((q) => ({ ...q, assunto: 'privacidade', status: 'all', page: 1 }))}>
            Ver todos os pedidos
          </Button>
        </div>
      )}

      <AdminCard flush>
        {/* Pílulas + assunto + busca só cabem numa linha em telas bem largas (com o menu aberto) */}
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:p-5 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <FilterPills<StatusFilter>
            label="Filtrar por status"
            value={query.status}
            onChange={(status) => setQuery((q) => ({ ...q, status, page: 1 }))}
            options={[
              { value: 'all', label: 'Todas', count: counts?.all },
              { value: 'new', label: 'Não lidas', count: counts?.unread },
              { value: 'read', label: 'Lidas', count: read },
              { value: 'answered', label: 'Respondidas', count: counts?.answered },
            ]}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:w-[36rem] 2xl:shrink-0">
            <Select aria-label="Filtrar por assunto" value={query.assunto} onChange={(e) => setQuery((q) => ({ ...q, assunto: e.target.value, page: 1 }))}>
              <option value="">Todos os assuntos</option>
              {Object.entries(SUBJECTS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <SearchInput label="Buscar por nome, e-mail, telefone ou mensagem" placeholder="Buscar mensagem…" value={searchInput} onChange={onSearch} />
          </div>
        </div>

        <DataTable
          caption="Mensagens do Fale Conosco"
          rows={rows}
          getRowId={(m) => m.id}
          columns={columns}
          rowActions={rowActions}
          loading={isLoading}
          empty={empty}
          pagination={
            pagination
              ? {
                  page: query.page,
                  totalPages: Math.max(pagination.totalPages, 1),
                  total: pagination.total,
                  pageSize: PAGE_SIZE,
                  onPageChange: (page) => setQuery((q) => ({ ...q, page })),
                }
              : undefined
          }
        />
      </AdminCard>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? subjectLabel(selected.assunto) : 'Mensagem'}
        subtitle={selected ? `Recebida em ${formatDateTime(selected.created_at)}` : undefined}
      >
        {selected && (
          <div className="space-y-5">
            {selectedPrivacy && (
              <div className="rounded-2xl bg-[#003f7f]/[0.05] p-4 text-sm text-gray-700 ring-1 ring-[#003f7f]/15">
                <p className="flex items-center gap-2 font-semibold text-[#003f7f]">
                  <FaUserShield aria-hidden="true" className="h-4 w-4" />
                  Pedido do titular (LGPD)
                </p>
                <p className="mt-1.5">
                  {selected.status === 'answered' ? (
                    'Pedido já respondido.'
                  ) : (
                    <span className={cx(selectedDeadline?.overdue && 'font-semibold text-red-700')}>
                      {selectedDeadline?.overdue ? `Prazo vencido em ${selectedDeadline.label}.` : `Responder até ${selectedDeadline?.label}.`}
                    </span>
                  )}{' '}
                  Se a pessoa pedir a exclusão, apague também os dados dela nas outras áreas (inscrições em eventos, currículos,
                  orientação jurídica) e, depois de responder, apague esta mensagem.
                </p>
              </div>
            )}

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Nome</dt>
                <dd className="mt-1 break-words text-gray-900">{selected.nome}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Status</dt>
                <dd className="mt-1">
                  <StatusBadge variant={STATUS[selected.status]?.variant ?? 'neutral'}>{STATUS[selected.status]?.label ?? selected.status}</StatusBadge>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">E-mail</dt>
                <dd className="mt-1 break-all text-gray-900">{selected.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Telefone</dt>
                <dd className="mt-1 text-gray-900 tabular-nums">{selected.telefone || 'Não informado'}</dd>
              </div>
            </dl>

            <div>
              <p className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">Mensagem</p>
              <p className="max-h-80 overflow-y-auto rounded-2xl bg-gray-50 px-4 py-3 text-sm leading-relaxed break-words whitespace-pre-wrap text-gray-800 ring-1 ring-gray-200">
                {selected.mensagem}
              </p>
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-5">
              {/* flex-wrap + grow: lado a lado quando cabem, um embaixo do outro quando não (fonte maior, tela estreita) */}
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <a href={mailtoHref(selected)} className={buttonClass('primary', 'md', 'sm:grow')}>
                  <FaEnvelope aria-hidden="true" className="h-4 w-4 shrink-0" />
                  Responder por e-mail
                </a>
                {selectedWhatsapp && (
                  <a href={selectedWhatsapp} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary', 'md', 'sm:grow')}>
                    <FaWhatsapp aria-hidden="true" className="h-4 w-4 shrink-0 text-[#00a859]" />
                    Responder no WhatsApp
                    <span className="sr-only">(abre em nova aba)</span>
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                {selected.status === 'answered' ? (
                  <Button variant="secondary" icon={FaUndo} loading={savingStatus} onClick={() => updateStatus(selected, 'read')}>
                    Marcar como não respondida
                  </Button>
                ) : (
                  <Button variant="secondary" icon={FaCheckCircle} loading={savingStatus} onClick={() => updateStatus(selected, 'answered')}>
                    Marcar como respondida
                  </Button>
                )}
                <Button variant="ghost" icon={FaTrash} className="text-red-700 hover:bg-red-50 hover:text-red-700" onClick={() => setToDelete(selected)}>
                  Apagar
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!toDelete}
        onClose={() => !isDeleting && setToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Apagar mensagem"
        message={`Apagar de vez a mensagem de ${toDelete?.nome ?? ''}? Ela sai do banco de dados e não pode ser recuperada. A auditoria registra só que uma mensagem foi apagada, sem nome nem conteúdo.`}
        type="delete"
        confirmText="Sim, apagar"
        isLoading={isDeleting}
      />
    </div>
  );
}
