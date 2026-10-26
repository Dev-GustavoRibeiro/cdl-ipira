'use client';

import React, { useId, useState } from 'react';
import { FaArrowRight, FaCalendarAlt, FaExternalLinkAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import RegistrationModal from './RegistrationModal';
import { formatDateLong, isTodayOrFuture, parseDateOnly } from '@/lib/date';
import { ModalBody, ModalChip, ModalMedia, ModalProse, ModalShell, ModalTitle, ShareButton, modalButton } from './Modal';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    image?: string;
    gradient?: string;
    attendees?: number;
    status?: 'upcoming' | 'ongoing' | 'past';
    /** false = entrada livre (sorteio, feira): sem inscrição */
    registration_enabled?: boolean;
  } | null;
}

// A data pode chegar como YYYY-MM-DD (banco) ou DD/MM/YYYY (já formatada pela página)
function toISODate(value: string): string {
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  return /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : '';
}

// Busca o local no Google Maps; nomes curtos ("Mercado de Artes") ganham a cidade para achar o lugar certo
const mapsUrl = (location: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(/ipir/i.test(location) ? location : `${location}, Ipirá - BA`)}`;

const FACT = 'flex gap-3.5 rounded-2xl bg-[#f4f8fc] p-4 ring-1 ring-[#003f7f]/8';
const FACT_ICON = 'grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-[#003f7f] shadow-[0_6px_16px_-8px_rgba(0,63,127,0.45)] ring-1 ring-[#003f7f]/10';
const FACT_LABEL = 'text-[11px] font-bold tracking-[0.12em] text-[#003f7f]/80 uppercase';

// Datas e situação derivadas do evento (a página e a home mandam a data em formatos diferentes)
function describe(event: NonNullable<EventModalProps['event']>) {
  const isoDate = toISODate(event.date || '');
  const dateObj = parseDateOnly(isoDate);
  const isUpcoming = isoDate ? isTodayOrFuture(isoDate) : event.status !== 'past';
  return {
    ...event,
    dateObj,
    displayDate: formatDateLong(isoDate) || event.date,
    weekday: dateObj?.toLocaleDateString('pt-BR', { weekday: 'long' }),
    time: event.time?.slice(0, 5),
    // Inscrição só para eventos de hoje em diante (o status salvo no banco não é mantido) que aceitam inscrição
    canRegister: isUpcoming && event.registration_enabled !== false,
    isUpcoming,
    attendees: event.attendees ?? 0,
  };
}

// Quem abre pode zerar `event` ao fechar: o ModalShell segue mostrando o último evento durante a saída
export default function EventModal({ isOpen, onClose, event }: EventModalProps) {
  const titleId = useId();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  // Fechou o evento: a inscrição não reabre sozinha na próxima vez
  if (!isOpen && isRegistrationOpen) setIsRegistrationOpen(false);
  const item = event && describe(event);
  const { dateObj } = item ?? {};

  return (
    <>
      <ModalShell
        isOpen={isOpen && !!event}
        onClose={onClose}
        labelledBy={titleId}
        footer={
          item && (
            <>
              <ShareButton
                title={item.title}
                text={[item.title, item.displayDate, item.time && `às ${item.time}`].filter(Boolean).join(' · ')}
                url="/imprensa/eventos"
              />
              {item.canRegister ? (
                <button
                  type="button"
                  onClick={() => setIsRegistrationOpen(true)}
                  aria-haspopup="dialog"
                  className={`ml-auto max-sm:flex-1 ${modalButton.primary}`}
                >
                  Inscrever-se
                  <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" aria-hidden="true" />
                </button>
              ) : (
                // Entrada livre que já passou: nunca teve inscrição para encerrar, o selo 'Evento realizado' basta
                (item.isUpcoming || item.registration_enabled !== false) && (
                  <p className="ml-auto text-right text-sm font-semibold text-gray-600">
                    {item.isUpcoming ? 'Entrada livre — não precisa de inscrição' : 'Inscrições encerradas'}
                  </p>
                )
              )}
            </>
          )
        }
      >
        {item && (
          <>
            <ModalMedia
              image={item.image}
              gradient={item.gradient}
              fallback={
                // Sem foto: o dia do evento em tipografia grande sobre o degradê
                dateObj && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 right-[7%] -translate-y-1/2 text-[clamp(6rem,24vw,10rem)] leading-none font-black tracking-tighter text-white/15 tabular-nums"
                  >
                    {String(dateObj.getDate()).padStart(2, '0')}
                  </span>
                )
              }
            />

            <ModalBody className="pt-0!">
              {/* Calendário sobreposto à capa + situação */}
              <div className="relative flex items-end gap-4">
                {dateObj && (
                  <div
                    aria-hidden="true"
                    className="-mt-10 w-[4.75rem] shrink-0 overflow-hidden rounded-2xl bg-white text-center shadow-[0_18px_40px_-14px_rgba(0,26,61,0.55)] ring-1 ring-black/5 sm:-mt-12 sm:w-[5.5rem]"
                  >
                    <div className="bg-[#003f7f] py-1.5 text-[11px] font-bold tracking-[0.14em] text-white uppercase">
                      {dateObj.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
                    </div>
                    <div className="px-2 pt-2 pb-2.5">
                      <div className="text-[2rem] leading-none font-black text-[#003f7f] tabular-nums sm:text-[2.4rem]">{String(dateObj.getDate()).padStart(2, '0')}</div>
                      <div className="mt-1 text-[11px] font-semibold text-gray-500 tabular-nums">{dateObj.getFullYear()}</div>
                    </div>
                  </div>
                )}
                <div className={`flex flex-wrap items-center gap-2 ${dateObj ? 'pb-1' : 'pt-6 sm:pt-9'}`}>
                  <ModalChip tone="accent">{item.category}</ModalChip>
                  {item.canRegister ? (
                    <ModalChip tone="success" dot>
                      Inscrições abertas
                    </ModalChip>
                  ) : item.isUpcoming ? (
                    <ModalChip tone="success" dot>
                      Entrada livre
                    </ModalChip>
                  ) : (
                    <ModalChip tone="muted">Evento realizado</ModalChip>
                  )}
                  {/* Contagem de inscritos não faz sentido em evento de entrada livre */}
                  {item.attendees > 0 && item.registration_enabled !== false && (
                    <ModalChip icon={FaUsers}>
                      {item.attendees} {item.attendees === 1 ? 'inscrito' : 'inscritos'}
                    </ModalChip>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <ModalTitle id={titleId}>{item.title}</ModalTitle>
              </div>

              {/* Quando e onde em destaque */}
              <ul aria-label="Quando e onde" className="mt-7 grid gap-3 sm:grid-cols-2">
                <li className={FACT}>
                  <span className={FACT_ICON}>
                    <FaCalendarAlt className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className={FACT_LABEL}>Quando</p>
                    <p className="mt-1 font-bold text-gray-900">{item.displayDate}</p>
                    {(item.weekday || item.time) && (
                      <p className="text-sm text-gray-600 first-letter:uppercase">{[item.weekday, item.time && `às ${item.time}`].filter(Boolean).join(', ')}</p>
                    )}
                  </div>
                </li>
                {item.location && (
                  <li className={FACT}>
                    <span className={FACT_ICON}>
                      <FaMapMarkerAlt className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className={FACT_LABEL}>Onde</p>
                      <p className="mt-1 font-bold text-pretty text-gray-900">{item.location}</p>
                      <p>
                        <a
                          href={mapsUrl(item.location)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="touch-target inline-flex items-center gap-1.5 text-sm font-semibold text-[#0066cc] underline-offset-2 hover:underline"
                        >
                          Como chegar
                          <FaExternalLinkAlt className="h-2.5 w-2.5" aria-hidden="true" />
                          <span className="sr-only">(abre o Google Maps em nova aba)</span>
                        </a>
                      </p>
                    </div>
                  </li>
                )}
              </ul>

              {item.description && (
                <section className="mt-9" aria-labelledby={`${titleId}-sobre`}>
                  <h3 id={`${titleId}-sobre`} className="text-xs font-bold tracking-[0.14em] text-[#003f7f] uppercase">
                    Sobre o evento
                  </h3>
                  <div aria-hidden="true" className="mt-3 h-1 w-12 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
                  <ModalProse className="mt-5" text={item.description} />
                </section>
              )}
            </ModalBody>
          </>
        )}
      </ModalShell>

      {/* Inscrição: abre por cima do evento (renderizada depois, fica no topo da pilha) */}
      <RegistrationModal
        isOpen={isOpen && isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        event={item && { id: item.id, title: item.title, attendees: item.attendees, date: item.displayDate, time: item.time, location: item.location }}
      />
    </>
  );
}
