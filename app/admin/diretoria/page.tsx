'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaUsers, FaUser, FaPlus, FaEdit, FaTrash, FaSearch, FaSave, FaTimes } from 'react-icons/fa';

interface Presidente {
  id?: number;
  nome: string;
  cargo: string;
  foto: string;
  biografia: string;
  contribuicao: string;
}

interface Diretor {
  id: number;
  nome: string;
  cargo: string;
  foto: string;
  contribuicao: string;
  funcao: string;
  order: number;
}

interface Colaborador {
  id: number;
  nome: string;
  cargo: string;
  foto: string;
  contribuicao: string;
  funcao: string;
  order: number;
}

export default function AdminDiretoriaPage() {
  const [presidente, setPresidente] = useState<Presidente | null>(null);
  const [diretores, setDiretores] = useState<Diretor[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'presidente' | 'diretores' | 'colaboradores'>('presidente');
  const [isEditingPresidente, setIsEditingPresidente] = useState(false);
  const [isEditingDiretor, setIsEditingDiretor] = useState<number | null>(null);
  const [isEditingColaborador, setIsEditingColaborador] = useState<number | null>(null);
  const [isAddingDiretor, setIsAddingDiretor] = useState(false);
  const [isAddingColaborador, setIsAddingColaborador] = useState(false);

  useEffect(() => {
    // TODO: Substituir por chamada de API real
    // Exemplo: fetch('/api/admin/diretoria').then(res => res.json()).then(data => { setPresidente(data.presidente); setDiretores(data.diretores); setColaboradores(data.colaboradores); })
    const fetchDiretoria = async () => {
      try {
        // const response = await fetch('/api/admin/diretoria');
        // const data = await response.json();
        // setPresidente(data.presidente);
        // setDiretores(data.diretores);
        // setColaboradores(data.colaboradores);
        setPresidente(null);
        setDiretores([]);
        setColaboradores([]);
      } catch (error) {
        console.error('Erro ao carregar diretoria:', error);
        setPresidente(null);
        setDiretores([]);
        setColaboradores([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDiretoria();
  }, []);

  const handleSavePresidente = async (data: Presidente) => {
    try {
      // TODO: Implementar chamada de API
      // await fetch('/api/admin/diretoria/presidente', { method: 'POST', body: JSON.stringify(data) });
      setPresidente(data);
      setIsEditingPresidente(false);
    } catch (error) {
      console.error('Erro ao salvar presidente:', error);
    }
  };

  const handleSaveDiretor = async (data: Diretor) => {
    try {
      // TODO: Implementar chamada de API
      // await fetch('/api/admin/diretoria/diretor', { method: 'POST', body: JSON.stringify(data) });
      if (data.id) {
        setDiretores(diretores.map(d => d.id === data.id ? data : d));
      } else {
        setDiretores([...diretores, { ...data, id: Date.now() }]);
      }
      setIsEditingDiretor(null);
      setIsAddingDiretor(false);
    } catch (error) {
      console.error('Erro ao salvar diretor:', error);
    }
  };

  const handleSaveColaborador = async (data: Colaborador) => {
    try {
      // TODO: Implementar chamada de API
      // await fetch('/api/admin/diretoria/colaborador', { method: 'POST', body: JSON.stringify(data) });
      if (data.id) {
        setColaboradores(colaboradores.map(c => c.id === data.id ? data : c));
      } else {
        setColaboradores([...colaboradores, { ...data, id: Date.now() }]);
      }
      setIsEditingColaborador(null);
      setIsAddingColaborador(false);
    } catch (error) {
      console.error('Erro ao salvar colaborador:', error);
    }
  };

  const handleDeleteDiretor = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este diretor?')) return;
    try {
      // TODO: Implementar chamada de API
      // await fetch(`/api/admin/diretoria/diretor/${id}`, { method: 'DELETE' });
      setDiretores(diretores.filter(d => d.id !== id));
    } catch (error) {
      console.error('Erro ao excluir diretor:', error);
    }
  };

  const handleDeleteColaborador = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este colaborador?')) return;
    try {
      // TODO: Implementar chamada de API
      // await fetch(`/api/admin/diretoria/colaborador/${id}`, { method: 'DELETE' });
      setColaboradores(colaboradores.filter(c => c.id !== id));
    } catch (error) {
      console.error('Erro ao excluir colaborador:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gerenciar Diretoria</h1>
          <p className="text-gray-600 mt-1">Gerencie presidente, diretores e colaboradores</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('presidente')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'presidente'
                  ? 'border-[#003f7f] text-[#003f7f]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaUser className="inline-block mr-2" />
              Presidente
            </button>
            <button
              onClick={() => setActiveTab('diretores')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'diretores'
                  ? 'border-[#003f7f] text-[#003f7f]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaUsers className="inline-block mr-2" />
              Diretores ({diretores.length})
            </button>
            <button
              onClick={() => setActiveTab('colaboradores')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'colaboradores'
                  ? 'border-[#003f7f] text-[#003f7f]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaUsers className="inline-block mr-2" />
              Colaboradores ({colaboradores.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Tab: Presidente */}
          {activeTab === 'presidente' && (
            <div className="space-y-6">
              {!presidente && !isEditingPresidente ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                  <FaUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Nenhum presidente cadastrado</p>
                  <button
                    onClick={() => setIsEditingPresidente(true)}
                    className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0066cc] transition-colors"
                  >
                    <FaPlus /> Adicionar Presidente
                  </button>
                </div>
              ) : isEditingPresidente ? (
                <PresidenteForm
                  presidente={presidente}
                  onSave={handleSavePresidente}
                  onCancel={() => {
                    setIsEditingPresidente(false);
                    if (!presidente) {
                      setPresidente(null);
                    }
                  }}
                />
              ) : (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{presidente?.nome}</h3>
                      <p className="text-gray-600 mb-4">{presidente?.cargo}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-semibold text-gray-700">Biografia:</span>
                          <p className="text-gray-600 text-sm">{presidente?.biografia}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-700">Contribuição:</span>
                          <p className="text-gray-600 text-sm">{presidente?.contribuicao}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditingPresidente(true)}
                      className="ml-4 p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Diretores */}
          {activeTab === 'diretores' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar diretor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setIsAddingDiretor(true)}
                  className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0066cc] transition-colors"
                >
                  <FaPlus /> Adicionar Diretor
                </button>
              </div>

              {isAddingDiretor && (
                <DiretorForm
                  onSave={handleSaveDiretor}
                  onCancel={() => setIsAddingDiretor(false)}
                />
              )}

              {diretores.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                  <FaUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum diretor cadastrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {diretores
                    .filter(d => 
                      searchTerm === '' || 
                      d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      d.cargo.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((diretor) => (
                      <div key={diretor.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        {isEditingDiretor === diretor.id ? (
                          <DiretorForm
                            diretor={diretor}
                            onSave={handleSaveDiretor}
                            onCancel={() => setIsEditingDiretor(null)}
                          />
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{diretor.nome}</h4>
                                <p className="text-sm text-gray-600">{diretor.cargo}</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setIsEditingDiretor(diretor.id)}
                                  className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded transition-colors"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteDiretor(diretor.id)}
                                  className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded transition-colors"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-semibold text-gray-700">Função:</span>
                                <p className="text-gray-600">{diretor.funcao}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">Contribuição:</span>
                                <p className="text-gray-600">{diretor.contribuicao}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Colaboradores */}
          {activeTab === 'colaboradores' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar colaborador..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setIsAddingColaborador(true)}
                  className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0066cc] transition-colors"
                >
                  <FaPlus /> Adicionar Colaborador
                </button>
              </div>

              {isAddingColaborador && (
                <ColaboradorForm
                  onSave={handleSaveColaborador}
                  onCancel={() => setIsAddingColaborador(false)}
                />
              )}

              {colaboradores.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                  <FaUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum colaborador cadastrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {colaboradores
                    .filter(c => 
                      searchTerm === '' || 
                      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      c.cargo.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((colaborador) => (
                      <div key={colaborador.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        {isEditingColaborador === colaborador.id ? (
                          <ColaboradorForm
                            colaborador={colaborador}
                            onSave={handleSaveColaborador}
                            onCancel={() => setIsEditingColaborador(null)}
                          />
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{colaborador.nome}</h4>
                                <p className="text-sm text-gray-600">{colaborador.cargo}</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setIsEditingColaborador(colaborador.id)}
                                  className="p-2 text-[#003f7f] hover:bg-[#003f7f] hover:text-white rounded transition-colors"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteColaborador(colaborador.id)}
                                  className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded transition-colors"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-semibold text-gray-700">Função:</span>
                                <p className="text-gray-600">{colaborador.funcao}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">Contribuição:</span>
                                <p className="text-gray-600">{colaborador.contribuicao}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente de Formulário do Presidente
function PresidenteForm({ 
  presidente, 
  onSave, 
  onCancel 
}: { 
  presidente: Presidente | null; 
  onSave: (data: Presidente) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Presidente>(presidente || {
    nome: '',
    cargo: 'Presidente',
    foto: '',
    biografia: '',
    contribuicao: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Foto (URL)</label>
        <input
          type="text"
          value={formData.foto}
          onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Biografia</label>
        <textarea
          value={formData.biografia}
          onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Contribuição</label>
        <textarea
          value={formData.contribuicao}
          onChange={(e) => setFormData({ ...formData, contribuicao: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          required
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0066cc] transition-colors"
        >
          <FaSave /> Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          <FaTimes /> Cancelar
        </button>
      </div>
    </form>
  );
}

// Componente de Formulário do Diretor
function DiretorForm({ 
  diretor, 
  onSave, 
  onCancel 
}: { 
  diretor?: Diretor; 
  onSave: (data: Diretor) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Diretor>(diretor || {
    id: 0,
    nome: '',
    cargo: '',
    foto: '',
    contribuicao: '',
    funcao: '',
    order: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo</label>
        <input
          type="text"
          value={formData.cargo}
          onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Foto (URL)</label>
        <input
          type="text"
          value={formData.foto}
          onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Função</label>
        <input
          type="text"
          value={formData.funcao}
          onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Contribuição</label>
        <textarea
          value={formData.contribuicao}
          onChange={(e) => setFormData({ ...formData, contribuicao: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Ordem</label>
        <input
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          min="0"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0066cc] transition-colors"
        >
          <FaSave /> Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          <FaTimes /> Cancelar
        </button>
      </div>
    </form>
  );
}

// Componente de Formulário do Colaborador
function ColaboradorForm({ 
  colaborador, 
  onSave, 
  onCancel 
}: { 
  colaborador?: Colaborador; 
  onSave: (data: Colaborador) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Colaborador>(colaborador || {
    id: 0,
    nome: '',
    cargo: '',
    foto: '',
    contribuicao: '',
    funcao: '',
    order: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo</label>
        <input
          type="text"
          value={formData.cargo}
          onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Foto (URL)</label>
        <input
          type="text"
          value={formData.foto}
          onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Função</label>
        <input
          type="text"
          value={formData.funcao}
          onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Contribuição</label>
        <textarea
          value={formData.contribuicao}
          onChange={(e) => setFormData({ ...formData, contribuicao: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Ordem</label>
        <input
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
          min="0"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0066cc] transition-colors"
        >
          <FaSave /> Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          <FaTimes /> Cancelar
        </button>
      </div>
    </form>
  );
}




