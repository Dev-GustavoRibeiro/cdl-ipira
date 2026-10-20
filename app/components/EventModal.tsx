'use client';

import React, { useId, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaCalendar, FaClock, FaMapMarkerAlt, FaTag, FaUsers } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import RegistrationModal from './RegistrationModal';
import { formatDateLong, isTodayOrFuture } from '@/lib/date';
import { useIsClient, useModalBehavior } from '@/lib/hooks/useModalBehavior';

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

// A data pode chegar como YYYY-MM-DD (banco) ou DD/MM/YYYY (já formatada pela página)
function toISODate(value: string): string {
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  return /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : '';
}

export default function EventModal({ isOpen, onClose, event }: EventModalProps) {
  const isClient = useIsClient();
  const titleId = useId();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const dialogRef = useModalBehavior<HTMLDivElement>(isOpen && !!event, onClose);

  if (!isClient || !isOpen || !event) return null;

  const isoDate = toISODate(event.date || '');
  const displayDate = formatDateLong(isoDate) || event.date;
  // Inscrição só para eventos de hoje em diante; o status salvo no banco não é mantido
  const canRegister = isoDate ? isTodayOrFuture(isoDate) : event.status !== 'past';

  return createPortal(
    <>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        ></div>

        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative z-10 flex flex-col animate-scale-in"
        >
          {/* Botão Fechar */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar evento"
            className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur text-gray-600 hover:text-red-600 rounded-full shadow-lg transition-all hover:rotate-90"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          {/* Header com Imagem (se houver) ou Gradiente */}
          <div className={`relative h-64 sm:h-80 md:h-96 shrink-0 ${!event.image ? `bg-linear-to-br ${event.gradient || 'from-[#003f7f] to-[#0066cc]'}` : ''}`}>
            {event.image ? (
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8">
                 <h2 id={titleId} className="text-3xl md:text-4xl font-black text-white text-center leading-tight drop-shadow-lg">
                   {event.title}
                 </h2>
              </div>
            )}

            {/* Overlay Gradient se tiver imagem */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>

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
                  <h2 id={titleId} className="text-2xl sm:text-3xl font-black text-[#003f7f] leading-tight">
                    {event.title}
                  </h2>
                )}

                <div className="prose prose-lg text-gray-600 text-left sm:text-justify">
                  <p className="whitespace-pre-line">{event.description}</p>
                </div>
              </div>

              {/* Sidebar de Informações */}
              <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-100 h-fit">
                <h3 className="font-bold text-[#003f7f] text-lg mb-2 border-b border-gray-200 pb-2">Detalhes do Evento</h3>

                {displayDate && (
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-[#00a859]">
                      <FaCalendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-semibold">DATA</div>
                      <div className="text-gray-800 font-medium">{displayDate}</div>
                    </div>
                  </div>
                )}

                {event.time && (
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-[#00a859]">
                      <FaClock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-semibold">HORÁRIO</div>
                      <div className="text-gray-800 font-medium">{event.time.slice(0, 5)}</div>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-[#ffd000]">
                      <FaMapMarkerAlt className="w-5 h-5 text-[#b39200]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-semibold">LOCAL</div>
                      <div className="text-gray-800 font-medium">{event.location}</div>
                    </div>
                  </div>
                )}

                {!!event.attendees && event.attendees > 0 && (
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

                {canRegister && (
                  <button
                    type="button"
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
