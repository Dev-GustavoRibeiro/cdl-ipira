'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaImages, FaCamera, FaArrowRight, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import SectionCarousel, { SectionHeading, useCardsMotion } from './carousel/SectionCarousel';
import { useReveal } from './motion/useReveal';
import { isOptimizableImage } from '@/lib/images';
import { formatDateLong } from '@/lib/date';

interface Gallery {
  id: number;
  title: string;
  image: string | null;
  photos: number;
  category?: string;
  date?: string;
  location?: string;
  description?: string;
}

const albumHref = (gallery: Gallery) => `/imprensa/galeria-fotos?album=${gallery.id}`;
const photosLabel = (n: number) => `${n} ${n === 1 ? 'foto' : 'fotos'}`;

/** Capa (decorativa: o título está no texto do cartão); sem imagem, gradiente da marca com o ícone de fotos. */
function Cover({ gallery, sizes }: { gallery: Gallery; sizes: string }) {
  if (!gallery.image) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#003f7f] to-[#0052a3]">
        <FaImages aria-hidden="true" className="h-20 w-20 text-white/15" />
      </div>
    );
  }
  return (
    <Image
      src={gallery.image}
      alt=""
      fill
      sizes={sizes}
      unoptimized={!isOptimizableImage(gallery.image)}
      className="object-cover transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
  );
}

/**
 * Cartão de álbum: capa grande de ponta a ponta (altura pela tela, --album-h da seção) com selo, nº de fotos, data e
 * título sobre um véu embaixo. `featured` (álbum único): do md em diante, capa e detalhes lado a lado.
 */
function AlbumCard({ gallery, featured, sizes }: { gallery: Gallery; featured?: boolean; sizes: string }) {
  const date = formatDateLong(gallery.date);

  return (
    // transition só de translate/sombra: transform e opacity ficam livres para a entrada (GSAP)
    <article
      data-card
      className={`group relative isolate flex h-(--album-h) flex-col justify-end overflow-hidden rounded-[1.75rem] bg-[#003f7f] shadow-[0_14px_34px_-22px_rgba(0,63,127,0.6)] ring-1 ring-[#003f7f]/8 transition-[translate,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-28px_rgba(0,63,127,0.6)] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#003f7f] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${featured ? 'md:flex-row md:justify-start md:bg-white' : ''}`}
    >
      {/* -z-10 dentro do isolate: a capa fica atrás do texto sem posicionar o bloco de texto (o link esticado do título
          precisa do artigo como referência para cobrir o cartão inteiro) */}
      <div data-card-media className={`absolute inset-0 -z-10 overflow-hidden bg-[#003f7f] ${featured ? 'md:relative md:w-[58%] md:shrink-0 md:rounded-[1.3rem] md:m-2' : ''}`}>
        {/* Camada própria para o parallax (a imagem mantém o zoom do hover com transição CSS) */}
        <div data-card-parallax className="absolute inset-0">
          <Cover gallery={gallery} sizes={sizes} />
        </div>
        {/* Véus: embaixo para o texto, em cima para os selos; sem escurecer a foto toda */}
        <div className={`absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-[#001a3d] via-[#001a3d]/55 to-transparent ${featured ? 'md:hidden' : ''}`} />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-black/35 to-transparent" />

        {gallery.category && (
          // Sem backdrop-blur: sobre a foto em parallax faz o Safari repintar/piscar ao rolar
          <span className="absolute top-3 left-3 inline-flex max-w-[60%] items-center gap-1.5 rounded-full bg-white/92 px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-[#003f7f] uppercase shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a859]" />
            <span className="truncate">{gallery.category}</span>
          </span>
        )}
        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white tabular-nums">
          <FaCamera aria-hidden="true" className="h-3 w-3" />
          {photosLabel(gallery.photos)}
        </span>
      </div>

      <div className={`p-4 text-white sm:p-5 ${featured ? 'md:flex md:flex-1 md:flex-col md:justify-center md:p-[clamp(1.5rem,4svh,3rem)] md:text-[#003f7f]' : ''}`}>
        {date && (
          <p className={`flex items-center gap-2 text-xs font-semibold text-white/80 ${featured ? 'md:text-sm md:text-gray-500' : ''}`}>
            <FaCalendarAlt aria-hidden="true" className={`h-3 w-3 text-[#ffd000] ${featured ? 'md:text-[#00a859]' : ''}`} />
            {date}
          </p>
        )}
        <h3 className={`mt-1.5 leading-tight font-black tracking-tight text-balance ${featured ? 'text-xl sm:text-2xl md:mt-3 md:text-[clamp(1.75rem,4svh,2.5rem)]' : 'text-lg sm:text-xl'}`}>
          {/* Link "esticado": o ::after cobre o cartão inteiro */}
          <Link
            href={albumHref(gallery)}
            className="block after:absolute after:inset-0 after:z-10 after:rounded-[1.75rem] after:content-[''] focus-visible:shadow-none! focus-visible:outline-none!"
          >
            <span className={featured ? 'line-clamp-2 md:line-clamp-3' : 'line-clamp-2'}>{gallery.title}</span>
          </Link>
        </h3>
        {featured && gallery.location && (
          <p className="mt-3 hidden items-center gap-2 text-sm font-medium text-gray-600 md:flex">
            <FaMapMarkerAlt aria-hidden="true" className="h-3.5 w-3.5 text-[#00a859]" />
            {gallery.location}
          </p>
        )}
        {featured && gallery.description && (
          <p className="mt-4 hidden leading-relaxed text-pretty text-gray-600 md:line-clamp-3 md:[@media(max-height:760px)]:hidden">{gallery.description}</p>
        )}
        <span
          aria-hidden="true"
          className={`mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#ffd000] ${featured ? 'md:mt-[clamp(1.25rem,4svh,2rem)] md:w-fit md:rounded-full md:bg-[#003f7f] md:px-6 md:py-3 md:text-white md:shadow-[0_15px_30px_-12px_rgba(0,63,127,0.6)] md:transition-colors md:duration-300 md:group-hover:bg-[#0052a3]' : ''}`}
        >
          Ver álbum
          <FaArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
        </span>
      </div>
    </article>
  );
}

