'use client';

import React, { useId } from 'react';
import { FaBriefcase, FaBuilding, FaCalendarAlt, FaMapMarkerAlt, FaUserFriends, FaWhatsapp } from 'react-icons/fa';
import { ModalBody, ModalChip, ModalProse, ModalShell, ModalTitle, ShareButton, modalButton } from './Modal';
import { CONTACT } from './navigation/navItems';

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

// Mesmos cartões de destaque do EventModal ("Quando"/"Onde")
const FACT = 'flex gap-3.5 rounded-2xl bg-[#f4f8fc] p-4 ring-1 ring-[#003f7f]/8';
const FACT_ICON = 'grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-[#003f7f] shadow-[0_6px_16px_-8px_rgba(0,63,127,0.45)] ring-1 ring-[#003f7f]/10';
const FACT_LABEL = 'text-[11px] font-bold tracking-[0.12em] text-[#003f7f]/80 uppercase';

// "Magazine Ipirá" → "MI"; uma palavra → uma letra (o "logo" da empresa no cartão sobre a faixa)
const initials = (company: string) =>
  company
    .split(/\s+/)
    .filter((word) => /^\p{L}/u.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

// O balcão não zera `job` ao fechar, mas o ModalShell já segura o último conteúdo durante a saída de qualquer forma
export default function JobModal({ isOpen, onClose, job }: JobModalProps) {
  const titleId = useId();
  const mark = job ? initials(job.company || '') : '';
  // WhatsApp oficial (fonte única em navItems); o cadastro de vagas do Balcão já usa o mesmo número
  const whatsappUrl =
    job ? `${CONTACT.whatsapp.href}?text=${encodeURIComponent(`Olá, gostaria de me candidatar à vaga de *${job.title}* na empresa *${job.company}*.`)}` : undefined;

  return (
    <ModalShell
      isOpen={isOpen && !!job}
      onClose={onClose}
      labelledBy={titleId}
      size="md"
      footer={
        job && (
          <>
            <ShareButton title={`Vaga: ${job.title}`} text={[job.title, job.company].filter(Boolean).join(' · ')} url="/produtos/balcao-empregos" />
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`ml-auto max-sm:flex-1 ${modalButton.primary}`}>
              <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
              {/* Em telas estreitas o rótulo completo quebrava em duas linhas na pílula; o ícone já diz "WhatsApp" */}
              <span>
                Candidatar-se<span className="max-[400px]:sr-only"> via WhatsApp</span>
              </span>
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          </>
        )
      }
    >
      {job && (
        <>
          {/* Faixa da marca (vaga não tem foto): degradê, pontos e a maleta grande ao fundo */}
          <div aria-hidden="true" className="relative h-28 overflow-hidden bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] sm:h-36">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.16)_1px,transparent_1.6px)] bg-size-[18px_18px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_0%,rgba(0,168,89,0.45),transparent_45%),radial-gradient(circle_at_55%_140%,rgba(255,208,0,0.28),transparent_45%)]" />
            <FaBriefcase className="absolute top-1/2 right-[8%] h-24 w-24 -translate-y-1/2 -rotate-12 text-white/12 sm:h-32 sm:w-32" />
          </div>

          <ModalBody className="pt-0!">
            {/* "Logo" da empresa sobre a faixa + etiquetas */}
            <div className="relative flex items-end gap-4">
              <div
                aria-hidden="true"
                className="-mt-9 grid h-[4.5rem] w-[4.5rem] shrink-0 place-items-center rounded-2xl bg-white text-2xl font-black tracking-tight text-[#003f7f] shadow-[0_18px_40px_-14px_rgba(0,26,61,0.55)] ring-1 ring-black/5 sm:-mt-11 sm:h-[5.25rem] sm:w-[5.25rem] sm:text-[1.75rem]"
              >
                {mark || <FaBuilding className="h-7 w-7" />}
              </div>
              <div className="flex flex-wrap items-center gap-2 pb-1">
                <ModalChip tone="accent" icon={FaBriefcase}>
                  {job.category || 'Vaga de emprego'}
                </ModalChip>
                {job.date && <ModalChip icon={FaCalendarAlt}>Publicada em {job.date}</ModalChip>}
              </div>
            </div>

            <div className="mt-6">
              <ModalTitle id={titleId}>{job.title}</ModalTitle>
            </div>
            {job.company && (
              <p className="mt-3 flex items-center gap-2 text-base font-semibold text-gray-700 sm:text-lg">
                <FaBuilding className="h-4 w-4 shrink-0 text-[#003f7f]/60" aria-hidden="true" />
                <span className="sr-only">Empresa:</span>
                {job.company}
              </p>
            )}

            <ul aria-label="Resumo da vaga" className={`mt-7 grid gap-3 ${job.location ? 'sm:grid-cols-2' : ''}`}>
              <li className={FACT}>
                <span className={FACT_ICON}>
                  <FaUserFriends className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className={FACT_LABEL}>Vagas</p>
                  <p className="mt-1 font-bold text-gray-900">
                    {job.quantity} {job.quantity === 1 ? 'vaga disponível' : 'vagas disponíveis'}
                  </p>
                </div>
              </li>
              {job.location && (
                <li className={FACT}>
                  <span className={FACT_ICON}>
                    <FaMapMarkerAlt className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className={FACT_LABEL}>Local</p>
                    <p className="mt-1 font-bold text-pretty break-words text-gray-900">{job.location}</p>
                  </div>
                </li>
              )}
            </ul>

            {job.description && (
              <section className="mt-9" aria-labelledby={`${titleId}-descricao`}>
                <h3 id={`${titleId}-descricao`} className="text-xs font-bold tracking-[0.14em] text-[#003f7f] uppercase">
                  Descrição da vaga
                </h3>
                <div aria-hidden="true" className="mt-3 h-1 w-12 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
                <ModalProse className="mt-5" text={job.description} />
              </section>
            )}

            <p className="mt-9 rounded-2xl bg-[#003f7f]/5 p-4 text-sm leading-relaxed text-gray-700 ring-1 ring-[#003f7f]/10 sm:p-5">
              <strong className="font-bold text-[#003f7f]">Interessado?</strong> Entre em contato diretamente com a empresa ou envie seu currículo para a CDL.
            </p>
          </ModalBody>
        </>
      )}
    </ModalShell>
  );
}
