'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaBullhorn, FaCalendarAlt, FaMapMarkerAlt, FaRegClock } from 'react-icons/fa';
import EventModal from './EventModal';
import SectionCarousel, { MOUSE_FOCUS, SectionHeading, mediaFitClass, useCardsMotion } from './carousel/SectionCarousel';
import { useReveal } from './motion/useReveal';
import { ScrollTrigger } from '@/lib/motion';
import { isTodayOrFuture, parseDateOnly, todayISO } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';

interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD (o modal formata)
  time: string; // HH:MM ('' = não informado)
  location: string;
  category: string;
  attendees?: number;
  image?: string;
  gradient: string;
  day: string;
  month: string;
  weekday: string;
  isToday: boolean;
  registration_enabled: boolean;
}

type ApiEvent = { id: number; title: string; description?: string | null; date?: string | null; time?: string | null; location?: string | null; category?: string | null; attendees?: number | null; image?: string | null; registration_enabled?: boolean | null };

// Cores da marca para eventos sem imagem (também usadas no topo do modal)
const GRADIENTS = [
  'from-[#003f7f] to-[#0066cc]',
  'from-[#00a859] to-[#00d670]',
  'from-[#0052a3] to-[#0066cc]',
  'from-[#ffd000] to-[#ffed4e]',
];

const short = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString('pt-BR', opts).replace('.', '');

