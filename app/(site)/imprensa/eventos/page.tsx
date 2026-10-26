'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { parseDateOnly, todayISO } from '@/lib/date';
import { FaExclamationTriangle } from 'react-icons/fa';
import EventModal from '@/app/components/EventModal';
import {
  Breadcrumb,
  HeroSection,
  FiltersSection,
  EventsGrid,
  UpcomingEventsSection,
  Event
} from './components';
import { StateBlock, primaryButton } from '../noticias/components/LoadStates';

const matchesCategory = (event: Event, category: string) => category === 'Todos' || event.category === category;
const matchesStatus = (event: Event, status: string) =>
  status === 'Todos' ||
  (status === 'Próximos' && event.status === 'upcoming') ||
  (status === 'Em Andamento' && event.status === 'ongoing') ||
  (status === 'Realizados' && event.status === 'past');

export default function EventosPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Recarrega a lista quando reloadKey muda (botão "Tentar novamente")
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true)
          .order('date', { ascending: true })
          .order('time', { ascending: true });

        if (error) throw error;

        if (data) {
          // A coluna status não é mantida no banco: o status deriva sempre da data do evento
          const today = todayISO();
          const formattedEvents = data.filter((item: { date: string }) => parseDateOnly(item.date)).map((item: { id: number; title: string; description: string; date: string; time?: string; location?: string; category: string; image?: string; gradient?: string; participants?: string; status?: string }) => {
            const dateObj = parseDateOnly(item.date) as Date;
            const isoDate = item.date.slice(0, 10);

            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const year = dateObj.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            const fullDate = dateObj.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            const status: Event['status'] = isoDate < today ? 'past' : isoDate === today ? 'ongoing' : 'upcoming';

            return {
              ...item,
              date: formattedDate,
              fullDate: fullDate,
              gradient: item.gradient || 'from-[#003f7f] to-[#0066cc]',
              status,
              time: item.time || '',
              location: item.location || '',
              image: item.image || ''
            };
          });
          // Hoje e próximos primeiro (do mais perto ao mais longe); realizados depois, do mais recente ao mais antigo
          setAllEvents([
            ...formattedEvents.filter((event) => event.status !== 'past'),
            ...formattedEvents.filter((event) => event.status === 'past').reverse(),
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        setAllEvents([]);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [reloadKey]);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(false);
    setReloadKey((key) => key + 1);
  };

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const filteredEvents = allEvents.filter((event) => matchesCategory(event, selectedCategory) && matchesStatus(event, selectedStatus));

  // Contagem de cada opção combinada com o outro filtro (opção vazia fica desativada); carregando, sem contagem
  const countStatus = (status: string) => allEvents.filter((e) => matchesCategory(e, selectedCategory) && matchesStatus(e, status)).length;
  const countCategory = (category: string) => allEvents.filter((e) => matchesStatus(e, selectedStatus) && matchesCategory(e, category)).length;
  const showCounts = !isLoading && !loadError;

  const upcomingEvents = allEvents.filter(e => e.status === 'upcoming');

  return (
    <>
      <Breadcrumb />
      <HeroSection />
      <FiltersSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        countStatus={showCounts ? countStatus : undefined}
        countCategory={showCounts ? countCategory : undefined}
      />
      {loadError ? (
        <section className="py-10 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <StateBlock
              icon={FaExclamationTriangle}
              title="Não foi possível carregar os eventos"
              description="Verifique sua conexão e tente novamente."
            >
              <button type="button" onClick={handleRetry} className={primaryButton}>
                Tentar novamente
              </button>
            </StateBlock>
          </div>
        </section>
      ) : (
        <EventsGrid
          events={filteredEvents}
          isLoading={isLoading}
          onOpenModal={openModal}
          onResetFilters={() => {
            setSelectedCategory('Todos');
            setSelectedStatus('Todos');
          }}
        />
      )}
      <UpcomingEventsSection upcomingEvents={upcomingEvents} />
      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        event={selectedEvent} 
      />
    </>
  );
}
