'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import Image from 'next/image';
import type { IconType } from 'react-icons';
import {
  FaArrowDown, FaArrowUp, FaBriefcase, FaCamera, FaCrown, FaEdit, FaExclamationTriangle, FaExternalLinkAlt, FaEye, FaEyeSlash,
  FaPlus, FaRedo, FaTrash, FaUser, FaUserFriends, FaUserShield, FaUserTie,
} from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { isOptimizableImage } from '@/lib/images';
import {
  AdminCard, AdminPageHeader, AdminSection, Button, Checkbox, EmptyState, FormField, IconButton, Input, SearchInput, Select,
  ImageRightsNotice, StatusBadge, Textarea, buttonClass, cx,
} from '../_components';

type Role = 'presidente' | 'vice_presidente' | 'diretor' | 'suplente' | 'colaborador';

interface TeamMember {
  id: number;
  name: string;
  role: Role;
  position: string;
  photo_url?: string | null;
  bio?: string | null;
  contribution?: string | null;
  function_description?: string | null;
  display_order: number;
  is_active: boolean;
}

interface FormState {
  id?: number;
  name: string;
  role: Role;
  position: string;
  photo_url: string;
  bio: string;
  contribution: string;
  function_description: string;
  display_order: number;
  is_active: boolean;
}

const ROLES: { role: Role; label: string; plural: string; icon: IconType; tile: string; description: string; position: string }[] = [
  { role: 'presidente', label: 'Presidente', plural: 'Presidência', icon: FaCrown, tile: 'bg-[#ffd000] text-[#003f7f]', description: 'Destaque no topo da página, com biografia.', position: 'Presidente' },
  { role: 'vice_presidente', label: 'Vice-presidente', plural: 'Vice-presidência', icon: FaUserShield, tile: 'bg-[#ffd000]/30 text-[#003f7f]', description: 'Exibido logo abaixo do presidente.', position: 'Vice-presidente' },
  { role: 'diretor', label: 'Diretor(a)', plural: 'Diretores', icon: FaUserTie, tile: 'bg-[#003f7f] text-white', description: 'Diretoria executiva, na ordem abaixo.', position: '' },
  { role: 'suplente', label: 'Suplente', plural: 'Suplentes', icon: FaUserFriends, tile: 'bg-[#0066cc]/10 text-[#0066cc]', description: 'Membros suplentes da diretoria.', position: 'Suplente' },
  { role: 'colaborador', label: 'Colaborador(a)', plural: 'Colaboradores', icon: FaBriefcase, tile: 'bg-[#00a859]/10 text-[#00703c]', description: 'Equipe de atendimento e administrativo.', position: '' },
];

const roleInfo = (role: Role) => ROLES.find((r) => r.role === role) ?? ROLES[2];
const byOrder = (a: TeamMember, b: TeamMember) => a.display_order - b.display_order || a.id - b.id;
const MAX_PHOTO_MB = 10;

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

const toPayload = (m: TeamMember | FormState) => ({
  name: m.name,
  role: m.role,
  position: m.position,
  photo_url: m.photo_url || null,
  // Mantém a biografia gravada mesmo se o campo estiver oculto (só o presidente mostra no site)
  bio: m.bio || null,
  contribution: m.contribution || null,
  function_description: m.function_description || null,
  display_order: m.display_order,
  is_active: m.is_active,
});

/** Foto 4:5 (mesmo recorte do site: object-cover, alinhada ao topo) */
function Photo({ src, name, className }: { src?: string | null; name: string; className?: string }) {
  return (
    <span className={cx('relative block aspect-4/5 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200', className)}>
      {src ? (
        <Image src={src} alt={`Foto de ${name}`} fill sizes="96px" className="object-cover object-top" unoptimized={!isOptimizableImage(src)} />
      ) : (
        <span className="flex h-full items-center justify-center text-gray-300">
          <FaUser aria-hidden="true" className="h-1/3 w-1/3" />
        </span>
      )}
    </span>
  );
}

