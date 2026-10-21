'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaWhatsapp, FaBriefcase, FaExclamationCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useIsClient, useModalBehavior } from '@/lib/hooks/useModalBehavior';

interface JobRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* Casca padrão dos modais do site (mesmas classes em NewsModal, EventModal, JobModal e RegistrationModal) */
const OVERLAY = 'fixed inset-0 z-100 flex items-end justify-center sm:items-center sm:p-6';
const BACKDROP = 'absolute inset-0 bg-[#001a3d]/70 backdrop-blur-sm transition-opacity duration-300 starting:opacity-0 motion-reduce:transition-none';
const PANEL = 'relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_-24px_60px_-24px_rgba(0,26,61,0.55)] outline-none transition-[opacity,translate,scale] duration-300 ease-out starting:translate-y-full sm:max-h-[90dvh] sm:rounded-3xl sm:shadow-[0_40px_100px_-30px_rgba(0,26,61,0.7)] sm:starting:translate-y-4 sm:starting:scale-[0.97] sm:starting:opacity-0 motion-reduce:transition-none';
const CLOSE = 'absolute top-3 right-3 z-30 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#003f7f] shadow-[0_8px_20px_-8px_rgba(0,26,61,0.6)] ring-1 ring-black/5 backdrop-blur-md transition-[scale,background-color] duration-200 hover:scale-105 hover:bg-white active:scale-95 motion-reduce:hover:scale-100 sm:top-4 sm:right-4';
const FOOTER = 'flex shrink-0 items-center gap-3 border-t border-gray-100 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8';
const BTN_PRIMARY = 'inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#003f7f] to-[#0066cc] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)] active:scale-[0.98] motion-reduce:hover:translate-y-0';
const BTN_SECONDARY = 'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[#003f7f] ring-1 ring-gray-200 transition-[background-color,scale] duration-200 hover:bg-gray-50 active:scale-[0.98]';

