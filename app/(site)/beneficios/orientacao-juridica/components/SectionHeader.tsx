import React from 'react';
import type { IconType } from 'react-icons';

interface SectionHeaderProps {
  eyebrow: string;
  icon: IconType;
  title: string;
  subtitle?: string;
  id?: string;
  /** center: títulos de seção comuns; left: colunas laterais (benefícios, formulário, FAQ) */
  align?: 'center' | 'left';
}

/** Cabeçalho padrão das seções (mesmo padrão da home): selo, título, divisor tricolor e subtítulo. */
const SectionHeader = ({ eyebrow, icon: Icon, title, subtitle, id, align = 'center' }: SectionHeaderProps) => {
  const center = align === 'center';
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'mx-auto max-w-xl text-center lg:mx-0 lg:text-left'}>
      <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#003f7f] shadow-sm">
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
        {eyebrow}
      </span>
      <h2 id={id} className="mt-4 text-3xl font-black leading-[1.08] tracking-tight text-balance text-[#003f7f] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <div
        aria-hidden="true"
        className={`mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] ${center ? 'mx-auto' : 'mx-auto lg:mx-0'}`}
      />
      {subtitle && <p className="mt-5 text-base text-balance text-gray-600 md:text-lg">{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;