function EventCard({ event, featured, sizes, onOpen }: { event: EventItem; featured?: boolean; sizes: string; onOpen: (event: EventItem) => void }) {
  return (
    // transition só de translate/sombra: transform e opacity ficam livres para a entrada (GSAP)
    <article
      data-card
      className={`group relative flex h-full flex-col rounded-[1.75rem] bg-white p-2 ring-1 ring-[#003f7f]/8 shadow-[0_14px_34px_-22px_rgba(0,63,127,0.5)] transition-[translate,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-22px_rgba(0,63,127,0.55)] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#003f7f] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${featured ? 'md:flex-row' : ''}`}
    >
      <div
        data-card-media
        className={`relative w-full shrink-0 overflow-hidden rounded-[1.3rem] bg-linear-to-br ${event.gradient} ${mediaFitClass} max-md:[@media(max-height:700px)]:max-h-[clamp(7.5rem,21svh,17rem)] ${featured ? 'md:aspect-auto md:max-h-none md:min-h-[clamp(15rem,44svh,24rem)] md:w-[56%]' : ''}`}
      >
        {event.image ? (
          // Camada própria para o parallax (a imagem mantém o zoom do hover com transição CSS)
          <div data-card-parallax className="absolute inset-0">
            <Image
              src={event.image}
              alt=""
              fill
              sizes={sizes}
              unoptimized={!isOptimizableImage(event.image)}
              className="object-cover transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        ) : (
          // Sem foto: pontilhado claro + o dia em tipografia grande (mesma ideia da capa do modal)
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.28)_1px,transparent_1.6px)] bg-size-[16px_16px]">
            <span className="absolute -right-[0.06em] -bottom-[0.2em] text-[clamp(7rem,18svh,11rem)] leading-none font-black tracking-tighter text-white/25 tabular-nums">{event.day}</span>
          </div>
        )}
        {/* Véu só no topo: legibilidade dos selos sem escurecer a foto */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-black/30 to-transparent" />

        {/* Sem backdrop-blur: sobre a foto em parallax faz o Safari repintar/piscar ao rolar */}
        <span className="absolute top-2.5 left-2.5 inline-flex max-w-[calc(100%-6.5rem)] items-center gap-1.5 rounded-full bg-white/92 px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-[#003f7f] uppercase shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)] md:top-3 md:left-3">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a859]" />
          <span className="truncate">{event.category}</span>
        </span>
        {event.isToday && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-[#ffd000] px-3 py-1 text-[11px] font-black tracking-[0.08em] text-[#003f7f] uppercase shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)] md:top-3 md:right-3">
            É hoje
          </span>
        )}
      </div>

      <div className={`flex grow flex-col px-3 pt-3 pb-1.5 md:pt-3.5 ${featured ? 'md:justify-center md:px-8 md:py-6 lg:px-10' : ''}`}>
        <div className={`flex items-start gap-3.5 ${featured ? 'md:gap-5' : ''}`}>
          {/* Data grande em bloco (mês · dia · dia da semana): é o que se procura primeiro numa agenda */}
          <time
            data-card-pop
            dateTime={event.date}
            className={`flex w-[3.75rem] shrink-0 flex-col items-center rounded-2xl bg-[#003f7f] pt-1.5 pb-2 text-center text-white shadow-[0_10px_22px_-12px_rgba(0,63,127,0.8)] ${featured ? 'md:w-20 md:pt-2 md:pb-2.5' : ''}`}
          >
            <span className="text-[11px] leading-tight font-bold tracking-[0.14em] text-[#ffd000] uppercase">{event.month}</span>
            <span className={`text-[1.75rem] leading-none font-black tracking-tight tabular-nums ${featured ? 'md:text-[2.5rem]' : ''}`}>{event.day}</span>
            <span className="mt-0.5 text-[10px] font-semibold tracking-[0.1em] text-white/75 uppercase">{event.weekday}</span>
          </time>

          <div className="min-w-0 grow">
            <h3 className={`leading-snug font-bold tracking-tight text-pretty text-gray-900 transition-colors duration-300 group-hover:text-[#003f7f] ${featured ? 'text-lg md:text-2xl lg:text-3xl' : 'text-[1.0625rem] md:text-lg'}`}>
              {/* Botão "esticado": o ::after cobre o card inteiro, então qualquer clique abre o modal */}
              <button
                type="button"
                // Foca no clique (o arraste do carrossel impede o foco no mousedown) para o modal devolver o foco ao cartão;
                // sem anel no clique, e só se o foco não estiver nele (teclado)
                onClick={(e) => {
                  if (document.activeElement !== e.currentTarget) e.currentTarget.focus(MOUSE_FOCUS);
                  onOpen(event);
                }}
                aria-haspopup="dialog"
                className="cursor-pointer text-left after:absolute after:inset-0 after:z-10 after:rounded-[1.75rem] after:content-[''] focus-visible:shadow-none! focus-visible:outline-none!"
              >
                {/* Lado a lado (md+) o título reserva 2 linhas: horário/local ficam na mesma altura em todos os cartões.
                    Destaque: coluna de texto estreita no tablet/notebook com título grande, então até 3 linhas. */}
                <span className={featured ? 'line-clamp-2 md:line-clamp-3' : 'line-clamp-2 md:min-h-[2lh]'}>{event.title}</span>
              </button>
            </h3>
            {/* Horário e local numa linha; o local encurta com reticências */}
            <p className="mt-1.5 flex min-w-0 items-center gap-3 text-[13px] font-medium text-gray-600">
              {event.time && (
                <span className="inline-flex shrink-0 items-center gap-1.5 tabular-nums">
                  <FaRegClock aria-hidden="true" className="text-[#00a859]" />
                  {event.time}
                </span>
              )}
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <FaMapMarkerAlt aria-hidden="true" className="shrink-0 text-[#00a859]" />
                <span className="truncate">{event.location}</span>
              </span>
            </p>
          </div>
        </div>

        {/* Destaque único: a descrição cabe ao lado da foto no desktop */}
        {featured && event.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-gray-600 md:mt-5 md:line-clamp-3 md:text-[15px] max-md:[@media(max-height:700px)]:hidden">{event.description}</p>
        )}

        <div className={`mt-auto flex items-center justify-between gap-3 pt-3 [@media(max-height:700px)]:pt-2 ${featured ? 'md:pt-6' : ''}`}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00a859]/10 px-2.5 py-1 text-[11px] font-bold whitespace-nowrap text-[#00703a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00a859]" />
            {/* Sorteio, feira…: o evento não pede inscrição */}
            {event.registration_enabled ? 'Inscrições abertas' : 'Entrada livre'}
          </span>
          <span aria-hidden="true" className="inline-flex items-center gap-2 text-sm font-bold text-[#003f7f]">
            {/* Cartão estreito (celular): só a seta, para o rodapé não quebrar em duas linhas */}
            <span className="max-sm:hidden">Ver evento</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#003f7f]/8 transition-[background-color,color,translate] duration-300 group-hover:translate-x-0.5 group-hover:bg-[#003f7f] group-hover:text-white motion-reduce:transition-none">
              <FaArrowRight className="text-[11px]" />
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}

