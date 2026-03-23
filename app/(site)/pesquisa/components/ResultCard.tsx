import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import { SearchResult, typeConfig, formatDate } from './types';

interface ResultCardProps {
  result: SearchResult;
}

const ResultCard = ({ result }: ResultCardProps) => {
  const config = typeConfig[result.type] || typeConfig.page;
  const Icon = config.icon;
  const isExternal = result.url.startsWith('http');

  return (
    <article className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#003f7f]/30 transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row">
        {/* Imagem (se houver) */}
        {result.image && (
          <div className="sm:w-48 md:w-56 lg:w-64 flex-shrink-0">
            <div className="relative h-40 sm:h-full w-full">
              <Image
                src={result.image}
                alt={result.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        )}
        
        {/* Conteúdo */}
        <div className="flex-1 p-5 sm:p-6">
          {/* Badge de tipo */}
          <div className="flex items-center gap-3 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.color}`}>
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
            {result.category && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {result.category}
              </span>
            )}
            {result.date && (
              <span className="text-xs text-gray-400 hidden sm:inline">
                {formatDate(result.date)}
              </span>
            )}
          </div>
          
          {/* Título */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-[#003f7f] transition-colors line-clamp-2">
            {result.title}
          </h3>
          
          {/* Descrição */}
          <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-4">
            {result.description}
          </p>
          
          {/* Link */}
          {isExternal ? (
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#003f7f] font-semibold hover:text-[#0066cc] transition-colors text-sm group/link"
            >
              Acessar
              <FaExternalLinkAlt className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          ) : (
            <Link
              href={result.url}
              className="inline-flex items-center gap-2 text-[#003f7f] font-semibold hover:text-[#0066cc] transition-colors text-sm group/link"
            >
              Ver mais
              <FaArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default ResultCard;



