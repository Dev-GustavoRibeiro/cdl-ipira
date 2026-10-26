'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  FaExclamationTriangle, FaHistory, FaPen, FaPlus, FaRedo, FaSearch, FaSearchPlus, FaSignInAlt, FaSignOutAlt, FaTrash,
} from 'react-icons/fa';
import Modal from '@/components/Modal';
import {
  AdminCard, AdminPageHeader, Button, DataTable, EmptyState, IconButton, SearchInput, Select, StatusBadge, type DataTableColumn,
  type StatusVariant,
} from '../_components';

interface AuditLog {
  id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  record_title: string | null;
  user_id: string | null;
  user_name: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

interface AuditResponse {
  data: AuditLog[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const ACTIONS: Record<string, { label: string; variant: StatusVariant; icon: IconType }> = {
  CREATE: { label: 'Criação', variant: 'success', icon: FaPlus },
  UPDATE: { label: 'Edição', variant: 'info', icon: FaPen },
  DELETE: { label: 'Exclusão', variant: 'danger', icon: FaTrash },
  LOGIN: { label: 'Login', variant: 'neutral', icon: FaSignInAlt },
  LOGOUT: { label: 'Logout', variant: 'neutral', icon: FaSignOutAlt },
};

// Tabelas gravadas pelas APIs (auditServer / logAuditServer)
const TABLES: Record<string, string> = {
  news: 'Notícias',
  events: 'Eventos',
  event_registrations: 'Inscrições em eventos',
  campaigns: 'Campanhas',
  videos: 'TV Lojista',
  albums: 'Galeria (álbuns)',
  album_photos: 'Galeria (fotos)',
  magazines: 'Revista CDL',
  hero_slides: 'Hero Carousel',
  partners: 'Associados',
  jobs: 'Vagas',
  resumes: 'Currículos',
  legal_requests: 'Orientação Jurídica',
  team_members: 'Diretoria',
  transparency_documents: 'Portal Transparência',
  contact_messages: 'Fale conosco',
  auth: 'Acesso ao painel',
};

const PAGE_SIZE = 20;
const TZ = 'America/Bahia';
const relative = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

function timeAgo(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (Number.isNaN(minutes)) return '';
  if (minutes < 1) return 'agora';
  if (minutes < 60) return relative.format(-minutes, 'minute');
  if (minutes < 60 * 24) return relative.format(-Math.round(minutes / 60), 'hour');
  return relative.format(-Math.round(minutes / (60 * 24)), 'day');
}

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: TZ });

/** Login com details.success === false vira "Login recusado" */
function actionInfo(log: AuditLog) {
  if (log.action === 'LOGIN' && log.details?.success === false) return { label: 'Login recusado', variant: 'warning' as const, icon: FaSignInAlt };
  return ACTIONS[log.action] ?? { label: log.action, variant: 'neutral' as const, icon: FaHistory };
}

const AUTH_TITLES: Record<string, string> = { Login: 'Entrada no painel', 'Login recusado': 'Tentativa de entrada', Logout: 'Saída do painel' };
const recordTitle = (log: AuditLog) =>
  log.record_title ||
  (log.table_name === 'auth' ? AUTH_TITLES[actionInfo(log).label] ?? actionInfo(log).label : log.record_id ? `Registro #${log.record_id}` : '—');
const tableLabel = (name: string) => TABLES[name] ?? name;
const shortId = (id: string) => id.slice(0, 8);

interface Query {
  page: number;
  action: string;
  table: string;
  search: string;
}

const INITIAL_QUERY: Query = { page: 1, action: '', table: '', search: '' };

export default function AuditoriaPage() {
  const [query, setQuery] = useState<Query>(INITIAL_QUERY);
  const [searchInput, setSearchInput] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; data?: AuditResponse; error?: string } | null>(null);
  const [selected, setSelected] = useState<AuditLog | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const params = new URLSearchParams({ page: String(query.page), limit: String(PAGE_SIZE) });
  if (query.action) params.set('action', query.action);
  if (query.table) params.set('table_name', query.table);
  if (query.search) params.set('search', query.search);
  const key = `${params.toString()}#${attempt}`;

