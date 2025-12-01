'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaFileExport, FaUser, FaEnvelope, FaPhone, FaBuilding, FaCalendar, FaTrash } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface RegistrationListModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number | null;
  eventTitle: string;
}

interface Registration {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  created_at: string;
}

export default function RegistrationListModal({ isOpen, onClose, eventId, eventTitle }: RegistrationListModalProps) {
  const [mounted, setMounted] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && eventId) {
      fetchRegistrations();
    } else {
      setRegistrations([]);
      setSearchTerm('');
    }
  }, [isOpen, eventId]);

  const fetchRegistrations = async () => {
    if (!eventId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este inscrito?')) return;

    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Tentar atualizar o contador de participantes
      // Nota: Em uma implementação ideal, isso seria feito por uma trigger no banco ou uma function
      // Mas como estamos fazendo manualmente na inserção, vamos tentar manter consistente aqui
      try {
        const { data: eventData } = await supabase
          .from('events')
          .select('attendees')
          .eq('id', eventId)
          .single();

        if (eventData && eventData.attendees > 0) {
          await supabase
            .from('events')
            .update({ attendees: eventData.attendees - 1 })
            .eq('id', eventId);
        }
      } catch (countError) {
        console.error('Erro ao atualizar contador de participantes:', countError);
      }

      toast.success('Inscrito excluído com sucesso');
      fetchRegistrations();
    } catch (error) {
      console.error('Erro ao excluir inscrito:', error);
      toast.error('Erro ao excluir inscrito');
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    if (registrations.length === 0) return;

    const headers = ['Nome', 'E-mail', 'Telefone', 'Empresa', 'Data Inscrição'];
    const csvContent = [
      headers.join(','),
      ...registrations.map(reg => [
        `"${reg.name}"`,
        `"${reg.email}"`,
        `"${reg.phone}"`,
        `"${reg.company || '-'}"`,
        `"${new Date(reg.created_at).toLocaleString('pt-BR')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inscritos_${eventTitle.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      ></div>
      
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative z-10 flex flex-col animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-bold text-[#003f7f]">Inscritos no Evento</h3>
            <p className="text-sm text-gray-600 truncate max-w-md">{eventTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#003f7f] focus:border-[#003f7f]"
              />
            </div>
            
            <button
              onClick={handleExport}
              disabled={registrations.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00a859] text-white rounded-lg font-bold hover:bg-[#008f4c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaFileExport />
              Exportar CSV
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Contato</th>
                    <th className="px-4 py-3">Empresa</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Carregando inscritos...
                      </td>
                    </tr>
                  ) : filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        {registrations.length === 0 ? 'Nenhum inscrito ainda.' : 'Nenhum inscrito encontrado com o filtro.'}
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                              <FaUser className="w-3 h-3" />
                            </div>
                            {reg.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <FaEnvelope className="w-3 h-3 text-gray-400" />
                              {reg.email}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FaPhone className="w-3 h-3 text-gray-400" />
                              {reg.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {reg.company ? (
                            <div className="flex items-center gap-1.5">
                              <FaBuilding className="w-3 h-3 text-gray-400" />
                              {reg.company}
                            </div>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <FaCalendar className="w-3 h-3 text-gray-400" />
                            {new Date(reg.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDelete(reg.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir inscrito"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 text-right">
            Total: <strong>{registrations.length}</strong> inscritos
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
