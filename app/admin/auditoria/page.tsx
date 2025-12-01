'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  FaHistory, FaSearch, FaFilter, FaNewspaper, FaCalendarAlt, 
  FaVideo, FaImages, FaBriefcase, FaStore, FaUser, FaSignInAlt,
  FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaSpinner, FaChevronLeft,
  FaChevronRight, FaDatabase
} from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

interface AuditLog {
  id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  record_title: string | null;
  user_id: string | null;
  user_name: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

const ACTION_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  'CREATE': { label: 'Criação', color: 'bg-green-100 text-green-800', icon: <FaPlus /> },
  'UPDATE': { label: 'Atualização', color: 'bg-blue-100 text-blue-800', icon: <FaEdit /> },
  'DELETE': { label: 'Exclusão', color: 'bg-red-100 text-red-800', icon: <FaTrash /> },
  'LOGIN': { label: 'Login', color: 'bg-purple-100 text-purple-800', icon: <FaSignInAlt /> },
  'LOGOUT': { label: 'Logout', color: 'bg-gray-100 text-gray-800', icon: <FaSignOutAlt /> },
};

const TABLE_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  'news': { label: 'Notícias', icon: <FaNewspaper /> },
  'events': { label: 'Eventos', icon: <FaCalendarAlt /> },
  'videos': { label: 'Vídeos', icon: <FaVideo /> },
  'hero_slides': { label: 'Banners', icon: <FaImages /> },
  'partners': { label: 'Associados', icon: <FaStore /> },
  'jobs': { label: 'Vagas', icon: <FaBriefcase /> },
  'admin_users': { label: 'Usuários', icon: <FaUser /> },
  'auth': { label: 'Autenticação', icon: <FaSignInAlt /> },
};

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterTable, setFilterTable] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('audit_log')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filterAction) {
        query = query.eq('action', filterAction);
      }
      if (filterTable) {
        query = query.eq('table_name', filterTable);
      }
      if (searchTerm) {
        query = query.or(`record_title.ilike.%${searchTerm}%,user_name.ilike.%${searchTerm}%`);
      }

      // Paginação
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error: queryError, count } = await query;

      if (queryError) {
        throw queryError;
      }

      setLogs(data || []);
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (err) {
      console.error('Erro ao carregar logs de auditoria:', err);
      setError('Erro ao carregar os logs de auditoria. A tabela pode não existir ainda.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filterAction, filterTable, searchTerm]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getActionInfo = (action: string) => {
    return ACTION_LABELS[action] || { label: action, color: 'bg-gray-100 text-gray-800', icon: <FaDatabase /> };
  };

  const getTableInfo = (tableName: string) => {
    return TABLE_LABELS[tableName] || { label: tableName, icon: <FaDatabase /> };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadLogs();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterAction('');
    setFilterTable('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] flex items-center gap-3">
            <FaHistory className="text-[#00a859]" />
            Auditoria
          </h1>
          <p className="text-gray-600 mt-1">
            Registro de todas as ações executadas no sistema
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total de registros: <span className="font-bold text-[#003f7f]">{totalCount}</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent transition-all"
              />
            </div>

            {/* Filtro de Ação */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filterAction}
                onChange={(e) => {
                  setFilterAction(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="">Todas as ações</option>
                <option value="CREATE">Criação</option>
                <option value="UPDATE">Atualização</option>
                <option value="DELETE">Exclusão</option>
                <option value="LOGIN">Login</option>
                <option value="LOGOUT">Logout</option>
              </select>
            </div>

            {/* Filtro de Tabela */}
            <div className="relative">
              <FaDatabase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filterTable}
                onChange={(e) => {
                  setFilterTable(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="">Todas as tabelas</option>
                <option value="news">Notícias</option>
                <option value="events">Eventos</option>
                <option value="videos">Vídeos</option>
                <option value="hero_slides">Banners</option>
                <option value="partners">Associados</option>
                <option value="jobs">Vagas</option>
                <option value="auth">Autenticação</option>
              </select>
            </div>

            {/* Botões */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#003f7f] text-white px-4 py-2.5 rounded-lg hover:bg-[#002d5c] transition-colors font-semibold"
              >
                Buscar
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Limpar
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Tabela de Logs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <FaSpinner className="animate-spin text-[#003f7f] text-3xl" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <FaDatabase className="mx-auto text-gray-300 text-5xl mb-4" />
            <p className="text-gray-500 mb-4">{error}</p>
            <div className="bg-gray-50 rounded-lg p-4 max-w-2xl mx-auto text-left">
              <p className="text-sm text-gray-600 mb-2 font-semibold">Para criar a tabela de auditoria, execute o seguinte SQL no Supabase:</p>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
{`CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  record_title TEXT,
  user_id TEXT,
  user_name TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX idx_audit_log_action ON audit_log(action);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for audit_log" ON audit_log FOR ALL USING (true);`}
              </pre>
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16">
            <FaHistory className="mx-auto text-gray-300 text-5xl mb-4" />
            <p className="text-gray-500">Nenhum registro de auditoria encontrado</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Ação
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Tabela
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Registro
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      IP
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((log) => {
                    const actionInfo = getActionInfo(log.action);
                    const tableInfo = getTableInfo(log.table_name);
                    
                    return (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(log.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${actionInfo.color}`}>
                            {actionInfo.icon}
                            {actionInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                            <span className="text-[#003f7f]">{tableInfo.icon}</span>
                            {tableInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {log.record_title || log.record_id || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {log.user_name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {log.ip_address || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {logs.map((log) => {
                const actionInfo = getActionInfo(log.action);
                const tableInfo = getTableInfo(log.table_name);
                
                return (
                  <div key={log.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${actionInfo.color}`}>
                        {actionInfo.icon}
                        {actionInfo.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#003f7f]">{tableInfo.icon}</span>
                      <span className="font-semibold">{tableInfo.label}</span>
                      {log.record_title && (
                        <span className="text-gray-600 truncate">- {log.record_title}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Usuário: {log.user_name || '-'}</span>
                      <span className="font-mono">{log.ip_address || '-'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
