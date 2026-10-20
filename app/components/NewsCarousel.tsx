'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { A11y, Autoplay } from 'swiper/modules';
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaNewspaper } from 'react-icons/fa';
import NewsModal from './NewsModal';
import { formatDateBR, parseDateOnly } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import 'swiper/css';
import 'swiper/css/a11y';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  rawDate: string | null;
  category: string;
  color: string;
  author?: string;
  image?: string;
}

// Cores da marca para notícias sem imagem (também usadas no topo do modal)
const COLORS = [
  'from-[#003f7f] to-[#0066cc]',
  'from-[#00a859] to-[#00d670]',
  'from-[#0052a3] to-[#0066cc]',
  'from-[#ffd000] to-[#ffed4e]',
];

// Acima disso vira carrossel; até aqui, grade estática (sem setas nem bolinhas)
const GRID_MAX = 3;

// Grade de 3 itens: no tablet (2 colunas) o terceiro card fica centralizado em vez de sobrar à esquerda
const GRID_3 = 'sm:grid-cols-2 lg:grid-cols-3 sm:max-lg:[&>:last-child]:col-span-2 sm:max-lg:[&>:last-child]:mx-auto sm:max-lg:[&>:last-child]:w-[calc(50%-0.75rem)]';

const SHADOW = 'shadow-[0_12px_32px_-18px_rgba(0,63,127,0.35)]';
const SHADOW_HOVER = 'hover:shadow-[0_24px_50px_-20px_rgba(0,63,127,0.45)]';

