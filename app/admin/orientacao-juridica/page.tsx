'use client';

import React, { useState } from 'react';
import { FaSearch, FaGavel, FaCheckCircle, FaClock, FaEnvelope } from 'react-icons/fa';

interface Solicitacao {
  id: number;
  nome: string;
  empresa: string;
  assunto: string;
  data: string;
  status: 'pending' | 'in_progress' | 'completed';
}

const solicitacoes = [
  { id: 1, nome: 'João Silva', empresa: 'Loja ABC', assunto: 'Questão trabalhista', data: '15/01/2025', status: 'pending' },
  { id: 2, nome: 'Maria Santos', empresa: 'Comércio XYZ', assunto: 'Análise de contrato', data: '14/01/2025', status: 'in_progress' },
  { id: 3, nome: 'Pedro Oliveira', empresa: 'Empresa 123', assunto: 'Orientação tributária', data: '13/01/2025', status: 'completed' },
];

export default function AdminOrientacaoJuridicaPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSolicitacoes = solicitacoes.filter(solicitacao =>
    solicitacao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitacao.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitacao.assunto.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
          Solicitações de Orientação Jurídica
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Gerencie as solicitações de orientação jurídica dos associados
        </p>
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
                      {solicitacao.data}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                        {statusBadge.icon}
                        {statusBadge.text}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <button className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors" title="Ver Detalhes">
                        <FaEnvelope className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




