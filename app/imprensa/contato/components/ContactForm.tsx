'use client';

import React from 'react';
import { FaPaperPlane, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ContactForm = ({ formData, isSubmitting, submitStatus, onChange, onSubmit }: ContactFormProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#003f7f] mb-3">Envie sua Mensagem</h2>
        <p className="text-gray-600">
          Preencha o formulário abaixo e entraremos em contato o mais breve possível.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Nome */}
        <div>
          <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#003f7f] focus:outline-none transition-colors"
            placeholder="Seu nome completo"
          />
        </div>

        {/* E-mail */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            E-mail *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#003f7f] focus:outline-none transition-colors"
            placeholder="seu@email.com"
          />
        </div>

        {/* Telefone */}
        <div>
          <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-2">
            Telefone *
          </label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#003f7f] focus:outline-none transition-colors"
            placeholder="(75) 99999-9999"
          />
        </div>

        {/* Assunto */}
        <div>
          <label htmlFor="assunto" className="block text-sm font-semibold text-gray-700 mb-2">
            Assunto *
          </label>
          <select
            id="assunto"
            name="assunto"
            value={formData.assunto}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#003f7f] focus:outline-none transition-colors"
          >
            <option value="">Selecione um assunto</option>
            <option value="associacao">Associação</option>
            <option value="spc">Consulta SPC</option>
            <option value="certificado">Certificado Digital</option>
            <option value="eventos">Eventos</option>
            <option value="duvidas">Dúvidas Gerais</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        {/* Mensagem */}
        <div>
          <label htmlFor="mensagem" className="block text-sm font-semibold text-gray-700 mb-2">
            Mensagem *
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            value={formData.mensagem}
            onChange={onChange}
            required
            rows={6}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#003f7f] focus:outline-none transition-colors resize-none"
            placeholder="Escreva sua mensagem aqui..."
          />
        </div>

        {/* Status de Envio */}
        {submitStatus === 'success' && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
            <FaCheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <p className="text-green-800 font-semibold">
              Mensagem enviada com sucesso! Entraremos em contato em breve.
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
            <FaTimesCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-red-800 font-semibold">
              Erro ao enviar mensagem. Tente novamente ou entre em contato por telefone.
            </p>
          </div>
        )}

        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#003f7f] text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-[#0066cc] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <FaPaperPlane className="w-5 h-5" />
              <span>Enviar Mensagem</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;



