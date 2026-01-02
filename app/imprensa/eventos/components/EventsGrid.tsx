'use client';

import React from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import { Event, getStatusBadge } from './types';

interface EventsGridProps {
  events: Event[];
  isLoading: boolean;
  onOpenModal: (event: Event) => void;
}

const EventsGrid = ({ events, isLoading, onOpenModal }: EventsGridProps) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg sm:text-xl">Carregando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-600 text-lg sm:text-xl">Nenhum evento encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {events.map((event, index) => {
              const statusBadge = getStatusBadge(event.status);
              return (
                <article
                  key={event.id}
                  className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Imagem do Evento */}
                  <div 
                    onClick={() => onOpenModal(event)}
                    className={`relative h-48 xs:h-52 sm:h-56 md:h-64 bg-linear-to-br ${event.gradient} overflow-hidden cursor-pointer`}
                  >
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-black/10"></div>
                    )}
                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>
                    
                    {/* Badge Status */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                      <span className={`${statusBadge.color} px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] xs:text-xs font-black shadow-lg`}>
                        {statusBadge.text}
                      </span>
                    </div>

                    {/* Badge Categoria */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                      <span className="bg-white/90 backdrop-blur-sm text-[#003f7f] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] xs:text-xs font-black shadow-lg">
                        {event.category}
                      </span>
                    </div>

                    {/* Calendário */}
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg">
                        <div className="text-[#003f7f] text-base sm:text-lg font-bold text-center leading-none">
                          {event.date.split('/')[0]}
                        </div>
                        <div className="text-[#00a859] text-xs font-semibold mt-1">
                          {event.date.split('/')[1]}/{event.date.split('/')[2]}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4 sm:p-5 md:p-6 relative flex flex-col grow bg-white">
                    <h3 
                      onClick={() => onOpenModal(event)}
                      className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-[#003f7f] transition-colors line-clamp-2 leading-tight cursor-pointer"
                    >
                      {event.title}
                    </h3>
                    
                    <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed line-clamp-3 grow text-justify">
                      {event.description}
                    </p>

                    {/* Informações do Evento */}
                    <div className="space-y-2 sm:space-y-2.5 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <FaClock className="w-3 h-3 sm:w-4 sm:h-4 text-[#00a859] shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-[#ffd000] shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      {event.attendees && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <FaUsers className="w-3 h-3 sm:w-4 sm:h-4 text-[#003f7f] shrink-0" />
                          <span>{event.attendees} participantes</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => onOpenModal(event)}
                        className={`w-full inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold transition-all duration-300 text-sm sm:text-base group/btn ${
                          event.status === 'upcoming' 
                            ? 'bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white hover:shadow-lg hover:scale-105'
                            : 'border-2 border-[#003f7f] text-[#003f7f] hover:bg-[#003f7f] hover:text-white'
                        }`}
                      >
                        {event.status === 'upcoming' ? 'Inscrever-se' : 'Ver Detalhes'}
                        {event.status === 'upcoming' && (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Paginação (Opcional para o futuro) */}
        {events.length > 9 && (
          <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2 sm:gap-3">
             {/* Lógica de paginação aqui */}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsGrid;



