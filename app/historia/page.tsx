import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'História - CDL Ipirá',
  description: 'Conheça a história da CDL Ipirá e sua trajetória no fortalecimento do comércio local.',
};

export default function HistoriaPage() {
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
            <span className="text-white font-semibold">História</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
            {/* Imagem à Esquerda */}
            <div className="order-2 lg:order-1 animate-blur-fade-in">
              <div className="relative w-full h-[300px] xs:h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl bg-linear-to-br from-[#003f7f] to-[#0066cc] group">
                <Image
                  src="/cdl-ipira-sede.jpg"
                  alt="Sede da CDL Ipirá"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay gradiente sutil */}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/10 to-transparent"></div>
                {/* Badge informativo */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#003f7f] shadow-lg">
                  📍 Sede CDL Ipirá
                </div>
              </div>
            </div>

            {/* Texto à Direita */}
            <div className="order-1 lg:order-2 animate-blur-fade-in">
              <div className="sticky top-24">
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-4 sm:mb-6 leading-tight">
                  História
                </h1>
                
                <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mb-6 sm:mb-8"></div>

                <div className="space-y-4 sm:space-y-5 md:space-y-6 text-gray-700 leading-relaxed">
                  <p className="text-sm xs:text-base sm:text-lg text-justify">
                    A <strong className="text-[#003f7f] font-bold">Câmara de Dirigentes Lojistas de Ipirá (CDL Ipirá)</strong> foi fundada com o objetivo de representar, fortalecer e desenvolver o comércio local, promovendo o crescimento sustentável dos empresários e empresárias de nossa cidade.
                  </p>

                  <p className="text-sm xs:text-base sm:text-lg text-justify">
                    Desde sua criação, a CDL Ipirá tem sido uma instituição fundamental para o desenvolvimento econômico e social de Ipirá, oferecendo serviços essenciais como o <strong className="text-[#00a859] font-bold">SPC - Serviço de Proteção ao Crédito</strong>, que permite aos comerciantes consultarem a situação cadastral de clientes antes de conceder crédito, reduzindo inadimplência e fortalecendo as relações comerciais.
                  </p>

                  <p className="text-sm xs:text-base sm:text-lg text-justify">
                    Ao longo dos anos, a CDL Ipirá expandiu sua atuação, incorporando novos serviços e benefícios para seus associados, incluindo assessoria jurídica, certificado digital, cursos e capacitações, além de promover eventos e ações que fortalecem o setor comercial e beneficiam toda a comunidade.
                  </p>

                  <p className="text-sm xs:text-base sm:text-lg text-justify">
                    A instituição tem se mantido como referência no apoio ao empreendedorismo local, sempre em busca de inovações e melhorias que contribuam para o sucesso dos negócios e para o desenvolvimento econômico de Ipirá.
                  </p>

                  <p className="text-sm xs:text-base sm:text-lg text-justify">
                    Com uma trajetória marcada pela dedicação e compromisso com o comércio local, a CDL Ipirá continua sendo uma parceira essencial para os empresários, oferecendo ferramentas, serviços e suporte necessário para o crescimento e fortalecimento dos negócios em nossa cidade.
                  </p>
                </div>

                {/* Botões de Ação */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    href="/diretoria"
                    className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  >
                    Conheça Nossa Diretoria
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
        </div>
      </section>

      {/* Seção de Valores/Missão Preview */}
      <section className="py-10 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            <div className="bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-[#003f7f] to-[#0066cc] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#003f7f] mb-2">Missão</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-justify">
                Representar e fortalecer o comércio de Ipirá, oferecendo serviços e soluções que contribuam para o sucesso dos empresários.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-[#00a859] to-[#00d670] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#003f7f] mb-2">Visão</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-justify">
                Ser referência em representação comercial, reconhecida pela excelência em serviços e pelo compromisso com o desenvolvimento local.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-[#ffd000] to-[#ffed4e] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#003f7f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#003f7f] mb-2">Valores</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-justify">
                Ética, transparência, compromisso, inovação e responsabilidade social são os pilares que guiam nossa atuação.
              </p>
            </div>
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <Link
              href="/missao-visao-valores"
              className="inline-flex items-center gap-2 text-[#003f7f] font-bold hover:text-[#0066cc] transition-colors group text-sm sm:text-base"
            >
              Conheça mais sobre nossa Missão, Visão e Valores
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

