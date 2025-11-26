'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaGavel, FaCheckCircle, FaClock, FaEnvelope, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Modal from '@/app/components/Modal';
import { supabase } from '@/lib/supabase';

interface Solicitacao {
  id: number;
  nome: string;
  empresa: string;
  assunto: string;
  data: string; // Será usado created_at
  status: 'pending' | 'in_progress' | 'completed';
  created_at?: string;
}

export default function AdminOrientacaoJuridicaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSolicitacao, setCurrentSolicitacao] = useState<Partial<Solicitacao>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchSolicitacoes = async () => {
    const { data, error } = await supabase
      .from('legal_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar solicitações:', error);
    } else {
      // Mapear created_at para data para compatibilidade visual se necessário, 
      // ou usar created_at diretamente na renderização.
      setSolicitacoes(data || []);
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const solicitacaoData = {
      nome: currentSolicitacao.nome,
      empresa: currentSolicitacao.empresa,
      assunto: currentSolicitacao.assunto,
      status: currentSolicitacao.status || 'pending',
    };

    try {
      if (isEditing && currentSolicitacao.id) {
        const { error } = await supabase
          .from('legal_requests')
          .update(solicitacaoData)
          .eq('id', currentSolicitacao.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('legal_requests').insert([solicitacaoData]);
        if (error) throw error;
      }
      
      await fetchSolicitacoes();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar solicitação:', error);
      alert('Erro ao salvar solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta solicitação?')) {
      try {
        const { error } = await supabase.from('legal_requests').delete().eq('id', id);
        if (error) throw error;
        await fetchSolicitacoes();
      } catch (error) {
        console.error('Erro ao excluir solicitação:', error);
        alert('Erro ao excluir solicitação');
      }
    }
  };

  const openModal = (solicitacao?: Solicitacao) => {
    if (solicitacao) {
      setCurrentSolicitacao(solicitacao);
      setIsEditing(true);
    } else {
      setCurrentSolicitacao({ status: 'pending' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSolicitacao({});
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: <FaClock /> };
      case 'in_progress':
        return { text: 'Em Andamento', color: 'bg-blue-100 text-blue-800', icon: <FaGavel /> };
      case 'completed':
        return { text: 'Concluída', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle /> };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800', icon: <FaClock /> };
    }
  };

  const filteredSolicitacoes = solicitacoes.filter(solicitacao =>
    solicitacao.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitacao.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitacao.assunto?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Solicitações de Orientação Jurídica
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie as solicitações de orientação jurídica dos associados
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#005a9e] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Nova Solicitação
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Buscar solicitações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#003f7f] text-white">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Solicitante</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Empresa</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Assunto</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Data</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSolicitacoes.map((solicitacao) => {
                const statusBadge = getStatusBadge(solicitacao.status);
                return (
                  <tr key={solicitacao.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="text-sm sm:text-base font-semibold text-gray-900">
                        {solicitacao.nome}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                      {solicitacao.empresa}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                      {solicitacao.assunto}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                      {solicitacao.created_at ? new Date(solicitacao.created_at).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                        {statusBadge.icon}
                        {statusBadge.text}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openModal(solicitacao)}
                          className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors" 
                          title="Editar"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(solicitacao.id)}
                          className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors" 
                          title="Excluir"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredSolicitacoes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Nenhuma solicitação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Editar Solicitação' : 'Nova Solicitação'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Solicitante</label>
            <input
              type="text"
              required
              value={currentSolicitacao.nome || ''}
              onChange={(e) => setCurrentSolicitacao({ ...currentSolicitacao, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#003f7f] focus:border-[#003f7f]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <input
              type="text"
              required
              value={currentSolicitacao.empresa || ''}
              onChange={(e) => setCurrentSolicitacao({ ...currentSolicitacao, empresa: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#003f7f] focus:border-[#003f7f]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
            <input
              type="text"
              required
              value={currentSolicitacao.assunto || ''}
              onChange={(e) => setCurrentSolicitacao({ ...currentSolicitacao, assunto: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#003f7f] focus:border-[#003f7f]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={currentSolicitacao.status || 'pending'}
              onChange={(e) => setCurrentSolicitacao({ ...currentSolicitacao, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#003f7f] focus:border-[#003f7f]"
            >
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluída</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#003f7f] text-white rounded-lg hover:bg-[#003f7f]/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
