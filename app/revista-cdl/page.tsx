import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FaBook, FaDownload, FaCalendarAlt, FaEye } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Revista CDL - CDL Ipirá',
  description: 'Acesse as edições da Revista CDL Ipirá com notícias, artigos e informações sobre o comércio local.',
};

export default function RevistaCDLPage() {
  const editions = [
    { id: 1, title: 'Revista CDL - Edição 01/2025', date: 'Janeiro 2025', cover: '/revista-01-2025.jpg' },
    { id: 2, title: 'Revista CDL - Edição 12/2024', date: 'Dezembro 2024', cover: '/revista-12-2024.jpg' },
    { id: 3, title: 'Revista CDL - Edição 11/2024', date: 'Novembro 2024', cover: '/revista-11-2024.jpg' },
    { id: 4, title: 'Revista CDL - Edição 10/2024', date: 'Outubro 2024', cover: '/revista-10-2024.jpg' },
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
            <span className="text-white font-semibold">Revista CDL</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <div className="inline-block bg-linear-to-r from-[#ffd000] to-[#ffed4e] text-[#003f7f] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
              📖 Revista CDL
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-3 sm:mb-4 leading-tight">
              Revista CDL
            </h1>
            <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4 text-justify">
              Acesse as edições da Revista CDL Ipirá com notícias, artigos, entrevistas e informações sobre o comércio local e regional.
            </p>
          </div>
        </div>
      </section>

      {/* Edições */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
              Edições Disponíveis
            </h2>
            <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {editions.map((edition, index) => (
              <div
                key={edition.id}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 sm:h-72 bg-linear-to-br from-[#003f7f] to-[#0066cc] flex items-center justify-center">
                  <FaBook className="w-24 h-24 sm:w-32 sm:h-32 text-white/30" />
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                    <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{edition.date}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-3 sm:mb-4 line-clamp-2">
                    {edition.title}
                  </h3>
                  <div className="flex gap-2">
                    <button className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 text-xs sm:text-sm">
                      <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                      Ler
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 border-2 border-[#003f7f] text-[#003f7f] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-bold hover:bg-[#003f7f] hover:text-white transition-all duration-300">
                      <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}




