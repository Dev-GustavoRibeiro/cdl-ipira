'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFileAlt, FaChartLine, FaDollarSign, FaCalendarAlt, FaDownload, FaSpinner, FaFilePdf, FaFileWord, FaFileExcel, FaFile, FaSearch, FaFilter } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

interface Documento {
  id: number;
  title: string;
  description?: string;
  type: string;
  category?: string;
  date: string;
  file_url: string;
  is_active: boolean;
}

const tiposArquivo: Record<string, { icon: React.ComponentType<{ className?: string }>, color: string, bg: string }> = {
  'PDF': { icon: FaFilePdf, color: 'text-red-600', bg: 'bg-red-100' },
  'DOC': { icon: FaFileWord, color: 'text-blue-600', bg: 'bg-blue-100' },
  'XLS': { icon: FaFileExcel, color: 'text-green-600', bg: 'bg-green-100' },
  'Outro': { icon: FaFile, color: 'text-gray-600', bg: 'bg-gray-100' },
};

export default function PortalTransparenciaPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [categorias, setCategorias] = useState<string[]>([]);

  useEffect(() => {
    async function fetchDocumentos() {
      try {
        const { data, error } = await supabase
          .from('transparency_documents')
          .select('*')
          .eq('is_active', true)
          .order('date', { ascending: false });

        if (error) throw error;
        
        setDocumentos(data || []);
        
        // Extrair categorias únicas
        const cats = [...new Set(data?.map(d => d.category).filter(Boolean))] as string[];
        setCategorias(cats);
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDocumentos();
  }, []);

  const getFileIcon = (type: string) => {
    const config = tiposArquivo[type] || tiposArquivo['Outro'];
    const Icon = config.icon;
    return { Icon, color: config.color, bg: config.bg };
  };

  const filteredDocumentos = documentos.filter(doc => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Agrupar documentos por categoria
  const documentosPorCategoria = filteredDocumentos.reduce((acc, doc) => {
    const cat = doc.category || 'Outros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {} as Record<string, Documento[]>);

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-[#003f7f] text-white py-2.5 sm:py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffd000] transition-colors flex items-center gap-1 group">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-[-2px] transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Início</span>
            </Link>
            <span className="text-white/40">/</span>
            <Link href="/institucional/historia" className="hover:text-[#ffd000] transition-colors">
              <span>Institucional</span>
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-semibold">Portal Transparência</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <div className="inline-block bg-linear-to-r from-[#00a859] to-[#00d670] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
              👁️ Transparência
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-3 sm:mb-4 leading-tight">
              Portal Transparência
            </h1>
            <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4 text-justify">
              Acesse informações sobre transparência, prestação de contas e gestão da CDL Ipirá. Compromisso com a transparência e a prestação de contas aos nossos associados.
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-6 sm:py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent transition-all"
                />
              </div>
              {categorias.length > 0 && (
                <div className="relative">
                  <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full sm:w-auto pl-11 pr-8 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent bg-white appearance-none cursor-pointer"
                  >
                    <option value="all">Todas as categorias</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Documentos */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="flex items-center gap-3 text-[#003f7f]">
                  <FaSpinner className="animate-spin w-6 h-6" />
                  <span className="text-lg font-medium">Carregando documentos...</span>
                </div>
              </div>
            ) : filteredDocumentos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum documento encontrado</h3>
                <p className="text-gray-500">Tente ajustar os filtros de busca</p>
              </div>
            ) : filterCategory === 'all' ? (
              // Exibir agrupado por categoria
              Object.entries(documentosPorCategoria).map(([categoria, docs], catIndex) => (
                <div key={categoria} className="mb-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-[#003f7f] rounded-full flex items-center justify-center">
                      <FaFileAlt className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#003f7f]">{categoria}</h2>
                    <span className="bg-[#003f7f]/10 text-[#003f7f] px-3 py-1 rounded-full text-sm font-bold">
                      {docs.length} {docs.length === 1 ? 'documento' : 'documentos'}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {docs.map((doc, index) => {
                      const { Icon, color, bg } = getFileIcon(doc.type);
                      return (
                        <div
                          key={doc.id}
                          className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#003f7f] hover:shadow-lg transition-all duration-300 animate-scale-in group"
                          style={{ animationDelay: `${(catIndex * 0.1) + (index * 0.05)}s` }}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                              <div className={`w-12 h-12 sm:w-14 sm:h-14 ${bg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#003f7f] mb-1 truncate">
                                  {doc.title}
                                </h3>
                                {doc.description && (
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">{doc.description}</p>
                                )}
                                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                                  <div className="flex items-center gap-1.5">
                                    <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{new Date(doc.date).toLocaleDateString('pt-BR')}</span>
                                  </div>
                                  <span className={`${bg} ${color} px-2 sm:px-3 py-1 rounded-full font-bold text-xs`}>
                                    {doc.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a 
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 p-3 sm:p-4 bg-[#00a859] text-white rounded-full hover:bg-[#00d670] transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                              title="Baixar documento"
                            >
                              <FaDownload className="w-4 h-4 sm:w-5 sm:h-5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              // Exibir lista simples quando filtrado por categoria
              <div className="space-y-4">
                {filteredDocumentos.map((doc, index) => {
                  const { Icon, color, bg } = getFileIcon(doc.type);
                  return (
                    <div
                      key={doc.id}
                      className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#003f7f] hover:shadow-lg transition-all duration-300 animate-scale-in group"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 ${bg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#003f7f] mb-1 truncate">
                              {doc.title}
                            </h3>
                            {doc.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-1">{doc.description}</p>
                            )}
                            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                              <div className="flex items-center gap-1.5">
                                <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{new Date(doc.date).toLocaleDateString('pt-BR')}</span>
                              </div>
                              <span className={`${bg} ${color} px-2 sm:px-3 py-1 rounded-full font-bold text-xs`}>
                                {doc.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <a 
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-3 sm:p-4 bg-[#00a859] text-white rounded-full hover:bg-[#00d670] transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                          title="Baixar documento"
                        >
                          <FaDownload className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Informações Adicionais */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#003f7f] mb-3">
                Compromisso com a Transparência
              </h2>
              <div className="w-20 h-1.5 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
              <div className="bg-linear-to-br from-[#003f7f] to-[#0052a3] rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 text-white shadow-xl">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <FaChartLine className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
                  Indicadores de Gestão
                </h3>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed text-justify">
                  Acompanhe os principais indicadores de gestão e desempenho da CDL Ipirá. Nosso compromisso é manter você informado sobre todas as atividades.
                </p>
              </div>

              <div className="bg-linear-to-br from-[#00a859] to-[#00d670] rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 text-white shadow-xl">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <FaDollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
                  Prestação de Contas
                </h3>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed text-justify">
                  Acesse os demonstrativos financeiros e relatórios de prestação de contas. Transparência total na gestão dos recursos da entidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

