'use client';

import React, { useRef, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaHandshake, FaPause, FaPlay } from 'react-icons/fa';
import { isOptimizableImage } from '@/lib/images';
import { EASE, MOTION_OK, ScrollTrigger, gsap, useGSAP } from '@/lib/motion';
import { useReveal } from '@/app/components/motion/useReveal';
import { SectionHeading } from '@/app/components/carousel/SectionCarousel';

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

// Abaixo disso não há logos para um letreiro contínuo: vira grade estática centralizada
const MIN_FOR_MARQUEE = 16;
// Cada volta do letreiro precisa cobrir telas largas (16 blocos ≈ 3000px)
const MIN_PER_LOOP = 16;
// Velocidade constante, independente da quantidade de associados (~50px/s no desktop, ~35px/s no celular)
const SECONDS_PER_LOGO = 5;

// Bloco 16:9 com largura pela altura da tela (a seção cabe inteira de 640 a 1080px de altura). As logos são
// enviadas em telas 1920x1080 com margem própria, então o padding é mínimo para não encolhê-las
const TILE_SIZE = 'aspect-video w-[clamp(8.5rem,min(24svh,38vw),15rem)] shrink-0 rounded-2xl';
const TILE = `${TILE_SIZE} group/tile block bg-white p-1 ring-1 ring-[#003f7f]/8 shadow-[0_10px_28px_-18px_rgba(0,63,127,0.45)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-16px_rgba(0,63,127,0.5)] motion-reduce:hover:translate-y-0 sm:p-1.5`;

// focusable=false no letreiro: centenas de paradas de Tab em blocos que se movem (e saem da tela)
// travariam o teclado; quem navega por teclado usa "Ver todos"
function PartnerTile({ partner, focusable = true }: { partner: Partner; focusable?: boolean }) {
  const website = getSafeWebsite(partner.website);
  const logo = (
    <span className="relative block h-full w-full">
      {/* Cinza no desktop, cor no hover. Telas de toque não têm hover: lá as logos ficam sempre coloridas */}
      <Image
        src={partner.logo}
        alt={partner.name}
        fill
        sizes="240px"
        loading="lazy"
        unoptimized={!isOptimizableImage(partner.logo)}
        className="object-contain transition-[filter,opacity] duration-300 [@media(hover:hover)]:opacity-80 [@media(hover:hover)]:grayscale group-hover/tile:opacity-100 group-hover/tile:grayscale-0 group-focus-visible/tile:opacity-100 group-focus-visible/tile:grayscale-0"
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
      className={`${TILE} active:scale-[0.98]`}
    >
      {logo}
    </a>
  );
}

// Fileiras do letreiro pela altura da tela: 1 em janelas baixas (celular deitado), 2 no comum, 3 em telas altas
const ROWS_2 = '(min-height: 600px)';
const ROWS_3 = '(min-height: 1000px)';
const subscribeRows = (onChange: () => void) => {
  const mqs = [ROWS_2, ROWS_3].map((q) => window.matchMedia(q));
  mqs.forEach((mq) => mq.addEventListener('change', onChange));
  return () => mqs.forEach((mq) => mq.removeEventListener('change', onChange));
};
const readRows = () => (window.matchMedia(ROWS_3).matches ? 3 : window.matchMedia(ROWS_2).matches ? 2 : 1);
const ORDINALS = ['primeira', 'segunda', 'terceira'];

// Menos movimento (sistema ou "Pausar animações"): o letreiro vira faixa rolável, que precisa aceitar o teclado
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const subscribeReducedMotion = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};
const readReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

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
        data-marquee
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

// Mesmas fileiras do letreiro, decididas por CSS (no servidor ainda não se sabe a altura da tela)
const SkeletonRow = ({ className = 'flex' }: { className?: string }) => (
  <div className={`${className} justify-center gap-3 sm:gap-4`} aria-hidden="true">
    {Array.from({ length: 12 }, (_, i) => (
      <div key={i} className={`${TILE_SIZE} animate-pulse bg-[#003f7f]/6 motion-reduce:animate-none`} />
    ))}
  </div>
);

