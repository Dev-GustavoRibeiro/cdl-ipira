'use client';

import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useModalBehavior } from '@/lib/hooks/useModalBehavior';

interface JobRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JobRegistrationModal = ({ isOpen, onClose }: JobRegistrationModalProps) => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitStatus('idle');

    const formData = new FormData(form);
    const empresa = formData.get('empresa') as string;
    const cargo = formData.get('cargo') as string;
    const descricao = formData.get('descricao') as string;
    const quantidade = formData.get('quantidade') as string;
    const localizacao = formData.get('localizacao') as string;
    const contato = formData.get('contato') as string;
    const email = formData.get('email') as string;

    const message = `Olá, gostaria de cadastrar uma nova vaga no Balcão de Empregos da CDL:\n\n` +
      `🏢 *Empresa:* ${empresa}\n` +
      `💼 *Cargo:* ${cargo}\n` +
      `📝 *Descrição:* ${descricao}\n` +
      `🔢 *Quantidade:* ${quantidade}\n` +
      `📍 *Localização:* ${localizacao}\n` +
      `👤 *Contato:* ${contato}\n` +
      `📧 *Email:* ${email}`;

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
    setTimeout(() => {
      onClose();
      setSubmitStatus('idle');
    }, 3000);
  };

  const handleClose = () => {
    onClose();
    setSubmitStatus('idle');
  };

  const dialogRef = useModalBehavior<HTMLDivElement>(isOpen, handleClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-registration-title"
        tabIndex={-1}
        className="outline-none bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 id="job-registration-title" className="text-2xl sm:text-4xl font-black text-[#003f7f]">
            Cadastre sua Vaga
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label="Fechar"
          >
            <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <p className="text-gray-700 text-sm sm:text-base mb-6 sm:mb-8 text-left sm:text-justify">
          Preencha os dados abaixo para enviar as informações da sua vaga diretamente para nossa equipe via WhatsApp.
        </p>

        {/* Mensagem de Sucesso */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-[#00a859] text-white rounded-xl flex items-center gap-3 animate-blur-fade-in">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold">Redirecionando para o WhatsApp...</p>
              <p className="text-sm text-white/90">Finalize o cadastro enviando a mensagem.</p>
            </div>
          </div>
        )}

        {/* Mensagem de Erro */}
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-500 text-white rounded-xl flex items-center gap-3 animate-blur-fade-in">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold">Não foi possível abrir o WhatsApp</p>
              <p className="text-sm text-white/90">Permita pop-ups para este site e tente novamente, ou fale conosco pelo (75) 3254-1599.</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label htmlFor="vaga-empresa" className="block text-sm font-bold text-gray-700 mb-2">
                Nome da Empresa *
              </label>
              <input
                type="text"
                id="vaga-empresa"
                name="empresa"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="vaga-cargo" className="block text-sm font-bold text-gray-700 mb-2">
                Cargo/Vaga *
              </label>
              <input
                type="text"
                id="vaga-cargo"
                name="cargo"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label htmlFor="vaga-descricao" className="block text-sm font-bold text-gray-700 mb-2">
              Descrição da Vaga *
            </label>
            <textarea
              id="vaga-descricao"
              name="descricao"
              required
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label htmlFor="vaga-quantidade" className="block text-sm font-bold text-gray-700 mb-2">
                Quantidade de Vagas *
              </label>
              <input
                type="number"
                id="vaga-quantidade"
                name="quantidade"
                min="1"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="vaga-localizacao" className="block text-sm font-bold text-gray-700 mb-2">
                Localização *
              </label>
              <input
                type="text"
                id="vaga-localizacao"
                name="localizacao"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label htmlFor="vaga-contato" className="block text-sm font-bold text-gray-700 mb-2">
                Contato *
              </label>
              <input
                type="text"
                id="vaga-contato"
                name="contato"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="vaga-email" className="block text-sm font-bold text-gray-700 mb-2">
                E-mail *
              </label>
              <input
                type="email"
                id="vaga-email"
                name="email"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={submitStatus === 'success'}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Enviar via WhatsApp
              <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-gray-50 transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobRegistrationModal;



