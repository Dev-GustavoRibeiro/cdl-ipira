'use client';

import React, { useId, useState } from 'react';
import { FaTimes, FaSpinner, FaCheckCircle, FaExclamationCircle, FaTicketAlt } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { useIsClient, useModalBehavior } from '@/lib/hooks/useModalBehavior';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: number;
    title: string;
    attendees?: number;
  } | null;
}

/* Casca padrão dos modais do site (mesmas classes em NewsModal, EventModal e JobModal).
   z-110: abre por cima do modal do evento. */
const OVERLAY = 'fixed inset-0 z-110 flex items-end justify-center sm:items-center sm:p-6';
const BACKDROP = 'absolute inset-0 bg-[#001a3d]/70 backdrop-blur-sm transition-opacity duration-300 starting:opacity-0 motion-reduce:transition-none';
const PANEL = 'relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_-24px_60px_-24px_rgba(0,26,61,0.55)] outline-none transition-[opacity,translate,scale] duration-300 ease-out starting:translate-y-full sm:max-h-[90dvh] sm:rounded-3xl sm:shadow-[0_40px_100px_-30px_rgba(0,26,61,0.7)] sm:starting:translate-y-4 sm:starting:scale-[0.97] sm:starting:opacity-0 motion-reduce:transition-none';
const CLOSE = 'absolute top-3 right-3 z-30 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#003f7f] shadow-[0_8px_20px_-8px_rgba(0,26,61,0.6)] ring-1 ring-black/5 backdrop-blur-md transition-[scale,background-color] duration-200 hover:scale-105 hover:bg-white active:scale-95 motion-reduce:hover:scale-100 sm:top-4 sm:right-4';
const FOOTER = 'flex shrink-0 items-center gap-3 border-t border-gray-100 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8';
const BTN_PRIMARY = 'inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#003f7f] to-[#0066cc] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,box-shadow,opacity] duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 motion-reduce:hover:translate-y-0';
const BTN_SECONDARY = 'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[#003f7f] ring-1 ring-gray-200 transition-[background-color,scale] duration-200 hover:bg-gray-50 active:scale-[0.98]';

