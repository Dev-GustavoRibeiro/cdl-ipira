import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  /** Versão para fundo azul */
  light?: boolean;
}

const SectionTitle = ({ title, subtitle, light = false }: SectionTitleProps) => {
  return (
    <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
      <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.015em] mb-4 ${light ? 'text-white' : 'text-[#003f7f]'}`}>
        {title}
      </h2>
      <div className={`h-1.5 w-24 bg-linear-to-r ${light ? 'from-[#ffd000] via-[#00d670]' : 'from-[#003f7f] via-[#00a859]'} to-[#ffd000] rounded-full mx-auto mb-4`} aria-hidden="true"></div>
      {subtitle && (
        <p className={`text-sm sm:text-base max-w-2xl mx-auto ${light ? 'text-white/90' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
