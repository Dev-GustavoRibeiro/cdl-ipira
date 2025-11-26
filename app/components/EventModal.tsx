'use client';

import React, { useState } from 'react';
import { FaTimes, FaCalendar, FaClock, FaMapMarkerAlt, FaTag, FaUsers, FaCheckCircle } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import RegistrationModal from './RegistrationModal';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    image?: string;
    gradient?: string;
    attendees?: number;
    status?: 'upcoming' | 'ongoing' | 'past';
  } | null;
}

export default function EventModal({ isOpen, onClose, event }: EventModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

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

  if (!mounted || !isOpen || !event) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
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
          <div className={`relative h-64 sm:h-80 md:h-96 shrink-0 ${!event.image ? `bg-linear-to-br ${event.gradient || 'from-[#003f7f] to-[#0066cc]'}` : ''}`}>
            {event.image ? (
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8">
                 <h2 className="text-3xl md:text-4xl font-black text-white text-center leading-tight drop-shadow-lg">
                   {event.title}
                 </h2>
              </div>
            )}
            
            {/* Overlay Gradient se tiver imagem */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>

             {/* Badge Categoria */}
             <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
              <span className="bg-[#ffd000] text-[#003f7f] px-4 py-1.5 rounded-full text-sm font-black shadow-lg flex items-center gap-2">
                <FaTag className="w-3 h-3" />
                {event.category}
              </span>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-6 sm:p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2 space-y-6">
                {event.image && (
                  <h2 className="text-2xl sm:text-3xl font-black text-[#003f7f] leading-tight">
                    {event.title}
                  </h2>
                )}
                
                <div className="prose prose-lg text-gray-600 text-justify">
                  <p>{event.description}</p>
                </div>
              </div>

              {/* Sidebar de Informações */}
              <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-100 h-fit">
                <h3 className="font-bold text-[#003f7f] text-lg mb-2 border-b border-gray-200 pb-2">Detalhes do Evento</h3>
                
                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-[#00a859]">
                    <FaCalendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">DATA</div>
                    <div className="text-gray-800 font-medium">{event.date}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-[#00a859]">
                    <FaClock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">HORÁRIO</div>
                    <div className="text-gray-800 font-medium">{event.time}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-[#ffd000]">
                    <FaMapMarkerAlt className="w-5 h-5 text-[#b39200]" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">LOCAL</div>
                    <div className="text-gray-800 font-medium">{event.location}</div>
                  </div>
                </div>

                {event.attendees !== undefined && (
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-[#003f7f]">
                      <FaUsers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-semibold">PARTICIPANTES</div>
                      <div className="text-gray-800 font-medium">{event.attendees} estimados</div>
                    </div>
                  </div>
                )}

                {event.status === 'upcoming' && (
                  <button 
                    onClick={() => setIsRegistrationOpen(true)}
                    className="w-full mt-4 bg-[#003f7f] text-white py-3 rounded-lg font-bold hover:bg-[#005a9e] transition-colors shadow-lg"
                  >
                    Inscrever-se Agora
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Inscrição Aninhado */}
      <RegistrationModal 
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        event={event}
      />
    </>,
    document.body
  );
}