const inputClass = (invalid: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 transition-[border-color,box-shadow] duration-200 focus:ring-4 focus:outline-none ${
    invalid ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : 'border-gray-200 hover:border-gray-300 focus:border-[#003f7f] focus:ring-[#003f7f]/15'
  }`;

// Máscara de CPF: 000.000.000-00
function maskCPF(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// Máscara de telefone: (00) 0000-0000 ou (00) 00000-0000
function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  const split = d.length === 11 ? 7 : 6;
  return `(${d.slice(0, 2)}) ${d.slice(2, split)}-${d.slice(split)}`;
}

type FormFields = { name: string; email: string; cpf: string; phone: string; company: string };
type FieldName = keyof FormFields;

// Mesmas regras básicas da API (/api/eventos/register), para avisar antes de enviar
function validate(data: FormFields): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (data.name.trim().length < 3) errors.name = 'Informe seu nome completo.';
  if (data.cpf.replace(/\D/g, '').length !== 11) errors.cpf = 'Informe os 11 dígitos do CPF.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Informe um e-mail válido.';
  if (data.phone.replace(/\D/g, '').length < 10) errors.phone = 'Informe o telefone com DDD.';
  return errors;
}

const FIELD_ORDER: FieldName[] = ['name', 'cpf', 'phone', 'email'];

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

/** Rótulo + campo + mensagem (erro tem prioridade sobre a dica). Os ids de erro/dica são `${id}-error`/`${id}-hint`. */
function Field({ id, label, optional, error, hint, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-gray-800">
        {label}
        {optional ? <span className="ml-1 font-medium text-gray-500">(opcional)</span> : <span className="ml-0.5 text-[#003f7f]" aria-hidden="true">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600">
          <FaExclamationCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && <p id={`${id}-hint`} className="mt-1.5 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
}

export default function RegistrationModal({ isOpen, onClose, event }: RegistrationModalProps) {
  const isClient = useIsClient();

  if (!isClient || !isOpen || !event) return null;

  // O formulário só existe enquanto o modal está aberto: ao fechar, os dados são descartados
  return createPortal(<RegistrationDialog onClose={onClose} event={event} />, document.body);
}

function RegistrationDialog({ onClose, event }: { onClose: () => void; event: NonNullable<RegistrationModalProps['event']> }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormFields>({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    company: ''
  });
  // Erros aparecem depois que o campo perde o foco ou na tentativa de envio
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const id = useId();
  const dialogRef = useModalBehavior<HTMLDivElement>(true, onClose);

  const errors = validate(formData);
  const errorFor = (field: FieldName) => (touched[field] ? errors[field] : undefined);

  // Props comuns de cada campo: valor, máscara, acessibilidade do erro/dica
  const fieldProps = (field: FieldName, mask?: (value: string) => string, hasHint = false) => {
    const error = errorFor(field);
    return {
      id: `${id}-${field}`,
      name: field,
      value: formData[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [field]: mask ? mask(e.target.value) : e.target.value }),
      onBlur: () => setTouched((prev) => ({ ...prev, [field]: true })),
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `${id}-${field}-error` : hasHint ? `${id}-${field}-hint` : undefined,
      className: inputClass(!!error),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
    if (firstInvalid) {
      setTouched({ name: true, cpf: true, phone: true, email: true });
      document.getElementById(`${id}-${firstInvalid}`)?.focus();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/eventos/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: event.id,
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          phone: formData.phone,
          company: formData.company
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setIsSuccess(true);
        toast.success('Inscrição realizada com sucesso!');
      } else if (response.status === 409) {
        toast.error('Você já está inscrito neste evento!');
      } else {
        // Erros de validação (4xx) trazem uma mensagem amigável do servidor
        toast.error(response.status < 500 && typeof data.error === 'string' ? data.error : 'Erro ao realizar inscrição. Tente novamente.');
      }
    } catch {
      toast.error('Não foi possível enviar sua inscrição. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={OVERLAY}>
      <div aria-hidden="true" className={BACKDROP} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-busy={isLoading || undefined}
        tabIndex={-1}
        className={`${PANEL} sm:max-w-xl`}
      >
        <button type="button" onClick={onClose} aria-label="Fechar" className={CLOSE}>
          <FaTimes className="h-4 w-4" aria-hidden="true" />
        </button>

        {isSuccess ? (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-12 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center sm:px-10 sm:pt-14 sm:pb-12">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#00a859]/10 text-[#00a859] ring-8 ring-[#00a859]/5 transition-[scale,opacity] duration-500 ease-out starting:scale-50 starting:opacity-0 motion-reduce:transition-none">
              <FaCheckCircle className="h-9 w-9" aria-hidden="true" />
            </span>
            <h2 id={`${id}-title`} className="mt-6 text-2xl font-black tracking-tight text-balance text-[#003f7f] sm:text-3xl">
              Inscrição confirmada!
            </h2>
            <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" aria-hidden="true" />
            <p className="mx-auto mt-5 max-w-[42ch] text-gray-600">
              Sua presença no evento <strong className="font-bold text-[#003f7f]">{event.title}</strong> foi registrada com sucesso.
            </p>
            {/* O botão de envio some ao confirmar: o foco vai para cá para não cair fora do diálogo */}
            <button type="button" onClick={onClose} autoFocus className={`${BTN_PRIMARY} mt-8 w-full sm:w-auto sm:min-w-48`}>
              Concluir
            </button>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="px-5 pt-7 sm:px-8 sm:pt-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold tracking-[0.14em] text-[#003f7f] uppercase shadow-sm">
                  <FaTicketAlt aria-hidden="true" />
                  Inscrição
                </span>
                <h2 id={`${id}-title`} className="mt-4 text-3xl leading-[1.1] font-black tracking-tight text-balance text-[#003f7f]">
                  Inscreva-se
                </h2>
                <div className="mt-4 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" aria-hidden="true" />
                <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-gray-600 sm:text-base">
                  Preencha seus dados para participar do evento <strong className="font-bold text-[#003f7f]">{event.title}</strong>.
                </p>
              </div>

              <form id={`${id}-form`} onSubmit={handleSubmit} noValidate className="grid gap-x-4 gap-y-5 px-5 pt-7 pb-8 sm:grid-cols-2 sm:px-8">
                <Field id={`${id}-name`} label="Nome completo" error={errorFor('name')} className="sm:col-span-2">
                  <input {...fieldProps('name')} type="text" required autoComplete="name" placeholder="Seu nome completo" />
                </Field>

                <Field id={`${id}-cpf`} label="CPF" error={errorFor('cpf')} hint="Garante uma inscrição por pessoa.">
                  <input {...fieldProps('cpf', maskCPF, true)} type="text" inputMode="numeric" required autoComplete="off" placeholder="000.000.000-00" />
                </Field>

                <Field id={`${id}-phone`} label="Telefone/WhatsApp" error={errorFor('phone')}>
                  <input {...fieldProps('phone', maskPhone)} type="tel" inputMode="numeric" required autoComplete="tel" placeholder="(00) 00000-0000" />
                </Field>

                <Field id={`${id}-email`} label="E-mail" error={errorFor('email')}>
                  <input {...fieldProps('email')} type="email" required autoComplete="email" placeholder="seu@email.com" />
                </Field>

                <Field id={`${id}-company`} label="Empresa" optional>
                  <input {...fieldProps('company')} type="text" autoComplete="organization" placeholder="Nome da sua empresa" />
                </Field>
              </form>
            </div>

            <div className={FOOTER}>
              <button type="button" onClick={onClose} className={`${BTN_SECONDARY} max-sm:hidden sm:ml-auto`}>
                Cancelar
              </button>
              <button type="submit" form={`${id}-form`} disabled={isLoading} className={`${BTN_PRIMARY} flex-1 sm:flex-none`}>
                {isLoading && <FaSpinner className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
                {isLoading ? 'Confirmando inscrição...' : 'Confirmar inscrição'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
