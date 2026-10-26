'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  FaArrowLeft, FaArrowRight, FaCloudUploadAlt, FaExclamationTriangle, FaExternalLinkAlt, FaEye, FaEyeSlash, FaHandshake,
  FaPlus, FaRedo, FaSearch, FaSyncAlt, FaTrash,
} from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { isOptimizableImage } from '@/lib/images';
import {
  AdminCard, AdminPageHeader, Button, Checkbox, EmptyState, FilterPills, FormField, IconButton, Input, Pagination, SearchInput,
  ImageRightsNotice, buttonClass, cardSurface, cx, focusRing,
} from '../../_components';

interface Partner {
  id: number;
  name: string;
  logo: string;
  website: string;
  order: number;
  isActive: boolean;
}

interface ApiPartner {
  id: number;
  name: string;
  logo: string;
  website: string | null;
  order_index: number | null;
  is_active: boolean | null;
}

interface FormState {
  id?: number;
  name: string;
  logo: string;
  website: string;
  isActive: boolean;
  /** Posição na lista (1 = primeiro) */
  position: string;
}

type Filter = 'all' | 'active' | 'hidden';

const PAGE_SIZE = 30;

const fromApi = (p: ApiPartner): Partner => ({
  id: p.id,
  name: p.name,
  logo: p.logo,
  website: p.website ?? '',
  order: p.order_index ?? 0,
  isActive: p.is_active !== false,
});

const byOrder = (a: Partner, b: Partner) => a.order - b.order || a.id - b.id;

