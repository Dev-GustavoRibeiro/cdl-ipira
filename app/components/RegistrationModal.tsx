'use client';

import React, { useId, useState } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaMapMarkerAlt, FaSpinner, FaTicketAlt } from 'react-icons/fa';
import { HONEYPOT_FIELD, formGuardFields, stampFormOpenedAt } from '@/lib/form-guard';
import { ModalBody, ModalChip, ModalShell, ModalTitle, modalButton } from './Modal';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: number;
    title: string;
    attendees?: number;
    /** Opcionais: resumo do evento no topo do formulário */
    date?: string;
    time?: string;
    location?: string;
  } | null;
}

// Placeholder em gray-500: o gray-400 ficava abaixo de 4,5:1 sobre o branco (WCAG 1.4.3)
const inputClass = (invalid: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 sm:text-[15px] transition-[border-color,box-shadow] duration-200 focus:ring-4 focus:outline-none ${
    invalid ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : 'border-gray-200 hover:border-gray-300 focus:border-[#003f7f] focus:ring-[#003f7f]/15'
  }`;

// Máscara de telefone: (00) 0000-0000 ou (00) 00000-0000
function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  const split = d.length === 11 ? 7 : 6;
  return `(${d.slice(0, 2)}) ${d.slice(2, split)}-${d.slice(split)}`;
}

// Coleta mínima: sem CPF (só servia para barrar inscrição duplicada, o que o e-mail já faz)
type FormFields = { name: string; email: string; phone: string; company: string };
type FieldName = keyof FormFields;

// Mesmas regras básicas da API (/api/eventos/register), para avisar antes de enviar
function validate(data: FormFields): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (data.name.trim().length < 3) errors.name = 'Informe seu nome completo.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Informe um e-mail válido.';
  if (data.phone.replace(/\D/g, '').length < 10) errors.phone = 'Informe o telefone com DDD.';
  return errors;
}

const FIELD_ORDER: FieldName[] = ['name', 'phone', 'email'];
const EMPTY: FormFields = { name: '', email: '', phone: '', company: '' };

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
  // Cada abertura começa com o formulário vazio (a chave muda ao abrir; ao fechar o conteúdo fica para a saída animada)
  const [session, setSession] = useState(0);
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setSession((value) => value + 1);
  }
  const [shown, setShown] = useState(event);
  if (event && event !== shown) setShown(event);
  const item = event ?? shown;

  if (!item) return null;
  return <RegistrationDialog key={session} isOpen={isOpen && !!event} onClose={onClose} event={item} />;
}

type Status = 'idle' | 'sending' | 'success';

function RegistrationDialog({ isOpen, onClose, event }: { isOpen: boolean; onClose: () => void; event: NonNullable<RegistrationModalProps['event']> }) {
  const [formData, setFormData] = useState<FormFields>(EMPTY);
  // Erros aparecem depois que o campo perde o foco ou na tentativa de envio
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [submitError, setSubmitError] = useState('');
  const id = useId();
  const titleId = `${id}-title`;

  const errors = validate(formData);
  const errorFor = (field: FieldName) => (touched[field] ? errors[field] : undefined);
  // Com algo digitado, clique fora e puxar a folha não fecham (Esc, X e Cancelar continuam fechando)
  const isDirty = status !== 'success' && Object.values(formData).some((value) => value.trim());

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (status === 'sending') return;

    const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
    if (firstInvalid) {
      setTouched({ name: true, phone: true, email: true });
      const field = document.getElementById(`${id}-${firstInvalid}`);
      field?.focus({ preventScroll: true });
      field?.scrollIntoView({ block: 'center' });
      return;
    }

    setStatus('sending');
    setSubmitError('');
    try {
      const response = await fetch('/api/eventos/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: event.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          ...formGuardFields(form),
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus('success');
        return;
      }
      setStatus('idle');
      // Erros de validação (4xx) trazem uma mensagem amigável do servidor
      setSubmitError(response.status < 500 && typeof data.error === 'string' ? data.error : 'Não foi possível concluir sua inscrição. Tente novamente em instantes.');
    } catch {
      setStatus('idle');
      setSubmitError('Sem conexão com o servidor. Verifique sua internet e tente novamente.');
    }
  };

  const summary = [event.date && { icon: FaCalendarAlt, text: [event.date, event.time && `às ${event.time}`].filter(Boolean).join(' ') }, event.location && { icon: FaMapMarkerAlt, text: event.location }].filter(
    (line): line is { icon: typeof FaCalendarAlt; text: string } => Boolean(line)
  );

  if (status === 'success') {
    return (
      <ModalShell isOpen={isOpen} onClose={onClose} labelledBy={titleId} size="md">
        <div className="px-6 pt-14 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center sm:px-10 sm:pt-16 sm:pb-12">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#00a859]/10 text-[#00a859] ring-8 ring-[#00a859]/5 transition-[scale,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] starting:scale-50 starting:opacity-0 motion-reduce:transition-none">
            <FaCheckCircle className="h-9 w-9" aria-hidden="true" />
          </span>
          <h2 id={titleId} className="mt-6 text-2xl font-black tracking-tight text-balance text-[#003f7f] sm:text-3xl">
            Inscrição confirmada!
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" aria-hidden="true" />
          {/* role=status: leitores de tela anunciam a confirmação */}
          <p role="status" className="mx-auto mt-5 max-w-[42ch] text-gray-600">
            Sua presença em <strong className="font-bold text-[#003f7f]">{event.title}</strong> foi registrada. Até lá!
          </p>
          {/* O botão de envio some ao confirmar: o foco vem para cá para não cair fora do diálogo */}
          <button type="button" onClick={onClose} autoFocus className={`${modalButton.primary} mt-8 w-full sm:w-auto sm:min-w-48`}>
            Concluir
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
      size="md"
      dismissible={!isDirty}
      busy={status === 'sending'}
      footer={
        <>
          <button type="button" onClick={onClose} className={`${modalButton.secondary} max-sm:hidden sm:ml-auto`}>
            Cancelar
          </button>
          {/* aria-disabled em vez de disabled: desabilitar o botão focado jogaria o foco para fora do diálogo */}
          <button type="submit" form={`${id}-form`} aria-disabled={status === 'sending' || undefined} className={`${modalButton.primary} flex-1 sm:flex-none`}>
            {status === 'sending' && <FaSpinner className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
            {status === 'sending' ? 'Confirmando inscrição...' : 'Confirmar inscrição'}
          </button>
        </>
      }
    >
      <ModalBody className="max-sm:pt-8">
        <ModalChip tone="accent" icon={FaTicketAlt}>
          Inscrição no evento
        </ModalChip>
        <div className="mt-4">
          <ModalTitle id={titleId}>Inscreva-se</ModalTitle>
        </div>

        {/* Resumo do evento */}
        <div className="mt-5 rounded-2xl bg-linear-to-br from-[#003f7f] to-[#0052a3] p-4 text-white shadow-[0_18px_40px_-20px_rgba(0,63,127,0.8)] sm:p-5">
          <p className="font-bold text-balance">{event.title}</p>
          {summary.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-white/85">
              {summary.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon className="h-3 w-3 shrink-0 text-[#ffd000]" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          )}
        </div>

        <form ref={stampFormOpenedAt} id={`${id}-form`} onSubmit={handleSubmit} noValidate className="mt-7 grid gap-x-4 gap-y-5 sm:grid-cols-2">
          {/* Campo-armadilha anti-robô (lib/form-guard): invisível, fora do Tab e escondido dos leitores de tela */}
          <div aria-hidden="true" className="sr-only">
            <label htmlFor={`${id}-website`}>Não preencha este campo</label>
            <input type="text" id={`${id}-website`} name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          <Field id={`${id}-name`} label="Nome completo" error={errorFor('name')} className="sm:col-span-2">
            <input {...fieldProps('name')} type="text" required autoComplete="name" placeholder="Seu nome completo" />
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

          {submitError && (
            <p
              role="alert"
              // No celular o aviso nasce abaixo da dobra: traz para a vista (o aviso remonta a cada tentativa)
              ref={(el) => {
                el?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
              }}
              className="flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700 ring-1 ring-red-200 sm:col-span-2">
              <FaExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {submitError}
            </p>
          )}
          {/* Aviso LGPD perto do envio: só informa o uso (não é um aceite);
              nova aba para não perder o que já foi digitado */}
          <p className="sm:col-span-2 text-xs text-pretty text-gray-500">
            Seus dados serão usados para gerenciar sua inscrição e avisar sobre o evento, conforme a{' '}
            <a href="/politica-de-privacidade" target="_blank" rel="noopener" className="font-semibold text-[#003f7f] underline underline-offset-2 hover:text-[#0066cc]">
              Política de Privacidade<span className="sr-only"> (abre em nova aba)</span>
            </a>
            .
          </p>
        </form>
      </ModalBody>
    </ModalShell>
  );
}
