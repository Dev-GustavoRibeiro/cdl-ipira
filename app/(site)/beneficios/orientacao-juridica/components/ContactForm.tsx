'use client';

import React from 'react';
import {
  FaArrowRight,
  FaCheck,
  FaExclamationCircle,
  FaPaperPlane,
  FaPhoneAlt,
  FaRegCalendarCheck,
  FaUserTie,
} from 'react-icons/fa';
import SectionHeader from './SectionHeader';

interface ContactFormProps {
  isFormSubmitting: boolean;
  formStatus: 'idle' | 'success' | 'error';
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Volta ao formulário depois do envio ("Enviar outra solicitação") */
  onReset?: () => void;
}

// Mesmo estilo de campo dos modais do site; o erro do campo aparece só depois que o usuário interage (:user-invalid)
const fieldClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 transition-[border-color,background-color,box-shadow] duration-200 hover:border-gray-300 focus:border-[#003f7f] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#003f7f]/10 user-invalid:border-red-500 user-invalid:bg-red-50/40 disabled:cursor-not-allowed disabled:opacity-60';

interface FieldProps {
  id: string;
  label: string;
  error: string;
  className?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, className, children }: FieldProps) {
  return (
    <div className={`group/field ${className ?? ''}`}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-800">
        {label} <span aria-hidden="true" className="text-red-600">*</span>
      </label>
      {children}
      <p className="mt-1.5 hidden items-center gap-1.5 text-xs font-medium text-red-700 group-has-[:user-invalid]/field:flex">
        <FaExclamationCircle aria-hidden="true" className="h-3 w-3 shrink-0" />
        {error}
      </p>
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
              <form onSubmit={onSubmit} aria-busy={isFormSubmitting} className="grid gap-5 sm:grid-cols-2">
                <Field id="juridico-nome" label="Nome completo" error="Informe seu nome.">
                  <input
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
                </Field>
                <Field id="juridico-empresa" label="Empresa" error="Informe o nome da empresa.">
                  <input
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
                </Field>
                <Field id="juridico-telefone" label="Telefone/WhatsApp" error="Informe um telefone para contato.">
                  <input
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
                </Field>
                <Field id="juridico-email" label="E-mail" error="Informe um e-mail válido.">
                  <input
                    type="email"
                    id="juridico-email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="seu@email.com"
                    disabled={isFormSubmitting}
                    className={fieldClass}
                  />
                </Field>
                <Field id="juridico-assunto" label="Assunto da consulta" error="Informe o assunto." className="sm:col-span-2">
                  <input
                    type="text"
                    id="juridico-assunto"
                    name="assunto"
                    required
                    maxLength={200}
                    placeholder="Ex.: questão trabalhista, análise de contrato"
                    disabled={isFormSubmitting}
                    className={fieldClass}
                  />
                </Field>
                <Field id="juridico-descricao" label="Descrição da situação" error="Descreva sua situação ou dúvida." className="sm:col-span-2">
                  <textarea
                    id="juridico-descricao"
                    name="descricao"
                    required
                    maxLength={3000}
                    rows={5}
                    placeholder="Descreva sua situação ou dúvida jurídica..."
                    disabled={isFormSubmitting}
                    className={`${fieldClass} resize-y min-h-32`}
                  />
                </Field>

                {formStatus === 'error' && (
                  <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:col-span-2 animate-scale-in">
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
