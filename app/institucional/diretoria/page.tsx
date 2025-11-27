'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUser, FaSpinner } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

interface TeamMember {
  id: number;
  name: string;
  role: 'presidente' | 'diretor' | 'colaborador';
  position: string;
  photo_url?: string;
  bio?: string;
  contribution?: string;
  function_description?: string;
  display_order: number;
  is_active: boolean;
}

export default function DiretoriaPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setMembers(data || []);
      } catch (error) {
        console.error('Erro ao carregar equipe:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();
  }, []);

  const presidente = members.find(m => m.role === 'presidente');
  const diretores = members.filter(m => m.role === 'diretor');
  const colaboradores = members.filter(m => m.role === 'colaborador');

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
              href="/historia"
              className="hover:text-[#ffd000] transition-colors"
            >
              Institucional
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-semibold">Diretoria</span>
          </nav>
        </div>
      </div>

      {/* Header da Página */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <div className="inline-block bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
              👥 Nossa Liderança
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-3 sm:mb-4 leading-tight">
              Diretoria
            </h1>
            <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4 text-justify">
              Conheça os profissionais que lideram a CDL Ipirá e trabalham pelo fortalecimento do comércio local
            </p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <section className="py-16 bg-white">
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-3 text-[#003f7f]">
              <FaSpinner className="animate-spin w-6 h-6" />
              <span className="text-lg font-medium">Carregando equipe...</span>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Presidente em Destaque */}
          {presidente && (
            <section className="py-8 sm:py-12 md:py-16 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto animate-blur-fade-in">
                  <div className="bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Foto do Presidente */}
                      <div className="relative h-[350px] xs:h-[400px] sm:h-[450px] md:h-[500px] lg:h-full lg:min-h-[500px] order-2 lg:order-1">
                        <div className="absolute inset-0 bg-linear-to-br from-[#003f7f] to-[#0066cc]">
                          {presidente.photo_url ? (
                            <Image
                              src={presidente.photo_url}
                              alt={presidente.name}
                              fill
                              className="object-cover opacity-90"
                              priority
                              sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <FaUser className="w-32 h-32 text-white/30" />
                            </div>
                          )}
                        </div>
                        {/* Overlay gradiente */}
                        <div className="absolute inset-0 bg-linear-to-t from-[#003f7f]/80 via-transparent to-transparent"></div>
                        {/* Badge Presidente */}
                        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                          <div className="bg-[#ffd000] text-[#003f7f] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-black text-xs sm:text-sm shadow-xl">
                            👑 PRESIDENTE
                          </div>
                        </div>
                      </div>

                      {/* Informações do Presidente */}
                      <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 flex flex-col justify-center order-1 lg:order-2 text-white">
                        <div className="mb-3 sm:mb-4">
                          <span className="text-[#ffd000] text-xs sm:text-sm font-bold uppercase tracking-wider">
                            Liderança
                          </span>
                        </div>
                        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 leading-tight">
                          {presidente.name}
                        </h2>
                        <p className="text-white/70 text-sm mb-2">{presidente.position}</p>
                        <div className="w-16 sm:w-20 h-1 bg-[#ffd000] rounded-full mb-4 sm:mb-6"></div>

                        {presidente.bio && (
                          <p className="text-white/90 text-sm xs:text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed text-justify">
                            {presidente.bio}
                          </p>
                        )}

                        {presidente.contribution && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-5 md:p-6 border border-white/20">
                            <h3 className="text-[#ffd000] font-bold text-xs sm:text-sm uppercase mb-2">
                              Contribuição
                            </h3>
                            <p className="text-white/95 text-xs sm:text-sm md:text-base leading-relaxed text-justify">
                              {presidente.contribution}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Diretores */}
          <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-linear-to-br from-gray-50 via-white to-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
                <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f] mb-3 sm:mb-4">
                  Diretores
                </h2>
                <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
              </div>

              {diretores.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Nenhum diretor cadastrado no momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
                  {diretores.map((diretor, index) => (
                    <div
                      key={diretor.id}
                      className="group bg-white rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Foto do Diretor */}
                      <div className="relative h-56 xs:h-64 sm:h-72 md:h-80 overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-[#003f7f] to-[#0066cc]">
                          {diretor.photo_url ? (
                            <Image
                              src={diretor.photo_url}
                              alt={diretor.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <FaUser className="w-20 h-20 text-white/30" />
                            </div>
                          )}
                        </div>
                        {/* Overlay gradiente */}
                        <div className="absolute inset-0 bg-linear-to-t from-[#003f7f]/90 via-[#003f7f]/50 to-transparent"></div>

                        {/* Badge Cargo */}
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                          <div className="bg-[#ffd000] text-[#003f7f] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-black text-[10px] xs:text-xs shadow-lg">
                            {diretor.position}
                          </div>
                        </div>

                        {/* Nome no overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 z-10">
                          <h3 className="text-white text-lg xs:text-xl sm:text-2xl font-black mb-1 drop-shadow-lg line-clamp-2">
                            {diretor.name}
                          </h3>
                        </div>
                      </div>

                      {/* Conteúdo do Card */}
                      <div className="p-4 sm:p-6 md:p-8">
                        {/* Função */}
                        {diretor.function_description && (
                          <div className="mb-3 sm:mb-4">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00a859] rounded-full shrink-0"></div>
                              <span className="text-[10px] xs:text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Função
                              </span>
                            </div>
                            <p className="text-gray-700 text-xs xs:text-sm sm:text-base font-medium leading-snug text-justify">
                              {diretor.function_description}
                            </p>
                          </div>
                        )}

                        {/* Contribuição */}
                        {diretor.contribution && (
                          <div className="pt-3 sm:pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#003f7f] rounded-full shrink-0"></div>
                              <span className="text-[10px] xs:text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Contribuição
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs xs:text-sm leading-relaxed text-justify">
                              {diretor.contribution}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Barra colorida inferior */}
                      <div className="h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Colaboradores */}
          {colaboradores.length > 0 && (
            <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
                  <div className="inline-block bg-linear-to-r from-[#00a859] to-[#00d670] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
                    💼 Nossa Equipe
                  </div>
                  <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f] mb-3 sm:mb-4">
                    Colaboradores
                  </h2>
                  <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-3 sm:mb-4"></div>
                  <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4 text-justify">
                    Profissionais dedicados que trabalham diariamente para oferecer o melhor atendimento e serviços aos associados
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
                  {colaboradores.map((colaborador, index) => (
                    <div
                      key={colaborador.id}
                      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-2 border-gray-100 hover:border-[#00a859]/30 animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Foto do Colaborador */}
                      <div className="relative h-52 xs:h-56 sm:h-64 overflow-hidden bg-linear-to-br from-[#00a859] to-[#00d670]">
                        {colaborador.photo_url ? (
                          <Image
                            src={colaborador.photo_url}
                            alt={colaborador.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <FaUser className="w-16 h-16 text-white/30" />
                          </div>
                        )}
                        {/* Overlay gradiente */}
                        <div className="absolute inset-0 bg-linear-to-t from-[#00a859]/80 via-[#00a859]/40 to-transparent"></div>

                        {/* Badge Cargo */}
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                          <div className="bg-white text-[#00a859] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold text-[10px] xs:text-xs shadow-lg">
                            {colaborador.position}
                          </div>
                        </div>

                        {/* Nome no overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 z-10">
                          <h3 className="text-white text-base xs:text-lg sm:text-xl font-black mb-1 drop-shadow-lg line-clamp-2">
                            {colaborador.name}
                          </h3>
                        </div>
                      </div>

                      {/* Conteúdo do Card */}
                      <div className="p-4 sm:p-5 md:p-6">
                        {/* Função */}
                        {colaborador.function_description && (
                          <div className="mb-3 sm:mb-4">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00a859] rounded-full shrink-0"></div>
                              <span className="text-[10px] xs:text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Função
                              </span>
                            </div>
                            <p className="text-gray-700 text-xs xs:text-sm font-medium leading-snug">
                              {colaborador.function_description}
                            </p>
                          </div>
                        )}

                        {/* Contribuição */}
                        {colaborador.contribution && (
                          <div className="pt-3 sm:pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00a859] rounded-full shrink-0"></div>
                              <span className="text-[10px] xs:text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Contribuição
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs xs:text-sm leading-relaxed text-justify">
                              {colaborador.contribution}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Barra colorida inferior */}
                      <div className="h-1 sm:h-1.5 bg-linear-to-r from-[#00a859] to-[#00d670]"></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Seção de Informação Adicional */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-blur-fade-in">
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl border border-gray-200">
              <div className="inline-block bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6">
                📅 Mandato 2024-2027
              </div>
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-[#003f7f] mb-3 sm:mb-4">
                Compromisso com o Futuro
              </h2>
              <p className="text-gray-700 text-sm xs:text-base sm:text-lg mb-5 sm:mb-6 leading-relaxed px-2 text-justify">
                A atual diretoria da CDL Ipirá foi eleita para o mandato 2024-2027, com o compromisso de continuar fortalecendo o comércio local e oferecendo serviços de excelência aos associados.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/historia"
                  className="inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-[#0066cc] transition-all duration-300 hover:scale-105 shadow-lg group"
                >
                  Conheça Nossa História
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/missao-visao-valores"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#003f7f] text-[#003f7f] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-[#003f7f] hover:text-white transition-all duration-300"
                >
                  Missão, Visão e Valores
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
