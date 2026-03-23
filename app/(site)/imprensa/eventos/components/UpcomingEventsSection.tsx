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
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black mb-4 sm:mb-6">
            Próximos Eventos
          </h2>
          <p className="text-white/90 text-sm sm:text-base mb-6 sm:mb-8 text-justify">
            Não perca as oportunidades de networking, capacitação e crescimento. Inscreva-se nos próximos eventos da CDL Ipirá.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/imprensa/contato"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-white hover:text-[#003f7f] transition-all duration-300"
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