  useEffect(() => {
    let active = true;
    const [qs] = key.split('#');
    fetch(`/api/admin/audit?${qs}`)
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error || 'Erro ao carregar a auditoria.');
        if (active) setResult({ key, data: json as AuditResponse });
      })
      .catch((error) => {
        if (active) setResult({ key, error: error instanceof Error ? error.message : 'Erro ao carregar a auditoria.' });
      });
    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  const isLoading = result?.key !== key;
  // Enquanto a próxima página carrega, `result` ainda é a anterior: a contagem e a paginação não "pulam"
  const logs = isLoading ? [] : (result?.data?.data ?? []);
  const pagination = result?.data?.pagination;
  const error = !isLoading ? result?.error : undefined;

  const onSearch = (value: string) => {
    setSearchInput(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setQuery((q) => ({ ...q, search: value.trim(), page: 1 })), 350);
  };

  const hasFilters = !!(query.action || query.table || query.search);
  const clearFilters = () => {
    clearTimeout(searchTimer.current);
    setSearchInput('');
    setQuery(INITIAL_QUERY);
  };

  const columns: DataTableColumn<AuditLog>[] = [
    {
      key: 'quando',
      header: 'Quando',
      className: 'whitespace-nowrap',
      cell: (log) => (
        <span className="inline-flex flex-col leading-tight md:items-start">
          <span className="text-gray-800 tabular-nums">{formatDateTime(log.created_at)}</span>
          <span suppressHydrationWarning className="text-xs text-gray-500">{timeAgo(log.created_at)}</span>
        </span>
      ),
    },
    {
      key: 'registro',
      header: 'Registro',
      primary: true,
      cell: (log) => {
        const info = actionInfo(log);
        return (
          <div className="min-w-0">
            <span className="mb-1.5 inline-flex">
              <StatusBadge variant={info.variant}>{info.label}</StatusBadge>
            </span>
            <p className="line-clamp-2 font-medium text-gray-900" title={log.record_title ?? undefined}>
              {recordTitle(log)}
            </p>
            <p className="text-xs font-normal text-gray-500">{tableLabel(log.table_name)}</p>
          </div>
        );
      },
    },
    {
      key: 'usuario',
      header: 'Usuário e IP',
      cell: (log) => (
        <span className="inline-flex max-w-52 flex-col leading-tight md:items-start">
          <span className="truncate text-gray-800">{log.user_name || '—'}</span>
          {log.user_id && (
            <span className="font-mono text-xs text-gray-500" title={log.user_id}>
              {shortId(log.user_id)}
            </span>
          )}
          <span className="mt-0.5 font-mono text-xs break-all text-gray-500">{log.ip_address || 'IP não registrado'}</span>
        </span>
      ),
    },
  ];

  const empty = error ? (
    <EmptyState
      icon={FaExclamationTriangle}
      title="Não foi possível carregar a auditoria"
      description={error}
      action={<Button icon={FaRedo} onClick={() => setAttempt((n) => n + 1)}>Tentar novamente</Button>}
    />
  ) : hasFilters ? (
    <EmptyState
      icon={FaSearch}
      title="Nenhum registro encontrado"
      description="Nenhuma ação corresponde aos filtros escolhidos."
      action={<Button variant="secondary" onClick={clearFilters}>Limpar filtros</Button>}
    />
  ) : (
    <EmptyState icon={FaHistory} title="Nenhuma ação registrada ainda" description="Criações, edições, exclusões e acessos ao painel aparecem aqui." />
  );

  const selectedInfo = selected ? actionInfo(selected) : null;

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="Auditoria"
        description="Tudo o que foi feito no painel: quem fez, quando, em qual área e de qual endereço IP."
        eyebrow={pagination ? `${pagination.total.toLocaleString('pt-BR')} ${pagination.total === 1 ? 'registro' : 'registros'}${hasFilters ? ' com os filtros' : ''}` : undefined}
      />

      <AdminCard flush>
        <div className="grid grid-cols-1 gap-3 border-b border-gray-100 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-[minmax(0,1fr)_13rem_15rem_auto]">
          <SearchInput label="Buscar por registro ou usuário" placeholder="Buscar por registro ou usuário…" value={searchInput} onChange={onSearch} className="sm:col-span-2 xl:col-span-1" />
          <Select aria-label="Filtrar por ação" value={query.action} onChange={(e) => setQuery((q) => ({ ...q, action: e.target.value, page: 1 }))}>
            <option value="">Todas as ações</option>
            {Object.entries(ACTIONS).map(([value, a]) => (
              <option key={value} value={value}>
                {a.label}
              </option>
            ))}
          </Select>
          <Select aria-label="Filtrar por área" value={query.table} onChange={(e) => setQuery((q) => ({ ...q, table: e.target.value, page: 1 }))}>
            <option value="">Todas as áreas</option>
            {Object.entries(TABLES)
              .sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'))
              .map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
          </Select>
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters} className="sm:col-span-2 xl:col-span-1">
              Limpar filtros
            </Button>
          )}
        </div>

        <DataTable
          caption="Registros de auditoria"
          rows={logs}
          getRowId={(log) => log.id}
          columns={columns}
          loading={isLoading}
          skeletonRows={8}
          rowActions={(log) => <IconButton icon={FaSearchPlus} label={`Ver detalhes: ${actionInfo(log).label} em ${tableLabel(log.table_name)}`} onClick={() => setSelected(log)} />}
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

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Detalhes do registro" subtitle={selected ? formatDateTime(selected.created_at) : undefined}>
        {selected && selectedInfo && (
          <div className="space-y-5">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Ação</dt>
                <dd className="mt-1">
                  <StatusBadge variant={selectedInfo.variant}>{selectedInfo.label}</StatusBadge>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Área</dt>
                <dd className="mt-1 text-gray-900">
                  {tableLabel(selected.table_name)} <span className="font-mono text-xs text-gray-500">({selected.table_name})</span>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Registro</dt>
                <dd className="mt-1 break-words text-gray-900">
                  {recordTitle(selected)}
                  {selected.record_id && <span className="ml-1.5 font-mono text-xs text-gray-500">#{selected.record_id}</span>}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Usuário</dt>
                <dd className="mt-1 text-gray-900">{selected.user_name || '—'}</dd>
                {selected.user_id && <dd className="font-mono text-xs break-all text-gray-500">{selected.user_id}</dd>}
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Endereço IP</dt>
                <dd className="mt-1 font-mono text-xs break-all text-gray-900">{selected.ip_address || '—'}</dd>
              </div>
            </dl>

            <div>
              <p className="mb-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">Dados registrados</p>
              {selected.details && Object.keys(selected.details).length > 0 ? (
                <pre className="max-h-72 overflow-auto rounded-2xl bg-[#001a3d] p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all text-[#e6eef8]">
                  {JSON.stringify(selected.details, null, 2)}
                </pre>
              ) : (
                <p className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-500 ring-1 ring-gray-200">Nenhum dado adicional.</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
