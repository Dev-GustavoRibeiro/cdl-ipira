import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FaEye, FaFileAlt, FaChartLine, FaDollarSign, FaCalendarAlt, FaDownload } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Portal Transparência - CDL Ipirá',
  description: 'Acesse informações sobre transparência, prestação de contas e gestão da CDL Ipirá.',
};

export default function PortalTransparenciaPage() {
  const documents = [
    { id: 1, title: 'Prestação de Contas 2024', date: '15/01/2025', type: 'PDF' },
    { id: 2, title: 'Relatório Anual 2024', date: '10/01/2025', type: 'PDF' },
    { id: 3, title: 'Demonstrativo Financeiro - Dezembro 2024', date: '05/01/2025', type: 'PDF' },
    { id: 4, title: 'Estatuto Social', date: '01/01/2024', type: 'PDF' },
  ];

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

      {/* Documentos */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
                Documentos e Relatórios
              </h2>
              <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {documents.map((doc, index) => (
                <div
                  key={doc.id}
                  className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#003f7f] hover:shadow-lg transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 sm:gap-5 flex-1">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#003f7f] rounded-full flex items-center justify-center shrink-0">
                        <FaFileAlt className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#003f7f] mb-1 sm:mb-2">
                          {doc.title}
                        </h3>
                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{doc.date}</span>
                          </div>
                          <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full font-semibold">
                            {doc.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="ml-4 p-3 sm:p-4 bg-[#00a859] text-white rounded-full hover:bg-[#00d670] transition-all duration-300 hover:scale-110">
                      <FaDownload className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Informações Adicionais */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#003f7f] rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <FaChartLine className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#003f7f] mb-2 sm:mb-3">
                  Indicadores de Gestão
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
                  Acompanhe os principais indicadores de gestão e desempenho da CDL Ipirá.
                </p>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#00a859] rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <FaDollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#003f7f] mb-2 sm:mb-3">
                  Prestação de Contas
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
                  Acesse os demonstrativos financeiros e relatórios de prestação de contas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}




