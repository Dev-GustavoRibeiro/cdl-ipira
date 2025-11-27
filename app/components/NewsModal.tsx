'use client';

import React from 'react';
import Image from 'next/image';
import { FaTimes, FaCalendar, FaUser, FaTag } from 'react-icons/fa';
import { createPortal } from 'react-dom';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: {
    title: string;
    content: string;
    date: string;
    category: string;
    image?: string;
    author?: string;
    color?: string;
  } | null;
}

export default function NewsModal({ isOpen, onClose, news }: NewsModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !news) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative z-10 flex flex-col animate-scale-in">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur text-gray-600 hover:text-red-600 rounded-full shadow-lg transition-all hover:rotate-90"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Header com Imagem (se houver) ou Gradiente */}
        <div className={`relative h-64 sm:h-80 md:h-96 shrink-0 ${!news.image ? `bg-linear-to-br ${news.color || 'from-blue-600 to-blue-800'}` : ''}`}>
          {news.image ? (
            <Image 
              src={news.image} 
              alt={news.title} 
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8">
               <h2 className="text-3xl md:text-4xl font-black text-white text-center leading-tight drop-shadow-lg">
                 {news.title}
               </h2>
            </div>
          )}
          
          {/* Overlay Gradient se tiver imagem para texto ficar legível se decidirmos por texto em cima */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none"></div>

           {/* Badge Categoria */}
           <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
            <span className="bg-[#ffd000] text-[#003f7f] px-4 py-1.5 rounded-full text-sm font-black shadow-lg flex items-center gap-2">
              <FaTag className="w-3 h-3" />
              {news.category}
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 sm:p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-2">
              <FaCalendar className="text-[#00a859]" />
              <span className="font-medium">{news.date}</span>
            </div>
            {news.author && (
              <div className="flex items-center gap-2">
                <FaUser className="text-[#003f7f]" />
                <span className="font-medium">{news.author}</span>
              </div>
            )}
          </div>

          {news.image && (
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#003f7f] mb-6 leading-tight">
               {news.title}
             </h2>
          )}

          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

