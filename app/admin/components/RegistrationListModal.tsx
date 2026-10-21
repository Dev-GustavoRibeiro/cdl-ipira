'use client';

import React, { useState, useEffect, useCallback, useId } from 'react';
import { FaTimes, FaSearch, FaFileExport, FaEnvelope, FaPhone, FaBuilding, FaCalendar, FaTrash, FaUsers, FaExclamationTriangle } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { useIsClient, useModalBehavior } from '@/lib/hooks/useModalBehavior';
import ConfirmDialog from '@/components/ConfirmDialog';

interface RegistrationListModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number | null;
  eventTitle: string;
}

interface Registration {
  id: number;
  name: string;
  email: string;
  cpf?: string;
  phone: string;
  company: string;
  created_at: string;
}

// Célula CSV: aspas escapadas e prefixo ' em valores que o Excel executaria como fórmula (=, +, -, @, tab, CR).
// Telefones (+55 ...) e o marcador '-' não são fórmulas e ficam como estão.
function toCsvCell(value: string): string {
  const isPhoneOrPlaceholder = /^[+\d\s()-]+$/.test(value);
  const safe = !isPhoneOrPlaceholder && /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

// Mesmas colunas no cabeçalho e nas linhas (desktop); no celular cada inscrito vira um cartão
const COLUMNS = 'md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.5fr)_minmax(0,1fr)_7.5rem_2.5rem]';

export default function RegistrationListModal({ isOpen, onClose, eventId, eventTitle }: RegistrationListModalProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [registrationToDelete, setRegistrationToDelete] = useState<Registration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isClient = useIsClient();
  const titleId = useId();
  const searchId = useId();

  // Encadeado com .then (sem setState síncrono): o efeito de abertura só dispara a busca.
  // Abre como "carregando"; quem recarrega (Tentar novamente) marca isLoading antes.
  const fetchRegistrations = useCallback(() => {
    if (!eventId) return;
    fetch(`/api/admin/registrations?eventId=${eventId}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao carregar inscrições');
        setRegistrations(data || []);
        setLoadError(false);
      })
      .catch(() => {
        setLoadError(true);
        toast.error('Erro ao carregar lista de inscritos');
      })
      .finally(() => setIsLoading(false));
  }, [eventId]);

  useEffect(() => {
    if (isOpen && eventId) {
      fetchRegistrations();
    }
  }, [isOpen, eventId, fetchRegistrations]);

  // Limpa a lista ao fechar para não exibir/exportar inscritos de outro evento na próxima abertura
  const handleClose = () => {
    setRegistrations([]);
    setSearchTerm('');
    setLoadError(false);
    setIsLoading(true);
    onClose();
  };

  const dialogRef = useModalBehavior<HTMLDivElement>(isOpen, handleClose);

  const handleConfirmDelete = async () => {
    if (!registrationToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetchWithCSRF(`/api/admin/registrations?id=${registrationToDelete.id}&eventId=${eventId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erro ao excluir inscrito');

      toast.success('Inscrito excluído com sucesso');
      setRegistrationToDelete(null);
      fetchRegistrations();
    } catch {
      toast.error('Erro ao excluir inscrito');
    } finally {
      setIsDeleting(false);
    }
  };

  const term = searchTerm.trim().toLowerCase();
  const filteredRegistrations = registrations.filter(reg =>
    reg.name.toLowerCase().includes(term) ||
    reg.email.toLowerCase().includes(term) ||
    reg.company?.toLowerCase().includes(term)
  );

  const handleExport = () => {
    if (registrations.length === 0) return;

    const headers = ['Nome', 'E-mail', 'Telefone', 'Empresa', 'Data Inscrição'];
    const csvContent = [
      headers.map(toCsvCell).join(','),
      ...registrations.map(reg => [
        reg.name,
        reg.email,
        reg.phone,
        reg.company || '-',
        new Date(reg.created_at).toLocaleString('pt-BR')
      ].map(value => toCsvCell(String(value ?? ''))).join(','))
    ].join('\r\n');

    // BOM UTF-8 para o Excel abrir os acentos corretamente
    const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inscritos_${eventTitle.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isClient || !isOpen) return null;

  const total = registrations.length;
  const showList = !isLoading && !loadError && filteredRegistrations.length > 0;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-end justify-center bg-[#001a3d]/60 backdrop-blur-sm sm:items-center sm:p-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_30px_80px_-20px_rgba(0,26,61,0.55)] animate-[slide-up_0.3s_ease-out] sm:h-auto sm:min-h-[min(34rem,90dvh)] sm:max-h-[90dvh] sm:max-w-5xl sm:rounded-3xl sm:animate-[scale-in_0.2s_ease-out]"
      >
        <div aria-hidden="true" className="h-1.5 shrink-0 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />

        {/* Cabeçalho */}
        <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-6">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-[#003f7f] uppercase">
              <FaUsers aria-hidden="true" className="h-3 w-3" />
              {isLoading || loadError ? 'Inscritos' : `${total} ${total === 1 ? 'inscrito' : 'inscritos'}`}
            </span>
            <h2 id={titleId} className="mt-3 text-xl font-black leading-tight tracking-tight text-balance text-[#003f7f] sm:text-2xl">
              Inscritos no evento
            </h2>
            <p className="mt-1 line-clamp-2 max-w-[65ch] text-sm text-gray-600">{eventTitle}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar lista de inscritos"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-[background-color,color,scale] duration-200 hover:bg-[#003f7f] hover:text-white active:scale-95 motion-reduce:transition-none"
          >
            <FaTimes aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {/* Busca e exportação: fixas acima da lista */}
        <div className="flex shrink-0 flex-col gap-3 border-b border-gray-100 px-5 pt-5 pb-4 sm:flex-row sm:items-center sm:px-8">
          <div className="relative flex-1">
            <label htmlFor={searchId} className="sr-only">Buscar inscritos</label>
            <FaSearch aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              id={searchId}
              type="search"
              placeholder="Buscar por nome, e-mail ou empresa"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pr-4 pl-10 text-sm text-gray-900 transition-colors placeholder:text-gray-500 hover:border-gray-300 focus:border-[#003f7f] focus:bg-white"
            />
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={total === 0}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#003f7f] px-5 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(0,63,127,0.7)] transition-[background-color,scale] duration-200 hover:bg-[#0052a3] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none motion-reduce:transition-none"
          >
            <FaFileExport aria-hidden="true" className="text-[#00d670]" />
            Exportar CSV
          </button>
        </div>

        {/* Lista */}
        <div className="grow overflow-y-auto overscroll-contain bg-gray-50/60 px-4 py-4 sm:px-8 sm:py-6 md:bg-white">
          <p aria-live="polite" className="sr-only">
            {!isLoading && term ? `${filteredRegistrations.length} de ${total} inscritos` : ''}
          </p>

          {isLoading ? (
            <div aria-busy="true" aria-label="Carregando inscritos" className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-gray-100">
                  <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-gray-200 motion-reduce:animate-none" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 animate-pulse rounded-full bg-gray-200 motion-reduce:animate-none" />
                    <div className="h-3 w-1/2 animate-pulse rounded-full bg-gray-100 motion-reduce:animate-none" />
                  </div>
                </div>
              ))}
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center px-4 py-14 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 ring-8 ring-red-50">
                <FaExclamationTriangle aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-lg font-black text-[#003f7f]">Não foi possível carregar a lista</h3>
              <p className="mt-2 max-w-[42ch] text-sm text-gray-600">Verifique a conexão e tente de novo.</p>
              <button
                type="button"
                onClick={() => { setIsLoading(true); fetchRegistrations(); }}
                className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#003f7f] px-5 text-sm font-bold text-white transition-colors hover:bg-[#0052a3]"
              >
                Tentar novamente
              </button>
            </div>
          ) : !showList ? (
            <div className="flex flex-col items-center px-4 py-14 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#003f7f]/10 text-[#003f7f] ring-8 ring-[#003f7f]/5">
                {total === 0 ? <FaUsers aria-hidden="true" className="h-6 w-6" /> : <FaSearch aria-hidden="true" className="h-5 w-5" />}
              </span>
              <h3 className="mt-6 text-lg font-black text-balance text-[#003f7f]">
                {total === 0 ? 'Nenhum inscrito ainda' : 'Nenhum inscrito encontrado'}
              </h3>
              <p className="mt-2 max-w-[42ch] text-sm text-pretty text-gray-600">
                {total === 0
                  ? 'Quando alguém se inscrever neste evento pelo site, aparece aqui.'
                  : `Nada corresponde a “${searchTerm.trim()}”. Tente outro nome, e-mail ou empresa.`}
              </p>
              {total > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-[#003f7f] ring-1 ring-gray-200 transition-colors hover:bg-gray-50"
                >
                  Limpar busca
                </button>
              )}
            </div>
          ) : (
            <div className="md:overflow-hidden md:rounded-2xl md:ring-1 md:ring-gray-100">
              {/* Cabeçalho das colunas (desktop), fixo ao rolar */}
              <div
                aria-hidden="true"
                className={`sticky top-0 z-10 hidden gap-5 border-b border-gray-100 bg-gray-50/95 px-5 py-3 text-[11px] font-bold tracking-wider text-gray-500 uppercase backdrop-blur md:grid ${COLUMNS}`}
              >
                <span>Inscrito</span>
                <span>Contato</span>
                <span>Empresa</span>
                <span>Inscrição</span>
                <span className="sr-only">Ações</span>
              </div>

              <ul className="space-y-3 md:space-y-0 md:divide-y md:divide-gray-100">
                {filteredRegistrations.map((reg) => (
                  <li
                    key={reg.id}
                    className={`relative rounded-2xl bg-white p-4 shadow-[0_10px_30px_-18px_rgba(0,63,127,0.35)] ring-1 ring-gray-100 md:grid md:items-center md:gap-5 md:rounded-none md:px-5 md:py-3.5 md:shadow-none md:ring-0 md:transition-colors md:hover:bg-gray-50 ${COLUMNS}`}
                  >
                    <div className="flex min-w-0 items-center gap-3 pr-12 md:pr-0">
                      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#003f7f]/10 text-sm font-black text-[#003f7f]">
                        {initials(reg.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold leading-snug text-gray-900">{reg.name}</p>
                        {reg.cpf && <p className="text-xs text-gray-500">CPF {reg.cpf}</p>}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 border-t border-gray-100 pt-3 text-sm text-gray-600 md:contents">
                      <div className="flex min-w-0 flex-col gap-1.5 md:gap-1">
                        <p className="flex min-w-0 items-center gap-2">
                          <FaEnvelope aria-hidden="true" className="h-3 w-3 shrink-0 text-gray-400" />
                          <span className="sr-only">E-mail:</span>
                          <span className="truncate" title={reg.email}>{reg.email}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <FaPhone aria-hidden="true" className="h-3 w-3 shrink-0 text-gray-400" />
                          <span className="sr-only">Telefone:</span>
                          <span>{reg.phone}</span>
                        </p>
                      </div>
                      <p className="flex min-w-0 items-center gap-2">
                        <FaBuilding aria-hidden="true" className="h-3 w-3 shrink-0 text-gray-400" />
                        <span className="sr-only">Empresa:</span>
                        <span className={`truncate ${reg.company ? '' : 'text-gray-500'}`}>{reg.company || 'Sem empresa'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FaCalendar aria-hidden="true" className="h-3 w-3 shrink-0 text-gray-400" />
                        <span className="sr-only">Inscrição em</span>
                        <span className="tabular-nums">{new Date(reg.created_at).toLocaleDateString('pt-BR')}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setRegistrationToDelete(reg)}
                      title="Excluir inscrito"
                      aria-label={`Excluir inscrito ${reg.name}`}
                      className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl text-red-600 ring-1 ring-red-100 transition-colors hover:bg-red-50 hover:ring-red-200 md:static"
                    >
                      <FaTrash aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-gray-100 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-sm text-gray-500 sm:px-8">
          {/* Sem contagem enquanto carrega ou após erro (não é "0 inscritos") */}
          <span>
            {isLoading || loadError
              ? null
              : term
                ? <>Mostrando <strong className="text-gray-900">{filteredRegistrations.length}</strong> de {total}</>
                : <>Total: <strong className="text-gray-900">{total}</strong> {total === 1 ? 'inscrito' : 'inscritos'}</>}
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-10 items-center rounded-xl px-4 font-bold text-[#003f7f] transition-colors hover:bg-gray-100"
          >
            Fechar
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!registrationToDelete}
        onClose={() => setRegistrationToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Inscrito"
        message={`Tem certeza que deseja excluir a inscrição de ${registrationToDelete?.name ?? ''}? Esta ação não pode ser desfeita.`}
        type="delete"
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </div>,
    document.body
  );
}
