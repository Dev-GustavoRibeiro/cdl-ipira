'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { A11y, Autoplay } from 'swiper/modules';
import { FaArrowRight, FaBullhorn, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import EventModal from './EventModal';
import { formatDateBR, isTodayOrFuture, parseDateOnly, todayISO } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import 'swiper/css';
import 'swiper/css/a11y';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // DD/MM/YYYY (exibida no modal)
  time: string;
  location: string;
  category: string;
  participants: string; // String for display in card ('' = não informado)
  attendees?: number; // Number for modal
  image?: string;
  gradient: string;
  month: string; // Derived for display
  day: string;   // Derived for display
  year: string;  // Derived for display
  fullDate: string; // Derived for display
  status: 'upcoming' | 'ongoing' | 'past';
}

// Cores da marca para eventos sem imagem (também usadas no topo do modal)
const GRADIENTS = [
  'from-[#003f7f] to-[#0066cc]',
  'from-[#00a859] to-[#00d670]',
  'from-[#0052a3] to-[#0066cc]',
  'from-[#ffd000] to-[#ffed4e]',
];

// Acima disso vira carrossel; até aqui, grade estática (sem setas nem bolinhas)
const GRID_MAX = 3;

// Grade de 3 itens: no tablet (2 colunas) o terceiro card fica centralizado em vez de sobrar à esquerda
const GRID_3 = 'sm:grid-cols-2 lg:grid-cols-3 sm:max-lg:[&>:last-child]:col-span-2 sm:max-lg:[&>:last-child]:mx-auto sm:max-lg:[&>:last-child]:w-[calc(50%-0.75rem)]';

const SHADOW = 'shadow-[0_12px_32px_-18px_rgba(0,63,127,0.35)]';
const SHADOW_HOVER = 'hover:shadow-[0_24px_50px_-20px_rgba(0,63,127,0.45)]';

const primaryButtonClass = `group inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#003f7f] to-[#0066cc] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)] active:scale-[0.98] motion-reduce:hover:translate-y-0`;

const secondaryButtonClass = `group inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#003f7f]/15 bg-white px-7 py-3 text-sm font-bold text-[#003f7f] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#003f7f] active:scale-[0.98] motion-reduce:hover:translate-y-0`;

const navButtonClass = `grid h-12 w-12 place-items-center rounded-full bg-white text-[#003f7f] ring-1 ring-gray-200 shadow-[0_8px_20px_-10px_rgba(0,63,127,0.45)] transition-all duration-200 hover:bg-[#003f7f] hover:text-white hover:ring-[#003f7f] active:scale-95`;

// Slides fora da área visível (no destino da transição) ficam inertes: fora do Tab e do leitor de tela.
// Conta pelas posições do Swiper com 1px de folga, porque a classe "fully-visible" falha com larguras fracionadas.
function syncInert(s: SwiperClass) {
  const active = document.activeElement;
  const start = s.snapGrid[s.snapIndex] ?? 0;
  s.slides.forEach((el, i) => {
    const left = s.slidesGrid[i] - start;
    el.inert = left < -1 || left + s.slidesSizesGrid[i] > s.width + 1;
  });
  // Se o foco estava num card que saiu de vista, leva para o primeiro card visível
  if (active instanceof HTMLElement && active.closest('.swiper-slide')?.hasAttribute('inert')) {
    s.slides.find((el) => !el.inert)?.querySelector('button')?.focus({ preventScroll: true });
  }
}

