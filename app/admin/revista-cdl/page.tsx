'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaBook } from 'react-icons/fa';

interface Edicao {
  id: number;
  title: string;
  date: string;
}

const edicoes = [
  { id: 1, title: 'Revista CDL - Edição 01/2025', date: 'Janeiro 2025' },
  { id: 2, title: 'Revista CDL - Edição 12/2024', date: 'Dezembro 2024' },
  { id: 3, title: 'Revista CDL - Edição 11/2024', date: 'Novembro 2024' },
];

export default function AdminRevistaCDLPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Gerenciar Revista CDL
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie as edições da Revista CDL
          </p>
        </div>
        <Link
          href="/admin/revista-cdl/novo"
          className="inline-flex items-center gap-2 bg-[#ffd000] text-[#003f7f] px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#ffed4e] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Nova Edição
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {edicoes.map((edicao) => (
          <div key={edicao.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-48 bg-linear-to-br from-[#003f7f] to-[#0066cc] flex items-center justify-center">
              <FaBook className="w-24 h-24 text-white/30" />
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-2">
                {edicao.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {edicao.date}
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href={`/revista-cdl`}
                  target="_blank"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-3 py-2 rounded-lg font-bold hover:bg-[#0066cc] transition-colors text-sm"
                >
                  <FaEye />
                  Ver
                </Link>
                <Link
                  href={`/admin/revista-cdl/${edicao.id}/editar`}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




