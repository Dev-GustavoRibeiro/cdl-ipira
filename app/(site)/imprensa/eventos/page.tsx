'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import EventModal from '@/app/components/EventModal';
import {
  Breadcrumb,
  HeroSection,
  FiltersSection,
  EventsGrid,
  UpcomingEventsSection,
  Event
} from './components';

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
          .order('date', { ascending: true });

        if (error) throw error;

        if (data) {
          const formattedEvents = data.map((item: { id: number; title: string; description: string; date: string; time?: string; location?: string; category: string; image?: string; gradient?: string; participants?: string; status?: string }) => {
            let dateObj = new Date(item.date);
            if (item.date && item.date.includes('-')) {
               const [year, month, day] = item.date.split('-').map(Number);
               dateObj = new Date(year, month - 1, day);
            }
            
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const year = dateObj.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            const fullDate = dateObj.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            dateObj.setHours(0, 0, 0, 0);
            let status: 'upcoming' | 'ongoing' | 'past' = 'upcoming';
            if (dateObj < today) {
              status = 'past';
            } else if (dateObj.getTime() === today.getTime()) {
              status = 'ongoing';
            }

            return {
              ...item,
              date: formattedDate,
              fullDate: fullDate,
              gradient: item.gradient || 'from-[#003f7f] to-[#0066cc]',
              status: (item.status as 'upcoming' | 'ongoing' | 'past') || status,
              time: item.time || '',
              location: item.location || '',
              image: item.image || ''
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
      />
      <EventsGrid
        events={filteredEvents}
        isLoading={isLoading}
        onOpenModal={openModal}
      />
      <UpcomingEventsSection upcomingEvents={upcomingEvents} />
      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        event={selectedEvent} 
      />
    </>
  );
}
