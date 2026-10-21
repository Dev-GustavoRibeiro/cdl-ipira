'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaHandshake, FaPause, FaPlay } from 'react-icons/fa';
import { isOptimizableImage } from '@/lib/images';

interface Partner {
  id: number;
  name: string;
  logo: string;
  website?: string;
}

// Só http(s): evita javascript:/data: vindos do cadastro; aceita "www.loja.com" sem protocolo
function getSafeWebsite(website?: string | null): string | null {
  const value = website?.trim();
  if (!value) return null;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffd000]';

// Abaixo disso não há logos para um letreiro contínuo: vira grade estática centralizada
const MIN_FOR_MARQUEE = 16;
// Cada volta do letreiro precisa cobrir telas largas (16 blocos ≈ 3000px)
const MIN_PER_LOOP = 16;
// Velocidade constante, independente da quantidade de associados (~48px/s no desktop, ~34px/s no celular)
const SECONDS_PER_LOGO = 5;

// Bloco 16:9 de tamanho fixo: as logos são enviadas em telas 1920x1080 com margem própria,
// então o padding é mínimo para não encolhê-las
const TILE_SIZE = 'aspect-video w-40 shrink-0 rounded-2xl sm:w-56';
const TILE = `${TILE_SIZE} block border border-gray-100 bg-white p-1 sm:p-1.5 shadow-[0_8px_24px_-14px_rgba(0,63,127,0.3)] transition-[transform,translate,scale,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-16px_rgba(0,63,127,0.45)] motion-reduce:hover:translate-y-0`;

