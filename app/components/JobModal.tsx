'use client';

import React, { useId } from 'react';
import { FaTimes, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaUserFriends, FaWhatsapp } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { useIsClient, useModalBehavior } from '@/lib/hooks/useModalBehavior';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: number;
    title: string;
    company: string;
    quantity: number;
    description: string;
    location?: string;
    date?: string;
    category?: string;
  } | null;
}

/* Casca padrão dos modais do site (mesmas classes em NewsModal, EventModal e nos formulários) */
const OVERLAY = 'fixed inset-0 z-100 flex items-end justify-center sm:items-center sm:p-6';
const BACKDROP = 'absolute inset-0 bg-[#001a3d]/70 backdrop-blur-sm transition-opacity duration-300 starting:opacity-0 motion-reduce:transition-none';
const PANEL = 'relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_-24px_60px_-24px_rgba(0,26,61,0.55)] outline-none transition-[opacity,translate,scale] duration-300 ease-out starting:translate-y-full sm:max-h-[90dvh] sm:rounded-3xl sm:shadow-[0_40px_100px_-30px_rgba(0,26,61,0.7)] sm:starting:translate-y-4 sm:starting:scale-[0.97] sm:starting:opacity-0 motion-reduce:transition-none';
const CLOSE = 'absolute top-3 right-3 z-30 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#003f7f] shadow-[0_8px_20px_-8px_rgba(0,26,61,0.6)] ring-1 ring-black/5 backdrop-blur-md transition-[scale,background-color] duration-200 hover:scale-105 hover:bg-white active:scale-95 motion-reduce:hover:scale-100 sm:top-4 sm:right-4';
const FOOTER = 'flex shrink-0 items-center gap-3 border-t border-gray-100 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8';
const BTN_SECONDARY = 'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[#003f7f] ring-1 ring-gray-200 transition-[background-color,scale] duration-200 hover:bg-gray-50 active:scale-[0.98]';
// Verde da marca com texto azul-marinho (branco sobre este verde não atinge o contraste AA)
const BTN_WHATSAPP = 'inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#00a859] to-[#00d670] px-6 py-3 text-sm font-bold text-[#001a3d] shadow-[0_12px_30px_-12px_rgba(0,168,89,0.8)] transition-[translate,scale,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,168,89,0.9)] active:scale-[0.98] motion-reduce:hover:translate-y-0';

const CHIP = 'inline-flex items-center gap-2 rounded-full bg-gray-50 px-3.5 py-2 text-sm font-semibold text-gray-800 ring-1 ring-gray-200';

export default function JobModal({ isOpen, onClose, job }: JobModalProps) {
  const isClient = useIsClient();
  const titleId = useId();
  const dialogRef = useModalBehavior<HTMLDivElement>(isOpen && !!job, onClose);

  if (!isClient || !isOpen || !job) return null;

  const whatsappUrl = `https://wa.me/557532541356?text=${encodeURIComponent(`Olá, gostaria de me candidatar à vaga de *${job.title}* na empresa *${job.company}*.`)}`;

  return createPortal(
    <div className={OVERLAY}>
      <div aria-hidden="true" onClick={onClose} className={BACKDROP} />

      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={`${PANEL} sm:max-w-2xl`}>
        <button type="button" onClick={onClose} aria-label="Fechar" className={CLOSE}>
          <FaTimes className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {/* Cabeçalho: cargo e empresa sobre o degradê da marca */}
          <header className="relative overflow-hidden bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] px-5 pt-8 pb-9 text-white sm:px-8 sm:pt-10 sm:pb-10">
            <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-[#00a859]/25 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#ffd000]/15 blur-3xl" aria-hidden="true" />

            <div className="relative pr-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold tracking-[0.14em] text-[#003f7f] uppercase shadow-sm">
                <FaBriefcase aria-hidden="true" />
                Vaga de emprego
              </span>
              <h2 id={titleId} className="mt-4 text-[1.75rem] leading-[1.1] font-black tracking-tight text-balance sm:text-4xl">
                {job.title}
              </h2>
              {job.company && (
                <p className="mt-4 flex items-center gap-3 text-base font-semibold text-white/95 sm:text-lg">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
                    <FaBuilding className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {job.company}
                </p>
              )}
            </div>
          </header>

          <div className="px-5 pt-6 pb-10 sm:px-8 sm:pt-7 sm:pb-12">
            <ul className="flex flex-wrap gap-2" aria-label="Resumo da vaga">
              <li className={CHIP}>
                <FaUserFriends className="h-3.5 w-3.5 text-[#003f7f]" aria-hidden="true" />
                {job.quantity} {job.quantity === 1 ? 'vaga disponível' : 'vagas disponíveis'}
              </li>
              {job.location && (
                <li className={CHIP}>
                  <FaMapMarkerAlt className="h-3.5 w-3.5 text-[#00a859]" aria-hidden="true" />
                  {job.location}
                </li>
              )}
              {job.category && (
                <li className={CHIP}>
                  <FaBriefcase className="h-3.5 w-3.5 text-[#003f7f]" aria-hidden="true" />
                  {job.category}
                </li>
              )}
              {job.date && (
                <li className={CHIP}>
                  <FaCalendarAlt className="h-3.5 w-3.5 text-[#00a859]" aria-hidden="true" />
                  Publicada em {job.date}
                </li>
              )}
            </ul>

            <h3 className="mt-8 text-xs font-bold tracking-[0.14em] text-[#003f7f] uppercase">Descrição da vaga</h3>
            <div className="mt-3 h-1.5 w-16 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" aria-hidden="true" />
            <p className="mt-5 max-w-[65ch] text-base leading-relaxed whitespace-pre-line text-gray-700 sm:text-[17px]">
              {job.description}
            </p>

            <p className="mt-8 rounded-2xl bg-[#003f7f]/5 p-4 text-sm leading-relaxed text-gray-700 ring-1 ring-[#003f7f]/10 sm:p-5">
              <strong className="font-bold text-[#003f7f]">Interessado?</strong> Entre em contato diretamente com a empresa ou envie seu currículo para a CDL.
            </p>
          </div>
        </div>

        <div className={FOOTER}>
          <button type="button" onClick={onClose} className={`${BTN_SECONDARY} max-sm:hidden sm:ml-auto`}>
            Fechar
          </button>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${BTN_WHATSAPP} flex-1 sm:flex-none`}>
            <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
            Candidatar-se via WhatsApp
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
