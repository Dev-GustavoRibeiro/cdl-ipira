'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStore, FaSearch, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaFilter } from 'react-icons/fa';

interface Associado {
  id: number;
  nome: string;
  categoria: string;
  endereco: string;
  telefone: string;
  email?: string;
  website?: string;
  logo?: string;
  descricao?: string;
}

const categorias = ['Todas', 'Supermercado', 'Farmácia', 'Vestuário', 'Padaria', 'Automotivo', 'Alimentação', 'Construção', 'Eletrônicos', 'Pet Shop', 'Ótica', 'Móveis', 'Livraria'];

export default function EmpresasPage() {
  const [associados, setAssociados] = useState<Associado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // TODO: Substituir por chamada de API real
    // Exemplo: fetch('/api/companies').then(res => res.json()).then(setAssociados)
    const fetchAssociados = async () => {
      try {
        // const response = await fetch('/api/companies');
        // const data = await response.json();
        // setAssociados(data);
        setAssociados([]); // Array vazio até implementar a API
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
        setAssociados([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssociados();
  }, []);

  const filteredAssociados = associados.filter(associado => {
    const categoryMatch = selectedCategory === 'Todas' || associado.categoria === selectedCategory;
    const searchMatch = searchTerm === '' || 
      associado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      associado.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      associado.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-[#003f7f] text-white py-2.5 sm:py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm" aria-label="Breadcrumb">
            <Link 
              href="/" 
              className="hover:text-[#ffd000] transition-colors flex items-center gap-1 group"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-[-2px] transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Início</span>
            </Link>
            <span className="text-white/40">/</span>
            <Link 
              href="#" 
              className="hover:text-[#ffd000] transition-colors"
            >
              Benefícios
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-semibold">Empresas</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <div className="inline-block bg-linear-to-r from-[#00a859] to-[#00d670] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
              🏢 Empresas Associadas
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-3 sm:mb-4 leading-tight">
              Nossos Associados
            </h1>
            <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4 text-justify">
              Conheça as empresas associadas à CDL Ipirá. Fortaleça o comércio local e encontre os melhores produtos e serviços da nossa cidade.
            </p>
          </div>
        </div>
      </section>

      {/* Busca e Filtros */}
      <section className="py-6 sm:py-8 bg-white border-b border-gray-200 sticky top-[73px] sm:top-[81px] z-40 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Busca */}
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Buscar empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Filtros de Categoria */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <FaFilter className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5" />
              {categorias.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-[#003f7f] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-[#003f7f] hover:text-white border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Empresas */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg sm:text-xl">Carregando empresas...</p>
            </div>
          ) : filteredAssociados.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl">
              <FaStore className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg sm:text-xl">Nenhuma empresa encontrada com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
              {filteredAssociados.map((associado, index) => (
                <article
                  key={associado.id}
                  className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#003f7f] transition-all duration-300 hover:-translate-y-2 group animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Header do Card */}
                  <div className="bg-linear-to-br from-[#003f7f] to-[#0066cc] p-4 sm:p-5 md:p-6 text-white">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex-1">
                        <div className="inline-block bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] xs:text-xs font-bold mb-2 sm:mb-3">
                          {associado.categoria}
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 line-clamp-2">
                          {associado.nome}
                        </h3>
                      </div>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0">
                        <FaStore className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4 sm:p-5 md:p-6">
                    {associado.descricao && (
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-5 leading-relaxed text-justify line-clamp-2">
                        {associado.descricao}
                      </p>
                    )}

                    {/* Informações de Contato */}
                    <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5">
                      <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                        <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-[#00a859] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{associado.endereco}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                        <FaPhone className="w-3 h-3 sm:w-4 sm:h-4 text-[#003f7f] shrink-0" />
                        <a href={`tel:${associado.telefone}`} className="hover:text-[#003f7f] transition-colors">
                          {associado.telefone}
                        </a>
                      </div>
                      {associado.email && (
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                          <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 text-[#ffd000] shrink-0" />
                          <a href={`mailto:${associado.email}`} className="hover:text-[#003f7f] transition-colors line-clamp-1">
                            {associado.email}
                          </a>
                        </div>
                      )}
                      {associado.website && (
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                          <FaGlobe className="w-3 h-3 sm:w-4 sm:h-4 text-[#00a859] shrink-0" />
                          <a 
                            href={`https://${associado.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-[#003f7f] transition-colors line-clamp-1"
                          >
                            {associado.website}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Botão de Ação */}
                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                      <button className="w-full inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold hover:bg-[#0066cc] transition-all duration-300 hover:scale-105 text-sm sm:text-base group">
                        Ver Detalhes
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Estatísticas */}
          <div className="mt-8 sm:mt-12 bg-linear-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f] mb-2">
                  {associados.length}+
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-semibold">
                  Empresas Associadas
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00a859] mb-2">
                  {categorias.length - 1}
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-semibold">
                  Categorias Diferentes
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#ffd000] mb-2">
                  100%
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-semibold">
                  Comprometidos com o Comércio
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-blur-fade-in">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black mb-4 sm:mb-6">
              Faça Parte Desta Rede
            </h2>
            <p className="text-white/90 text-sm sm:text-base mb-6 sm:mb-8 text-justify">
              Associe sua empresa à CDL Ipirá e tenha acesso a benefícios exclusivos, networking e oportunidades de crescimento.
            </p>
            <Link
              href="/seja-associado"
              className="inline-flex items-center justify-center gap-2 bg-[#ffd000] text-[#003f7f] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-[#ffed4e] transition-all duration-300 hover:scale-105 shadow-xl text-sm sm:text-base group"
            >
              Associe-se Agora
              <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

