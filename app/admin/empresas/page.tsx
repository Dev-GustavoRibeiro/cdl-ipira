'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaStore } from 'react-icons/fa';

interface Empresa {
  id: number;
  nome: string;
  categoria: string;
  endereco: string;
  telefone: string;
  email?: string;
}

const empresas = [
  { id: 1, nome: 'Supermercado Central', categoria: 'Supermercado', endereco: 'Rua Principal, 123', telefone: '(75) 99999-9999', email: 'contato@supercentral.com.br' },
  { id: 2, nome: 'Farmácia Saúde & Vida', categoria: 'Farmácia', endereco: 'Av. Comercial, 456', telefone: '(75) 99999-8888', email: 'contato@farmaciasaudevida.com.br' },
  { id: 3, nome: 'Loja de Roupas Moda & Estilo', categoria: 'Vestuário', endereco: 'Rua do Comércio, 789', telefone: '(75) 99999-7777', email: 'contato@modaestilo.com.br' },
  { id: 4, nome: 'Padaria Doce Sabor', categoria: 'Padaria', endereco: 'Rua das Flores, 321', telefone: '(75) 99999-6666' },
];

export default function AdminEmpresasPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmpresas = empresas.filter(empresa =>
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Gerenciar Empresas
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie as empresas associadas à CDL Ipirá
          </p>
        </div>
        <Link
          href="/admin/empresas/novo"
          className="inline-flex items-center gap-2 bg-[#00a859] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#00d670] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Nova Empresa
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Buscar empresas..."
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
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Empresa</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Categoria</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Endereço</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Contato</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmpresas.map((empresa) => (
                <tr key={empresa.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="text-sm sm:text-base font-semibold text-gray-900">
                      {empresa.nome}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className="inline-block bg-[#003f7f] text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                      {empresa.categoria}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 line-clamp-1">
                    {empresa.endereco}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="text-xs sm:text-sm text-gray-600">
                      <div>{empresa.telefone}</div>
                      {empresa.email && (
                        <div className="text-[10px] text-gray-500 line-clamp-1">{empresa.email}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/beneficios/empresas`}
                        target="_blank"
                        className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors"
                        title="Visualizar"
                      >
                        <FaEye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/empresas/${empresa.id}/editar`}
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