const PartnersCarousel = () => {
  // null = carregando; [] = erro ou nenhum associado (seção some)
  const [partners, setPartners] = React.useState<Partner[] | null>(null);
  const [paused, setPaused] = React.useState(false);
  // Servidor: 2 (o esqueleto mostra as fileiras por CSS; as logos só chegam no cliente)
  const rows = useSyncExternalStore(subscribeRows, readRows, () => 2);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => false);
  const root = useRef<HTMLElement>(null);
  // Cabeçalho e ações existem desde o esqueleto: sem deps, para não repetir a entrada quando as logos chegam
  useReveal(root);

  useGSAP(
    () => {
      const logos = root.current?.querySelector<HTMLElement>('[data-logos]');
      if (!partners?.length || !logos) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Logos entram em cascata (escala + fade) da esquerda para a direita, só as que estão à vista;
        // as posições são lidas na hora do gatilho porque o letreiro já andou até lá
        const controls = gsap.utils.toArray<HTMLElement>('[data-controls] > *', root.current);
        gsap.set([logos, ...controls], { opacity: 0 });
        ScrollTrigger.create({
          trigger: logos,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            const box = logos.getBoundingClientRect();
            const visible = gsap.utils.toArray<HTMLElement>('li', logos).filter((li) => {
              const r = li.getBoundingClientRect();
              return r.right > 0 && r.left < window.innerWidth;
            });
            gsap.set(logos, { opacity: 1 });
            gsap.from(visible, {
              opacity: 0,
              scale: 0.8,
              y: 16,
              duration: 0.7,
              ease: EASE.enter,
              clearProps: 'opacity,transform',
              stagger: (_, li: HTMLElement) => {
                const r = li.getBoundingClientRect();
                return Math.min(0.9, (r.left / window.innerWidth) * 0.6 + ((r.top - box.top) / box.height) * 0.25);
              },
            });
            gsap.to(controls, { opacity: 1, duration: 0.6, delay: 0.3, ease: EASE.soft, clearProps: 'opacity' });
          },
        });

        // Letreiro acelera com a velocidade da rolagem e volta suave ao ritmo normal.
        // Mexe só no playbackRate da animação CSS: pausa (botão/hover/foco) e movimento reduzido continuam valendo
        const anims = gsap.utils.toArray<HTMLElement>('[data-marquee]', root.current).flatMap((el) => el.getAnimations());
        if (!anims.length) return;
        const speed = { rate: 1 };
        const apply = () => anims.forEach((a) => {
          a.playbackRate = speed.rate;
        });
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            gsap.to(speed, {
              rate: 1 + Math.min(Math.abs(self.getVelocity()) / 300, 5),
              duration: 0.25,
              ease: EASE.soft,
              overwrite: true,
              onUpdate: apply,
            });
            gsap.to(speed, { rate: 1, duration: 1.4, delay: 0.25, ease: EASE.inOut, onUpdate: apply });
          },
        });
        return () => {
          speed.rate = 1;
          apply();
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [partners, rows], revertOnUpdate: true },
  );

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
  const perRow = Math.ceil(total / rows);

  return (
    // Bloco branco da home (borda reta, logo depois dos atalhos): ocupa a área útil da tela (--screen-fit) com o
    // conteúdo centrado; logos e respiros crescem com a altura (svh) para tudo caber. Janela baixa (< 560px,
    // celular deitado): altura natural.
    <section
      ref={root}
      aria-labelledby="associados-titulo"
      aria-busy={partners === null || undefined}
      className="relative flex flex-col justify-center overflow-hidden bg-white py-(--scene-blend) [@media(min-height:560px)]:min-h-(--screen-fit)"
    >
      {/* Mesma grade das seções com carrossel (kit): celular = "Ver todos" na linha do selo e controles depois das
          logos; md+ = coluna à direita do título com a ação em cima e os controles alinhados à base do título */}
      <div className="container relative mx-auto grid w-full grid-cols-[minmax(0,1fr)_auto] gap-x-3 px-4 md:gap-x-6">
        <div className="col-span-2 col-start-1 row-start-1 md:col-span-1">
          <SectionHeading
            id="associados-titulo"
            eyebrow={
              <>
                <FaHandshake aria-hidden="true" />
                Associados
              </>
            }
            eyebrowClass="bg-[#ffd000] text-[#003f7f]"
            title="Nossos Associados"
            text="Empresas que fortalecem o comércio de Ipirá e fazem parte da nossa rede."
          />
        </div>

        <div className="contents md:col-start-2 md:row-start-1 md:flex md:flex-col md:items-end md:justify-between md:gap-3">
          <div data-reveal="fade" className="relative z-10 col-start-2 row-start-1 flex self-start justify-self-end md:self-end">
            <Link
              href="/beneficios/empresas"
              className="group inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-4 text-xs font-bold whitespace-nowrap text-[#003f7f] ring-1 ring-[#003f7f]/15 transition-[background-color,color,box-shadow] duration-200 hover:bg-[#003f7f] hover:text-white hover:ring-[#003f7f] md:h-10 md:px-5 md:text-sm"
            >
              Ver todos
              {/* "Ver todos" também aparece na TV Lojista: na lista de links do leitor de tela, diz de quê */}
              <span className="sr-only"> os associados</span>
              <FaArrowRight aria-hidden="true" className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </Link>
          </div>

          {/* Controles: total de associados + pausa do letreiro (WCAG 2.2.2; hover só segura enquanto dura) */}
          <div data-controls className="col-start-2 row-start-3 mt-[clamp(0.75rem,2svh,1.25rem)] flex min-h-11 items-center justify-end gap-2 self-center md:mt-0 md:self-end">
            {partners !== null && (
              <span className="hidden text-sm font-bold whitespace-nowrap tabular-nums sm:inline md:mr-1">
                <span className="text-[#003f7f]">{total}</span>
                <span className="text-[#003f7f]/70"> associados</span>
              </span>
            )}
            {useMarquee && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Retomar animação dos associados' : 'Pausar animação dos associados'}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm text-[#003f7f]/70 transition-[background-color,color,scale] duration-200 hover:bg-[#003f7f]/8 hover:text-[#003f7f] active:scale-95 motion-reduce:hidden"
              >
                {paused ? <FaPlay aria-hidden="true" className="h-3 w-3 translate-x-px" /> : <FaPause aria-hidden="true" className="h-3 w-3" />}
              </button>
            )}
          </div>
        </div>

        {/* Logos de ponta a ponta da tela (fora do container), bordas com fade; o respiro vertical dá espaço para a
            sombra/elevação dos blocos dentro do recorte */}
        <div className="col-span-2 col-start-1 row-start-2 mx-[calc(50%-50vw)] mt-[clamp(0.25rem,1.2svh,0.75rem)]">
          {partners !== null && !useMarquee ? (
            <ul data-logos aria-label="Associados" className="container mx-auto flex flex-wrap justify-center gap-3 px-4 py-[clamp(1rem,3svh,2rem)] sm:gap-4">
              {partners.map((partner) => (
                <li key={partner.id}>
                  <PartnerTile partner={partner} />
                </li>
              ))}
            </ul>
          ) : (
            <div
              // Rolável só com menos movimento: aí entra no Tab e rola pelas setas (WCAG 2.1.1)
              {...(reducedMotion && partners?.length ? { tabIndex: 0, role: 'region', 'aria-label': 'Associados (role para os lados)' } : {})}
              className="overflow-hidden py-[clamp(1rem,3svh,2rem)] [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:scroll-px-4 motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]">
              <div data-logos className="flex flex-col gap-[clamp(0.75rem,1.8svh,1.25rem)]">
                {partners === null ? (
                  <>
                    <SkeletonRow className="hidden [@media(max-height:599px)]:flex" />
                    <SkeletonRow className="hidden [@media(min-height:600px)]:flex" />
                    <SkeletonRow className="hidden [@media(min-height:600px)]:flex" />
                    <SkeletonRow className="hidden [@media(min-height:1000px)]:flex" />
                  </>
                ) : (
                  Array.from({ length: rows }, (_, r) => (
                    <MarqueeRow
                      key={r}
                      partners={partners.slice(r * perRow, (r + 1) * perRow)}
                      paused={paused}
                      label={rows === 1 ? 'Associados' : `Associados, ${ORDINALS[r]} fileira`}
                      reverse={r % 2 === 1}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Convite final: no celular divide a linha com os controles; md+ centralizado embaixo das logos */}
        <div
          data-reveal="fade"
          className="col-start-1 row-start-3 mt-[clamp(0.75rem,2svh,1.25rem)] flex items-center md:col-span-2 md:justify-center md:gap-5"
        >
          <p className="hidden text-[15px] font-medium text-gray-600 md:block">Sua empresa também pode fazer parte da rede.</p>
          <a
            href="https://app.higestor.com.br/inscricao/empresa/cdl-ipira"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#003f7f] to-[#0066cc] px-6 text-sm font-bold whitespace-nowrap text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)] active:scale-[0.98] motion-reduce:hover:translate-y-0 md:h-12 md:px-7"
          >
            Seja um associado
            <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
      </div>

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
