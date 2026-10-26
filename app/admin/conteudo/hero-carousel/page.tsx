'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  FaArrowDown, FaArrowRight, FaArrowUp, FaCheck, FaDesktop, FaEdit, FaExclamationTriangle, FaExternalLinkAlt, FaEye,
  FaEyeSlash, FaImages, FaInfoCircle, FaMobileAlt, FaPlus, FaRedo, FaTrash,
} from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { isOptimizableImage } from '@/lib/images';
import {
  AdminCard, AdminPageHeader, Button, Checkbox, EmptyState, FormField, IconButton, ImageUploadField, Input, StatusBadge, Textarea,
  buttonClass, cardSurface, cx, focusRing,
} from '../../_components';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  gradient: string;
  accentColor: string;
  image: string;
  /** Imagem própria para celular (vertical). Vazio: o celular usa a imagem principal. */
  imageMobile: string;
  imagePosition: string;
  imageFit: string;
  pattern: string;
  order: number;
  isActive: boolean;
}

interface ApiSlide {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  gradient: string | null;
  accent_color: string | null;
  image: string | null;
  image_mobile: string | null;
  image_position: string | null;
  image_fit: string | null;
  pattern: string | null;
  order_index: number | null;
  is_active: boolean | null;
}

// Opções limitadas às cores da marca (a API recusa valores fora destas listas)
const GRADIENTS = [
  { value: 'from-[#003f7f] via-[#0052a3] to-[#0066cc]', label: 'Azul CDL' },
  { value: 'from-[#001a3d] via-[#002855] to-[#003f7f]', label: 'Marinho' },
  { value: 'from-[#00a859] via-[#00c46a] to-[#00d670]', label: 'Verde CDL' },
  { value: 'from-[#ffd000] via-[#ffda33] to-[#ffed4e]', label: 'Amarelo CDL' },
];
const DEFAULT_GRADIENT = GRADIENTS[0].value;

// Texto do botão segue a regra do site (HeroCarousel): fundo claro → texto azul; escuro → branco
const ACCENTS = [
  { value: 'bg-[#ffd000]', label: 'Amarelo (padrão)', text: 'text-[#003f7f]' },
  { value: 'bg-[#0066cc]', label: 'Azul', text: 'text-white' },
  { value: 'bg-[#00a859]', label: 'Verde', text: 'text-white' },
  { value: 'bg-white', label: 'Branco', text: 'text-[#003f7f]' },
];
const DEFAULT_ACCENT = ACCENTS[0].value;

const POSITIONS = [
  { value: 'left top', label: 'Canto superior esquerdo' },
  { value: 'top', label: 'Topo' },
  { value: 'right top', label: 'Canto superior direito' },
  { value: 'left', label: 'Esquerda' },
  { value: 'center', label: 'Centro' },
  { value: 'right', label: 'Direita' },
  { value: 'left bottom', label: 'Canto inferior esquerdo' },
  { value: 'bottom', label: 'Base' },
  { value: 'right bottom', label: 'Canto inferior direito' },
];

const FITS = [
  { value: 'cover', label: 'Preencher', hint: 'Cobre todo o banner; corta as sobras.' },
  { value: 'contain', label: 'Mostrar inteira', hint: 'Sem cortes; a cor de fundo aparece nas bordas.' },
];

const PATTERNS = [
  { value: '', label: 'Nenhuma' },
  { value: 'music', label: 'Música' },
  { value: 'business', label: 'Negócios' },
];

const ASSOCIE_SE_URL = 'https://app.higestor.com.br/inscricao/empresa/cdl-ipira';

const fromApi = (s: ApiSlide): Slide => ({
  id: s.id,
  title: s.title ?? '',
  subtitle: s.subtitle ?? '',
  description: s.description ?? '',
  buttonText: s.button_text ?? '',
  buttonLink: s.button_link ?? '',
  gradient: s.gradient ?? '',
  accentColor: s.accent_color ?? '',
  image: s.image ?? '',
  imageMobile: s.image_mobile ?? '',
  imagePosition: s.image_position || 'center',
  imageFit: s.image_fit || 'cover',
  pattern: s.pattern ?? '',
  order: s.order_index ?? 0,
  isActive: s.is_active !== false,
});