// Resumo do card: excerpt cadastrado ou início do conteúdo em texto puro (o conteúdo pode ter HTML)
function getExcerpt(excerpt?: string | null, content?: string | null): string {
  if (excerpt?.trim()) return excerpt.trim();
  const text = (content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  return text.length > 120 ? `${text.slice(0, 120).trimEnd()}...` : text;
}

// Slides fora da área visível (no destino da transição) ficam inertes: fora do Tab e do leitor de tela.
// Conta pelas posições do Swiper com 1px de folga, porque a classe "fully-visible" falha com larguras fracionadas.
function syncInert(s: SwiperClass) {
  const active = document.activeElement;
  const start = s.snapGrid[s.snapIndex] ?? 0;
  s.slides.forEach((el, i) => {
    const left = s.slidesGrid[i] - start;
    el.inert = left < -1 || left + s.slidesSizesGrid[i] > s.width + 1;
  });
  // Se o foco estava num card que saiu de vista, leva para o primeiro card visível
  if (active instanceof HTMLElement && active.closest('.swiper-slide')?.hasAttribute('inert')) {
    s.slides.find((el) => !el.inert)?.querySelector('button')?.focus({ preventScroll: true });
  }
}

function SectionHeader({ actions }: { actions?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#003f7f] shadow-sm">
          <FaNewspaper aria-hidden="true" />
          Últimas Notícias
        </span>
        <h2 id="noticias-titulo" className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-balance text-[#003f7f] sm:text-5xl lg:text-6xl">
          Fique por Dentro
        </h2>
        <div className="mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
        <p className="mt-5 text-base text-balance text-gray-600 md:text-lg">
          Novidades, campanhas e ações da CDL Ipirá para fortalecer o comércio da cidade.
        </p>
      </div>
      {actions}
    </div>
  );
}

const viewAllClass = `group inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#003f7f] to-[#0066cc] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)] active:scale-[0.98] motion-reduce:hover:translate-y-0`;

const navButtonClass = `grid h-12 w-12 place-items-center rounded-full bg-white text-[#003f7f] ring-1 ring-gray-200 shadow-[0_8px_20px_-10px_rgba(0,63,127,0.45)] transition-all duration-200 hover:bg-[#003f7f] hover:text-white hover:ring-[#003f7f] active:scale-95`;

function NewsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`overflow-hidden rounded-3xl bg-white ring-1 ring-gray-100 ${SHADOW} ${i === 1 ? 'hidden sm:block' : ''} ${i === 2 ? 'hidden lg:block' : ''}`}
        >
          <div className="aspect-16/10 animate-pulse bg-gray-200 motion-reduce:animate-none" />
          <div className="space-y-3 p-6 md:p-7">
            <div className="h-5 w-11/12 animate-pulse rounded-full bg-gray-200 motion-reduce:animate-none" />
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-gray-200 motion-reduce:animate-none" />
            <div className="h-3.5 w-full animate-pulse rounded-full bg-gray-100 pt-2 motion-reduce:animate-none" />
            <div className="h-3.5 w-5/6 animate-pulse rounded-full bg-gray-100 motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NewsCard({ item, featured, sizes, onOpen }: { item: NewsItem; featured?: boolean; sizes: string; onOpen: (item: NewsItem) => void }) {
  const month = parseDateOnly(item.rawDate)?.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');

  return (
    <article
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-3xl text-left bg-white ring-1 ring-gray-100 ${SHADOW} ${SHADOW_HOVER} transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#003f7f] has-focus-visible:ring-2 has-focus-visible:ring-[#ffd000] motion-reduce:hover:translate-y-0 ${featured ? 'md:flex-row' : ''}`}
    >
      <div className={`relative aspect-16/10 shrink-0 overflow-hidden bg-linear-to-br ${item.color} ${featured ? 'md:aspect-auto md:min-h-88 md:w-1/2' : ''}`}>
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes={sizes}
            unoptimized={!isOptimizableImage(item.image)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
        ) : (
          <FaNewspaper aria-hidden="true" className="absolute inset-0 m-auto text-6xl text-white/30" />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-transparent" />

        {/* Badge categoria */}
        <div className="absolute top-5 left-5">
          <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-black tracking-wide text-[#003f7f] uppercase shadow-lg backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00a859]" />
            {item.category}
          </span>
        </div>

        {/* Data flutuante */}
        {item.date && (
          <time dateTime={item.rawDate?.slice(0, 10)} className="absolute top-5 right-5 rounded-2xl bg-white/95 p-3 text-center shadow-xl backdrop-blur-sm">
            <span className="block text-xl leading-none font-black text-[#003f7f]">{item.date.split('/')[0]}</span>
            <span className="mt-1 block text-[10px] font-bold tracking-wider text-[#00a859] uppercase">{month}</span>
          </time>
        )}
      </div>

      <div className={`flex grow flex-col p-6 md:p-7 ${featured ? 'md:justify-center md:p-10 lg:p-12' : ''}`}>
        <h3 className={`font-bold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-[#003f7f] ${featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
          {/* Botão "esticado": o ::after cobre o card inteiro, então qualquer clique abre o modal */}
          <button
            type="button"
            onClick={() => onOpen(item)}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:shadow-none! focus-visible:outline-none!"
          >
            <span className="line-clamp-2">{item.title}</span>
          </button>
        </h3>

        {item.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600 md:text-[15px]">{item.excerpt}</p>}

        {/* Rodapé fixo embaixo, com respiro mínimo mesmo quando o card não tem sobra de altura */}
        <div className="mt-auto pt-6 md:pt-8">
          <div className="flex items-center justify-between border-t border-gray-100 pt-5">
            <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">{item.author}</span>
            <span aria-hidden="true" className="inline-flex items-center gap-2 text-sm font-bold text-[#00a859] transition-all duration-300 group-hover:gap-3">
              Leia mais
              <FaArrowRight className="text-xs" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

const NewsCarousel = () => {
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedNews, setSelectedNews] = React.useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [swiper, setSwiper] = React.useState<SwiperClass | null>(null);
  const [snap, setSnap] = React.useState({ index: 0, count: 1 });

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/noticias?limit=6');
        if (response.ok) {
          const data = await response.json();

          // Map database fields to NewsItem interface
          const mappedNews: NewsItem[] = data.slice(0, 6).map((item: { id: number; title: string; excerpt?: string | null; content?: string | null; date?: string | null; category?: string | null; author?: string | null; image?: string | null }, index: number) => ({
            id: item.id,
            title: item.title,
            excerpt: getExcerpt(item.excerpt, item.content),
            content: item.content || '',
            date: formatDateBR(item.date),
            rawDate: item.date || null,
            category: item.category || 'Notícias',
            color: COLORS[index % COLORS.length],
            author: item.author || 'CDL Ipirá',
            image: item.image || undefined
          }));

          setNews(mappedNews);
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Com o modal aberto o carrossel não anda (senão o card de origem sai de vista e o foco não volta para ele)
  const openModal = (item: NewsItem) => {
    swiper?.autoplay?.stop();
    setSelectedNews(item);
    setIsModalOpen(true);
  };

  // Sem notícias, a seção some (nada de bloco vazio na home)
  if (!isLoading && news.length === 0) return null;

  const isCarousel = news.length > GRID_MAX;
  // Só existe no cliente (a lista vem do fetch), então pode ler a preferência direto
  const reduceMotion = isCarousel && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sync = (s: SwiperClass) => {
    setSnap({ index: s.snapIndex, count: s.snapGrid.length });
    syncInert(s);
  };

  const viewAll = (
    <Link href="/imprensa/noticias" className={viewAllClass}>
      Ver todas
      <FaArrowRight aria-hidden="true" className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );

  let content: React.ReactNode;
  if (isLoading) {
    content = <NewsSkeleton />;
  } else if (!isCarousel) {
    const sizes = news.length === 3 ? '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw' : '(min-width: 768px) 50vw, 100vw';
    content = (
      <div className={`grid gap-6 lg:gap-8 ${news.length === 2 ? 'md:grid-cols-2' : news.length === 3 ? GRID_3 : ''}`}>
        {news.map((item) => (
          <NewsCard key={item.id} item={item} featured={news.length === 1} sizes={sizes} onOpen={openModal} />
        ))}
      </div>
    );
  } else {
    content = (
      <>
        <Swiper
          modules={[A11y, Autoplay]}
          onSwiper={setSwiper}
          onAfterInit={sync}
          onSnapIndexChange={sync}
          onSnapGridLengthChange={sync}
          rewind
          speed={reduceMotion ? 0 : 600}
          slidesPerView={1.15}
          spaceBetween={16}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 32 },
          }}
          autoplay={reduceMotion ? false : { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          a11y={{
            containerRoleDescriptionMessage: 'carrossel',
            itemRoleDescriptionMessage: 'notícia',
            slideLabelMessage: '{{index}} de {{slidesLength}}',
            // Só os slides visíveis recebem foco (os demais ficam inert), então não precisa rolar ao focar
            scrollOnFocus: false,
          }}
          className="-mx-4! -mt-3! -mb-12! w-auto! px-4! pt-3! pb-12!"
        >
          {news.map((item) => (
            <SwiperSlide key={item.id} className="h-auto! px-0!">
              <NewsCard item={item} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw" onOpen={openModal} />
            </SwiperSlide>
          ))}
        </Swiper>

        {snap.count > 1 && (
          <div className="mt-5 flex justify-center">
            {Array.from({ length: snap.count }, (_, i) => (
              // Área de toque de 24px+ ao redor do ponto visível
              <button
                key={i}
                type="button"
                onClick={() => swiper?.slideTo(i)}
                aria-label={`Ir para a posição ${i + 1} de ${snap.count}`}
                aria-current={i === snap.index ? 'true' : undefined}
                className="group/dot grid h-10 place-items-center rounded-full px-[7px]"
              >
                <span className={`block h-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${i === snap.index ? 'w-8 bg-[#003f7f]' : 'w-2.5 bg-gray-300 group-hover/dot:bg-gray-400'}`} />
              </button>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <section
      aria-labelledby="noticias-titulo"
      aria-busy={isLoading || undefined}
      className="relative overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-50 py-16 md:py-24"
    >
      {/* Elementos decorativos de fundo */}
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-[#003f7f]/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-24 h-96 w-96 rounded-full bg-[#00a859]/5 blur-3xl" />

      {/* Teclado: setas navegam; foco dentro pausa o autoplay (hover é tratado pelo Swiper).
          Fica fora do modal, que é um portal e também propagaria os eventos. */}
      <div
        className="relative container mx-auto px-4"
        onKeyDown={(e) => {
          if (!swiper) return;
          if (e.key === 'ArrowLeft') swiper.slidePrev();
          if (e.key === 'ArrowRight') swiper.slideNext();
        }}
        onFocus={() => swiper?.autoplay?.running && swiper.autoplay.stop()}
        onBlur={(e) => {
          if (swiper && !reduceMotion && !isModalOpen && !e.currentTarget.contains(e.relatedTarget)) swiper.autoplay?.start();
        }}
      >
        <SectionHeader
          actions={
            <div className="hidden shrink-0 items-center gap-3 md:flex">
              {isCarousel && (
                <>
                  <button type="button" onClick={() => swiper?.slidePrev()} aria-label="Notícias anteriores" className={navButtonClass}>
                    <FaChevronLeft aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => swiper?.slideNext()} aria-label="Próximas notícias" className={navButtonClass}>
                    <FaChevronRight aria-hidden="true" />
                  </button>
                </>
              )}
              {viewAll}
            </div>
          }
        />

        {content}

        <div className="mt-10 md:hidden [&>a]:w-full">{viewAll}</div>
      </div>

      <NewsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Volta a rodar; se o foco retornar ao card, o onFocus acima pausa de novo
          if (!reduceMotion) swiper?.autoplay?.start();
        }}
        news={selectedNews}
      />
    </section>
  );
};

export default NewsCarousel;
