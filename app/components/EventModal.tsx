'use client';

import React, { useId, useState } from 'react';
import Image from 'next/image';
import { FaArrowRight, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTimes, FaUsers } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { createPortal } from 'react-dom';
import RegistrationModal from './RegistrationModal';
import { formatDateLong, isTodayOrFuture, parseDateOnly } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import { useIsClient, useModalBehavior } from '@/lib/hooks/useModalBehavior';

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
  } | null;
}

// A data pode chegar como YYYY-MM-DD (banco) ou DD/MM/YYYY (já formatada pela página)
function toISODate(value: string): string {
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  return /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : '';
}

/* Casca padrão dos modais do site (mesmas classes em NewsModal, JobModal e nos formulários) */
const OVERLAY = 'fixed inset-0 z-100 flex items-end justify-center sm:items-center sm:p-6';
const BACKDROP = 'absolute inset-0 bg-[#001a3d]/70 backdrop-blur-sm transition-opacity duration-300 starting:opacity-0 motion-reduce:transition-none';
const PANEL = 'relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_-24px_60px_-24px_rgba(0,26,61,0.55)] outline-none transition-[opacity,translate,scale] duration-300 ease-out starting:translate-y-full sm:max-h-[90dvh] sm:rounded-3xl sm:shadow-[0_40px_100px_-30px_rgba(0,26,61,0.7)] sm:starting:translate-y-4 sm:starting:scale-[0.97] sm:starting:opacity-0 motion-reduce:transition-none';
const CLOSE = 'absolute top-3 right-3 z-30 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#003f7f] shadow-[0_8px_20px_-8px_rgba(0,26,61,0.6)] ring-1 ring-black/5 backdrop-blur-md transition-[scale,background-color] duration-200 hover:scale-105 hover:bg-white active:scale-95 motion-reduce:hover:scale-100 sm:top-4 sm:right-4';
const FOOTER = 'flex shrink-0 items-center gap-3 border-t border-gray-100 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8';
const BTN_PRIMARY = 'inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#003f7f] to-[#0066cc] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)] active:scale-[0.98] motion-reduce:hover:translate-y-0';
const BTN_SECONDARY = 'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[#003f7f] ring-1 ring-gray-200 transition-[background-color,scale] duration-200 hover:bg-gray-50 active:scale-[0.98]';

interface InfoItem {
  icon: IconType;
  label: string;
  value: string;
}