/** "www.loja.com" → "https://www.loja.com" (o campo aceita só http(s) ou caminho do site) */
function normalizeWebsite(value: string) {
  const v = value.trim();
  if (!v || v.startsWith('/') || /^https?:\/\//i.test(v)) return v;
  return /^[\w-]+(\.[\w-]+)+/.test(v) ? `https://${v}` : v;
}

function websiteError(value: string) {
  const v = value.trim();
  if (!v) return null;
  if (v.startsWith('/') && !v.startsWith('//')) return null;
  try {
    const url = new URL(v);
    if (/^https?:$/.test(url.protocol) && url.hostname.includes('.')) return null;
  } catch {
    // inválido
  }
  return 'Informe o endereço completo, ex.: https://www.loja.com.br';
}

const hostOf = (website: string) => {
  try {
    return new URL(website).hostname.replace(/^www\./, '');
  } catch {
    return website;
  }
};

/** Nome sugerido a partir do arquivo: "supermercado-bom-preco.png" → "supermercado bom preco" */
const nameFromFile = (filename: string) => filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();

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

/** Renumera 1..n e devolve só quem mudou de posição */
const renumber = (ordered: Partner[]) =>
  ordered.map((p, i) => ({ id: p.id, order: i + 1, before: p.order })).filter((it) => it.order !== it.before).map(({ id, order }) => ({ id, order }));

export default function AdminParceirosPage() {
  const [version, setVersion] = useState(0);
  const [list, setList] = useState<{ v: number; rows: Partner[]; error?: string }>({ v: -1, rows: [] });
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [form, setForm] = useState<FormState | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Partner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const logoInputId = useId();

  useEffect(() => {
    let active = true;
    api<ApiPartner[]>('/api/admin/parceiros').then(
      (rows) => active && setList({ v: version, rows: (rows || []).map(fromApi) }),
      (error) => active && setList((prev) => ({ v: version, rows: prev.rows, error: errorMessage(error) }))
    );
    return () => {
      active = false;
    };
  }, [version]);

  const reload = () => setVersion((v) => v + 1);
  const isLoading = list.v === -1;
  const ordered = useMemo(() => [...list.rows].sort(byOrder), [list.rows]);

  const counts = useMemo(
    () => ({ all: ordered.length, active: ordered.filter((p) => p.isActive).length, hidden: ordered.filter((p) => !p.isActive).length }),
    [ordered]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ordered.filter(
      (p) => (filter === 'all' || (filter === 'active') === p.isActive) && (!q || p.name.toLowerCase().includes(q) || p.website.toLowerCase().includes(q))
    );
  }, [ordered, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  // Setas só fazem sentido na lista completa (com filtro, o vizinho na tela não é o vizinho real)
  const canReorder = filter === 'all' && !search.trim();

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => (f ? { ...f, [key]: value } : f));

  const openForm = (partner?: Partner) => {
    setLogoError(null);
    setForm(
      partner
        ? {
            id: partner.id,
            name: partner.name,
            logo: partner.logo,
            website: partner.website,
            isActive: partner.isActive,
            position: String(ordered.findIndex((p) => p.id === partner.id) + 1),
          }
        : { name: '', logo: '', website: '', isActive: true, position: String(ordered.length + 1) }
    );
  };

  const uploadLogo = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setLogoError('Escolha uma imagem (PNG, JPG ou WebP).');
      return;
    }
    setLogoError(null);
    setIsUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('bucket', 'partners');
      const uploaded = await api<{ url?: string }>('/api/upload', { method: 'POST', body });
      if (!uploaded.url) throw new Error('O envio da logo não retornou o endereço.');
      setForm((f) => (f ? { ...f, logo: uploaded.url!, name: f.name || nameFromFile(file.name) } : f));
    } catch (error) {
      setLogoError(errorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  /** Move para a posição (1..n) e grava só as ordens que mudaram */
  const saveOrder = async (base: Partner[], id: number, toIndex: number) => {
    const next = base.filter((p) => p.id !== id);
    const item = base.find((p) => p.id === id);
    if (!item) return;
    next.splice(Math.max(0, Math.min(toIndex, next.length)), 0, item);
    const changed = renumber(next);
    if (!changed.length) return;
    const previous = list.rows;
    const orderOf = new Map(changed.map((it) => [it.id, it.order]));
    setList((l) => ({ ...l, rows: l.rows.map((r) => (orderOf.has(r.id) ? { ...r, order: orderOf.get(r.id)! } : r)) }));
    try {
      await api('/api/admin/parceiros', jsonInit('PATCH', { items: changed }));
    } catch (error) {
      setList((l) => ({ ...l, rows: previous }));
      throw error;
    }
  };

  const move = async (partner: Partner, direction: -1 | 1) => {
    const index = ordered.findIndex((p) => p.id === partner.id);
    setBusyId(partner.id);
    try {
      await saveOrder(ordered, partner.id, index + direction);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;
    const another = (e.nativeEvent as SubmitEvent).submitter?.getAttribute('data-another') === '1';
    if (!form.logo) {
      setLogoError('Envie a logo do associado.');
      return;
    }
    const website = normalizeWebsite(form.website);
    if (websiteError(website)) return;

    setIsSaving(true);
    try {
      const payload = { name: form.name.trim(), logo: form.logo, website, isActive: form.isActive };
      let id = form.id;
      let base = ordered;
      if (id) {
        await api('/api/admin/parceiros', jsonInit('PUT', { id, ...payload }));
        base = ordered.map((p) => (p.id === id ? { ...p, ...payload } : p));
      } else {
        const order = ordered.length ? Math.max(...ordered.map((p) => p.order)) + 1 : 1;
        const created = await api<ApiPartner>('/api/admin/parceiros', jsonInit('POST', { ...payload, order }));
        id = created.id;
        base = [...ordered, fromApi({ ...created, order_index: created.order_index ?? order })];
      }
      setList((l) => ({ ...l, rows: base.map((p) => (p.id === id ? { ...p, isActive: form.isActive } : p)) }));
      toast.success(form.id ? `${payload.name} atualizado.` : `${payload.name} adicionado.`);

      // Já está salvo: se só a posição falhar, avisa sem manter o formulário aberto (salvar de novo duplicaria o associado)
      const wanted = Number(form.position);
      const currentIndex = base.findIndex((p) => p.id === id);
      if (Number.isInteger(wanted) && wanted >= 1 && wanted - 1 !== currentIndex) {
        await saveOrder(base, id!, wanted - 1).catch((error) => toast.error(`Não foi possível mudar a posição: ${errorMessage(error)}`));
      }

      if (another) {
        setForm({ name: '', logo: '', website: '', isActive: true, position: String(base.length + 1) });
        setLogoError(null);
        document.getElementById(logoInputId)?.focus();
      } else {
        setForm(null);
      }
      reload();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (partner: Partner) => {
    setBusyId(partner.id);
    try {
      await api('/api/admin/parceiros', jsonInit('PUT', { id: partner.id, isActive: !partner.isActive }));
      setList((l) => ({ ...l, rows: l.rows.map((r) => (r.id === partner.id ? { ...r, isActive: !partner.isActive } : r)) }));
      toast.success(partner.isActive ? `${partner.name} ocultado do site.` : `${partner.name} visível no site.`);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await api(`/api/admin/parceiros?id=${toDelete.id}`, { method: 'DELETE' });
      setList((l) => ({ ...l, rows: l.rows.filter((r) => r.id !== toDelete.id) }));
      toast.success(`${toDelete.name} excluído.`);
      setToDelete(null);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const formWebsiteError = form ? websiteError(normalizeWebsite(form.website)) : null;

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="Associados"
        breadcrumb={[{ label: 'Conteúdo do site', href: '/admin/conteudo' }, { label: 'Associados' }]}
        description="Logos das empresas associadas, exibidas no carrossel da página inicial e em Benefícios › Empresas."
        actions={
          <>
            <a href="/beneficios/empresas" target="_blank" rel="noopener noreferrer" className={buttonClass('secondary')}>
              <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5" />
              Ver no site
              <span className="sr-only">(abre em nova aba)</span>
            </a>
            <Button icon={FaPlus} onClick={() => openForm()}>
              Novo associado
            </Button>
          </>
        }
      />

      <AdminCard flush>
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <FilterPills<Filter>
            label="Filtrar por visibilidade"
            value={filter}
            onChange={(v) => {
              setFilter(v);
              setPage(1);
            }}
            options={[
              { value: 'all', label: 'Todos', count: counts.all },
              { value: 'active', label: 'Visíveis', count: counts.active },
              { value: 'hidden', label: 'Ocultos', count: counts.hidden },
            ]}
          />
          <SearchInput
            label="Buscar associado por nome ou site"
            placeholder="Buscar associado…"
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            className="xl:w-80"
          />
        </div>

        <div className="p-4 sm:p-5">
          {!isLoading && filtered.length > 0 && (
            <p className="mb-4 text-xs text-gray-500">
              {canReorder ? (
                <>
                  A ordem abaixo é a do site.{' '}
                  <span className="sm:hidden">Toque em um associado para mudar a posição.</span>
                  <span className="hidden sm:inline">Use as setas (ou a posição, ao editar) para reorganizar.</span>
                </>
              ) : (
                'Para reordenar, limpe a busca e o filtro.'
              )}
            </p>
          )}

          {isLoading ? (
            <ul aria-hidden="true" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {Array.from({ length: 10 }, (_, i) => (
                <li key={i} className={cx(cardSurface, 'overflow-hidden')}>
                  <div className="aspect-[3/2] animate-pulse bg-gray-100" />
                  <div className="space-y-2 p-3">
                    <span className="block h-3.5 w-3/4 animate-pulse rounded bg-gray-100" />
                    <span className="block h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                  </div>
                </li>
              ))}
            </ul>
          ) : filtered.length === 0 ? (
            list.error && ordered.length === 0 ? (
              <EmptyState
                icon={FaExclamationTriangle}
                title="Não foi possível carregar os associados"
                description={list.error}
                action={<Button icon={FaRedo} onClick={reload}>Tentar novamente</Button>}
              />
            ) : ordered.length === 0 ? (
              <EmptyState
                icon={FaHandshake}
                title="Nenhum associado cadastrado"
                description="Envie a logo, o nome e o site de cada empresa associada."
                action={<Button icon={FaPlus} onClick={() => openForm()}>Novo associado</Button>}
              />
            ) : (
              <EmptyState
                icon={FaSearch}
                title="Nenhum associado encontrado"
                description={search.trim() ? `Nada encontrado para "${search.trim()}".` : 'Nenhum associado neste filtro.'}
                action={
                  <Button variant="secondary" onClick={() => { setSearch(''); setFilter('all'); }}>
                    Limpar filtros
                  </Button>
                }
              />
            )
          ) : (
            <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {pageItems.map((p) => {
                const index = ordered.findIndex((x) => x.id === p.id);
                return (
                  <li key={p.id} className={cx(cardSurface, 'flex min-w-0 flex-col overflow-hidden', !p.isActive && 'bg-gray-50')}>
                    <button
                      type="button"
                      onClick={() => openForm(p)}
                      aria-label={`Editar ${p.name}`}
                      className={cx('group relative block aspect-[3/2] bg-white', focusRing, 'focus-visible:ring-inset focus-visible:ring-offset-0')}
                    >
                      <Image
                        src={p.logo}
                        alt=""
                        fill
                        sizes="(min-width: 1536px) 14vw, (min-width: 1280px) 17vw, (min-width: 640px) 30vw, 45vw"
                        className={cx('object-contain p-4 transition-[scale] duration-200 group-hover:scale-105 motion-reduce:transition-none', !p.isActive && 'opacity-40 grayscale')}
                        unoptimized={!isOptimizableImage(p.logo)}
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-gray-900/[0.06] px-2 py-0.5 text-[11px] font-bold text-gray-600 tabular-nums">
                        {index + 1}º
                      </span>
                      {!p.isActive && (
                        <span className="absolute top-2 right-2 rounded-full bg-gray-700 px-2 py-0.5 text-[11px] font-semibold text-white">Oculto</span>
                      )}
                    </button>
                    <div className="min-w-0 border-t border-gray-100 px-3 pt-2.5 pb-1">
                      <p className="line-clamp-2 text-sm leading-snug font-semibold text-gray-900" title={p.name}>
                        {p.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">{p.website ? hostOf(p.website) : 'Sem site'}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-end gap-0.5 px-1.5 pb-1.5">
                      {canReorder && (
                        <span className="mr-auto hidden items-center gap-0.5 sm:flex">
                          <IconButton icon={FaArrowLeft} label={`Mover ${p.name} para antes`} onClick={() => move(p, -1)} disabled={index === 0 || busyId !== null} />
                          <IconButton icon={FaArrowRight} label={`Mover ${p.name} para depois`} onClick={() => move(p, 1)} disabled={index === ordered.length - 1 || busyId !== null} />
                        </span>
                      )}
                      <IconButton
                        icon={p.isActive ? FaEyeSlash : FaEye}
                        label={p.isActive ? `Ocultar ${p.name} do site` : `Mostrar ${p.name} no site`}
                        onClick={() => toggleActive(p)}
                        disabled={busyId === p.id}
                      />
                      <IconButton icon={FaTrash} variant="danger" label={`Excluir ${p.name}`} onClick={() => setToDelete(p)} />
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {!isLoading && filtered.length > PAGE_SIZE && (
          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} total={filtered.length} pageSize={PAGE_SIZE} />
        )}
      </AdminCard>

      <Modal
        isOpen={!!form}
        onClose={() => !isSaving && !isUploading && setForm(null)}
        title={form?.id ? 'Editar associado' : 'Novo associado'}
        subtitle={form?.id ? undefined : 'Para cadastrar vários, use “Salvar e adicionar outro”.'}
      >
        {form && (
          <form onSubmit={handleSave} className="space-y-5">
            {/* Logo: prévia sem cortes (object-contain), como no site */}
            <div>
              <p id={`${logoInputId}-label`} className="mb-1.5 text-sm font-semibold text-gray-700">
                Logo<span aria-hidden="true" className="ml-0.5 text-red-600">*</span>
              </p>
              <label
                htmlFor={logoInputId}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!isUploading) uploadLogo(e.dataTransfer.files?.[0]);
                }}
                className={cx(
                  'relative flex aspect-[3/1] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-white transition-colors sm:aspect-[4/1]',
                  'has-[input:focus-visible]:border-[#0066cc] has-[input:focus-visible]:ring-4 has-[input:focus-visible]:ring-[#0066cc]/15',
                  logoError ? 'border-red-400' : form.logo ? 'border-gray-200 hover:border-[#003f7f]/40' : 'border-gray-300 bg-gray-50/60 hover:border-[#003f7f]/40',
                  isUploading && 'pointer-events-none'
                )}
              >
                {form.logo ? (
                  <>
                    <Image src={form.logo} alt="Prévia da logo" fill sizes="600px" className="object-contain p-4" unoptimized={!isOptimizableImage(form.logo)} />
                    <span className="absolute right-2 bottom-2 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#003f7f] shadow-sm ring-1 ring-gray-200">
                      <FaSyncAlt aria-hidden="true" className="h-3 w-3" />
                      Trocar logo
                    </span>
                  </>
                ) : (
                  <span className="flex flex-col items-center gap-1.5 px-4 text-center">
                    <FaCloudUploadAlt aria-hidden="true" className="h-6 w-6 text-[#003f7f]" />
                    <span className="text-sm font-semibold text-gray-800">
                      <span className="text-[#0052a3]">Clique para enviar</span> ou arraste a logo
                    </span>
                  </span>
                )}
                {isUploading && (
                  <span role="status" className="absolute inset-0 flex items-center justify-center bg-white/80 text-sm font-semibold text-[#003f7f]">
                    Enviando…
                  </span>
                )}
                <input
                  id={logoInputId}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  aria-labelledby={`${logoInputId}-label`}
                  aria-describedby={`${logoInputId}-hint ${logoInputId}-rights`}
                  aria-invalid={logoError ? true : undefined}
                  disabled={isUploading}
                  onChange={(e) => {
                    uploadLogo(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
              </label>
              {logoError && (
                <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">
                  {logoError}
                </p>
              )}
              <p id={`${logoInputId}-hint`} className="mt-1.5 text-xs text-gray-500">
                PNG com fundo transparente ou branco, até 10 MB. A logo aparece inteira, sem cortes.
              </p>
              <ImageRightsNotice id={`${logoInputId}-rights`} className="mt-1" />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_9rem]">
              <FormField label="Nome da empresa" required>
                <Input value={form.name} onChange={(e) => setField('name', e.target.value)} required minLength={2} maxLength={100} autoComplete="off" />
              </FormField>
              <FormField label="Posição" hint={`De 1 a ${form.id ? ordered.length : ordered.length + 1}`}>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={form.id ? ordered.length : ordered.length + 1}
                  value={form.position}
                  onChange={(e) => setField('position', e.target.value)}
                />
              </FormField>
              <FormField label="Site" error={formWebsiteError} hint={!formWebsiteError ? 'Opcional. Ex.: www.loja.com.br' : undefined} className="sm:col-span-2">
                <Input
                  value={form.website}
                  onChange={(e) => setField('website', e.target.value)}
                  onBlur={(e) => setField('website', normalizeWebsite(e.target.value))}
                  inputMode="url"
                  autoCapitalize="none"
                  spellCheck={false}
                  maxLength={500}
                  placeholder="https://"
                />
              </FormField>
            </div>

            <Checkbox label="Visível no site" checked={form.isActive} onChange={(e) => setField('isActive', e.target.checked)} />

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setForm(null)} disabled={isSaving || isUploading}>
                Cancelar
              </Button>
              {!form.id && (
                <Button type="submit" variant="secondary" data-another="1" disabled={isSaving || isUploading} icon={FaPlus}>
                  Salvar e adicionar outro
                </Button>
              )}
              <Button type="submit" loading={isSaving} disabled={isUploading}>
                {isSaving ? 'Salvando…' : form.id ? 'Salvar alterações' : 'Salvar'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir associado"
        message={`Excluir ${toDelete?.name ?? ''}? Para só tirar do site, use "Ocultar". Esta ação não pode ser desfeita.`}
        type="delete"
        confirmText="Sim, excluir"
        isLoading={isDeleting}
      />
    </div>
  );
}
