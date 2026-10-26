'use client';

import React, { useState } from 'react';
import {
  FaArrowRight,
  FaCheck,
  FaExclamationCircle,
  FaPaperPlane,
  FaPhoneAlt,
  FaRegCalendarCheck,
  FaUserTie,
} from 'react-icons/fa';
import { HONEYPOT_FIELD, stampFormOpenedAt } from '@/lib/form-guard';
import SectionHeader from './SectionHeader';

interface ContactFormProps {
  isFormSubmitting: boolean;
  formStatus: 'idle' | 'success' | 'error';
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Volta ao formulário depois do envio ("Enviar outra solicitação") */
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
  /** Orientação fixa sob o campo (id `${id}-dica`) */
  hint?: string;
  className?: string;
  /** Recebe os atributos que ligam a dica e o erro ao campo (aria-invalid e aria-describedby) */
  children: (aria: FieldAria) => React.ReactNode;
}

const isValid = (e: React.SyntheticEvent) => (e.target as HTMLInputElement).validity.valid;

function Field({ id, label, error, hint, className, children }: FieldProps) {
  // O erro aparece na tentativa de envio (invalid) ou ao sair de um campo preenchido errado, e some assim que o campo
  // fica válido. No React esses eventos borbulham (até o invalid), então o contêiner ouve o campo de dentro.
  const [invalid, setInvalid] = useState(false);
  const describedBy = [hint && `${id}-dica`, invalid && `${id}-erro`].filter(Boolean).join(' ') || undefined;
  return (
    <div
      className={className}
      onInvalid={() => setInvalid(true)}
      onBlur={(e) => (e.target as HTMLInputElement).value && setInvalid(!isValid(e))}
      onChange={(e) => invalid && setInvalid(!isValid(e))}
    >
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-800">
        {label} <span aria-hidden="true" className="text-red-600">*</span>
      </label>
      {children({ 'aria-invalid': invalid || undefined, 'aria-describedby': describedBy })}
      {hint && (
        <p id={`${id}-dica`} className="mt-1.5 text-xs text-pretty text-gray-500">
          {hint}
        </p>
      )}
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

const steps = [
  { icon: FaPaperPlane, title: 'Envie sua solicitação', text: 'Conte qual é a sua dúvida ou situação.' },
  { icon: FaPhoneAlt, title: 'Nossa equipe entra em contato', text: 'Retornamos pelo telefone ou e-mail informado.' },
  { icon: FaRegCalendarCheck, title: 'Orientação agendada', text: 'Atendimento presencial, por telefone ou online.' },
];

const ContactForm = ({ isFormSubmitting, formStatus, onSubmit, onReset }: ContactFormProps) => {
  return (
    <section
      id="solicitar"
      aria-labelledby="solicitar-titulo"
      className="scroll-mt-[calc(var(--header-height,0px)+1rem)] bg-white py-16 md:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          {/* Coluna de apoio: como funciona */}
          <div className="lg:sticky lg:top-[calc(var(--header-height,0px)+2rem)]">
            <SectionHeader
              id="solicitar-titulo"
              align="left"
              eyebrow="Atendimento"
              icon={FaUserTie}
              title="Solicite sua Orientação"
              subtitle="Preencha o formulário e nossa equipe entrará em contato para agendar sua orientação jurídica."
            />

            <ol className="mx-auto mt-8 max-w-xl space-y-4 lg:mx-0">
              {steps.map(({ icon: Icon, title, text }, index) => (
                <li key={title} className="flex items-start gap-4 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
                  <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-[#003f7f] ring-1 ring-[#003f7f]/10 shadow-sm">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-[#ffd000] text-[10px] font-black text-[#003f7f]">
                      {index + 1}
                    </span>
                  </span>
                  <div>
                    <p className="font-bold text-[#003f7f]">{title}</p>
                    <p className="mt-0.5 text-sm text-gray-600">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Cartão do formulário */}
          <div className="rounded-3xl bg-white p-6 ring-1 ring-gray-100 shadow-[0_30px_60px_-30px_rgba(0,63,127,0.45)] sm:p-8 lg:p-10">
            {formStatus === 'success' ? (
              <div ref={focusOnMount} tabIndex={-1} role="status" className="flex flex-col items-center py-8 text-center outline-none sm:py-12 animate-scale-in">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-[#00a859]/10 ring-8 ring-[#00a859]/5">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[#00a859] text-white">
                    <FaCheck aria-hidden="true" className="h-5 w-5" />
                  </span>
                </span>
                <h3 className="mt-6 text-2xl font-black tracking-tight text-[#003f7f] sm:text-3xl">
                  Solicitação enviada com sucesso!
                </h3>
                <p className="mt-3 max-w-sm text-gray-600">
                  Nossa equipe entrará em contato em breve para agendar sua orientação.
                </p>
                {onReset && (
                  <button
                    type="button"
                    onClick={onReset}
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#003f7f] px-6 py-2.5 text-sm font-bold text-[#003f7f] transition-[background-color,color,scale] duration-200 hover:bg-[#003f7f] hover:text-white active:scale-[0.98]"
                  >
                    Enviar outra solicitação
                  </button>
                )}
              </div>
            ) : (
              <form ref={stampFormOpenedAt} onSubmit={onSubmit} aria-busy={isFormSubmitting} className="grid gap-5 sm:grid-cols-2">
                {/* Campo-armadilha anti-robô (lib/form-guard): invisível, fora do Tab e escondido dos leitores de tela */}
                <div aria-hidden="true" className="sr-only">
                  <label htmlFor="juridico-website">Não preencha este campo</label>
                  <input type="text" id="juridico-website" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
                </div>

                <Field id="juridico-nome" label="Nome completo" error="Informe seu nome.">
                  {(aria) => (
                    <input
                      {...aria}
                      type="text"
                      id="juridico-nome"
                      name="nome"
                      required
                      maxLength={120}
                      autoComplete="name"
                      placeholder="Seu nome"
                      disabled={isFormSubmitting}
                      className={fieldClass}
                    />
                  )}
                </Field>
                <Field id="juridico-empresa" label="Empresa" error="Informe o nome da empresa.">
                  {(aria) => (
                    <input
                      {...aria}
                      type="text"
                      id="juridico-empresa"
                      name="empresa"
                      required
                      maxLength={150}
                      autoComplete="organization"
                      placeholder="Nome da empresa"
                      disabled={isFormSubmitting}
                      className={fieldClass}
                    />
                  )}
                </Field>
                <Field id="juridico-telefone" label="Telefone/WhatsApp" error="Informe um telefone para contato.">
                  {(aria) => (
                    <input
                      {...aria}
                      type="tel"
                      id="juridico-telefone"
                      name="telefone"
                      required
                      maxLength={30}
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="(75) 99999-9999"
                      disabled={isFormSubmitting}
                      className={fieldClass}
                    />
                  )}
                </Field>
                <Field id="juridico-email" label="E-mail" error="Informe um e-mail válido.">
                  {(aria) => (
                    <input
                      {...aria}
                      type="email"
                      id="juridico-email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="seu@email.com"
                      disabled={isFormSubmitting}
                      className={fieldClass}
                    />
                  )}
                </Field>
                <Field id="juridico-assunto" label="Assunto da consulta" error="Informe o assunto." className="sm:col-span-2">
                  {(aria) => (
                    <input
                      {...aria}
                      type="text"
                      id="juridico-assunto"
                      name="assunto"
                      required
                      maxLength={200}
                      placeholder="Ex.: questão trabalhista, análise de contrato"
                      disabled={isFormSubmitting}
                      className={fieldClass}
                    />
                  )}
                </Field>
                {/* O campo tende a receber dados sensíveis ou de terceiros: avisa antes de escrever (LGPD, art. 6º, III) */}
                <Field
                  id="juridico-descricao"
                  label="Descrição da situação"
                  error="Descreva sua situação ou dúvida."
                  hint="Conte só o essencial. Não inclua dados de saúde nem documentos; se precisarmos de mais informações, pediremos no atendimento."
                  className="sm:col-span-2"
                >
                  {(aria) => (
                    <textarea
                      {...aria}
                      id="juridico-descricao"
                      name="descricao"
                        required
                      maxLength={3000}
                      rows={5}
                      placeholder="Descreva sua situação ou dúvida jurídica..."
                      disabled={isFormSubmitting}
                      className={`${fieldClass} resize-y min-h-32`}
                    />
                  )}
                </Field>

                {formStatus === 'error' && (
                  // Foco no erro: o botão fica desativado durante o envio e o foco do teclado cairia no topo da página
                  <div ref={focusOnMount} tabIndex={-1} role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 outline-none sm:col-span-2 animate-scale-in">
                    <FaExclamationCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <div>
                      <p className="font-bold text-red-800">Erro ao enviar solicitação</p>
                      <p className="text-sm text-red-700">Tente novamente ou entre em contato conosco.</p>
                    </div>
                  </div>
                )}

                <div className="pt-2 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isFormSubmitting}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#003f7f] to-[#0066cc] px-7 py-4 text-base font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    {isFormSubmitting ? (
                      <>
                        <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar solicitação
                        <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-center text-xs text-gray-500">
                    <span aria-hidden="true" className="text-red-600">*</span> Campos obrigatórios
                  </p>
                  {/* Aviso LGPD perto do envio: só informa o uso (não é um aceite);
                      nova aba para não perder o que já foi digitado */}
                  <p className="mt-1 text-center text-xs text-pretty text-gray-500">
                    Seus dados serão usados para analisar e responder ao seu pedido, conforme a{' '}
                    <a href="/politica-de-privacidade" target="_blank" rel="noopener" className="font-semibold text-[#003f7f] underline underline-offset-2 hover:text-[#0066cc]">
                      Política de Privacidade<span className="sr-only"> (abre em nova aba)</span>
                    </a>
                    .
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
