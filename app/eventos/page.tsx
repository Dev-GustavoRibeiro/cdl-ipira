'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import EventModal from '@/app/components/EventModal';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  attendees?: number;
  status: 'upcoming' | 'ongoing' | 'past';
  gradient: string;
  fullDate?: string;
}

const categories = ['Todos', 'Networking', 'Capacitação', 'Feira', 'Palestra', 'Institucional', 'Reunião'];
const statusFilters = ['Todos', 'Próximos', 'Em Andamento', 'Realizados'];

export default function EventosPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true)
          .order('date', { ascending: true }); // Ordenar por data mais próxima

        if (error) throw error;

        if (data) {
          const formattedEvents = data.map((item: any) => {
            let dateObj = new Date(item.date);
            // Ajuste para fuso horário se necessário, ou assumindo que a data vem YYYY-MM-DD
            if (item.date && item.date.includes('-')) {
               const [year, month, day] = item.date.split('-').map(Number);
               dateObj = new Date(year, month - 1, day);
            }
            
            // Formatar DD/MM/YYYY
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const year = dateObj.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            const fullDate = dateObj.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            return {
              ...item,
              date: formattedDate,
              fullDate: fullDate,
              gradient: item.gradient || 'from-[#003f7f] to-[#0066cc]'
            };
          });
          setAllEvents(formattedEvents);
        }
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        setAllEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const filteredEvents = allEvents.filter(event => {
    const categoryMatch = selectedCategory === 'Todos' || event.category === selectedCategory;
    const statusMatch = selectedStatus === 'Todos' || 
      (selectedStatus === 'Próximos' && event.status === 'upcoming') ||
      (selectedStatus === 'Em Andamento' && event.status === 'ongoing') ||
      (selectedStatus === 'Realizados' && event.status === 'past');
    return categoryMatch && statusMatch;
  });

  // Separar eventos por status para a seção de destaque (opcional)
  const upcomingEvents = allEvents.filter(e => e.status === 'upcoming');

  const getStatusBadge = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return { text: 'Próximo', color: 'bg-[#00a859] text-white' };
      case 'ongoing':
        return { text: 'Em Andamento', color: 'bg-[#ffd000] text-[#003f7f]' };
      case 'past':
        return { text: 'Realizado', color: 'bg-gray-400 text-white' };
    }
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-[#003f7f] text-white py-2.5 sm:py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm" aria-label="Breadcrumb">
            <Link 
              href="/" 
              className="hover:text-[#ffd000] transition-colors flex items-center gap-1 group"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-[-2px] transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Início</span>
            </Link>
            <span className="text-white/40">/</span>
            <Link 
              href="/noticias" 
              className="hover:text-[#ffd000] transition-colors"
            >
              Imprensa
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-semibold">Eventos</span>
          </nav>
        </div>
      </div>

      {/* Header da Página */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <div className="inline-block bg-linear-to-r from-[#00a859] to-[#00d670] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
              📅 Eventos
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-3 sm:mb-4 leading-tight">
              Nossos Eventos
            </h1>
            <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4 text-justify">
              Participe dos eventos da CDL Ipirá e fortaleça seu negócio através de networking, capacitação e oportunidades de crescimento
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-4 sm:py-6 bg-white border-b border-gray-200 sticky top-[73px] sm:top-[81px] z-40 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {/* Filtro de Status */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm font-semibold text-gray-600 mr-2">Status:</span>
              {statusFilters.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 ${
                    selectedStatus === status
                      ? 'bg-[#003f7f] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-[#003f7f] hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Filtro de Categoria */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm font-semibold text-gray-600 mr-2">Categoria:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-[#00a859] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-[#00a859] hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Eventos */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg sm:text-xl">Carregando eventos...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-gray-600 text-lg sm:text-xl">Nenhum evento encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
              {filteredEvents.map((event, index) => {
                const statusBadge = getStatusBadge(event.status);
                return (
                  <article
                    key={event.id}
                    className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Imagem do Evento */}
                    <div 
                      onClick={() => openModal(event)}
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
                        onClick={() => openModal(event)}
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
                          onClick={() => openModal(event)}
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
          {filteredEvents.length > 9 && (
            <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2 sm:gap-3">
               {/* Lógica de paginação aqui */}
            </div>
          )}
        </div>
      </section>

      {/* Seção de Destaque - Próximos Eventos */}
      {upcomingEvents.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center animate-blur-fade-in">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black mb-4 sm:mb-6">
                Próximos Eventos
              </h2>
              <p className="text-white/90 text-sm sm:text-base mb-6 sm:mb-8 text-justify">
                Não perca as oportunidades de networking, capacitação e crescimento. Inscreva-se nos próximos eventos da CDL Ipirá.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/contato"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-white hover:text-[#003f7f] transition-all duration-300"
                >
                  Entre em Contato
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        event={selectedEvent} 
      />
    </>
  );
}
