'use client';

import React from 'react';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import { isOptimizableImage } from '@/lib/images';
import { shadowCard, shadowCardHover } from '../../_components/ui';
import { TeamMember } from './types';

/* Cartão de membro da equipe (diretores, suplentes e colaboradores): foto 4:5, cargo, nome e textos. */

export type MemberAccent = 'yellow' | 'blue' | 'green';

const accents: Record<MemberAccent, { pill: string; bar: string; dot: string }> = {
  yellow: { pill: 'bg-[#ffd000] text-[#003f7f]', bar: 'from-[#003f7f] via-[#00a859] to-[#ffd000]', dot: 'bg-[#ffd000]' },
  blue: { pill: 'bg-[#003f7f] text-white', bar: 'from-[#003f7f] to-[#0066cc]', dot: 'bg-[#0066cc]' },
  green: { pill: 'bg-[#00a859]/10 text-[#003f7f] ring-1 ring-[#00a859]/30', bar: 'from-[#00a859] to-[#00d670]', dot: 'bg-[#00a859]' },
};

interface MemberCardProps {
  member: TeamMember;
  accent: MemberAccent;
  index?: number;
}

/** Texto que só repete o cargo (ex.: função "Suplente" para o cargo "Suplente") não é exibido de novo */
export const sameText = (a?: string, b?: string) => Boolean(a && b && a.trim().toLowerCase() === b.trim().toLowerCase());

/** Linha de cartões centralizada: cartões que sobram na última linha ficam no meio */
export const teamGrid = 'flex flex-wrap justify-center gap-6 lg:gap-8';

const MemberCard = ({ member, accent, index = 0 }: MemberCardProps) => {
  const tone = accents[accent];
  const showFunction = member.function_description && !sameText(member.function_description, member.position);
  return (
    <article
      className={`group flex w-full max-w-sm flex-col overflow-hidden sm:w-[calc((100%-1.5rem)/2)] sm:max-w-none lg:w-[calc((100%-4rem)/3)] rounded-3xl bg-white ring-1 ring-[#003f7f]/[0.07] animate-scale-in transition-[translate,box-shadow] duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${shadowCard} ${shadowCardHover}`}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="relative aspect-4/5 shrink-0 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={`Foto de ${member.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
            quality={100}
            unoptimized={!isOptimizableImage(member.photo_url)}
            className="object-cover object-top transition-[scale] duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FaUser aria-hidden="true" className="h-20 w-20 text-gray-300" />
          </div>
        )}
        <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-1.5 bg-linear-to-r ${tone.bar}`} />
      </div>

      <div className="flex grow flex-col p-5 sm:p-6">
        <span className={`self-start rounded-full px-3 py-1 text-xs font-bold ${tone.pill}`}>{member.position}</span>
        <h3 className="mt-3 text-xl leading-snug font-black tracking-tight text-balance text-gray-900">{member.name}</h3>

        {showFunction && (
          <div className="mt-4">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-gray-500 uppercase">
              <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
              Função
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-pretty text-gray-700">{member.function_description}</p>
          </div>
        )}

        {member.contribution && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-gray-500 uppercase">
              <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
              Contribuição
            </p>
            <p className="mt-1.5 text-base leading-relaxed text-pretty text-gray-600 lg:text-[15px]">{member.contribution}</p>
          </div>
        )}
      </div>
    </article>
  );
};

export default MemberCard;