export default function EventModal({ isOpen, onClose, event }: EventModalProps) {
  const isClient = useIsClient();
  const titleId = useId();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const dialogRef = useModalBehavior<HTMLDivElement>(isOpen && !!event, onClose);

  if (!isClient || !isOpen || !event) return null;

  const isoDate = toISODate(event.date || '');
  const displayDate = formatDateLong(isoDate) || event.date;
  const dateObj = parseDateOnly(isoDate);
  // Inscrição só para eventos de hoje em diante; o status salvo no banco não é mantido
  const canRegister = isoDate ? isTodayOrFuture(isoDate) : event.status !== 'past';

  const info = [
    displayDate && { icon: FaCalendarAlt, label: 'Data', value: displayDate },
    event.time && { icon: FaClock, label: 'Horário', value: event.time.slice(0, 5) },
    event.location && { icon: FaMapMarkerAlt, label: 'Local', value: event.location },
    !!event.attendees && event.attendees > 0 && { icon: FaUsers, label: 'Participantes', value: `${event.attendees} estimados` },
  ].filter((item): item is InfoItem => Boolean(item));

  return createPortal(
    <>
      <div className={OVERLAY}>
        <div aria-hidden="true" onClick={onClose} className={BACKDROP} />

        <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={`${PANEL} sm:max-w-3xl`}>
          <button type="button" onClick={onClose} aria-label="Fechar" className={CLOSE}>
            <FaTimes className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {/* Capa: imagem 16:9 ou o degradê do evento */}
            <div
              className={`relative w-full overflow-hidden bg-linear-to-br ${event.gradient || 'from-[#003f7f] to-[#0066cc]'} ${event.image ? 'aspect-video sm:max-h-[42dvh]' : 'h-36 sm:h-44'}`}
            >
              {event.image ? (
                <>
                  <Image
                    src={event.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 768px, 100vw"
                    unoptimized={!isOptimizableImage(event.image)}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#001a3d]/70 via-[#001a3d]/10 to-[#001a3d]/20" />
                </>
              ) : (
                // Ícone decorativo cortado no canto inferior, longe do botão de fechar
                <FaCalendarAlt aria-hidden="true" className="absolute -right-4 -bottom-8 -rotate-12 text-[9rem] text-white/15 sm:right-20 sm:text-[10rem]" />
              )}

              <span className="absolute top-4 left-4 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-black text-[#003f7f] shadow-lg sm:top-5 sm:left-6">
                {event.category}
              </span>
            </div>

            <div className="px-5 pb-10 sm:px-8 sm:pb-12">
              {/* Calendário sobreposto à capa + situação das inscrições */}
              <div className={`relative flex items-end gap-4 ${dateObj ? '-mt-10' : 'pt-6'}`}>
                {dateObj && (
                  <div aria-hidden="true" className="w-20 shrink-0 overflow-hidden rounded-2xl bg-white text-center shadow-[0_18px_40px_-14px_rgba(0,26,61,0.55)] ring-1 ring-black/5">
                    <div className="bg-[#003f7f] py-1.5 text-[11px] font-bold tracking-wider text-white uppercase">
                      {dateObj.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
                    </div>
                    <div className="px-2 pt-2 pb-2.5">
                      <div className="text-3xl leading-none font-black text-[#003f7f]">{String(dateObj.getDate()).padStart(2, '0')}</div>
                      <div className="mt-1 text-[11px] font-semibold text-gray-500">{dateObj.getFullYear()}</div>
                    </div>
                  </div>
                )}
                {canRegister ? (
                  <span className="mb-1 inline-flex items-center gap-2 rounded-full bg-[#00a859]/10 px-3.5 py-1.5 text-xs font-bold text-[#003f7f] ring-1 ring-[#00a859]/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00a859]" aria-hidden="true" />
                    Inscrições abertas
                  </span>
                ) : (
                  <span className="mb-1 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3.5 py-1.5 text-xs font-bold text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" aria-hidden="true" />
                    Evento realizado
                  </span>
                )}
              </div>

              <h2 id={titleId} className="mt-6 max-w-[26ch] text-[1.75rem] leading-[1.1] font-black tracking-tight text-balance text-[#003f7f] sm:text-4xl">
                {event.title}
              </h2>
              <div className="mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" aria-hidden="true" />

              {info.length > 0 && (
                <dl className="mt-7 grid gap-3 sm:grid-cols-2">
                  {info.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3.5 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-[#003f7f] shadow-[0_6px_16px_-8px_rgba(0,63,127,0.45)] ring-1 ring-gray-100">
                        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-[11px] font-bold tracking-[0.12em] text-gray-600 uppercase">{label}</dt>
                        <dd className="mt-0.5 font-semibold text-gray-900">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              )}

              {event.description && (
                <div className="mt-8">
                  <h3 className="text-xs font-bold tracking-[0.14em] text-[#003f7f] uppercase">Sobre o evento</h3>
                  <p className="mt-3 max-w-[65ch] text-base leading-relaxed whitespace-pre-line text-gray-700 sm:text-[17px]">{event.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className={FOOTER}>
            {!canRegister && <p className="mr-auto hidden text-sm text-gray-600 sm:block">As inscrições para este evento estão encerradas.</p>}
            <button type="button" onClick={onClose} className={`${BTN_SECONDARY} flex-1 sm:flex-none ${canRegister ? 'sm:ml-auto' : ''}`}>
              Fechar
            </button>
            {canRegister && (
              <button type="button" onClick={() => setIsRegistrationOpen(true)} aria-haspopup="dialog" className={`group flex-1 sm:flex-none ${BTN_PRIMARY}`}>
                Inscrever-se
                <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Inscrição Aninhado */}
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        event={event}
      />
    </>,
    document.body
  );
}
