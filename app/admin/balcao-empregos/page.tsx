'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaBriefcase, FaCheckCircle, FaTimes } from 'react-icons/fa';

interface Vaga {
  id: number;
  title: string;
  company: string;
  quantity: number;
  date: string;
  status: 'active' | 'closed';
}

const vagas = [
  { id: 1, title: 'SECRETARIA ESCOLAR', company: 'Escola Municipal', quantity: 1, date: '15/01/2025', status: 'active' },
  { id: 2, title: 'ZELADORA - HOMANY MODA', company: 'Homany Moda Masculina', quantity: 1, date: '14/01/2025', status: 'active' },
  { id: 3, title: 'COORDENADOR ESTRATEGICO', company: 'CDL Sorriso', quantity: 1, date: '13/01/2025', status: 'active' },
  { id: 4, title: 'VENDEDOR', company: 'Loja de Roupas', quantity: 2, date: '11/01/2025', status: 'closed' },
];

export default function AdminBalcaoEmpregosPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVagas = vagas.filter(vaga =>
    vaga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vaga.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Gerenciar Vagas
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie as vagas de emprego cadastradas
          </p>
        </div>
        <Link
          href="/admin/balcao-empregos/novo"
          className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Nova Vaga
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Buscar vagas..."
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
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Vaga</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Empresa</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Quantidade</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Data</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVagas.map((vaga) => (
                <tr key={vaga.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="text-sm sm:text-base font-semibold text-gray-900">
                      {vaga.title}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                    {vaga.company}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className="inline-block bg-[#003f7f] text-white px-3 py-1 rounded-lg text-xs font-bold">
                      {vaga.quantity}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                    {vaga.date}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                      vaga.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vaga.status === 'active' ? (
                        <>
                          <FaCheckCircle />
                          Ativa
                        </>
                      ) : (
                        <>
                          <FaTimes />
                          Encerrada
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/balcao-empregos`}
                        target="_blank"
                        className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors"
                        title="Visualizar"
                      >
                        <FaEye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/balcao-empregos/${vaga.id}/editar`}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




