'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStore, FaSearch, FaGlobe, FaExternalLinkAlt } from 'react-icons/fa';

interface Parceiro {
  id: number;
  name: string;
  logo: string;
  website?: string;
  order: number;
}

export default function EmpresasPage() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchParceiros() {
      try {
        const response = await fetch('/api/parceiros');
        if (response.ok) {
          const data = await response.json();
          const formattedParceiros = data.map((p: { id: number; name: string; logo: string; website?: string; order_index?: number; order?: number }) => ({
            id: p.id,
            name: p.name,
            logo: p.logo,
            website: p.website,
            order: p.order_index || p.order || 0
          }));
          setParceiros(formattedParceiros);
        }
      } catch (error) {
        console.error('Erro ao carregar associados:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchParceiros();
  }, []);

  const filteredParceiros = parceiros.filter(parceiro =>
    parceiro.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <span className="text-white font-semibold">Empresas Associadas</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <div className="inline-block bg-linear-to-r from-[#00a859] to-[#00d670] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
              🤝 Associados CDL
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-3 sm:mb-4 leading-tight">
              Nossos Associados
            </h1>
            <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4 text-justify">
              Conheça as empresas parceiras da CDL Ipirá. Juntos, fortalecemos o comércio local e oferecemos os melhores produtos e serviços para nossa comunidade.
            </p>
          </div>
        </div>
      </section>

      {/* Busca */}
      <section className="py-6 sm:py-8 border-b border-gray-200 sticky top-[73px] sm:top-[81px] z-40 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Buscar associado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Associados */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg sm:text-xl">Carregando associados...</p>
            </div>
          ) : filteredParceiros.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl">
              <FaStore className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg sm:text-xl">
                {searchTerm ? 'Nenhum associado encontrado com esse nome.' : 'Nenhum associado cadastrado ainda.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredParceiros.map((parceiro, index) => (
                <article
                  key={parceiro.id}
                  className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#003f7f] transition-all duration-300 hover:-translate-y-2 group animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Logo */}
                  <div className="h-28 sm:h-32 bg-gray-50 flex items-center justify-center p-4 group-hover:bg-gray-100 transition-colors">
                    <div className="relative w-full h-full">
                      <Image
                        src={parceiro.logo}
                        alt={parceiro.name}
                        fill
                        className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-base font-bold text-[#003f7f] mb-2 line-clamp-2">
                      {parceiro.name}
                    </h3>

                    {parceiro.website ? (
                      <a
                        href={parceiro.website.startsWith('http') ? parceiro.website : `https://${parceiro.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm text-[#00a859] hover:text-[#008f4c] font-semibold transition-colors"
                      >
                        <FaGlobe className="w-3 h-3" />
                        Visitar Site
                        <FaExternalLinkAlt className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Associado CDL</span>
                    )}
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
                  {parceiros.length}+
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-semibold">
                  Empresas Associadas
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00a859] mb-2">
                  30+
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-semibold">
                  Anos de Parceria
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
              Seja Nosso Associado
            </h2>
            <p className="text-white/90 text-sm sm:text-base mb-6 sm:mb-8 text-justify">
              Faça parte desta rede de empresas que movimentam a economia de Ipirá. Entre em contato conosco e descubra as vantagens de ser um associado CDL.
            </p>
            <Link
              href="/imprensa/contato"
              className="inline-flex items-center justify-center gap-2 bg-[#ffd000] text-[#003f7f] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-[#ffed4e] transition-all duration-300 hover:scale-105 shadow-xl text-sm sm:text-base group"
            >
              Entre em Contato
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
