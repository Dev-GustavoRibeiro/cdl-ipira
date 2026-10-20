'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from './types';

interface UpcomingEventsSectionProps {
  upcomingEvents: Event[];
}

const UpcomingEventsSection = ({ upcomingEvents }: UpcomingEventsSectionProps) => {
  if (upcomingEvents.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-blur-fade-in">
          <h2 className="text-2xl sm:text-4xl font-black tracking-[-0.015em] mb-4">
            Próximos Eventos
          </h2>
          <div className="h-1.5 w-24 rounded-full bg-linear-to-r from-[#ffd000] via-[#00d670] to-[#ffd000] mx-auto mb-5" aria-hidden="true"></div>
          <p className="text-white/90 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl mx-auto">
            Não perca as oportunidades de networking, capacitação e crescimento. Inscreva-se nos próximos eventos da CDL Ipirá.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/imprensa/contato"
              className="inline-flex items-center justify-center gap-2 bg-[#ffd000] text-[#003f7f] px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-[0_12px_28px_-12px_rgba(255,208,0,0.9)] hover:bg-[#ffed4e] hover:-translate-y-0.5 active:scale-[0.98] transition-[transform,background-color] duration-200"
            >
              Entre em Contato
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;