/** Troca valores antigos (cores fora da marca, "esticar", "original") pelos suportados. Retorna se algo mudou. */
function normalize(slide: Slide): { slide: Slide; changed: boolean } {
  const next = {
    ...slide,
    gradient: GRADIENTS.some((g) => g.value === slide.gradient) ? slide.gradient : DEFAULT_GRADIENT,
    accentColor: ACCENTS.some((a) => a.value === slide.accentColor) ? slide.accentColor : DEFAULT_ACCENT,
    imageFit: FITS.some((f) => f.value === slide.imageFit) ? slide.imageFit : 'cover',
    imagePosition: POSITIONS.some((p) => p.value === slide.imagePosition) ? slide.imagePosition : 'center',
    pattern: PATTERNS.some((p) => p.value === slide.pattern) ? slide.pattern : '',
  };
  // Vazio já era "padrão" (azul / amarelo): não conta como ajuste
  const changed =
    (!!slide.gradient && next.gradient !== slide.gradient) ||
    (!!slide.accentColor && next.accentColor !== slide.accentColor) ||
    // "none" o site já mostra como "cover": trocar não muda nada na tela
    next.imageFit !== (slide.imageFit === 'none' ? 'cover' : slide.imageFit) ||
    next.imagePosition !== slide.imagePosition ||
    next.pattern !== slide.pattern;
  return { slide: next, changed };
}

/** Mesma regra do site: caminho interno "/..." ou http(s) */
function checkLink(value: string): { ok: boolean; external: boolean } {
  const href = value.trim();
  if (!href) return { ok: true, external: false };
  if (href.startsWith('/') && !href.startsWith('//') && !/\s/.test(href)) return { ok: true, external: false };
  try {
    const url = new URL(href);
    return { ok: /^https?:$/.test(url.protocol) && !!url.hostname.includes('.'), external: true };
  } catch {
    return { ok: false, external: false };
  }
}

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
const byOrder = (a: Slide, b: Slide) => a.order - b.order || a.id - b.id;

/**
 * Prévia do slide como no site (HeroCarousel): fundo, imagem com ajuste/foco, véu azul do lado do texto,
 * etiqueta amarela, título, descrição e botões. Tamanhos por container query (acompanha a largura da prévia).
 */
