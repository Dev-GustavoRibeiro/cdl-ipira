'use client';

import React, { useId, useState } from 'react';
import { FaTimes, FaSpinner, FaCheckCircle } from 'react-icons/fa';
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

const inputClass = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent';

// Máscara de CPF: 000.000.000-00
function maskCPF(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export default function RegistrationModal({ isOpen, onClose, event }: RegistrationModalProps) {
  const isClient = useIsClient();

  if (!isClient || !isOpen || !event) return null;

  // O formulário só existe enquanto o modal está aberto: ao fechar, os dados são descartados
  return createPortal(<RegistrationDialog onClose={onClose} event={event} />, document.body);
}

function RegistrationDialog({ onClose, event }: { onClose: () => void; event: NonNullable<RegistrationModalProps['event']> }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    company: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const id = useId();
  const dialogRef = useModalBehavior<HTMLDivElement>(true, onClose);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      ></div>

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        tabIndex={-1}
        className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative z-10 flex flex-col animate-scale-in"
      >
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar inscrição"
          className="absolute top-4 right-4 z-20 p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-8 h-8" />
              </div>
              <h3 id={`${id}-title`} className="text-2xl font-bold text-gray-900 mb-2">Inscrição Confirmada!</h3>
              <p className="text-gray-600 mb-6">
                Sua presença no evento <br />
                <span className="font-bold text-[#003f7f]">{event.title}</span><br />
                foi registrada com sucesso.
              </p>
              {/* O botão de envio some ao confirmar: o foco vai para cá para não cair fora do diálogo */}
              <button
                type="button"
                onClick={onClose}
                autoFocus
                className="w-full bg-[#00a859] text-white py-3 rounded-lg font-bold hover:bg-[#008f4c] transition-colors shadow-lg"
              >
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center mb-6">
                <h3 id={`${id}-title`} className="text-2xl font-black text-[#003f7f] mb-2">Inscreva-se</h3>
                <p className="text-sm text-gray-600">
                  Preencha os dados para participar do evento<br />
                  <span className="font-bold text-[#003f7f]">{event.title}</span>
                </p>
              </div>

              <div>
                <label htmlFor={`${id}-name`} className="block text-sm font-bold text-gray-700 mb-1">Nome Completo *</label>
                <input
                  id={`${id}-name`}
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor={`${id}-cpf`} className="block text-sm font-bold text-gray-700 mb-1">CPF *</label>
                <input
                  id={`${id}-cpf`}
                  type="text"
                  inputMode="numeric"
                  required
                  autoComplete="off"
                  aria-describedby={`${id}-cpf-hint`}
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                  className={inputClass}
                  placeholder="000.000.000-00"
                />
                <p id={`${id}-cpf-hint`} className="text-xs text-gray-500 mt-1">Necessário para garantir inscrição única.</p>
              </div>

              <div>
                <label htmlFor={`${id}-email`} className="block text-sm font-bold text-gray-700 mb-1">E-mail *</label>
                <input
                  id={`${id}-email`}
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor={`${id}-phone`} className="block text-sm font-bold text-gray-700 mb-1">Telefone/WhatsApp *</label>
                <input
                  id={`${id}-phone`}
                  type="tel"
                  inputMode="numeric"
                  required
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClass}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label htmlFor={`${id}-company`} className="block text-sm font-bold text-gray-700 mb-1">Empresa (Opcional)</label>
                <input
                  id={`${id}-company`}
                  type="text"
                  autoComplete="organization"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={inputClass}
                  placeholder="Nome da sua empresa"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#003f7f] text-white py-3.5 rounded-lg font-bold hover:bg-[#005a9e] transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading && <FaSpinner className="animate-spin" />}
                {isLoading ? 'Confirmando Inscrição...' : 'Confirmar Inscrição'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