// focusable=false no letreiro: centenas de paradas de Tab em blocos que se movem (e saem da tela)
// travariam o teclado; quem navega por teclado usa "Ver todos os associados"
function PartnerTile({ partner, focusable = true }: { partner: Partner; focusable?: boolean }) {
  const website = getSafeWebsite(partner.website);
  const logo = (
    <span className="relative block h-full w-full">
      <Image
        src={partner.logo}
        alt={partner.name}
        fill
        sizes="(min-width: 640px) 216px, 152px"
        loading="lazy"
        unoptimized={!isOptimizableImage(partner.logo)}
        className="object-contain"
      />
    </span>
  );

  if (!website) {
    return (
      <div className={TILE} title={partner.name}>
        {logo}
      </div>
    );
  }

  return (
    <a
      href={website}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visitar site de ${partner.name}`}
      title={partner.name}
      tabIndex={focusable ? undefined : -1}
      className={`${TILE} ${FOCUS_RING} active:scale-[0.98]`}
    >
      {logo}
    </a>
  );
}

interface MarqueeRowProps {
  partners: Partner[];
  reverse?: boolean;
  paused: boolean;
  label: string;
}

const MarqueeRow = ({ partners, reverse = false, paused, label }: MarqueeRowProps) => {
  // Repete a fileira até cobrir telas largas; a 2ª cópia fecha o loop sem emenda (translate -50%)
  const loop = Array.from({ length: Math.ceil(MIN_PER_LOOP / partners.length) }, () => partners).flat();

  return (
    <div className="group">
      <div
        className={`flex w-max animate-[cdl-marquee_linear_infinite] will-change-transform group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none ${paused ? '[animation-play-state:paused]' : ''}`}
        style={{
          animationDuration: `${loop.length * SECONDS_PER_LOGO}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {[0, 1].map((copy) => (
          // Cópias só existem para o loop: inert tira do teclado e do leitor de tela
          <ul
            key={copy}
            aria-label={copy === 0 ? label : undefined}
            inert={copy === 1}
            className={`flex gap-3 pr-3 sm:gap-4 sm:pr-4 ${copy === 1 ? 'motion-reduce:hidden' : 'motion-reduce:pl-4'}`}
          >
            {loop.map((partner, index) => {
              const repeat = copy === 1 || index >= partners.length;
              return (
                <li
                  key={`${partner.id}-${index}`}
                  inert={repeat}
                  className={`snap-start ${repeat ? 'motion-reduce:hidden' : ''}`}
                >
                  <PartnerTile partner={partner} focusable={false} />
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
};

const SkeletonRow = () => (
  <div className="flex justify-center gap-3 sm:gap-4" aria-hidden="true">
    {Array.from({ length: 12 }, (_, i) => (
      <div
        key={i}
        className={`${TILE_SIZE} animate-pulse border border-gray-100 bg-gray-100 motion-reduce:animate-none`}
      />
    ))}
  </div>
);

const PartnersCarousel = () => {
  // null = carregando; [] = erro ou nenhum associado (seção some)
  const [partners, setPartners] = React.useState<Partner[] | null>(null);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/parceiros');
        if (!response.ok) throw new Error('Erro ao buscar associados');
        const data: Partner[] = await response.json();
        if (!active) return;
        setPartners(
          data
            .filter((p) => p.logo)
            .map((p) => ({ id: p.id, name: p.name, logo: p.logo, website: p.website }))
        );
      } catch (error) {
        console.error('Erro ao carregar associados:', error);
        if (active) setPartners([]);
      }
    };
    fetchPartners();
    return () => {
      active = false;
    };
  }, []);

  if (partners?.length === 0) return null;

  const total = partners?.length ?? 0;
  const useMarquee = total >= MIN_FOR_MARQUEE;
  const mid = Math.ceil(total / 2);

  return (
    <section
      aria-labelledby="associados-titulo"
      aria-busy={partners === null}
      className="relative overflow-hidden bg-white py-14 sm:py-20"
    >
      {/* Cabeçalho */}
      <div className="container relative mx-auto px-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#003f7f] shadow-sm">
          <FaHandshake aria-hidden="true" />
          Associados
        </span>
        <h2
          id="associados-titulo"
          className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-balance text-[#003f7f] sm:text-5xl lg:text-6xl"
        >
          Nossos Associados
        </h2>
        <div className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
        <p className="mx-auto mt-5 max-w-2xl text-base text-balance text-gray-600 md:text-lg">
          {total >= 20 ? `Mais de ${Math.floor((total - 1) / 10) * 10} empresas` : 'Empresas que'} fortalecem o
          comércio de Ipirá e fazem parte da nossa rede.
        </p>
      </div>

      {/* Logos: py-8 dá espaço para a sombra/elevação dos blocos dentro do recorte; bordas com fade */}
      {partners !== null && !useMarquee ? (
        <ul aria-label="Associados" className="container mx-auto mt-4 flex flex-wrap justify-center gap-3 px-4 py-8 sm:mt-6 sm:gap-4">
          {partners.map((partner) => (
            <li key={partner.id}>
              <PartnerTile partner={partner} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 overflow-hidden py-8 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] sm:mt-6 motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:scroll-px-4 motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]">
          <div className="flex flex-col gap-4 sm:gap-6">
            {partners === null ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : (
              <>
                <MarqueeRow partners={partners.slice(0, mid)} paused={paused} label="Associados, primeira fileira" />
                <MarqueeRow partners={partners.slice(mid)} paused={paused} label="Associados, segunda fileira" reverse />
              </>
            )}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="container relative mx-auto mt-2 flex flex-col items-center justify-center gap-3 px-4 sm:mt-4 sm:flex-row">
        <Link
          href="/beneficios/empresas"
          className={`inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#003f7f] px-7 py-3.5 text-sm font-bold text-[#003f7f] transition duration-200 hover:bg-[#003f7f] hover:text-white active:scale-[0.98] sm:w-auto ${FOCUS_RING}`}
        >
          Ver todos os associados
        </Link>
        <a
          href="https://app.higestor.com.br/inscricao/empresa/cdl-ipira"
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-transparent bg-linear-to-r from-[#003f7f] to-[#0066cc] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)] active:scale-[0.98] motion-reduce:hover:translate-y-0 sm:w-auto ${FOCUS_RING}`}
        >
          Seja um associado
          <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
        </a>
      </div>

      {/* Fora da fileira de CTAs para não descentralizá-los */}
      {useMarquee && (
        <div className="mt-3 flex justify-center px-4 motion-reduce:hidden">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Retomar animação dos associados' : 'Pausar animação dos associados'}
            className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-gray-500 transition duration-200 hover:bg-gray-50 hover:text-[#003f7f] active:scale-[0.98] ${FOCUS_RING}`}
          >
            {paused ? <FaPlay className="h-3 w-3" aria-hidden="true" /> : <FaPause className="h-3 w-3" aria-hidden="true" />}
            {paused ? 'Retomar animação' : 'Pausar animação'}
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes cdl-marquee {
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </section>
  );
};

export default PartnersCarousel;