function SectionHeader({ compact, actions }: { compact?: boolean; actions?: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${compact ? 'mb-8 md:mb-10' : 'mb-10 md:mb-14'}`}>
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#003f7f] px-4 py-1.5 text-xs font-bold tracking-[0.14em] text-white uppercase shadow-sm">
          <FaCalendarAlt aria-hidden="true" className="text-[#ffd000]" />
          Agenda CDL Ipirá
        </span>
        <h2 id="eventos-titulo" className="mt-4 text-4xl leading-[1.05] font-black tracking-tight text-balance text-[#003f7f] sm:text-5xl lg:text-6xl">
          Eventos em Destaque
        </h2>
        <div className="mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
        <p className="mt-5 text-base text-balance text-gray-600 md:text-lg">
          Participe dos eventos que fortalecem o comércio e a comunidade de Ipirá.
        </p>
      </div>
      {actions}
    </div>
  );
}

function EventsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`overflow-hidden rounded-3xl bg-white ring-1 ring-gray-100 ${SHADOW} ${i === 1 ? 'hidden sm:block' : ''} ${i === 2 ? 'hidden lg:block' : ''}`}
        >
          <div className="aspect-16/10 animate-pulse bg-gray-200 motion-reduce:animate-none" />
          <div className="space-y-3 p-6">
            <div className="h-5 w-4/5 animate-pulse rounded-full bg-gray-200 motion-reduce:animate-none" />
            <div className="h-3.5 w-1/2 animate-pulse rounded-full bg-gray-100 motion-reduce:animate-none" />
            <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-gray-100 motion-reduce:animate-none" />
            <div className="mt-6 h-11 w-full animate-pulse rounded-full bg-gray-100 motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EventCard({ event, featured, sizes, onOpen }: { event: Event; featured?: boolean; sizes: string; onOpen: (event: Event) => void }) {
  return (
    <article
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-3xl text-left bg-white ring-1 ring-gray-100 ${SHADOW} ${SHADOW_HOVER} transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#003f7f] has-focus-visible:ring-2 has-focus-visible:ring-[#ffd000] motion-reduce:hover:translate-y-0 ${featured ? 'md:flex-row' : ''}`}
    >
      {/* Imagem do Evento */}
      <div className={`relative aspect-16/10 shrink-0 overflow-hidden bg-linear-to-br ${event.gradient} ${featured ? 'md:aspect-auto md:min-h-96 md:w-1/2' : ''}`}>
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes={sizes}
            unoptimized={!isOptimizableImage(event.image)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
        ) : (
          <FaCalendarAlt aria-hidden="true" className="absolute inset-0 m-auto text-6xl text-white/30" />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/20" />

        {/* Categoria Badge - amarelo com texto azul */}
        <span className="absolute top-5 left-5 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-black text-[#003f7f] shadow-lg">
          {event.category}
        </span>

        {event.status === 'ongoing' && (
          <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-[#00a859] px-3.5 py-1.5 text-xs font-bold text-white shadow-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            É hoje
          </span>
        )}

        {/* Calendário */}
        <div className="absolute top-5 right-5 overflow-hidden rounded-2xl bg-white text-center shadow-2xl transition-transform duration-500 group-hover:-rotate-3 motion-reduce:group-hover:rotate-0">
          <div className="bg-[#003f7f] px-4 py-1.5 text-xs font-bold tracking-wider text-white uppercase">{event.month}</div>
          <div className="px-4 pt-2 pb-2.5">
            <div className="text-3xl leading-none font-black text-[#003f7f]">{event.day}</div>
            <div className="mt-1 text-[11px] font-semibold text-gray-500">{event.year}</div>
          </div>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className={`flex grow flex-col p-6 md:p-7 ${featured ? 'md:justify-center md:p-10 lg:p-12' : ''}`}>
        <h3 className={`leading-snug font-black tracking-tight text-gray-900 transition-colors group-hover:text-[#003f7f] ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
          {/* Botão "esticado": o ::after cobre o card inteiro, então qualquer clique abre o modal */}
          <button
            type="button"
            onClick={() => onOpen(event)}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:shadow-none! focus-visible:outline-none!"
          >
            <span className="line-clamp-2">{event.title}</span>
          </button>
        </h3>

        <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
          <li className="flex items-center gap-2.5">
            <FaCalendarAlt aria-hidden="true" className="shrink-0 text-[#00a859]" />
            <span className="font-semibold text-gray-800">
              {event.fullDate}
              {event.time && <span className="font-normal text-gray-500"> · {event.time.slice(0, 5)}</span>}
            </span>
          </li>
          <li className="flex items-center gap-2.5">
            <FaMapMarkerAlt aria-hidden="true" className="shrink-0 text-[#00a859]" />
            <span className="line-clamp-1">{event.location}</span>
          </li>
          {event.participants && (
            <li className="flex items-center gap-2.5">
              <FaUsers aria-hidden="true" className="shrink-0 text-[#00a859]" />
              <span className="line-clamp-1">{event.participants}</span>
            </li>
          )}
        </ul>

        {event.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-gray-600">{event.description}</p>
        )}

        <div className={`mt-auto pt-6 ${featured ? 'md:mt-0 md:pt-8' : ''}`}>
          <span
            aria-hidden="true"
            className={`items-center justify-center gap-2 rounded-full border-2 border-[#003f7f] px-6 py-3 text-sm font-bold text-[#003f7f] transition-colors duration-300 group-hover:bg-[#003f7f] group-hover:text-white ${featured ? 'flex md:inline-flex' : 'flex'}`}
          >
            Saiba mais
            <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>

      {/* Barra colorida inferior */}
      <div className={`absolute inset-x-0 bottom-0 h-1.5 bg-linear-to-r ${event.gradient}`} />
    </article>
  );
}

// Sem eventos futuros: faixa compacta com caminhos úteis, em vez de um bloco vazio
function NoUpcomingEvents() {
  return (
    <div className={`rounded-3xl bg-white p-6 ring-1 ring-gray-100 sm:p-8 md:p-10 ${SHADOW}`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-[#003f7f] to-[#0066cc] text-2xl text-white shadow-[0_12px_24px_-10px_rgba(0,63,127,0.6)]">
            <FaCalendarAlt aria-hidden="true" />
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-[#ffd000] ring-4 ring-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-[#003f7f] md:text-3xl">Novos eventos em breve</h3>
            <p className="mt-2 max-w-xl text-pretty text-gray-600">
              Estamos preparando a próxima agenda. Enquanto isso, relembre os eventos realizados e acompanhe nossas campanhas.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:ml-auto lg:shrink-0">
          <Link href="/imprensa/eventos" className={primaryButtonClass}>
            Ver eventos realizados
            <FaArrowRight aria-hidden="true" className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link href="/imprensa/campanhas" className={secondaryButtonClass}>
            <FaBullhorn aria-hidden="true" className="text-[#00a859]" />
            Conheça nossas campanhas
          </Link>
        </div>
      </div>
    </div>
  );
}

const EventsCarousel = () => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [swiper, setSwiper] = React.useState<SwiperClass | null>(null);
  const [snap, setSnap] = React.useState({ index: 0, count: 1 });

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/eventos');
        if (response.ok) {
          const data = await response.json();

          // A coluna status não é mantida no banco: a home mostra só eventos de hoje em diante
          const today = todayISO();
          const upcoming = data.filter((item: { date?: string | null }) => isTodayOrFuture(item.date, today) && parseDateOnly(item.date));

          const mappedEvents = upcoming.map((item: { id: number; title: string; description?: string | null; date: string; time?: string | null; location?: string | null; category?: string | null; participants?: string | null; attendees?: number | null; image?: string | null }, index: number): Event => {
            const dateObj = parseDateOnly(item.date) as Date;
            const day = dateObj.getDate().toString().padStart(2, '0');
            const monthShort = dateObj.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
            const year = dateObj.getFullYear().toString();
            const fullDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

            return {
              id: item.id,
              title: item.title,
              description: item.description || '',
              date: formatDateBR(item.date),
              time: item.time || '',
              location: item.location || 'CDL Ipirá',
              category: item.category || 'Evento',
              participants: item.participants || '',
              attendees: item.attendees || undefined,
              image: item.image || undefined,
              gradient: GRADIENTS[index % GRADIENTS.length],
              month: monthShort,
              day: day,
              year: year,
              fullDate: fullDate,
              status: item.date.slice(0, 10) === today ? 'ongoing' : 'upcoming'
            };
          });

          setEvents(mappedEvents);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Com o modal aberto o carrossel não anda (senão o card de origem sai de vista e o foco não volta para ele)
  const openModal = (event: Event) => {
    swiper?.autoplay?.stop();
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const isEmpty = !isLoading && events.length === 0;
  const isCarousel = events.length > GRID_MAX;
  // Só existe no cliente (a lista vem do fetch), então pode ler a preferência direto
  const reduceMotion = isCarousel && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sync = (s: SwiperClass) => {
    setSnap({ index: s.snapIndex, count: s.snapGrid.length });
    syncInert(s);
  };

  const viewAll = (
    <Link href="/imprensa/eventos" className={primaryButtonClass}>
      Ver agenda completa
      <FaArrowRight aria-hidden="true" className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );

  let content: React.ReactNode;
  if (isLoading) {
    content = <EventsSkeleton />;
  } else if (isEmpty) {
    content = <NoUpcomingEvents />;
  } else if (!isCarousel) {
    const sizes = events.length === 3 ? '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw' : '(min-width: 768px) 50vw, 100vw';
    content = (
      <div className={`grid gap-6 lg:gap-8 ${events.length === 2 ? 'md:grid-cols-2' : events.length === 3 ? GRID_3 : ''}`}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} featured={events.length === 1} sizes={sizes} onOpen={openModal} />
        ))}
      </div>
    );
  } else {
    content = (
      <>
        <Swiper
          modules={[A11y, Autoplay]}
          onSwiper={setSwiper}
          onAfterInit={sync}
          onSnapIndexChange={sync}
          onSnapGridLengthChange={sync}
          rewind
          speed={reduceMotion ? 0 : 600}
          slidesPerView={1.15}
          spaceBetween={16}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 32 },
          }}
          autoplay={reduceMotion ? false : { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          a11y={{
            containerRoleDescriptionMessage: 'carrossel',
            itemRoleDescriptionMessage: 'evento',
            slideLabelMessage: '{{index}} de {{slidesLength}}',
            // Só os slides visíveis recebem foco (os demais ficam inert), então não precisa rolar ao focar
            scrollOnFocus: false,
          }}
          className="-mx-4! -mt-3! -mb-12! w-auto! px-4! pt-3! pb-12!"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id} className="h-auto! px-0!">
              <EventCard event={event} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw" onOpen={openModal} />
            </SwiperSlide>
          ))}
        </Swiper>

        {snap.count > 1 && (
          <div className="mt-5 flex justify-center">
            {Array.from({ length: snap.count }, (_, i) => (
              // Área de toque de 24px+ ao redor do ponto visível
              <button
                key={i}
                type="button"
                onClick={() => swiper?.slideTo(i)}
                aria-label={`Ir para a posição ${i + 1} de ${snap.count}`}
                aria-current={i === snap.index ? 'true' : undefined}
                className="group/dot grid h-10 place-items-center rounded-full px-[7px]"
              >
                <span className={`block h-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${i === snap.index ? 'w-8 bg-[#003f7f]' : 'w-2.5 bg-gray-300 group-hover/dot:bg-gray-400'}`} />
              </button>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <section
      aria-labelledby="eventos-titulo"
      aria-busy={isLoading || undefined}
      className={`relative overflow-hidden bg-white ${isEmpty ? 'py-14 md:py-20' : 'py-16 md:py-24'}`}
    >
      {/* Elementos decorativos de fundo */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#003f7f]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#ffd000]/10 blur-3xl" />

      {/* Teclado: setas navegam; foco dentro pausa o autoplay (hover é tratado pelo Swiper).
          Fica fora do modal, que é um portal e também propagaria os eventos. */}
      <div
        className="relative container mx-auto px-4"
        onKeyDown={(e) => {
          if (!swiper) return;
          if (e.key === 'ArrowLeft') swiper.slidePrev();
          if (e.key === 'ArrowRight') swiper.slideNext();
        }}
        onFocus={() => swiper?.autoplay?.running && swiper.autoplay.stop()}
        onBlur={(e) => {
          if (swiper && !reduceMotion && !isModalOpen && !e.currentTarget.contains(e.relatedTarget)) swiper.autoplay?.start();
        }}
      >
        <SectionHeader
          compact={isEmpty}
          actions={
            events.length > 0 && (
              <div className="hidden shrink-0 items-center gap-3 md:flex">
                {isCarousel && (
                  <>
                    <button type="button" onClick={() => swiper?.slidePrev()} aria-label="Eventos anteriores" className={navButtonClass}>
                      <FaChevronLeft aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => swiper?.slideNext()} aria-label="Próximos eventos" className={navButtonClass}>
                      <FaChevronRight aria-hidden="true" />
                    </button>
                  </>
                )}
                {viewAll}
              </div>
            )
          }
        />

        {content}

        {events.length > 0 && <div className="mt-10 md:hidden [&>a]:w-full">{viewAll}</div>}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Volta a rodar; se o foco retornar ao card, o onFocus acima pausa de novo
          if (!reduceMotion) swiper?.autoplay?.start();
        }}
        event={selectedEvent}
      />
    </section>
  );
};

export default EventsCarousel;
