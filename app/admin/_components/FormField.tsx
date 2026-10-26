'use client';

import React, { createContext, useContext, useId, useState } from 'react';
import Image from 'next/image';
import { FaChevronDown, FaCloudUploadAlt, FaExclamationCircle, FaSyncAlt, FaTrash, FaUserShield } from 'react-icons/fa';
import { isOptimizableImage } from '@/lib/images';
import { cx, focusRing } from './styles';

/**
 * Campos de formulário do painel.
 *
 * ```tsx
 * <FormField label="Título" required error={errors.title} hint="Até 150 caracteres">
 *   <Input name="title" value={title} onChange={...} required maxLength={150} />
 * </FormField>
 * ```
 * O FormField liga rótulo, dica e erro ao campo (id, aria-describedby, aria-invalid) automaticamente.
 * Para marcação própria, use `fieldClass` direto no <input>.
 */

/** Classe base de input/select/textarea (texto 16px no celular evita o zoom do iOS). */
export const fieldClass = cx(
  'block w-full min-h-11 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-base text-gray-900 placeholder:text-gray-400',
  'shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,box-shadow] duration-200',
  'hover:border-gray-400 focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/15 focus:outline-none',
  'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
  'aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/15 sm:text-sm'
);

interface FieldContextValue {
  id: string;
  describedBy?: string;
  invalid: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

function useFieldProps(id?: string, describedBy?: string, invalid?: boolean) {
  const ctx = useContext(FieldContext);
  return {
    id: id ?? ctx?.id,
    'aria-describedby': [describedBy, ctx?.describedBy].filter(Boolean).join(' ') || undefined,
    'aria-invalid': (invalid ?? ctx?.invalid) ? true : undefined,
  };
}

interface FormFieldProps {
  label: React.ReactNode;
  /** id do campo (gerado se omitido) */
  id?: string;
  /** Só mostra o asterisco; passe `required` também ao campo */
  required?: boolean;
  hint?: React.ReactNode;
  error?: string | null;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, id, required, hint, error, className, children }: FormFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx('min-w-0', className)}>
      <label htmlFor={fieldId} className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-red-600">
            *
          </span>
        )}
      </label>
      <FieldContext value={{ id: fieldId, describedBy, invalid: Boolean(error) }}>{children}</FieldContext>
      {error && (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-700">
          <FaExclamationCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
}

type InvalidProp = { invalid?: boolean };

export function Input({ id, invalid, className, 'aria-describedby': describedBy, ...props }: React.ComponentProps<'input'> & InvalidProp) {
  return <input {...useFieldProps(id, describedBy, invalid)} {...props} className={cx(fieldClass, className)} />;
}

export function Textarea({ id, invalid, className, 'aria-describedby': describedBy, ...props }: React.ComponentProps<'textarea'> & InvalidProp) {
  return <textarea rows={4} {...useFieldProps(id, describedBy, invalid)} {...props} className={cx(fieldClass, 'min-h-24 resize-y', className)} />;
}

export function Select({ id, invalid, className, children, 'aria-describedby': describedBy, ...props }: React.ComponentProps<'select'> & InvalidProp) {
  return (
    <div className="relative">
      <select {...useFieldProps(id, describedBy, invalid)} {...props} className={cx(fieldClass, 'cursor-pointer appearance-none pr-10', className)}>
        {children}
      </select>
      <FaChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3.5 h-3 w-3 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

interface CheckboxProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  label: React.ReactNode;
  description?: React.ReactNode;
}

/** Caixa de seleção com rótulo clicável (alvo de 44px). */
export function Checkbox({ label, description, id, className, ...props }: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <label htmlFor={inputId} className={cx('flex min-h-11 cursor-pointer items-start gap-3 py-2.5', className)}>
      <input
        type="checkbox"
        id={inputId}
        className={cx('mt-0.5 size-5 shrink-0 cursor-pointer rounded-md accent-[#003f7f]', focusRing)}
        {...props}
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-gray-800">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-gray-500">{description}</span>}
      </span>
    </label>
  );
}

/**
 * Lembrete de direito de imagem (LGPD e Código Civil, art. 20) para os campos de envio de imagem.
 * className substitui a margem de cima padrão (mt-1.5): cx não resolve conflito de classes, as duas ficariam juntas.
 */
export function ImageRightsNotice({ id, className }: { id?: string; className?: string }) {
  return (
    <p id={id} className={cx(className ?? 'mt-1.5', 'flex items-start gap-1.5 text-xs text-gray-500')}>
      <FaUserShield aria-hidden="true" className="mt-px h-3 w-3 shrink-0 text-gray-400" />
      <span>Use só imagens próprias ou autorizadas. Fotos com pessoas identificáveis precisam de autorização de uso de imagem.</span>
    </p>
  );
}

