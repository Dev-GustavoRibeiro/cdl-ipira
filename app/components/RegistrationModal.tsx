'use client';

import React, { useState } from 'react';
import { FaTimes, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: number;
    title: string;
    attendees?: number;
  } | null;
}

export default function RegistrationModal({ isOpen, onClose, event }: RegistrationModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Reset states when modal closes or opens
  React.useEffect(() => {
    if (!isOpen) {
      setIsSuccess(false);
      setFormData({ name: '', email: '', phone: '', company: '' });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert([
          {
            event_id: event.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company
          }
        ]);

      if (error) throw error;

      // Atualizar contagem de inscritos
      if (event.attendees !== undefined) {
        await supabase
          .from('events')
          .update({ attendees: (event.attendees || 0) + 1 })
          .eq('id', event.id);
      }

      setIsSuccess(true);
      toast.success('Inscrição realizada com sucesso!');
    } catch (error) {
      console.error('Erro ao realizar inscrição:', error);
      toast.error('Erro ao realizar inscrição. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !isOpen || !event) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="bg-white w-full max-w-md overflow-y-auto rounded-2xl shadow-2xl relative z-10 flex flex-col animate-scale-in">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="text-center py-4 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Inscrição Confirmada!</h3>
              <p className="text-gray-600 mb-6">
                Sua presença no evento <br/>
                <span className="font-bold text-[#003f7f]">{event.title}</span><br/>
                foi registrada com sucesso.
              </p>
              <button 
                onClick={onClose}
                className="w-full bg-[#00a859] text-white py-3 rounded-lg font-bold hover:bg-[#008f4c] transition-colors shadow-lg"
              >
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-[#003f7f] mb-2">Inscreva-se</h3>
                <p className="text-sm text-gray-600">
                  Preencha os dados para participar do evento<br/>
                  <span className="font-bold text-[#003f7f]">{event.title}</span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Telefone/WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Empresa (Opcional)</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
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
    </div>,
    document.body
  );
}



