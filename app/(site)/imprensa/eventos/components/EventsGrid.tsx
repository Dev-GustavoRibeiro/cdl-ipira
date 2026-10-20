'use client';

import React from 'react';
import Image from 'next/image';
import { FaArrowRight, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import { formatDateBR } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import { CardsSkeleton, StateBlock, cardClass, primaryButton, staggerDelay } from '../../noticias/components/LoadStates';
import { Event, getStatusBadge } from './types';

interface EventsGridProps {
  events: Event[];
  isLoading: boolean;
  onOpenModal: (event: Event) => void;
  /** Limpa status e categoria quando a combinação escolhida não tem eventos */
  onResetFilters?: () => void;
}

const EventsGrid = ({ events, isLoading, onOpenModal, onResetFilters }: EventsGridProps) => {
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <CardsSkeleton label="Carregando eventos" />
        ) : events.length === 0 ? (
          <StateBlock
            icon={FaCalendarAlt}
            title="Nenhum evento encontrado"
            description="Não há eventos com os filtros selecionados. Novas datas são divulgadas aqui assim que confirmadas."
          >
            {onResetFilters && (
              <button type="button" onClick={onResetFilters} className={primaryButton}>
                Ver todos os eventos
              </button>
            )}
          </StateBlock>
        ) : (
          <div className="cards-grid gap-5 sm:gap-6 md:gap-8">
            {events.map((event, index) => {
              const statusBadge = getStatusBadge(event.status);
              // Data vem formatada (DD/MM/YYYY) ou crua do banco (YYYY-MM-DD)
              const [day, month, year] = (formatDateBR(event.date) || event.date || '').split('/');
              const isUpcoming = event.status === 'upcoming';
              const ctaLabel = isUpcoming ? 'Inscrever-se' : 'Ver Detalhes';
              return (
                <article key={event.id} className={cardClass} style={staggerDelay(index)}>
                  {/* Botão cobrindo o cartão inteiro: clique, toque e teclado abrem o evento */}
                  <button
                    type="button"
                    onClick={() => onOpenModal(event)}
                    aria-label={`${ctaLabel}: ${event.title}`}
                    className="absolute inset-0 z-20 w-full cursor-pointer rounded-2xl focus-inset"
                  />

                  {/* Imagem do Evento */}
                  <div className={`relative h-48 sm:h-56 md:h-60 bg-linear-to-br ${event.gradient} overflow-hidden shrink-0`}>
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        unoptimized={!isOptimizableImage(event.image)}
                        className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaCalendarAlt className="w-14 h-14 text-white/30" aria-hidden="true" />
                      </div>
                    )}
                    {/* Overlay para os selos ficarem legíveis sobre qualquer imagem */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-black/20"></div>

                    {/* Badge Status */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                      <span className={`${statusBadge.color} px-3 py-1.5 rounded-full text-[11px] font-black shadow-lg`}>
                        {statusBadge.text}
                      </span>
                    </div>

                    {/* Badge Categoria */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 max-w-[50%]">
                      <span className="block truncate bg-white/95 backdrop-blur-sm text-[#003f7f] px-3 py-1.5 rounded-full text-[11px] font-black shadow-lg">
                        {event.category}
                      </span>
                    </div>

                    {/* Calendário */}
                    {day && month && (
                      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10">
                        <div className="bg-white rounded-xl px-2.5 py-2 shadow-lg text-center">
                          <div className="text-[#003f7f] text-lg font-black leading-none">{day}</div>
                          <div className="text-[#00a859] text-[10px] font-bold mt-1">
                            {month}/{year}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 sm:p-6 flex flex-col grow">
                    <h3 className="text-lg sm:text-xl font-extrabold tracking-[-0.015em] text-gray-900 mb-2 group-hover:text-[#003f7f] transition-colors line-clamp-2 leading-snug">
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className="text-sm sm:text-[15px] text-gray-600 mb-4 leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    {/* Informações do Evento */}
                    <ul className="space-y-2 mb-5 text-sm text-gray-600">
                      {event.time && (
                        <li className="flex items-center gap-2">
                          <FaClock className="w-3.5 h-3.5 text-[#00a859] shrink-0" aria-hidden="true" />
                          <span>{event.time.slice(0, 5)}</span>
                        </li>
                      )}
                      {event.location && (
                        <li className="flex items-center gap-2 min-w-0">
                          <FaMapMarkerAlt className="w-3.5 h-3.5 text-[#0066cc] shrink-0" aria-hidden="true" />
                          <span className="truncate">{event.location}</span>
                        </li>
                      )}
                      {!!event.attendees && (
                        <li className="flex items-center gap-2">
                          <FaUsers className="w-3.5 h-3.5 text-[#003f7f] shrink-0" aria-hidden="true" />
                          <span>{event.attendees} participantes</span>
                        </li>
                      )}
                    </ul>

                    {/* Ação (visual): o botão que cobre o cartão é quem recebe o clique */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <span
                        className={`w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-[background-color,color,gap] duration-300 ${
                          isUpcoming
                            ? 'bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white group-hover:gap-3'
                            : 'border-2 border-[#003f7f] text-[#003f7f] group-hover:bg-[#003f7f] group-hover:text-white'
                        }`}
                      >
                        {ctaLabel}
                        {isUpcoming && <FaArrowRight className="w-3.5 h-3.5" aria-hidden="true" />}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsGrid;
