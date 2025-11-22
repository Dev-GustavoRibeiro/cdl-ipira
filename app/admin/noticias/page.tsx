'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaNewspaper } from 'react-icons/fa';

interface Noticia {
  id: number;
  title: string;
  category: string;
  date: string;
  status: 'published' | 'draft';
}

const noticias: Noticia[] = [
  { id: 1, title: 'Operações de crédito do BNDES chegam a R$ 230 bilhões', category: 'Economia', date: '15/11/2024', status: 'published' },
  { id: 2, title: 'Vendas no comércio caem 0,3% em setembro', category: 'Comércio', date: '14/11/2024', status: 'published' },
  { id: 3, title: 'Brasil estima colheita de 354,8 milhões de toneladas', category: 'Agronegócio', date: '13/11/2024', status: 'published' },
  { id: 4, title: 'Black Friday: Dicas para aumentar suas vendas', category: 'Dicas', date: '12/11/2024', status: 'draft' },
];

export default function AdminNoticiasPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNoticias = noticias.filter(noticia =>
    noticia.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    noticia.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Gerenciar Notícias
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Crie, edite e gerencie as notícias do site
          </p>
        </div>
        <Link
          href="/admin/noticias/novo"
          className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Nova Notícia
        </Link>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Buscar notícias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#003f7f] text-white">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Título</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Categoria</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Data</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNoticias.map((noticia) => (
                <tr key={noticia.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">
                      {noticia.title}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className="inline-block bg-[#00a859] text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                      {noticia.category}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                    {noticia.date}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                      noticia.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {noticia.status === 'published' ? 'Publicada' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/noticias/${noticia.id}`}
                        target="_blank"
                        className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors"
                        title="Visualizar"
                      >
                        <FaEye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/noticias/${noticia.id}/editar`}
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

      {/* Paginação */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="text-sm text-gray-600">
          Mostrando <span className="font-bold">1-4</span> de <span className="font-bold">4</span> notícias
        </div>
        <div className="flex gap-2">
          <button className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            Anterior
          </button>
          <button className="px-3 sm:px-4 py-2 bg-[#003f7f] text-white rounded-lg font-bold text-sm">
            1
          </button>
          <button className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}




