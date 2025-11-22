import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Missão, Visão e Valores - CDL Ipirá',
  description: 'Conheça a missão, visão e valores da CDL Ipirá que guiam nossa atuação no fortalecimento do comércio local.',
};

export default function MissaoVisaoValoresPage() {
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
            <span className="text-white font-semibold">Missão, Visão e Valores</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Imagem à Esquerda com Elementos Gráficos */}
            <div className="order-2 lg:order-1 relative animate-blur-fade-in">
              <div className="relative w-full h-[400px] xs:h-[450px] sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl bg-linear-to-br from-[#003f7f] to-[#0066cc]">
                {/* Imagem de fundo */}
                <div className="absolute inset-0">
                  <Image
                    src="/missao-visao-valores.jpg"
                    alt="Missão, Visão e Valores CDL Ipirá"
                    fill
                    className="object-cover opacity-40"
                    priority
                  />
                </div>
                
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-linear-to-br from-[#003f7f]/90 via-[#003f7f]/70 to-[#0066cc]/90"></div>

                {/* Elementos gráficos sobrepostos */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 z-10">
                  {/* Palavras destacadas */}
                  <div className="relative w-full max-w-md">
                    <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
                      <div className="text-white/60 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black drop-shadow-2xl">
                        Missão
                      </div>
                      <div className="relative">
                        <div className="text-[#00d4ff] text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black drop-shadow-2xl relative z-10">
                          Visão
                        </div>
                        {/* Círculo brilhante ao redor de "Visão" */}
                        <div className="absolute -inset-2 sm:-inset-3 md:-inset-4 bg-[#00d4ff]/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="absolute -inset-1 sm:-inset-2 border-2 border-[#00d4ff]/50 rounded-full"></div>
                      </div>
                      <div className="text-white/60 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black drop-shadow-2xl">
                        Valores
                      </div>
                    </div>

                    {/* Gráfico de crescimento */}
                    <div className="relative mt-4 sm:mt-6 md:mt-8 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                      <div className="flex items-end justify-between gap-1 sm:gap-2 h-24 sm:h-28 md:h-32">
                        <div className="flex flex-col items-center gap-1 sm:gap-2">
                          <div className="w-5 sm:w-6 md:w-8 bg-linear-to-t from-[#00d4ff] to-[#0066cc] rounded-t-lg h-12 sm:h-14 md:h-16"></div>
                          <span className="text-white/80 text-[10px] xs:text-xs font-bold">2021</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 sm:gap-2">
                          <div className="w-5 sm:w-6 md:w-8 bg-linear-to-t from-[#00d4ff] to-[#0066cc] rounded-t-lg h-16 sm:h-18 md:h-24"></div>
                          <span className="text-white/80 text-[10px] xs:text-xs font-bold">2022</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 sm:gap-2">
                          <div className="w-5 sm:w-6 md:w-8 bg-linear-to-t from-[#00d4ff] to-[#0066cc] rounded-t-lg h-20 sm:h-24 md:h-32"></div>
                          <span className="text-white/80 text-[10px] xs:text-xs font-bold">2024</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 sm:gap-2">
                          <div className="w-5 sm:w-6 md:w-8 bg-linear-to-t from-[#00d4ff] to-[#0066cc] rounded-t-lg h-24 sm:h-28 md:h-40"></div>
                          <span className="text-white/80 text-[10px] xs:text-xs font-bold">2030</span>
                        </div>
                      </div>
                      {/* Seta de crescimento */}
                      <div className="absolute top-1.5 sm:top-2 right-2 sm:right-4">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>

                    {/* Brilho central */}
                    <div className="absolute top-1/2 right-1/4 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-[#00d4ff]/30 rounded-full blur-3xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo à Direita */}
            <div className="order-1 lg:order-2 animate-blur-fade-in">
              <div className="sticky top-24">
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-4 sm:mb-6 leading-tight">
                  Missão, Visão e Valores
                </h1>
                
                <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mb-6 sm:mb-8"></div>

                {/* MISSÃO */}
                <div className="mb-6 sm:mb-8 md:mb-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#003f7f] to-[#0066cc] rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-[#003f7f]">
                      MISSÃO
                    </h2>
                  </div>
                  <p className="text-gray-700 text-sm xs:text-base sm:text-lg leading-relaxed pl-0 sm:pl-12 md:pl-16 text-justify">
                    Promover o fortalecimento de nossos associados através da representatividade e entrega de soluções, defendendo, orientando e contribuindo para o desenvolvimento econômico e social de Ipirá e região.
                  </p>
                </div>

                {/* VISÃO */}
                <div className="mb-6 sm:mb-8 md:mb-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#00a859] to-[#00d670] rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-[#003f7f]">
                      VISÃO
                    </h2>
                  </div>
                  <p className="text-gray-700 text-sm xs:text-base sm:text-lg leading-relaxed pl-0 sm:pl-12 md:pl-16 text-justify">
                    Ser reconhecida como a melhor entidade da Bahia até 2030, destacando-se em práticas de compliance, excelência na fidelização e na entrega de soluções inovadoras e eficazes que impulsionem o sucesso dos nossos associados.
                  </p>
                </div>

                {/* VALORES */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#ffd000] to-[#ffed4e] rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#003f7f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-[#003f7f]">
                      VALORES
                    </h2>
                  </div>

                  <div className="space-y-4 sm:space-y-5 md:space-y-6 pl-0 sm:pl-12 md:pl-16">
                    {/* FOCO NO ASSOCIADO */}
                    <div className="bg-linear-to-br from-gray-50 to-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-l-4 border-[#003f7f] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-x-1">
                      <h3 className="text-base xs:text-lg sm:text-xl font-black text-[#003f7f] mb-2">
                        FOCO NO ASSOCIADO
                      </h3>
                      <p className="text-gray-700 text-xs xs:text-sm sm:text-base leading-relaxed text-justify">
                        Excelência no atendimento, comunicação constante e gerar valor ao associado.
                      </p>
                    </div>

                    {/* COMPROMETIMENTO */}
                    <div className="bg-linear-to-br from-gray-50 to-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-l-4 border-[#00a859] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-x-1">
                      <h3 className="text-base xs:text-lg sm:text-xl font-black text-[#003f7f] mb-2">
                        COMPROMETIMENTO
                      </h3>
                      <p className="text-gray-700 text-xs xs:text-sm sm:text-base leading-relaxed text-justify">
                        Compromisso com a verdade, espírito de equipe, integridade, inovação, valor e paixão.
                      </p>
                    </div>

                    {/* EFICIÊNCIA */}
                    <div className="bg-linear-to-br from-gray-50 to-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-l-4 border-[#ffd000] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-x-1">
                      <h3 className="text-base xs:text-lg sm:text-xl font-black text-[#003f7f] mb-2">
                        EFICIÊNCIA
                      </h3>
                      <p className="text-gray-700 text-xs xs:text-sm sm:text-base leading-relaxed text-justify">
                        Gestão da qualidade, fidelização, inovação, performance e solução ao associado.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Destaque */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-blur-fade-in">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 leading-tight">
              Nossos Pilares
            </h2>
            <p className="text-white/90 text-sm xs:text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed px-2 text-justify">
              A Missão, Visão e Valores da CDL Ipirá são os fundamentos que guiam todas as nossas ações e decisões, sempre com foco no sucesso dos associados e no desenvolvimento do comércio local.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/diretoria"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#003f7f] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-[#ffd000] hover:text-[#003f7f] transition-all duration-300 hover:scale-105 shadow-xl group"
              >
                Conheça Nossa Diretoria
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                href="/historia"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-white hover:text-[#003f7f] transition-all duration-300"
              >
                Nossa História
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