export default function AdminDiretoriaPage() {
  const [version, setVersion] = useState(0);
  const [list, setList] = useState<{ v: number; rows: TeamMember[]; error?: string }>({ v: -1, rows: [] });
  const [search, setSearch] = useState('');

  const [form, setForm] = useState<FormState | null>(null);
  const [photo, setPhoto] = useState<{ file: File; preview: string } | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toDelete, setToDelete] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const photoInputId = useId();

  useEffect(() => {
    let active = true;
    api<TeamMember[]>('/api/admin/team-members').then(
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

  const groups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ROLES.map((info) => {
      const all = rows.filter((m) => m.role === info.role).sort(byOrder);
      const shown = q ? all.filter((m) => [m.name, m.position, m.function_description].some((v) => v?.toLowerCase().includes(q))) : all;
      return { ...info, all, shown };
    });
  }, [rows, search]);

  const activePresidents = rows.filter((m) => m.role === 'presidente' && m.is_active).length;

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => (f ? { ...f, [key]: value } : f));

  const clearPhoto = () => {
    if (photo) URL.revokeObjectURL(photo.preview);
    setPhoto(null);
  };

  const openForm = (member?: TeamMember, role: Role = 'diretor') => {
    clearPhoto();
    setPhotoError(null);
    if (member) {
      setForm({
        id: member.id,
        name: member.name,
        role: member.role,
        position: member.position,
        photo_url: member.photo_url ?? '',
        bio: member.bio ?? '',
        contribution: member.contribution ?? '',
        function_description: member.function_description ?? '',
        display_order: member.display_order,
        is_active: member.is_active,
      });
    } else {
      const sameRole = rows.filter((m) => m.role === role);
      setForm({
        name: '',
        role,
        position: roleInfo(role).position,
        photo_url: '',
        bio: '',
        contribution: '',
        function_description: '',
        display_order: sameRole.length ? Math.max(...sameRole.map((m) => m.display_order)) + 1 : 0,
        is_active: true,
      });
    }
  };

  const closeForm = () => {
    if (isSaving) return;
    clearPhoto();
    setForm(null);
  };

  const pickPhoto = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Escolha uma imagem (JPG, PNG ou WebP).');
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setPhotoError(`Imagem muito grande. Máximo: ${MAX_PHOTO_MB} MB.`);
      return;
    }
    setPhotoError(null);
    if (photo) URL.revokeObjectURL(photo.preview);
    setPhoto({ file, preview: URL.createObjectURL(file) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setIsSaving(true);
    try {
      let photoUrl = form.photo_url;
      if (photo) {
        const body = new FormData();
        body.append('file', photo.file);
        body.append('bucket', 'team-photos');
        body.append('folder', 'photos');
        const uploaded = await api<{ url?: string }>('/api/upload', { method: 'POST', body });
        if (!uploaded.url) throw new Error('O envio da foto não retornou o endereço.');
        photoUrl = uploaded.url;
      }
      const payload = toPayload({ ...form, photo_url: photoUrl });
      await api('/api/admin/team-members', jsonInit(form.id ? 'PUT' : 'POST', form.id ? { id: form.id, ...payload } : payload));
      toast.success(form.id ? 'Membro atualizado.' : 'Membro cadastrado.');
      clearPhoto();
      setForm(null);
      reload();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (member: TeamMember) => {
    setBusyId(member.id);
    try {
      await api('/api/admin/team-members', jsonInit('PUT', { id: member.id, ...toPayload({ ...member, is_active: !member.is_active }) }));
      setList((l) => ({ ...l, rows: l.rows.map((r) => (r.id === member.id ? { ...r, is_active: !member.is_active } : r)) }));
      toast.success(member.is_active ? `${member.name} foi ocultado(a) do site.` : `${member.name} agora aparece no site.`);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  /** Troca com o vizinho e renumera o grupo (0, 1, 2…); só envia quem mudou de posição */
  const move = async (member: TeamMember, direction: -1 | 1) => {
    const group = rows.filter((m) => m.role === member.role).sort(byOrder);
    const index = group.findIndex((m) => m.id === member.id);
    const target = index + direction;
    if (target < 0 || target >= group.length) return;
    [group[index], group[target]] = [group[target], group[index]];
    const changed = group.map((m, i) => ({ id: m.id, display_order: i })).filter((it) => group.find((m) => m.id === it.id)!.display_order !== it.display_order);
    const previous = rows;
    const orderOf = new Map(changed.map((it) => [it.id, it.display_order]));
    setList((l) => ({ ...l, rows: l.rows.map((r) => (orderOf.has(r.id) ? { ...r, display_order: orderOf.get(r.id)! } : r)) }));
    setBusyId(member.id);
    try {
      await api('/api/admin/team-members', jsonInit('PATCH', { items: changed }));
    } catch (error) {
      setList((l) => ({ ...l, rows: previous }));
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await api(`/api/admin/team-members?id=${toDelete.id}`, { method: 'DELETE' });
      setList((l) => ({ ...l, rows: l.rows.filter((r) => r.id !== toDelete.id) }));
      toast.success('Membro excluído.');
      setToDelete(null);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const previewSrc = photo?.preview || form?.photo_url || null;
  const searching = search.trim() !== '';

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="Diretoria e equipe"
        description="Quem aparece na página Diretoria do site, separado por função. Use as setas para definir a ordem."
        actions={
          <>
            <a href="/institucional/diretoria" target="_blank" rel="noopener noreferrer" className={buttonClass('secondary')}>
              <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5" />
              Ver no site
              <span className="sr-only">(abre em nova aba)</span>
            </a>
            <Button icon={FaPlus} onClick={() => openForm()}>
              Novo membro
            </Button>
          </>
        }
      />

      {/* Resumo por função + busca */}
      <AdminCard className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:flex lg:flex-wrap" aria-label="Membros por função">
          {groups.map(({ role, plural, icon: Icon, tile, all }) => (
            <li key={role} className="flex items-center gap-2.5">
              <span className={cx('flex size-9 shrink-0 items-center justify-center rounded-xl', tile)}>
                <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block text-lg font-black text-gray-900 tabular-nums">{isLoading || (list.error && rows.length === 0) ? '–' : all.length}</span>
                <span className="block truncate text-xs font-medium text-gray-500">{plural}</span>
              </span>
            </li>
          ))}
        </ul>
        <SearchInput label="Buscar por nome ou cargo" placeholder="Buscar por nome ou cargo…" value={search} onChange={setSearch} className="xl:w-72 xl:shrink-0" />
      </AdminCard>

      {list.error && rows.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={FaExclamationTriangle}
            title="Não foi possível carregar a diretoria"
            description={list.error}
            action={<Button icon={FaRedo} onClick={reload}>Tentar novamente</Button>}
          />
        </AdminCard>
      ) : (
        groups
          .filter((g) => !searching || g.shown.length > 0)
          .map(({ role, label, plural, icon: Icon, tile, description, all, shown }) => (
            <AdminSection
              key={role}
              title={`${plural} (${all.length})`}
              description={
                role === 'presidente' && activePresidents > 1
                  ? 'Atenção: há mais de um presidente visível. O site mostra só o primeiro da lista.'
                  : description
              }
              flush
              actions={
                <Button variant="secondary" size="sm" icon={FaPlus} onClick={() => openForm(undefined, role)}>
                  Adicionar
                </Button>
              }
            >
              {isLoading ? (
                <ul aria-hidden="true" className="divide-y divide-gray-100">
                  {[0, 1].map((i) => (
                    <li key={i} className="flex items-center gap-4 px-4 py-4 sm:px-6">
                      <span className="aspect-4/5 w-12 animate-pulse rounded-xl bg-gray-100" />
                      <span className="flex-1 space-y-2">
                        <span className="block h-4 w-1/3 animate-pulse rounded bg-gray-100" />
                        <span className="block h-3 w-1/4 animate-pulse rounded bg-gray-100" />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : shown.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-left">
                  <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-xl', tile)}>
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <p className="text-sm text-gray-500">Nenhum(a) {label.toLowerCase()} cadastrado(a).</p>
                </div>
              ) : (
                <ol className="divide-y divide-gray-100">
                  {shown.map((m) => {
                    const index = all.findIndex((x) => x.id === m.id);
                    return (
                      <li key={m.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3.5 sm:flex-nowrap sm:px-6">
                        <div className="flex min-w-0 flex-1 basis-full items-center gap-4 sm:basis-auto">
                          <span aria-hidden="true" className="hidden w-5 shrink-0 text-center text-xs font-bold text-gray-500 tabular-nums sm:block">
                            {index + 1}
                          </span>
                          <Photo src={m.photo_url} name={m.name} className={cx('w-12', !m.is_active && 'opacity-50 grayscale')} />
                          <div className="min-w-0 flex-1">
                            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className={cx('font-semibold', m.is_active ? 'text-gray-900' : 'text-gray-500')}>{m.name}</span>
                              {!m.is_active && <StatusBadge variant="neutral">Oculto no site</StatusBadge>}
                              {!m.photo_url && <StatusBadge variant="warning">Sem foto</StatusBadge>}
                            </p>
                            <p className="text-sm text-gray-600">{m.position}</p>
                            {m.function_description && m.function_description !== m.position && (
                              <p className="line-clamp-1 text-xs text-gray-500">{m.function_description}</p>
                            )}
                          </div>
                        </div>
                        <div className="ml-auto flex shrink-0 items-center gap-1">
                          {!searching && all.length > 1 && (
                            <>
                              <IconButton icon={FaArrowUp} label={`Mover ${m.name} para cima`} onClick={() => move(m, -1)} disabled={index === 0 || busyId !== null} />
                              <IconButton icon={FaArrowDown} label={`Mover ${m.name} para baixo`} onClick={() => move(m, 1)} disabled={index === all.length - 1 || busyId !== null} />
                              <span aria-hidden="true" className="mx-1 h-6 w-px bg-gray-200" />
                            </>
                          )}
                          <IconButton
                            icon={m.is_active ? FaEyeSlash : FaEye}
                            label={m.is_active ? `Ocultar ${m.name} do site` : `Mostrar ${m.name} no site`}
                            onClick={() => toggleActive(m)}
                            disabled={busyId === m.id}
                          />
                          <IconButton icon={FaEdit} label={`Editar ${m.name}`} onClick={() => openForm(m)} />
                          <IconButton icon={FaTrash} variant="danger" label={`Excluir ${m.name}`} onClick={() => setToDelete(m)} />
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </AdminSection>
          ))
      )}

      {!isLoading && searching && groups.every((g) => g.shown.length === 0) && (
        <AdminCard>
          <EmptyState
            title="Ninguém encontrado"
            description={`Nenhum membro com "${search.trim()}" no nome ou cargo.`}
            action={<Button variant="secondary" onClick={() => setSearch('')}>Limpar busca</Button>}
          />
        </AdminCard>
      )}

      <Modal isOpen={!!form} onClose={closeForm} title={form?.id ? 'Editar membro' : 'Novo membro'}>
        {form && (
          <form onSubmit={handleSave} className="space-y-5">
            {/* Foto */}
            <div className="flex flex-col gap-4 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-200/80 sm:flex-row sm:items-center">
              <Photo src={previewSrc} name={form.name || 'novo membro'} className="w-28 self-center bg-white sm:self-auto" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-700">Foto</p>
                <p id={`${photoInputId}-hint`} className="mt-1 text-xs leading-relaxed text-gray-500">
                  Foto vertical (proporção 4:5, ex.: 800 × 1000 px), com o rosto no terço de cima e fundo neutro. O site recorta as
                  sobras pelas laterais e pela base, como na prévia.
                </p>
                <ImageRightsNotice id={`${photoInputId}-rights`} className="mt-1" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <label
                    htmlFor={photoInputId}
                    className={cx(
                      buttonClass('secondary', 'sm'),
                      'cursor-pointer has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-[#0066cc]'
                    )}
                  >
                    <FaCamera aria-hidden="true" className="h-3.5 w-3.5" />
                    {previewSrc ? 'Trocar foto' : 'Enviar foto'}
                    <input
                      id={photoInputId}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      aria-describedby={`${photoInputId}-hint ${photoInputId}-rights`}
                      onChange={(e) => {
                        pickPhoto(e.target.files?.[0]);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {previewSrc && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={FaTrash}
                      className="text-red-700 hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        clearPhoto();
                        setField('photo_url', '');
                      }}
                    >
                      Remover
                    </Button>
                  )}
                </div>
                {photoError && (
                  <p role="alert" className="mt-2 text-sm font-medium text-red-700">
                    {photoError}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Nome" required>
                <Input value={form.name} onChange={(e) => setField('name', e.target.value)} required maxLength={120} autoComplete="off" />
              </FormField>
              <FormField label="Função na página" required>
                <Select value={form.role} onChange={(e) => setField('role', e.target.value as Role)}>
                  {ROLES.map((r) => (
                    <option key={r.role} value={r.role}>
                      {r.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Cargo" required hint="Ex.: Diretor Financeiro, Secretária, Atendente.">
                <Input value={form.position} onChange={(e) => setField('position', e.target.value)} required maxLength={120} />
              </FormField>
              <FormField label="Atribuição" hint="Opcional. Frase curta sobre o que faz.">
                <Input value={form.function_description} onChange={(e) => setField('function_description', e.target.value)} maxLength={200} />
              </FormField>
              {form.role === 'presidente' && (
                <FormField label="Biografia" className="sm:col-span-2">
                  <Textarea value={form.bio} onChange={(e) => setField('bio', e.target.value)} rows={4} maxLength={2000} />
                </FormField>
              )}
              <FormField label="Contribuição" className="sm:col-span-2" hint="Opcional. Aparece no cartão do membro no site.">
                <Textarea value={form.contribution} onChange={(e) => setField('contribution', e.target.value)} rows={3} maxLength={1000} />
              </FormField>
            </div>

            <Checkbox label="Visível no site" checked={form.is_active} onChange={(e) => setField('is_active', e.target.checked)} />

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={closeForm} disabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" loading={isSaving}>
                {isSaving ? (photo ? 'Enviando foto…' : 'Salvando…') : form.id ? 'Salvar alterações' : 'Cadastrar membro'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir membro"
        message={`Excluir ${toDelete?.name ?? ''} da diretoria? Para só tirar do site, use "Ocultar". Esta ação não pode ser desfeita.`}
        type="delete"
        confirmText="Sim, excluir"
        isLoading={isDeleting}
      />
    </div>
  );
}