const inputClass = (invalid: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 transition-[border-color,box-shadow] duration-200 focus:ring-4 focus:outline-none ${
    invalid ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : 'border-gray-200 hover:border-gray-300 focus:border-[#003f7f] focus:ring-[#003f7f]/15'
  }`;

type FieldName = 'empresa' | 'cargo' | 'descricao' | 'quantidade' | 'localizacao' | 'contato' | 'email';

interface FieldConfig {
  name: FieldName;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  wide?: boolean;
  textarea?: boolean;
}

// Ordem do formulário (e da mensagem); "wide" ocupa as duas colunas no desktop
const FIELDS: FieldConfig[] = [
  { name: 'empresa', label: 'Nome da empresa', placeholder: 'Ex.: Magazine Ipirá', autoComplete: 'organization' },
  { name: 'cargo', label: 'Cargo/Vaga', placeholder: 'Ex.: Vendedor(a)' },
  { name: 'descricao', label: 'Descrição da vaga', placeholder: 'Atividades, requisitos e benefícios', wide: true, textarea: true },
  { name: 'quantidade', label: 'Quantidade de vagas', type: 'number', placeholder: 'Ex.: 2' },
  { name: 'localizacao', label: 'Localização', placeholder: 'Bairro ou endereço' },
  { name: 'contato', label: 'Contato', placeholder: 'Nome e telefone do responsável', autoComplete: 'name' },
  { name: 'email', label: 'E-mail', type: 'email', placeholder: 'contato@empresa.com', autoComplete: 'email' },
];

function validateField(name: FieldName, raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return 'Campo obrigatório.';
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Informe um e-mail válido.';
  if (name === 'quantidade' && !(Number.isInteger(Number(value)) && Number(value) >= 1)) return 'Informe um número a partir de 1.';
  return undefined;
}

const JobRegistrationModal = ({ isOpen, onClose }: JobRegistrationModalProps) => {
  const isClient = useIsClient();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitStatus('idle');

    const formData = new FormData(form);
    const get = (name: FieldName) => String(formData.get(name) ?? '');

    // Validação inline: mostra todos os erros e leva o foco ao primeiro campo inválido
    const nextErrors: Partial<Record<FieldName, string>> = {};
    for (const { name } of FIELDS) {
      const error = validateField(name, get(name));
      if (error) nextErrors[name] = error;
    }
    setErrors(nextErrors);
    const firstInvalid = FIELDS.find(({ name }) => nextErrors[name]);
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid.name}"]`)?.focus();
      return;
    }

    const message = `Olá, gostaria de cadastrar uma nova vaga no Balcão de Empregos da CDL:\n\n` +
      `🏢 *Empresa:* ${get('empresa')}\n` +
      `💼 *Cargo:* ${get('cargo')}\n` +
      `📝 *Descrição:* ${get('descricao')}\n` +
      `🔢 *Quantidade:* ${get('quantidade')}\n` +
      `📍 *Localização:* ${get('localizacao')}\n` +
      `👤 *Contato:* ${get('contato')}\n` +
      `📧 *Email:* ${get('email')}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=557532541599&text=${encodeURIComponent(message)}`;

    // Abre a janela ainda dentro do clique (bloqueadores de pop-up barram window.open fora do gesto do usuário)
    const whatsappWindow = window.open(whatsappUrl, '_blank');
    if (!whatsappWindow) {
      setSubmitStatus('error');
      return;
    }
    whatsappWindow.opener = null;

    setSubmitStatus('success');
    form.reset();
  };

  const handleClose = () => {
    onClose();
    setSubmitStatus('idle');
    setErrors({});
  };

  // Depois de abrir o WhatsApp, fecha sozinho em 3s (o timer é cancelado se o usuário fechar antes)
  useEffect(() => {
    if (submitStatus !== 'success') return;
    const timer = setTimeout(() => {
      onClose();
      setSubmitStatus('idle');
    }, 3000);
    return () => clearTimeout(timer);
  }, [submitStatus, onClose]);

  const dialogRef = useModalBehavior<HTMLDivElement>(isOpen, handleClose);

  if (!isClient || !isOpen) return null;

  return createPortal(
    <div className={OVERLAY}>
      <div aria-hidden="true" onClick={handleClose} className={BACKDROP} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-registration-title"
        tabIndex={-1}
        className={`${PANEL} sm:max-w-2xl`}
      >
        <button type="button" onClick={handleClose} aria-label="Fechar" className={CLOSE}>
          <FaTimes className="h-4 w-4" aria-hidden="true" />
        </button>

        {submitStatus === 'success' ? (
          <div role="status" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-12 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center sm:px-10 sm:pt-14 sm:pb-12">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#00a859]/10 text-[#00a859] ring-8 ring-[#00a859]/5 transition-[scale,opacity] duration-500 ease-out starting:scale-50 starting:opacity-0 motion-reduce:transition-none">
              <FaWhatsapp className="h-9 w-9" aria-hidden="true" />
            </span>
            <h2 id="job-registration-title" className="mt-6 text-2xl font-black tracking-tight text-balance text-[#003f7f] sm:text-3xl">
              Redirecionando para o WhatsApp...
            </h2>
            <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" aria-hidden="true" />
            <p className="mx-auto mt-5 max-w-[42ch] text-gray-600">Finalize o cadastro enviando a mensagem com os dados da vaga para a nossa equipe.</p>
            {/* O formulário some: o foco vai para cá para não cair fora do diálogo */}
            <button type="button" onClick={handleClose} autoFocus className={`${BTN_SECONDARY} mt-8 w-full sm:w-auto sm:min-w-48`}>
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="px-5 pt-7 sm:px-8 sm:pt-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold tracking-[0.14em] text-[#003f7f] uppercase shadow-sm">
                  <FaBriefcase aria-hidden="true" />
                  Balcão de Empregos
                </span>
                <h2 id="job-registration-title" className="mt-4 text-3xl leading-[1.1] font-black tracking-tight text-balance text-[#003f7f] sm:text-4xl">
                  Cadastre sua Vaga
                </h2>
                <div className="mt-4 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" aria-hidden="true" />
                <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-gray-600 sm:text-base">
                  Preencha os dados abaixo para enviar as informações da sua vaga diretamente para nossa equipe via WhatsApp.
                </p>
              </div>

              {submitStatus === 'error' && (
                <div role="alert" className="mx-5 mt-6 flex gap-3 rounded-2xl bg-red-50 p-4 text-red-800 ring-1 ring-red-100 sm:mx-8">
                  <FaExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                  <div className="text-sm">
                    <p className="font-bold">Não foi possível abrir o WhatsApp</p>
                    <p className="mt-0.5">Permita pop-ups para este site e tente novamente, ou fale conosco pelo (75) 3254-1599.</p>
                  </div>
                </div>
              )}

              <form id="job-registration-form" onSubmit={handleSubmit} noValidate className="grid gap-x-4 gap-y-5 px-5 pt-7 pb-8 sm:grid-cols-2 sm:px-8">
                {FIELDS.map(({ name, label, type = 'text', placeholder, autoComplete, wide, textarea }) => {
                  const id = `vaga-${name}`;
                  const error = errors[name];
                  const common = {
                    id,
                    name,
                    required: true,
                    placeholder,
                    autoComplete,
                    'aria-invalid': error ? true : undefined,
                    'aria-describedby': error ? `${id}-error` : undefined,
                    className: `${inputClass(!!error)} ${textarea ? 'resize-none' : ''}`,
                    // Revalida ao sair do campo; enquanto há erro, revalida a cada digitação
                    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      const value = e.currentTarget.value;
                      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
                    },
                    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      const value = e.currentTarget.value;
                      if (error) setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
                    },
                  };
                  return (
                    <div key={name} className={wide ? 'sm:col-span-2' : undefined}>
                      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-gray-800">
                        {label}
                        <span className="ml-0.5 text-[#003f7f]" aria-hidden="true">*</span>
                      </label>
                      {textarea ? (
                        <textarea {...common} rows={4} />
                      ) : (
                        <input {...common} type={type} {...(type === 'number' ? { min: 1, inputMode: 'numeric' as const } : {})} />
                      )}
                      {error && (
                        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                          <FaExclamationCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                          {error}
                        </p>
                      )}
                    </div>
                  );
                })}
              </form>
            </div>

            <div className={FOOTER}>
              <button type="button" onClick={handleClose} className={`${BTN_SECONDARY} max-sm:hidden sm:ml-auto`}>
                Cancelar
              </button>
              <button type="submit" form="job-registration-form" className={`${BTN_PRIMARY} flex-1 sm:flex-none`}>
                <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
                Enviar via WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default JobRegistrationModal;