function SlidePreview({ slide, device = 'desktop', className }: { slide: Slide; device?: 'desktop' | 'mobile'; className?: string }) {
  const accent = ACCENTS.find((a) => a.value === slide.accentColor) ?? ACCENTS[0];
  const link = checkLink(slide.buttonLink);
  const showCta = !!slide.buttonText.trim() && !!slide.buttonLink.trim() && link.ok;
  const mobile = device === 'mobile';
  // No celular vale a imagem própria do celular, quando houver (como no site)
  const image = (mobile && slide.imageMobile) || slide.image;
  return (
    <div aria-hidden="true" className={cx('@container relative isolate overflow-hidden bg-[#003f7f] select-none', className)}>
      <div className={cx('absolute inset-0 bg-linear-to-br', slide.gradient || DEFAULT_GRADIENT)} />
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 768px) 640px, 100vw"
          className={slide.imageFit === 'contain' ? 'object-contain' : 'object-cover'}
          style={{ objectPosition: slide.imagePosition || 'center' }}
          unoptimized={!isOptimizableImage(image)}
        />
      ) : (
        <>
          {slide.pattern && <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('/patterns/${slide.pattern}.svg')` }} />}
          <div className="absolute -top-1/4 -right-1/6 size-2/3 rounded-full bg-[#00a859]/25 blur-3xl" />
          <div className="absolute right-1/4 -bottom-1/3 size-1/2 rounded-full bg-[#ffd000]/15 blur-3xl" />
        </>
      )}
      <div
        className={cx(
          'absolute inset-0',
          mobile
            ? 'bg-linear-to-t from-[#003f7f]/95 via-[#003f7f]/60 to-[#003f7f]/10'
            : 'bg-linear-to-r from-[#003f7f]/90 via-[#003f7f]/55 via-40% to-transparent to-85%'
        )}
      />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/45 to-transparent" />

      <div className={cx('relative flex h-full flex-col p-[6cqw] text-white', mobile ? 'justify-end' : 'justify-center')}>
        <div className={cx(mobile ? 'max-w-full' : 'max-w-[62%]')}>
          {slide.subtitle && (
            <p className="mb-[2.5cqw] inline-flex max-w-full items-center gap-[1cqw] rounded-full bg-[#ffd000] px-[2.2cqw] py-[0.9cqw] text-[max(7px,2cqw)] leading-tight font-extrabold tracking-wider text-[#003f7f] uppercase">
              <span className="size-[1cqw] shrink-0 rounded-full bg-[#003f7f]" />
              <span className="truncate">{slide.subtitle}</span>
            </p>
          )}
          <p className={cx('leading-[1.02] font-black tracking-tight text-balance', mobile ? 'text-[10cqw]' : 'text-[5.6cqw]')}>
            {slide.title || 'Título do slide'}
          </p>
          {slide.description && (
            <p className={cx('mt-[2cqw] line-clamp-3 leading-snug text-white/90', mobile ? 'text-[4.2cqw]' : 'text-[2.1cqw]')}>{slide.description}</p>
          )}
          <div className="mt-[3.5cqw] flex flex-wrap items-center gap-[1.6cqw]">
            {showCta && (
              <span
                className={cx(
                  'inline-flex items-center gap-[1cqw] rounded-full font-extrabold',
                  mobile ? 'px-[4cqw] py-[2.4cqw] text-[3.8cqw]' : 'px-[2.6cqw] py-[1.4cqw] text-[1.9cqw]',
                  accent.value,
                  accent.text
                )}
              >
                {slide.buttonText}
                <FaArrowRight className="size-[0.9em]" />
              </span>
            )}
            {slide.buttonLink.trim() !== ASSOCIE_SE_URL && (
              <span
                className={cx(
                  'inline-flex items-center rounded-full border border-white/50 bg-white/5 font-extrabold',
                  mobile ? 'px-[4cqw] py-[2.4cqw] text-[3.8cqw]' : 'px-[2.6cqw] py-[1.4cqw] text-[1.9cqw]'
                )}
              >
                {mobile ? 'Associe-se' : 'Seja um associado'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Botão de escolha (cor, ajuste, foco): aria-pressed + marca de selecionado */
function ChoiceButton({ selected, label, onClick, className, children }: { selected: boolean; label: string; onClick: () => void; className?: string; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cx(
        'relative transition-[box-shadow,scale] duration-150 active:scale-95 motion-reduce:transition-none',
        selected ? 'ring-2 ring-[#003f7f] ring-offset-2' : 'ring-1 ring-gray-300 hover:ring-[#003f7f]/50',
        focusRing,
        className
      )}
    >
      {children}
      {selected && (
        <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-[#003f7f] text-white ring-2 ring-white">
          <FaCheck aria-hidden="true" className="size-2.5" />
        </span>
      )}
    </button>
  );
}

const EMPTY: Slide = {
  id: 0, title: '', subtitle: '', description: '', buttonText: 'Saiba mais', buttonLink: '', gradient: DEFAULT_GRADIENT,
  accentColor: DEFAULT_ACCENT, image: '', imageMobile: '', imagePosition: 'center', imageFit: 'cover', pattern: '', order: 0, isActive: true,
};

export default function AdminHeroCarouselPage() {
  const [version, setVersion] = useState(0);
  const [list, setList] = useState<{ v: number; rows: Slide[]; error?: string }>({ v: -1, rows: [] });

  const [form, setForm] = useState<Slide | null>(null);
  const [adjusted, setAdjusted] = useState(false);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  // Qual campo de imagem está enviando (a principal ou a do celular)
  const [uploading, setUploading] = useState<'image' | 'imageMobile' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Slide | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    api<ApiSlide[]>('/api/admin/hero').then(
      (rows) => active && setList({ v: version, rows: (rows || []).map(fromApi) }),
      (error) => active && setList((prev) => ({ v: version, rows: prev.rows, error: errorMessage(error) }))
    );
    return () => {
      active = false;
    };
  }, [version]);

  const reload = () => setVersion((v) => v + 1);
  const isLoading = list.v === -1;
  const slides = useMemo(() => [...list.rows].sort(byOrder), [list.rows]);
  const visibleCount = slides.filter((s) => s.isActive).length;

  const setField = <K extends keyof Slide>(key: K, value: Slide[K]) => setForm((f) => (f ? { ...f, [key]: value } : f));

  const openForm = (slide?: Slide) => {
    setDevice('desktop');
    if (slide) {
      const { slide: normalized, changed } = normalize(slide);
      setForm(normalized);
      setAdjusted(changed);
    } else {
      setForm({ ...EMPTY, order: slides.length ? Math.max(...slides.map((s) => s.order)) + 1 : 1 });
      setAdjusted(false);
    }
  };

  const link = checkLink(form?.buttonLink ?? '');
  const linkError = form && !link.ok ? 'Use um caminho do site começando com / (ex.: /eventos) ou um endereço completo com https://' : null;

  const uploadImage = async (file: File, field: 'image' | 'imageMobile') => {
    setUploading(field);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('bucket', 'heroes');
      const uploaded = await api<{ url?: string }>('/api/upload', { method: 'POST', body });
      if (!uploaded.url) throw new Error('O envio da imagem não retornou o endereço.');
      setField(field, uploaded.url);
      // Mostra na prévia o aparelho da imagem que acabou de chegar
      setDevice(field === 'imageMobile' ? 'mobile' : 'desktop');
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || linkError) return;
    setIsSaving(true);
    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      buttonText: form.buttonText.trim(),
      buttonLink: form.buttonLink.trim(),
      gradient: form.gradient,
      accentColor: form.accentColor,
      image: form.image,
      imageMobile: form.imageMobile,
      imagePosition: form.imagePosition,
      imageFit: form.imageFit,
      pattern: form.pattern,
      order: form.order,
      isActive: form.isActive,
    };
    try {
      await api('/api/admin/hero', jsonInit(form.id ? 'PUT' : 'POST', form.id ? { id: form.id, ...payload } : payload));
      toast.success(form.id ? 'Slide atualizado.' : 'Slide criado.');
      setForm(null);
      reload();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (slide: Slide) => {
    setBusyId(slide.id);
    try {
      await api('/api/admin/hero', jsonInit('PUT', { id: slide.id, isActive: !slide.isActive }));
      setList((l) => ({ ...l, rows: l.rows.map((r) => (r.id === slide.id ? { ...r, isActive: !slide.isActive } : r)) }));
      toast.success(slide.isActive ? 'Slide ocultado do site.' : 'Slide visível no site.');
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  /** Troca com o vizinho e renumera (1, 2, 3…); só envia quem mudou */
  const move = async (slide: Slide, direction: -1 | 1) => {
    const ordered = [...slides];
    const index = ordered.findIndex((s) => s.id === slide.id);
    const target = index + direction;
    if (target < 0 || target >= ordered.length) return;
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    const changed = ordered.map((s, i) => ({ id: s.id, order: i + 1, before: s.order })).filter((it) => it.order !== it.before);
    const previous = list.rows;
    const orderOf = new Map(changed.map((it) => [it.id, it.order]));
    setList((l) => ({ ...l, rows: l.rows.map((r) => (orderOf.has(r.id) ? { ...r, order: orderOf.get(r.id)! } : r)) }));
    setBusyId(slide.id);
    try {
      await api('/api/admin/hero', jsonInit('PATCH', { items: changed.map(({ id, order }) => ({ id, order })) }));
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
      await api(`/api/admin/hero?id=${toDelete.id}`, { method: 'DELETE' });
      setList((l) => ({ ...l, rows: l.rows.filter((r) => r.id !== toDelete.id) }));
      toast.success('Slide excluído.');
      setToDelete(null);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="Hero Carousel"
        breadcrumb={[{ label: 'Conteúdo do site', href: '/admin/conteudo' }, { label: 'Hero Carousel' }]}
        description="Banners do topo da página inicial. A prévia mostra cada slide como aparece no site."
        actions={
          <>
            <a href="/" target="_blank" rel="noopener noreferrer" className={buttonClass('secondary')}>
              <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5" />
              Ver no site
              <span className="sr-only">(abre em nova aba)</span>
            </a>
            <Button icon={FaPlus} onClick={() => openForm()}>
              Novo slide
            </Button>
          </>
        }
      />

      {!isLoading && slides.length > 0 && visibleCount === 0 && (
        <p className="flex items-start gap-2.5 rounded-2xl bg-[#ffd000]/20 px-4 py-3 text-sm text-[#003f7f] ring-1 ring-[#e6bb00]/50 ring-inset">
          <FaInfoCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          Nenhum slide está visível: o site mostra os dois banners padrão até você publicar um.
        </p>
      )}

      {isLoading ? (
        <ul aria-hidden="true" className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {[0, 1].map((i) => (
            <li key={i} className={cx(cardSurface, 'overflow-hidden')}>
              <div className="aspect-[16/7] animate-pulse bg-gray-100" />
              <div className="flex gap-3 p-4">
                <span className="h-5 w-24 animate-pulse rounded bg-gray-100" />
                <span className="ml-auto h-9 w-40 animate-pulse rounded-xl bg-gray-100" />
              </div>
            </li>
          ))}
        </ul>
      ) : slides.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={list.error ? FaExclamationTriangle : FaImages}
            title={list.error ? 'Não foi possível carregar os slides' : 'Nenhum slide cadastrado'}
            description={list.error ?? 'Sem slides, o site mostra dois banners padrão. Crie o primeiro para destacar campanhas e eventos.'}
            action={
              list.error ? (
                <Button icon={FaRedo} onClick={reload}>Tentar novamente</Button>
              ) : (
                <Button icon={FaPlus} onClick={() => openForm()}>Novo slide</Button>
              )
            }
          />
        </AdminCard>
      ) : (
        <ol className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {slides.map((slide, index) => {
            const target = checkLink(slide.buttonLink);
            return (
              <li key={slide.id} className={cx(cardSurface, 'flex min-w-0 flex-col overflow-hidden')}>
                <div className="relative">
                  <SlidePreview slide={normalize(slide).slide} className={cx('aspect-[16/7]', !slide.isActive && 'opacity-60 grayscale')} />
                  <span className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-bold text-[#003f7f] tabular-nums shadow-sm">
                    {index + 1}º
                  </span>
                </div>
                <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-3 p-4">
                  <div className="min-w-0 flex-1 basis-48">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-semibold text-gray-900">{slide.title}</span>
                      {slide.isActive ? <StatusBadge variant="success">Visível</StatusBadge> : <StatusBadge variant="neutral">Oculto</StatusBadge>}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {slide.buttonText && slide.buttonLink ? (
                        <>
                          Botão “{slide.buttonText}” → {slide.buttonLink}
                          {!target.ok && <span className="ml-1 font-semibold text-red-700">(link inválido)</span>}
                        </>
                      ) : (
                        'Sem botão'
                      )}
                    </p>
                  </div>
                  <div className="ml-auto flex shrink-0 items-center gap-1">
                    {slides.length > 1 && (
                      <>
                        <IconButton icon={FaArrowUp} label={`Mover "${slide.title}" para antes`} onClick={() => move(slide, -1)} disabled={index === 0 || busyId !== null} />
                        <IconButton icon={FaArrowDown} label={`Mover "${slide.title}" para depois`} onClick={() => move(slide, 1)} disabled={index === slides.length - 1 || busyId !== null} />
                      </>
                    )}
                    <IconButton
                      icon={slide.isActive ? FaEyeSlash : FaEye}
                      label={slide.isActive ? `Ocultar "${slide.title}" do site` : `Mostrar "${slide.title}" no site`}
                      onClick={() => toggleActive(slide)}
                      disabled={busyId === slide.id}
                    />
                    <IconButton icon={FaTrash} variant="danger" label={`Excluir "${slide.title}"`} onClick={() => setToDelete(slide)} />
                    <Button variant="secondary" size="sm" icon={FaEdit} onClick={() => openForm(slide)} aria-label={`Editar "${slide.title}"`}>
                      Editar
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <Modal isOpen={!!form} onClose={() => !isSaving && !uploading && setForm(null)} title={form?.id ? 'Editar slide' : 'Novo slide'}>
        {form && (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Prévia ao vivo */}
            <section aria-label="Prévia do slide" className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-700">Prévia</p>
                <div role="group" aria-label="Tamanho da prévia" className="inline-flex rounded-xl bg-gray-100 p-1">
                  {(
                    [
                      ['desktop', 'Computador', FaDesktop],
                      ['mobile', 'Celular', FaMobileAlt],
                    ] as const
                  ).map(([value, label, Icon]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={device === value}
                      onClick={() => setDevice(value)}
                      className={cx(
                        'inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors pointer-fine:min-h-8',
                        device === value ? 'bg-white text-[#003f7f] shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:text-gray-900',
                        focusRing
                      )}
                    >
                      <Icon aria-hidden="true" className="h-3 w-3" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-gray-100 p-2 ring-1 ring-gray-200">
                <SlidePreview
                  slide={form}
                  device={device}
                  className={cx('rounded-xl', device === 'desktop' ? 'aspect-[16/7] w-full' : 'mx-auto aspect-[375/520] w-full max-w-[240px]')}
                />
              </div>
              {adjusted && (
                <p className="flex items-start gap-2 rounded-xl bg-[#0066cc]/[0.07] px-3 py-2.5 text-xs text-[#0052a3]">
                  <FaInfoCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Algumas opções antigas (cores fora da identidade da CDL ou ajuste de imagem sem suporte) foram trocadas pelas
                  equivalentes. Confira a prévia e salve para aplicar.
                </p>
              )}
            </section>

            {/* Texto */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Título" required className="sm:col-span-2">
                <Input value={form.title} onChange={(e) => setField('title', e.target.value)} required maxLength={100} />
              </FormField>
              <FormField label="Etiqueta" hint="Faixa amarela acima do título. Opcional." className="sm:col-span-2">
                <Input value={form.subtitle} onChange={(e) => setField('subtitle', e.target.value)} maxLength={200} placeholder="Ex.: Comércio forte, cidade viva!" />
              </FormField>
              <FormField label="Descrição" hint={`${form.description.length}/500 · no celular aparecem até 3 linhas.`} className="sm:col-span-2">
                <Textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={3} maxLength={500} />
              </FormField>
              <FormField label="Texto do botão" hint="Sem texto ou sem link, o botão não aparece.">
                <Input value={form.buttonText} onChange={(e) => setField('buttonText', e.target.value)} maxLength={50} placeholder="Ex.: Saiba mais" />
              </FormField>
              <FormField
                label="Link do botão"
                error={linkError}
                hint={
                  !linkError && form.buttonLink.trim()
                    ? link.external
                      ? 'Endereço externo: abre em nova aba.'
                      : 'Página do próprio site.'
                    : 'Ex.: /imprensa/eventos ou https://…'
                }
              >
                <Input
                  value={form.buttonLink}
                  onChange={(e) => setField('buttonLink', e.target.value)}
                  maxLength={500}
                  inputMode="url"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="/pagina ou https://…"
                />
              </FormField>
            </div>

            {/* Imagem */}
            <div className="space-y-5 border-t border-gray-100 pt-6">
              <ImageUploadField
                label="Imagem de fundo"
                value={form.image || null}
                onSelect={(file) => uploadImage(file, 'image')}
                onRemove={() => setField('image', '')}
                uploading={uploading === 'image'}
                accept="image/png,image/jpeg,image/webp"
                aspect="wide"
                hint="JPG ou WebP, de preferência 1920 × 840 px. Sem imagem, o slide usa a cor de fundo escolhida abaixo."
              />

              <ImageUploadField
                label="Imagem para celular (opcional)"
                value={form.imageMobile || null}
                onSelect={(file) => uploadImage(file, 'imageMobile')}
                onRemove={() => setField('imageMobile', '')}
                uploading={uploading === 'imageMobile'}
                accept="image/png,image/jpeg,image/webp"
                aspect="portrait"
                rightsNotice={false}
                hint="Vertical, de preferência 1080 × 1350 px (4:5). Sem ela, o celular mostra a imagem de fundo acima. Use a prévia “Celular” para conferir."
              />

              {form.image && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_auto]">
                  <fieldset className="min-w-0">
                    <legend className="mb-1.5 text-sm font-semibold text-gray-700">Ajuste da imagem</legend>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {FITS.map((fit) => (
                        <button
                          key={fit.value}
                          type="button"
                          aria-pressed={form.imageFit === fit.value}
                          onClick={() => setField('imageFit', fit.value)}
                          className={cx(
                            'min-h-11 rounded-xl px-3.5 py-2.5 text-left transition-[background-color,box-shadow]',
                            form.imageFit === fit.value ? 'bg-[#003f7f]/[0.06] ring-2 ring-[#003f7f]' : 'bg-white ring-1 ring-gray-300 hover:ring-[#003f7f]/50',
                            focusRing
                          )}
                        >
                          <span className="block text-sm font-semibold text-gray-900">{fit.label}</span>
                          <span className="block text-xs text-gray-500">{fit.hint}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="mb-1.5 text-sm font-semibold text-gray-700">Ponto de foco</legend>
                    <div className="grid w-fit grid-cols-3 gap-1.5 rounded-xl bg-gray-100 p-1.5">
                      {POSITIONS.map((pos) => (
                        <button
                          key={pos.value}
                          type="button"
                          aria-pressed={form.imagePosition === pos.value}
                          aria-label={pos.label}
                          title={pos.label}
                          onClick={() => setField('imagePosition', pos.value)}
                          className={cx(
                            'flex size-11 items-center justify-center rounded-lg transition-colors pointer-fine:size-9',
                            form.imagePosition === pos.value ? 'bg-[#003f7f] text-white' : 'bg-white text-gray-400 hover:text-[#003f7f]',
                            focusRing
                          )}
                        >
                          <span aria-hidden="true" className={cx('size-2 rounded-full', form.imagePosition === pos.value ? 'bg-[#ffd000]' : 'bg-current')} />
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}
            </div>

            {/* Cores */}
            <div className="grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2">
              <fieldset>
                <legend className="mb-1 text-sm font-semibold text-gray-700">Cor de fundo</legend>
                <p className="mb-3 text-xs text-gray-500">{form.image ? 'Aparece nas bordas no modo “Mostrar inteira”.' : 'Fundo do slide sem imagem.'}</p>
                <div className="flex flex-wrap gap-3">
                  {GRADIENTS.map((g) => (
                    <ChoiceButton
                      key={g.value}
                      selected={form.gradient === g.value}
                      label={g.label}
                      onClick={() => setField('gradient', g.value)}
                      className={cx('size-11 rounded-xl bg-linear-to-br', g.value)}
                    />
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-1 text-sm font-semibold text-gray-700">Cor do botão</legend>
                <p className="mb-3 text-xs text-gray-500">{ACCENTS.find((a) => a.value === form.accentColor)?.label ?? 'Amarelo (padrão)'}</p>
                <div className="flex flex-wrap gap-3">
                  {ACCENTS.map((a) => (
                    <ChoiceButton
                      key={a.value}
                      selected={form.accentColor === a.value}
                      label={`Botão ${a.label.toLowerCase()}`}
                      onClick={() => setField('accentColor', a.value)}
                      className={cx('flex h-11 min-w-16 items-center justify-center rounded-full px-3 text-xs font-extrabold', a.value, a.text)}
                    >
                      Aa
                    </ChoiceButton>
                  ))}
                </div>
              </fieldset>
              {!form.image && (
                <fieldset className="sm:col-span-2">
                  <legend className="mb-1.5 text-sm font-semibold text-gray-700">Textura do fundo</legend>
                  <div role="group" className="inline-flex flex-wrap gap-2">
                    {PATTERNS.map((p) => (
                      <button
                        key={p.value || 'none'}
                        type="button"
                        aria-pressed={form.pattern === p.value}
                        onClick={() => setField('pattern', p.value)}
                        className={cx(
                          'inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold pointer-fine:min-h-9',
                          form.pattern === p.value ? 'bg-[#003f7f] text-white' : 'bg-white text-gray-600 ring-1 ring-gray-300 ring-inset hover:text-[#003f7f]',
                          focusRing
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}
            </div>

            <Checkbox label="Slide visível no site" checked={form.isActive} onChange={(e) => setField('isActive', e.target.checked)} />

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setForm(null)} disabled={isSaving || !!uploading}>
                Cancelar
              </Button>
              <Button type="submit" loading={isSaving} disabled={!!uploading || !!linkError}>
                {isSaving ? 'Salvando…' : form.id ? 'Salvar alterações' : 'Criar slide'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir slide"
        message={`Excluir o slide "${toDelete?.title ?? ''}"? Para só tirar do site, use "Ocultar". Esta ação não pode ser desfeita.`}
        type="delete"
        confirmText="Sim, excluir"
        isLoading={isDeleting}
      />
    </div>
  );
}
