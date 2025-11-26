'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBook, FaDownload, FaCalendarAlt, FaEye, FaSpinner, FaSearch } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

interface Magazine {
  id: number;
  title: string;
  description?: string;
  edition?: string;
  date: string;
  cover_url?: string;
  file_url: string;
  is_active: boolean;
}

export default function RevistaCDLPage() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);

  useEffect(() => {
    async function fetchMagazines() {
      try {
        const { data, error } = await supabase
          .from('magazines')
          .select('*')
          .eq('is_active', true)
          .order('date', { ascending: false });

        if (error) throw error;
        setMagazines(data || []);
      } catch (error) {
        console.error('Erro ao carregar revistas:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMagazines();
  }, []);

  const filteredMagazines = magazines.filter(mag =>
    mag.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mag.edition?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Destacar a edição mais recente
  const latestMagazine = magazines[0];
  const otherMagazines = filteredMagazines.filter(m => m.id !== latestMagazine?.id);

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
            <span className="text-white font-semibold">Revista CDL</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <div className="inline-block bg-gradient-to-r from-[#ffd000] to-[#ffed4e] text-[#003f7f] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
              📖 Revista CDL
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-3 sm:mb-4 leading-tight">
              Revista CDL
            </h1>
            <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-gradient-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4 text-justify">
              Acesse as edições da Revista CDL Ipirá com notícias, artigos, entrevistas e informações sobre o comércio local e regional.
            </p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <section className="py-16 bg-white">
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-3 text-[#003f7f]">
              <FaSpinner className="animate-spin w-6 h-6" />
              <span className="text-lg font-medium">Carregando revistas...</span>
            </div>
          </div>
        </section>
      ) : magazines.length === 0 ? (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <FaBook className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhuma edição disponível</h3>
            <p className="text-gray-500">Em breve teremos novas edições da Revista CDL.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Edição em Destaque */}
          {latestMagazine && !searchTerm && (
            <section className="py-8 sm:py-12 bg-gradient-to-r from-[#003f7f] to-[#0052a3]">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6">
                  <span className="inline-block bg-[#ffd000] text-[#003f7f] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide">
                    ✨ Edição Mais Recente
                  </span>
                </div>
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Capa */}
                    <div className="md:w-1/3 relative h-64 md:h-auto bg-gradient-to-br from-[#003f7f] to-[#0052a3]">
                      {latestMagazine.cover_url ? (
                        <Image
                          src={latestMagazine.cover_url}
                          alt={latestMagazine.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <FaBook className="w-24 h-24 text-white/30" />
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span>
                          {new Date(latestMagazine.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </span>
                        {latestMagazine.edition && (
                          <span className="bg-[#003f7f]/10 text-[#003f7f] px-2 py-0.5 rounded-full text-xs font-bold">
                            {latestMagazine.edition}
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-[#003f7f] mb-3">
                        {latestMagazine.title}
                      </h2>
                      {latestMagazine.description && (
                        <p className="text-gray-600 mb-6 line-clamp-3">
                          {latestMagazine.description}
                        </p>
                      )}
                      <div className="flex gap-3">
                        <a
                          href={latestMagazine.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0066cc] transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <FaEye className="w-4 h-4" />
                          Ler Revista
                        </a>
                        <a
                          href={latestMagazine.file_url}
                          download
                          className="inline-flex items-center justify-center gap-2 border-2 border-[#003f7f] text-[#003f7f] px-6 py-3 rounded-xl font-bold hover:bg-[#003f7f] hover:text-white transition-all duration-300"
                        >
                          <FaDownload className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Busca e Outras Edições */}
          <section className="py-8 sm:py-12 md:py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Título e Busca */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#003f7f]">
                    {searchTerm ? 'Resultados da Busca' : 'Todas as Edições'}
                  </h2>
                  <div className="w-16 h-1.5 bg-gradient-to-r from-[#003f7f] to-[#00a859] rounded-full mt-2"></div>
                </div>
                <div className="relative max-w-sm w-full">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar edições..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Grid de Edições */}
              {(searchTerm ? filteredMagazines : otherMagazines).length === 0 ? (
                <div className="text-center py-12">
                  <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm ? 'Nenhuma edição encontrada para sua busca.' : 'Não há mais edições disponíveis.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
                  {(searchTerm ? filteredMagazines : otherMagazines).map((magazine, index) => (
                    <div
                      key={magazine.id}
                      className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-scale-in border border-gray-100"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Capa */}
                      <div className="relative h-56 sm:h-64 bg-gradient-to-br from-[#003f7f] to-[#0052a3] flex items-center justify-center overflow-hidden">
                        {magazine.cover_url ? (
                          <Image
                            src={magazine.cover_url}
                            alt={magazine.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <FaBook className="w-20 h-20 sm:w-24 sm:h-24 text-white/30 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        {/* Overlay no hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>

                      {/* Info */}
                      <div className="p-4 sm:p-5 md:p-6">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                          <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>
                            {new Date(magazine.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-1 line-clamp-2 group-hover:text-[#0066cc] transition-colors">
                          {magazine.title}
                        </h3>
                        {magazine.edition && (
                          <p className="text-sm text-gray-500 mb-3">Edição: {magazine.edition}</p>
                        )}
                        {magazine.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{magazine.description}</p>
                        )}
                        <div className="flex gap-2">
                          <a
                            href={magazine.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 text-xs sm:text-sm"
                          >
                            <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                            Ler
                          </a>
                          <a
                            href={magazine.file_url}
                            download
                            className="inline-flex items-center justify-center gap-2 border-2 border-[#003f7f] text-[#003f7f] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-bold hover:bg-[#003f7f] hover:text-white transition-all duration-300"
                          >
                            <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-[#003f7f] mb-4">
            Quer aparecer na Revista CDL?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Divulgue sua empresa e seus produtos para toda a comunidade lojista de Ipirá e região. Entre em contato com a CDL e saiba como participar das próximas edições.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 bg-[#00a859] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#00d670] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Fale Conosco
          </Link>
        </div>
      </section>
    </>
  );
}
