'use client';

import React, { useState } from 'react';
import { FaPaperPlane, FaCheck, FaExclamationCircle, FaChevronDown } from 'react-icons/fa';
import { HONEYPOT_FIELD, stampFormOpenedAt } from '@/lib/form-guard';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
}

interface ContactFormProps {
  formData: FormData;
  isSubmitting: boolean;
  submitStatus: 'success' | 'error' | null;
  submitMessage?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Volta ao formulário depois do envio ("Enviar nova mensagem") */
  onReset?: () => void;
}

// Mesmo estilo de campo dos modais do site; o vermelho acompanha o aria-invalid que o Field liga.
// Placeholder em gray-500: o gray-400 ficava em 2,5:1 sobre o fundo do campo (WCAG 1.4.3 pede 4,5:1)
const fieldClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 sm:text-[15px] transition-[border-color,background-color,box-shadow] duration-200 hover:border-gray-300 focus:border-[#003f7f] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#003f7f]/10 aria-invalid:border-red-500 aria-invalid:bg-red-50/40 disabled:cursor-not-allowed disabled:opacity-60';

type FieldAria = { 'aria-invalid'?: true; 'aria-describedby'?: string };

interface FieldProps {
  id: string;
  label: string;
  error: string;
  optional?: boolean;
  className?: string;
  /** Recebe os atributos que ligam o erro ao campo (aria-invalid e aria-describedby) */
  children: (aria: FieldAria) => React.ReactNode;
}

const isValid = (e: React.SyntheticEvent) => (e.target as HTMLInputElement).validity.valid;

function Field({ id, label, error, optional, className, children }: FieldProps) {
  // O erro aparece na tentativa de envio (invalid) ou ao sair de um campo preenchido errado, e some assim que o campo
  // fica válido. No React esses eventos borbulham (até o invalid), então o contêiner ouve o campo de dentro.
  const [invalid, setInvalid] = useState(false);
  return (
    <div
      className={className}
      onInvalid={() => setInvalid(true)}
      onBlur={(e) => (e.target as HTMLInputElement).value && setInvalid(!isValid(e))}
      onChange={(e) => invalid && setInvalid(!isValid(e))}
    >
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-800">
        {label}{' '}
        {optional ? <span className="font-medium text-gray-500">(opcional)</span> : <span aria-hidden="true" className="text-red-600">*</span>}
      </label>
      {children(invalid ? { 'aria-invalid': true, 'aria-describedby': `${id}-erro` } : {})}
      {invalid && (
        <p id={`${id}-erro`} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700">
          <FaExclamationCircle aria-hidden="true" className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// Função estável (fora do componente): o foco vai para o painel de sucesso só quando ele aparece,
// já que o botão de envio focado some junto com o formulário
const focusOnMount = (el: HTMLElement | null) => el?.focus();

const ContactForm = ({
  formData,
  isSubmitting,
  submitStatus,
  submitMessage,
  onChange,
  onSubmit,
  onReset
}: ContactFormProps) => {
  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-gray-100 shadow-[0_30px_60px_-30px_rgba(0,63,127,0.45)] sm:p-8 lg:p-10">
      {submitStatus === 'success' ? (
        <div ref={focusOnMount} tabIndex={-1} role="status" className="flex flex-col items-center py-10 text-center outline-none sm:py-16 animate-scale-in">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-[#00a859]/10 ring-8 ring-[#00a859]/5">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#00a859] text-white">
              <FaCheck aria-hidden="true" className="h-5 w-5" />
            </span>
          </span>
          <h2 className="mt-6 text-2xl font-black tracking-tight text-[#003f7f] sm:text-3xl">Mensagem enviada!</h2>
          <p className="mt-3 max-w-sm text-gray-600">
            {submitMessage || 'Mensagem enviada com sucesso! Entraremos em contato em breve.'}
          </p>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#003f7f] px-6 py-2.5 text-sm font-bold text-[#003f7f] transition-[background-color,color,scale] duration-200 hover:bg-[#003f7f] hover:text-white active:scale-[0.98]"
            >
              Enviar nova mensagem
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight text-[#003f7f] sm:text-3xl">Envie sua Mensagem</h2>
            <div aria-hidden="true" className="mt-4 h-1.5 w-16 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
            <p className="mt-4 text-gray-600">
              Preencha o formulário abaixo e entraremos em contato o mais breve possível.
            </p>
          </div>

          <form ref={stampFormOpenedAt} onSubmit={onSubmit} aria-busy={isSubmitting} className="grid gap-5 sm:grid-cols-2">
            {/* Campo-armadilha anti-robô (lib/form-guard): invisível, fora do Tab e escondido dos leitores de tela */}
            <div aria-hidden="true" className="sr-only">
              <label htmlFor="contato-website">Não preencha este campo</label>
              <input type="text" id="contato-website" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            <Field id="nome" label="Nome completo" error="Informe seu nome." className="sm:col-span-2">
              {(aria) => (
                <input
                  {...aria}
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={onChange}
                  required
                  maxLength={120}
                  autoComplete="name"
                  disabled={isSubmitting}
                  className={fieldClass}
                  placeholder="Seu nome completo"
                />
              )}
            </Field>

            <Field id="email" label="E-mail" error="Informe um e-mail válido.">
              {(aria) => (
                <input
                  {...aria}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                  className={fieldClass}
                  placeholder="seu@email.com"
                />
              )}
            </Field>

            {/* Coleta mínima: o e-mail já basta para responder, o telefone fica a critério de quem escreve */}
            <Field id="telefone" label="Telefone" error="Informe um telefone válido." optional>
              {(aria) => (
                <input
                  {...aria}
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={onChange}
                  maxLength={30}
                  autoComplete="tel"
                  inputMode="tel"
                  disabled={isSubmitting}
                  className={fieldClass}
                  placeholder="(75) 99999-9999"
                />
              )}
            </Field>

            <Field id="assunto" label="Assunto" error="Selecione um assunto." className="sm:col-span-2">
              {(aria) => (
                <div className="relative">
                  {/* Sem assunto escolhido o texto fica cinza como um placeholder (gray-500 para manter 4,5:1) */}
                  <select
                    {...aria}
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={onChange}
                    required
                    disabled={isSubmitting}
                    className={`${fieldClass} appearance-none pr-11 invalid:text-gray-500`}
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="associacao">Associação</option>
                    <option value="spc">Consulta SPC</option>
                    <option value="certificado">Certificado Digital</option>
                    <option value="eventos">Eventos</option>
                    <option value="duvidas">Dúvidas Gerais</option>
                    <option value="privacidade">Privacidade e meus dados (LGPD)</option>
                    <option value="outros">Outros</option>
                  </select>
                  <FaChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 h-3 w-3 -translate-y-1/2 text-gray-500" />
                </div>
              )}
            </Field>

            <Field id="mensagem" label="Mensagem" error="Escreva sua mensagem." className="sm:col-span-2">
              {(aria) => (
                <textarea
                  {...aria}
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={onChange}
                  required
                  maxLength={5000}
                  rows={6}
                  disabled={isSubmitting}
                  className={`${fieldClass} resize-y min-h-36`}
                  placeholder="Escreva sua mensagem aqui..."
                />
              )}
            </Field>

            {submitStatus === 'error' && (
              // Foco no erro: o botão fica desativado durante o envio e o foco do teclado cairia no topo da página
              <div ref={focusOnMount} tabIndex={-1} role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 outline-none sm:col-span-2 animate-scale-in">
                <FaExclamationCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <p className="font-semibold text-red-800">
                  {submitMessage || 'Erro ao enviar mensagem. Tente novamente ou entre em contato por telefone.'}
                </p>
              </div>
            )}

            <div className="pt-2 sm:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-linear-to-r from-[#003f7f] to-[#0066cc] px-7 py-4 text-base font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
                    <span>Enviar Mensagem</span>
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-xs text-gray-500">
                <span aria-hidden="true" className="text-red-600">*</span> Campos obrigatórios
              </p>
              {/* Aviso LGPD perto do envio: só informa o uso (a base é o legítimo interesse, não um aceite);
                  nova aba para não perder o que já foi digitado */}
              <p className="mt-1 text-center text-xs text-pretty text-gray-500">
                Seus dados serão usados para responder ao seu contato, conforme a{' '}
                <a href="/politica-de-privacidade" target="_blank" rel="noopener" className="font-semibold text-[#003f7f] underline underline-offset-2 hover:text-[#0066cc]">
                  Política de Privacidade<span className="sr-only"> (abre em nova aba)</span>
                </a>
                .
              </p>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ContactForm;
