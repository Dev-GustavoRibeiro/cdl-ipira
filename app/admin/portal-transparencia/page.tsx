'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaDownload, FaFileAlt } from 'react-icons/fa';

interface Documento {
  id: number;
  title: string;
  type: string;
  date: string;
}

const documentos = [
  { id: 1, title: 'Prestação de Contas 2024', type: 'PDF', date: '15/01/2025' },
  { id: 2, title: 'Relatório Anual 2024', type: 'PDF', date: '10/01/2025' },
  { id: 3, title: 'Demonstrativo Financeiro - Dezembro 2024', type: 'PDF', date: '05/01/2025' },
];

export default function AdminPortalTransparenciaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Gerenciar Documentos
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie os documentos do Portal de Transparência
          </p>
        </div>
        <Link
          href="/admin/portal-transparencia/novo"
          className="inline-flex items-center gap-2 bg-[#00a859] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#00d670] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Novo Documento
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#00a859] text-white">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Documento</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Tipo</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Data</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documentos.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#003f7f] rounded-lg flex items-center justify-center text-white">
                        <FaFileAlt className="w-5 h-5" />
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-gray-900">
                        {doc.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-xs font-bold">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                    {doc.date}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors" title="Download">
                        <FaDownload className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/portal-transparencia/${doc.id}/editar`}
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




