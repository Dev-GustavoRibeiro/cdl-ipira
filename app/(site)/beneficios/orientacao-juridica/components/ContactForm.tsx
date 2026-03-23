'use client';

import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface ContactFormProps {
  isFormSubmitting: boolean;
  formStatus: 'idle' | 'success' | 'error';
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ContactForm = ({ isFormSubmitting, formStatus, onSubmit }: ContactFormProps) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-linear-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-200">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
                Solicite sua Orientação
              </h2>
              <p className="text-gray-700 text-sm sm:text-base text-justify">
                Preencha o formulário abaixo e nossa equipe entrará em contato para agendar sua orientação jurídica.
              </p>
            </div>

            {/* Mensagem de Sucesso */}
            {formStatus === 'success' && (
              <div className="mb-6 p-4 bg-[#00a859] text-white rounded-xl flex items-center gap-3 animate-blur-fade-in">
                <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <div>
                  <p className="font-bold">Solicitação enviada com sucesso!</p>
                  <p className="text-sm text-white/90">Nossa equipe entrará em contato em breve.</p>
                </div>
              </div>
            )}

            {/* Mensagem de Erro */}
            {formStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-500 text-white rounded-xl flex items-center gap-3 animate-blur-fade-in">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-bold">Erro ao enviar solicitação</p>
                  <p className="text-sm text-white/90">Tente novamente ou entre em contato conosco.</p>
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    required
                    disabled={isFormSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Empresa *
                  </label>
                  <input
                    type="text"
                    name="empresa"
                    required
                    disabled={isFormSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Telefone/WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="contato"
                    required
                    disabled={isFormSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={isFormSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Assunto da Consulta *
                </label>
                <input
                  type="text"
                  name="assunto"
                  required
                  placeholder="Ex: Questão trabalhista, análise de contrato, etc."
                  disabled={isFormSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Descrição da Situação *
                </label>
                <textarea
                  name="descricao"
                  required
                  rows={5}
                  placeholder="Descreva sua situação ou dúvida jurídica..."
                  disabled={isFormSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isFormSubmitting || formStatus === 'success'}
                  className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isFormSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Solicitação
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;



