'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { FaBriefcase, FaExclamationCircle, FaExclamationTriangle, FaWhatsapp } from 'react-icons/fa';
import { ModalBody, ModalChip, ModalShell, ModalTitle, modalButton } from '@/app/components/Modal';
import { CONTACT } from '@/app/components/navigation/navItems';

interface JobRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Placeholder em gray-500: o gray-400 ficava abaixo de 4,5:1 sobre o branco (WCAG 1.4.3)
const inputClass = (invalid: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 sm:text-[15px] transition-[border-color,box-shadow] duration-200 focus:ring-4 focus:outline-none ${
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

// Depois de abrir o WhatsApp o modal fecha sozinho (a barra do aviso de sucesso mostra o tempo)
const AUTO_CLOSE_MS = 3000;

const JobRegistrationModal = ({ isOpen, onClose }: JobRegistrationModalProps) => {
  const id = useId();
  const titleId = `${id}-title`;
  const formId = `${id}-form`;
  const [success, setSuccess] = useState(false);
  // Tentativas barradas pelo bloqueador de pop-up (cada uma traz o aviso de volta para a vista)
  const [blocked, setBlocked] = useState(0);
  const alertRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  // Com algo digitado, clique fora e puxar a folha não fecham (Esc, X e Cancelar continuam fechando)
  const [dirty, setDirty] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

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

    // Número da mesma fonte do rodapé e do contato (wa.me aceita o texto pronto em ?text=)
    const whatsappUrl = `${CONTACT.whatsapp.href}?text=${encodeURIComponent(message)}`;

    // Abre a janela ainda dentro do clique (bloqueadores de pop-up barram window.open fora do gesto do usuário)
    const whatsappWindow = window.open(whatsappUrl, '_blank');
    if (!whatsappWindow) {
      setBlocked((count) => count + 1);
      return;
    }
    whatsappWindow.opener = null;
    setSuccess(true);
    setBlocked(0);
    setDirty(false);
  };

  // O conteúdo continua na tela durante a saída (ModalShell); o estado zera para a próxima abertura
  const handleClose = () => {
    onClose();
    setSuccess(false);
    setBlocked(0);
    setErrors({});
    setDirty(false);
  };

  // O timer é cancelado se o usuário fechar antes
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      onClose();
      setSuccess(false);
    }, AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [success, onClose]);

  // O aviso fica perto do botão de envio; no celular nasce abaixo da dobra, então vem para a vista
  useEffect(() => {
    if (!blocked) return;
    alertRef.current?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [blocked]);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={handleClose}
      labelledBy={titleId}
      size="md"
      dismissible={!dirty}
      footer={
        !success && (
          <>
            <button type="button" onClick={handleClose} className={`${modalButton.secondary} max-sm:hidden sm:ml-auto`}>
              Cancelar
            </button>
            <button type="submit" form={formId} className={`${modalButton.primary} flex-1 sm:flex-none`}>
              <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
              Enviar via WhatsApp
              <span className="sr-only">(abre em nova aba)</span>
            </button>
          </>
        )
      }
    >
      {success ? (
        <div className="px-6 pt-14 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center sm:px-10 sm:pt-16 sm:pb-12">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#00a859]/10 text-[#00a859] ring-8 ring-[#00a859]/5 transition-[scale,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] starting:scale-50 starting:opacity-0 motion-reduce:transition-none">
            <FaWhatsapp className="h-9 w-9" aria-hidden="true" />
          </span>
          <h2 id={titleId} className="mt-6 text-2xl font-black tracking-tight text-balance text-[#003f7f] sm:text-3xl">
            Mensagem pronta no WhatsApp
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" aria-hidden="true" />
          {/* role=status: leitores de tela anunciam o próximo passo */}
          <p role="status" className="mx-auto mt-5 max-w-[42ch] text-pretty text-gray-600">
            Finalize o cadastro enviando a mensagem com os dados da vaga para a nossa equipe.
          </p>
          {/* O formulário some: o foco vem para cá para não cair fora do diálogo */}
          <button type="button" onClick={handleClose} autoFocus className={`${modalButton.primary} mt-8 w-full sm:w-auto sm:min-w-48`}>
            Concluir
          </button>
          {/* Tempo até fechar sozinho (some com movimento reduzido: a barra parada não diria nada) */}
          <div aria-hidden="true" className="mx-auto mt-8 h-1 max-w-48 overflow-hidden rounded-full bg-gray-100 motion-reduce:hidden">
            <div
              style={{ transitionDuration: `${AUTO_CLOSE_MS}ms` }}
              className="h-full origin-left scale-x-0 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] transition-[scale] ease-linear starting:scale-x-100"
            />
          </div>
        </div>
      ) : (
        <ModalBody className="max-sm:pt-8">
          <ModalChip tone="accent" icon={FaBriefcase}>
            Balcão de Empregos
          </ModalChip>
          <div className="mt-4">
            <ModalTitle id={titleId}>Cadastre sua vaga</ModalTitle>
          </div>
          <p className="mt-3 max-w-[60ch] text-pretty text-gray-600 sm:text-[1.0625rem]">
            Preencha os dados abaixo para enviar as informações da sua vaga diretamente para nossa equipe via WhatsApp.
          </p>

          {/* Para onde vão os dados */}
          <div className="mt-5 flex items-center gap-3.5 rounded-2xl bg-linear-to-br from-[#003f7f] to-[#0052a3] p-4 text-white shadow-[0_18px_40px_-20px_rgba(0,63,127,0.8)] sm:p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/12 text-[#00d670] ring-1 ring-white/20">
              <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-sm text-white/85">
              <strong className="block font-bold text-white">Envio pelo WhatsApp da CDL</strong>
              A mensagem já sai pronta com os dados da vaga para o {CONTACT.whatsapp.label}.
            </p>
          </div>

          <form
            id={formId}
            onSubmit={handleSubmit}
            onInput={(e) => setDirty(Array.from(new FormData(e.currentTarget).values()).some((value) => String(value).trim() !== ''))}
            noValidate
            className="mt-7 grid gap-x-4 gap-y-5 sm:grid-cols-2"
          >
            {FIELDS.map(({ name, label, type = 'text', placeholder, autoComplete, wide, textarea }) => {
              const fieldId = `${id}-${name}`;
              const error = errors[name];
              const common = {
                id: fieldId,
                name,
                required: true,
                placeholder,
                autoComplete,
                'aria-invalid': error ? true : undefined,
                'aria-describedby': error ? `${fieldId}-error` : undefined,
                className: `${inputClass(!!error)} ${textarea ? 'resize-none' : ''}`,
                // Valida ao sair do campo só o que foi preenchido (passar por um campo vazio com Tab não acende o
                // "obrigatório" em todos; isso fica para o envio); enquanto há erro, revalida a cada digitação
                onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  const value = e.currentTarget.value;
                  if (value.trim() || error) setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
                },
                onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  const value = e.currentTarget.value;
                  if (error) setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
                },
              };
              return (
                <div key={name} className={wide ? 'sm:col-span-2' : undefined}>
                  <label htmlFor={fieldId} className="mb-1.5 block text-sm font-bold text-gray-800">
                    {label}
                    <span className="ml-0.5 text-[#003f7f]" aria-hidden="true">*</span>
                  </label>
                  {textarea ? (
                    <textarea {...common} rows={4} />
                  ) : (
                    <input {...common} type={type} {...(type === 'number' ? { min: 1, inputMode: 'numeric' as const } : {})} />
                  )}
                  {error && (
                    <p id={`${fieldId}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                      <FaExclamationCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                      {error}
                    </p>
                  )}
                </div>
              );
            })}

            {blocked > 0 && (
              <div
                ref={alertRef}
                role="alert"
                className="flex gap-3 rounded-2xl bg-red-50 p-4 text-red-800 ring-1 ring-red-200 sm:col-span-2"
              >
                <FaExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                <div className="text-sm">
                  <p className="font-bold">Não foi possível abrir o WhatsApp</p>
                  <p className="mt-0.5">Permita pop-ups para este site e tente novamente, ou fale conosco pelo {CONTACT.whatsapp.label}.</p>
                </div>
              </div>
            )}
            {/* Aviso LGPD perto do envio: só informa o uso (não é um aceite);
                nova aba para não perder o que já foi digitado */}
            <p className="sm:col-span-2 text-xs text-pretty text-gray-500">
              Os dados vão na mensagem de WhatsApp para a CDL e serão usados para divulgar a vaga, conforme a{' '}
              <a href="/politica-de-privacidade" target="_blank" rel="noopener" className="font-semibold text-[#003f7f] underline underline-offset-2 hover:text-[#0066cc]">
                Política de Privacidade<span className="sr-only"> (abre em nova aba)</span>
              </a>
              .
            </p>
          </form>
        </ModalBody>
      )}
    </ModalShell>
  );
};

export default JobRegistrationModal;