// Sem eventos futuros: faixa compacta com caminhos úteis, em vez de um bloco vazio
function NoUpcomingEvents() {
  const month = short(new Date(), { month: 'short' });
  return (
    <div data-card className="relative overflow-hidden rounded-[1.75rem] bg-[#f4f8fc] p-5 ring-1 ring-[#003f7f]/8 sm:p-7 lg:px-10 lg:py-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Calendário "folheando": página do mês atual sobre outra inclinada, com os três pontos da marca no lugar do dia */}
          <div data-card-pop aria-hidden="true" className="relative w-16 shrink-0 sm:w-20">
            <div className="absolute inset-0 translate-x-1.5 -translate-y-1 rotate-[8deg] rounded-2xl bg-[#ffd000]" />
            <div className="relative overflow-hidden rounded-2xl bg-white text-center shadow-[0_14px_28px_-14px_rgba(0,63,127,0.6)] ring-1 ring-[#003f7f]/10">
              <div className="bg-[#003f7f] py-1 text-[11px] font-bold tracking-[0.14em] text-[#ffd000] uppercase">{month}</div>
              <div className="flex h-11 items-center justify-center gap-1.5 sm:h-14">
                <span className="h-2 w-2 rounded-full bg-[#003f7f]" />
                <span className="h-2 w-2 rounded-full bg-[#00a859]" />
                <span className="h-2 w-2 rounded-full bg-[#ffd000]" />
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-black tracking-tight text-balance text-[#003f7f] sm:text-2xl lg:text-[1.75rem]">Novos eventos em breve</h3>
            <p className="mt-1 max-w-xl text-sm text-pretty text-gray-600 sm:mt-1.5 sm:text-[15px]">
              Estamos preparando a próxima agenda. Enquanto isso, relembre os eventos realizados e acompanhe nossas campanhas.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row md:ml-auto md:shrink-0 md:flex-col lg:flex-row">
          <Link
            href="/imprensa/eventos"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#003f7f] px-6 text-sm font-bold text-white shadow-[0_12px_26px_-14px_rgba(0,63,127,0.8)] transition-[background-color,translate] duration-200 hover:-translate-y-0.5 hover:bg-[#0052a3] active:translate-y-0 motion-reduce:hover:translate-y-0"
          >
            Ver eventos realizados
            <FaArrowRight aria-hidden="true" className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Link>
          <Link
            href="/imprensa/campanhas"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#003f7f] ring-1 ring-[#003f7f]/15 transition-[background-color,color,box-shadow] duration-200 hover:bg-[#003f7f] hover:text-white hover:ring-[#003f7f]"
          >
            <FaBullhorn aria-hidden="true" className="text-xs" />
            Nossas campanhas
          </Link>
        </div>
      </div>
    </div>
  );
}

const EventsCarousel = () => {
  const [events, setEvents] = React.useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedEvent, setSelectedEvent] = React.useState<EventItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);

  // Cabeçalho e cartões entram ao rolar; reprocessa quando os eventos chegam
  useReveal(sectionRef, [isLoading, events.length]);
  useCardsMotion(sectionRef, [isLoading, events.length]);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/eventos');
        if (!response.ok) return setEvents([]);
        const data: ApiEvent[] = await response.json();
        // A coluna status não é mantida no banco: a home mostra só eventos de hoje em diante, do mais próximo ao mais longe
        const today = todayISO();
        const upcoming = data
          .filter((item) => isTodayOrFuture(item.date, today) && parseDateOnly(item.date))
          .sort((a, b) => `${a.date}${a.time ?? ''}`.localeCompare(`${b.date}${b.time ?? ''}`));

        setEvents(
          upcoming.map((item, index) => {
            const date = parseDateOnly(item.date) as Date;
            const iso = (item.date as string).slice(0, 10);
            return {
              id: item.id,
              title: item.title,
              description: item.description || '',
              date: iso,
              time: item.time?.slice(0, 5) || '',
              location: item.location || 'CDL Ipirá',
              category: item.category || 'Evento',
              attendees: item.attendees || undefined,
              image: item.image || undefined,
              gradient: GRADIENTS[index % GRADIENTS.length],
              day: String(date.getDate()).padStart(2, '0'),
              month: short(date, { month: 'short' }),
              weekday: short(date, { weekday: 'short' }),
              isToday: iso === today,
              registration_enabled: item.registration_enabled !== false,
            };
          }),
        );
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const isEmpty = !isLoading && events.length === 0;

  // A altura da seção muda quando os dados chegam (o estado vazio encolhe; janela baixa não tem altura mínima) depois que
  // os gatilhos de rolagem das seções de baixo já foram medidos: sem remedir, a entrada da TV/galeria disparava
  // centenas de px tarde (conteúdo na tela ainda invisível)
  React.useEffect(() => {
    if (!isLoading) ScrollTrigger.refresh();
  }, [isLoading]);
  // Até 2 eventos os cartões ficam mais largos no desktop (a vista nunca passa do total)
  const sizes = events.length <= 2 ? '(min-width: 768px) 50vw, 88vw' : '(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 46vw, (min-width: 640px) 62vw, 88vw';

  return (
    <section
      ref={sectionRef}
      aria-labelledby="eventos-titulo"
      aria-busy={isLoading || undefined}
      // Bloco branco da home (borda reta entre as seções): com eventos ocupa a área útil da tela com o conteúdo
      // centrado; vazio fica compacto (só o aviso). Janela muito baixa (celular deitado): altura natural.
      className={`relative flex flex-col justify-center overflow-hidden bg-white py-(--scene-blend) ${isEmpty ? '' : '[@media(min-height:560px)]:min-h-(--screen-fit)'}`}
    >
      {/* Brilho discreto: gradiente radial em vez de filter: blur (área grande sob o header de vidro piscava ao rolar) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(30rem_24rem_at_92%_12%,rgba(255,208,0,0.08),transparent_70%),radial-gradient(26rem_26rem_at_2%_90%,rgba(0,63,127,0.04),transparent_70%)]" />

      <div className="relative container mx-auto w-full px-4">
        <SectionCarousel
          label="Próximos eventos"
          itemName="evento"
          header={
            <SectionHeading
              id="eventos-titulo"
              eyebrow={
                <>
                  <FaCalendarAlt aria-hidden="true" />
                  Agenda CDL Ipirá
                </>
              }
              eyebrowClass="bg-[#ffd000] text-[#003f7f]"
              title="Eventos em Destaque"
              text="Participe dos eventos que fortalecem o comércio e a comunidade de Ipirá."
            />
          }
          // Sem eventos futuros o aviso do estado vazio já leva à agenda
          action={isEmpty ? undefined : { href: '/imprensa/eventos', label: 'Ver agenda' }}
          prevLabel="Eventos anteriores"
          nextLabel="Próximos eventos"
          loading={isLoading}
          empty={<NoUpcomingEvents />}
          autoplay={7000}
          // Com o modal aberto o carrossel não anda (senão o card de origem sai de vista e o foco não volta para ele)
          paused={isModalOpen}
        >
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              featured={events.length === 1}
              sizes={sizes}
              onOpen={(e) => {
                setSelectedEvent(e);
                setIsModalOpen(true);
              }}
            />
          ))}
        </SectionCarousel>
      </div>

      <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} event={selectedEvent} />
    </section>
  );
};

export default EventsCarousel;