interface ImageUploadFieldProps {
  label: React.ReactNode;
  /** URL da imagem atual (Storage, link externo ou blob: de pré-visualização) */
  value?: string | null;
  /** Arquivo escolhido (clique ou arrastar). O envio fica com a página (fetchWithCSRF('/api/upload')). */
  onSelect: (file: File) => void;
  onRemove?: () => void;
  uploading?: boolean;
  accept?: string;
  required?: boolean;
  hint?: React.ReactNode;
  error?: string | null;
  /** Proporção da pré-visualização (padrão 16/9) */
  aspect?: 'video' | 'square' | 'wide' | 'portrait';
  /** Lembrete de direito de imagem (padrão: true). Desligue no 2º campo de imagem do mesmo formulário. */
  rightsNotice?: boolean;
  id?: string;
  className?: string;
}

const ASPECT = { video: 'aspect-video', square: 'aspect-square max-w-xs', wide: 'aspect-[21/9]', portrait: 'aspect-[4/5] max-w-[220px]' };

/** Campo de imagem: área de soltar/clicar, pré-visualização, trocar e remover. */
export function ImageUploadField({
  label,
  value,
  onSelect,
  onRemove,
  uploading = false,
  accept = 'image/*',
  required,
  hint = 'PNG, JPG ou WebP.',
  error,
  aspect = 'video',
  rightsNotice = true,
  id,
  className,
}: ImageUploadFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const labelId = `${inputId}-label`;
  const rightsId = `${inputId}-rights`;
  const [dragging, setDragging] = useState(false);

  const pick = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onSelect(file);
  };

  const input = (
    <input
      id={inputId}
      type="file"
      accept={accept}
      className="sr-only"
      disabled={uploading}
      // Sem imagem, o nome do campo vem do rótulo; com imagem, do botão "Trocar imagem" que envolve o input
      aria-labelledby={value ? undefined : labelId}
      aria-describedby={[error ? errorId : '', hint ? hintId : '', rightsNotice ? rightsId : ''].filter(Boolean).join(' ') || undefined}
      aria-invalid={error ? true : undefined}
      onChange={(e) => {
        pick(e.target.files);
        e.target.value = ''; // permite escolher o mesmo arquivo de novo
      }}
    />
  );

  return (
    <div className={cx('min-w-0', className)}>
      <p id={labelId} className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-red-600">
            *
          </span>
        )}
      </p>

      {value ? (
        <div className="space-y-3">
          <div className={cx('relative w-full overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200', ASPECT[aspect])}>
            <Image src={value} alt="Pré-visualização da imagem" fill sizes="(min-width: 768px) 480px, 100vw" className="object-cover" unoptimized={!isOptimizableImage(value)} />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold text-[#003f7f]" role="status">
                Enviando…
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <label
              htmlFor={inputId}
              className={cx(
                'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#003f7f] ring-1 ring-inset ring-gray-300 hover:ring-[#003f7f]/40 pointer-fine:min-h-9',
                'has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-[#0066cc]',
                uploading && 'pointer-events-none opacity-50'
              )}
            >
              <FaSyncAlt aria-hidden="true" className="h-3.5 w-3.5" />
              Trocar imagem
              {input}
            </label>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                disabled={uploading}
                className={cx(
                  'inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50 pointer-fine:min-h-9',
                  focusRing
                )}
              >
                <FaTrash aria-hidden="true" className="h-3.5 w-3.5" />
                Remover
              </button>
            )}
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (!uploading) pick(e.dataTransfer.files);
          }}
          className={cx(
            'flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors',
            'has-[input:focus-visible]:border-[#0066cc] has-[input:focus-visible]:ring-4 has-[input:focus-visible]:ring-[#0066cc]/15',
            dragging ? 'border-[#0066cc] bg-[#0066cc]/5' : error ? 'border-red-400 bg-red-50/40' : 'border-gray-300 bg-gray-50/60 hover:border-[#003f7f]/40 hover:bg-[#003f7f]/[0.03]',
            uploading && 'pointer-events-none opacity-60'
          )}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#003f7f] ring-1 ring-gray-200">
            <FaCloudUploadAlt aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold text-gray-800">
            {uploading ? 'Enviando…' : (
              <>
                <span className="text-[#0052a3] underline-offset-2 hover:underline">Clique para enviar</span> ou arraste a imagem
              </>
            )}
          </span>
          {input}
        </label>
      )}

      {error && (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-700">
          <FaExclamationCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-gray-500">
          {hint}
        </p>
      )}
      {rightsNotice && <ImageRightsNotice id={rightsId} className={hint ? 'mt-1' : undefined} />}
    </div>
  );
}
