'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaCalendarAlt } from 'react-icons/fa';

interface Evento {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'past';
}

const eventos = [
  { id: 1, title: 'Conexão & Growth 2025', date: '15/03/2025', location: 'Centro de Convenções', category: 'Networking', status: 'upcoming' },
  { id: 2, title: 'Workshop de Gestão Financeira', date: '22/02/2025', location: 'Sede CDL Ipirá', category: 'Capacitação', status: 'upcoming' },
  { id: 3, title: 'Feira de Negócios Regional', date: '10/02/2025', location: 'Praça Central', category: 'Feira', status: 'upcoming' },
  { id: 4, title: 'Cerimônia de Posse', date: '20/01/2025', location: 'Sede CDL Ipirá', category: 'Institucional', status: 'past' },
];

export default function AdminEventosPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEventos = eventos.filter(evento =>
    evento.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return { text: 'Próximo', color: 'bg-green-100 text-green-800' };
      case 'ongoing':
        return { text: 'Em Andamento', color: 'bg-yellow-100 text-yellow-800' };
      case 'past':
        return { text: 'Realizado', color: 'bg-gray-100 text-gray-800' };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Gerenciar Eventos
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Crie, edite e gerencie os eventos do site
          </p>
        </div>
        <Link
          href="/admin/eventos/novo"
          className="inline-flex items-center gap-2 bg-[#00a859] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#00d670] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Novo Evento
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#00a859] text-white">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Evento</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Data</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Local</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Categoria</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEventos.map((evento) => {
                const statusBadge = getStatusBadge(evento.status);
                return (
                  <tr key={evento.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="text-sm sm:text-base font-semibold text-gray-900">
                        {evento.title}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                      {evento.date}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                      {evento.location}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className="inline-block bg-[#003f7f] text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                        {evento.category}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/eventos`}
                          target="_blank"
                          className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <FaEye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/eventos/${evento.id}/editar`}
                          className="p-2 text-[#00a859] hover:bg-[#00a859] hover:text-white rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FaEdit className="w-4 h-4" />
                        </Link>
                        <button
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




