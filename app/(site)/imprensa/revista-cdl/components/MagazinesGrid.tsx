import React from 'react';
import Image from 'next/image';
import { FaBook, FaCalendarAlt, FaEye, FaDownload } from 'react-icons/fa';
import { Magazine } from './types';

interface MagazinesGridProps {
  magazines: Magazine[];
  searchTerm: string;
}

const MagazinesGrid = ({ magazines, searchTerm }: MagazinesGridProps) => {
  if (magazines.length === 0) {
    return (
      <div className="text-center py-12">
        <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">
          {searchTerm ? 'Nenhuma edição encontrada para sua busca.' : 'Não há mais edições disponíveis.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
      {magazines.map((magazine, index) => (
        <div
          key={magazine.id}
          className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-scale-in border border-gray-100"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Capa */}
          <div className="relative h-56 sm:h-64 bg-linear-to-br from-[#003f7f] to-[#0052a3] flex items-center justify-center overflow-hidden">
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
  );
};

export default MagazinesGrid;



