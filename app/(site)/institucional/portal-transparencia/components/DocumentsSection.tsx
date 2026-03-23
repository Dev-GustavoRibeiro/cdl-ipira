'use client';

import React from 'react';
import { FaFileAlt, FaCalendarAlt, FaDownload, FaSpinner, FaFilePdf, FaFileWord, FaFileExcel, FaFile } from 'react-icons/fa';
import { Documento } from './types';

interface DocumentsSectionProps {
  documentos: Documento[];
  isLoading: boolean;
  filterCategory: string;
}

const tiposArquivo: Record<string, { icon: React.ComponentType<{ className?: string }>, color: string, bg: string }> = {
  'PDF': { icon: FaFilePdf, color: 'text-red-600', bg: 'bg-red-100' },
  'DOC': { icon: FaFileWord, color: 'text-blue-600', bg: 'bg-blue-100' },
  'XLS': { icon: FaFileExcel, color: 'text-green-600', bg: 'bg-green-100' },
  'Outro': { icon: FaFile, color: 'text-gray-600', bg: 'bg-gray-100' },
};

const getFileIcon = (type: string) => {
  const config = tiposArquivo[type] || tiposArquivo['Outro'];
  const Icon = config.icon;
  return { Icon, color: config.color, bg: config.bg };
};

const DocumentCard = ({ doc, index, catIndex = 0 }: { doc: Documento; index: number; catIndex?: number }) => {
  const { Icon, color, bg } = getFileIcon(doc.type);
  
  return (
    <div
      className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#003f7f] hover:shadow-lg transition-all duration-300 animate-scale-in group"
      style={{ animationDelay: `${(catIndex * 0.1) + (index * 0.05)}s` }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 ${bg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#003f7f] mb-1 truncate">
              {doc.title}
            </h3>
            {doc.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">{doc.description}</p>
            )}
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{new Date(doc.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <span className={`${bg} ${color} px-2 sm:px-3 py-1 rounded-full font-bold text-xs`}>
                {doc.type}
              </span>
            </div>
          </div>
        </div>
        <a 
          href={doc.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-3 sm:p-4 bg-[#00a859] text-white rounded-full hover:bg-[#00d670] transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
          title="Baixar documento"
        >
          <FaDownload className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
      </div>
    </div>
  );
};

const DocumentsSection = ({ documentos, isLoading, filterCategory }: DocumentsSectionProps) => {
  // Agrupar documentos por categoria
  const documentosPorCategoria = documentos.reduce((acc, doc) => {
    const cat = doc.category || 'Outros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {} as Record<string, Documento[]>);

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex items-center gap-3 text-[#003f7f]">
                <FaSpinner className="animate-spin w-6 h-6" />
                <span className="text-lg font-medium">Carregando documentos...</span>
              </div>
            </div>
          ) : documentos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFileAlt className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum documento encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros de busca</p>
            </div>
          ) : filterCategory === 'all' ? (
            // Exibir agrupado por categoria
            Object.entries(documentosPorCategoria).map(([categoria, docs], catIndex) => (
              <div key={categoria} className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#003f7f] rounded-full flex items-center justify-center">
                    <FaFileAlt className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#003f7f]">{categoria}</h2>
                  <span className="bg-[#003f7f]/10 text-[#003f7f] px-3 py-1 rounded-full text-sm font-bold">
                    {docs.length} {docs.length === 1 ? 'documento' : 'documentos'}
                  </span>
                </div>
                <div className="space-y-4">
                  {docs.map((doc, index) => (
                    <DocumentCard key={doc.id} doc={doc} index={index} catIndex={catIndex} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Exibir lista simples quando filtrado por categoria
            <div className="space-y-4">
              {documentos.map((doc, index) => (
                <DocumentCard key={doc.id} doc={doc} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;



