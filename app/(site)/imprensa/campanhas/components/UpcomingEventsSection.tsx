'use client';

import React from 'react';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import type { Event } from '../../eventos/components';
import SectionTitle from './SectionTitle';

interface UpcomingEventsSectionProps {
  events: Event[];
  onOpenModal: (event: Event) => void;
}

const UpcomingEventsSection = ({ events, onOpenModal }: UpcomingEventsSectionProps) => {
  if (events.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          light
          title="O que vem por aí"
          subtitle="Confira os próximos eventos das campanhas da CDL Ipirá e participe."
        />

        <div className="cards-grid gap-4 sm:gap-6">
          {events.map((event, index) => {
            const [day, month, year] = event.date.split('/');
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => onOpenModal(event)}
                className="group flex items-center gap-4 text-left bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 animate-scale-in focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffd000]/60"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Calendário */}
                <span className="bg-white rounded-xl p-3 shadow-lg text-center shrink-0 min-w-16">
                  <span className="block text-[#003f7f] text-2xl font-black leading-none">{day}</span>
                  <span className="block text-[#00a859] text-xs font-semibold mt-1">{month}/{year}</span>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[#ffd000] text-[10px] sm:text-xs font-black uppercase tracking-wide mb-1 truncate">
                    {event.category}
                  </span>
                  <span className="font-bold text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-[#ffd000] transition-colors">
                    {event.title}
                  </span>
                  {(event.time || event.location) && (
                    <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-white/80">
                      {event.time && (
                        <span className="inline-flex items-center gap-1.5">
                          <FaClock className="w-3 h-3 text-[#00d670] shrink-0" aria-hidden="true" />
                          {event.time.slice(0, 5)}
                        </span>
                      )}
                      {event.location && (
                        <span className="inline-flex items-center gap-1.5 min-w-0 max-w-full">
                          <FaMapMarkerAlt className="w-3 h-3 text-[#ffd000] shrink-0" aria-hidden="true" />
                          <span className="truncate">{event.location}</span>
                        </span>
                      )}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