function AlbumSkeleton() {
  return <div className="h-(--album-h) animate-pulse rounded-[1.75rem] bg-[#003f7f]/8 motion-reduce:animate-none" />;
}

const GaleriaFotos = () => {
  const [galleries, setGalleries] = React.useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const root = React.useRef<HTMLElement>(null);

  useReveal(root, [isLoading, galleries.length]);
  useCardsMotion(root, [isLoading, galleries.length]);

  React.useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await fetch('/api/albums?limit=8');
        setGalleries(response.ok ? await response.json() : []);
      } catch (error) {
        console.error('Erro ao carregar galerias:', error);
        setGalleries([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  // Sem álbuns, a seção some em vez de mostrar um bloco vazio
  if (!isLoading && galleries.length === 0) return null;

  // Até 2 álbuns os cartões ficam mais largos no desktop (a vista nunca passa do total)
  const sizes = galleries.length <= 2 ? '(min-width: 768px) 60vw, 90vw' : '(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 46vw, (min-width: 640px) 62vw, 88vw';

  return (
    // Bloco branco da home (borda reta entre as seções): uma tela útil (--screen-fit) com o conteúdo centrado; celular
    // deitado cresce naturalmente. --album-h: altura dos cartões = o que sobra da tela depois dos respiros, do
    // cabeçalho e dos controles (no md+ os controles ficam ao lado do título), com teto para não virarem pôsteres.
    // Celular alto (> 820px): o texto de apoio do cabeçalho aparece (SectionHeading) e desconta mais. Do xl em diante o
    // texto de apoio volta e, com este título longo, pode descer para baixo dele (+1 linha): o xl desconta essa linha.
    <section
      ref={root}
      aria-labelledby="galeria-titulo"
      aria-busy={isLoading || undefined}
      className="relative flex flex-col justify-center overflow-hidden bg-white py-(--scene-blend) [--album-h:clamp(14rem,calc(var(--screen-fit)-2*var(--scene-blend)-12rem),28rem)] max-md:[@media(min-height:821px)]:[--album-h:clamp(14rem,calc(var(--screen-fit)-2*var(--scene-blend)-15.5rem),28rem)] md:[--album-h:clamp(16rem,calc(var(--screen-fit)-2*var(--scene-blend)-9.5rem),34rem)] xl:[--album-h:clamp(16rem,calc(var(--screen-fit)-2*var(--scene-blend)-11.25rem),34rem)] [@media(min-height:560px)]:min-h-(--screen-fit)"
    >
      {/* Brilhos discretos: gradientes radiais em vez de filter: blur (área grande sob o header de vidro) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(30rem_26rem_at_8%_6%,rgba(0,63,127,0.05),transparent_70%),radial-gradient(30rem_26rem_at_94%_96%,rgba(255,208,0,0.1),transparent_70%)]" />

      <div className="relative container mx-auto w-full px-4">
        <SectionCarousel
          label="Galerias de fotos"
          itemName="álbum"
          header={
            <SectionHeading
              id="galeria-titulo"
              eyebrow={
                <>
                  <FaCamera aria-hidden="true" />
                  Nossa Galeria
                </>
              }
              eyebrowClass="bg-[#ffd000] text-[#003f7f]"
              title="Momentos que Fazem História"
              text="Eventos, ações e celebrações da CDL Ipirá."
            />
          }
          action={{ href: '/imprensa/galeria-fotos', label: 'Ver todas' }}
          prevLabel="Álbuns anteriores"
          nextLabel="Próximos álbuns"
          loading={isLoading}
          skeleton={<AlbumSkeleton />}
          autoplay={7000}
        >
          {galleries.map((gallery) => (
            <AlbumCard key={gallery.id} gallery={gallery} featured={galleries.length === 1} sizes={sizes} />
          ))}
        </SectionCarousel>
      </div>
    </section>
  );
};

export default GaleriaFotos;
