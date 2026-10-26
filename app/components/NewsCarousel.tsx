'use client';

import React from 'react';
import Image from 'next/image';
import { FaArrowRight, FaNewspaper, FaRegClock } from 'react-icons/fa';
import NewsModal from './NewsModal';
import SectionCarousel, { SectionHeading, mediaFitClass, useCardsMotion, MOUSE_FOCUS } from './carousel/SectionCarousel';
import { parseDateOnly } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import { useReveal } from './motion/useReveal';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string; // YYYY-MM-DD ('' = sem data); o cartão e o modal formatam
  category: string;
  color: string;
  author?: string;
  image?: string;
  minutes: number;
  campaign: { slug: string; title: string } | null;
}

// Cores da marca para notícias sem imagem (também usadas no topo do modal)
const COLORS = [
  'from-[#003f7f] to-[#0066cc]',
  'from-[#00a859] to-[#00d670]',
  'from-[#0052a3] to-[#0066cc]',
  'from-[#ffd000] to-[#ffed4e]',
];

const plainText = (html?: string | null) => (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

// Resumo do card: excerpt cadastrado ou início do conteúdo em texto puro (o conteúdo pode ter HTML)
function getExcerpt(excerpt?: string | null, content?: string | null): string {
  if (excerpt?.trim()) return excerpt.trim();
  const text = plainText(content);
  return text.length > 120 ? `${text.slice(0, 120).trimEnd()}...` : text;
}

// Cantos côncavos da aba da data (encaixe da aba na foto): quarto de círculo transparente, resto branco
const NOTCH = "before:absolute before:bottom-full before:left-0 before:size-4 before:bg-[radial-gradient(circle_at_100%_0,transparent_1rem,#fff_calc(1rem+0.5px))] before:content-[''] after:absolute after:bottom-0 after:left-full after:size-4 after:bg-[radial-gradient(circle_at_100%_0,transparent_1rem,#fff_calc(1rem+0.5px))] after:content-['']";

function NewsCard({ item, featured, sizes, onOpen }: { item: NewsItem; featured?: boolean; sizes: string; onOpen: (item: NewsItem) => void }) {
  const date = parseDateOnly(item.date);

  return (
    // transition só de translate/sombra: transform e opacity ficam livres para a entrada (GSAP)
    <article
      data-card
      className={`group relative flex h-full flex-col rounded-[1.75rem] bg-white p-2 ring-1 ring-[#003f7f]/8 shadow-[0_14px_34px_-22px_rgba(0,63,127,0.5)] transition-[translate,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-28px_rgba(0,63,127,0.55)] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#003f7f] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${featured ? 'md:flex-row' : ''}`}
    >
      <div
        data-card-media
        // Canto inferior esquerdo reto sob a aba da data: arredondado, o fundo da mídia vazava uma linha fina na curva
        className={`relative w-full shrink-0 overflow-hidden rounded-[1.3rem] ${date ? 'rounded-bl-none' : ''} bg-linear-to-br ${item.color} ${mediaFitClass} ${featured ? 'md:aspect-auto md:max-h-none md:min-h-[clamp(15rem,44svh,24rem)] md:w-[56%]' : ''}`}
      >
        {item.image ? (
          // Camada própria para o parallax (a imagem mantém o zoom do hover com transição CSS)
          <div data-card-parallax className="absolute inset-0">
            <Image
              src={item.image}
              alt=""
              fill
              sizes={sizes}
              unoptimized={!isOptimizableImage(item.image)}
              className="object-cover transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        ) : (
          <FaNewspaper aria-hidden="true" className="absolute inset-0 m-auto text-5xl text-white/35 md:text-6xl" />
        )}
        {/* Véu só no topo: legibilidade do selo sem escurecer a foto */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-black/30 to-transparent" />

        {/* Sem backdrop-blur: com 92% de branco não aparece, e sobre a foto em parallax faz o Safari repintar/piscar ao rolar */}
        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-[#003f7f] uppercase shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)] md:top-3 md:left-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00a859]" />
          {item.category}
        </span>

        {/* Data em destaque numa aba branca encaixada na foto (continua o fundo do cartão) */}
        {date && (
          <time dateTime={item.date.slice(0, 10)} className={`absolute bottom-0 left-0 flex items-baseline gap-1.5 rounded-tr-2xl bg-white pt-2 pr-3.5 pl-3 ${NOTCH}`}>
            <span className="text-[1.375rem] leading-none font-black tracking-tight text-[#003f7f] tabular-nums md:text-2xl">{String(date.getDate()).padStart(2, '0')}</span>
            {/* Verde mais escuro que o da marca: 11px sobre branco precisa de 4.5:1 (#00a859 dava 3.1:1) */}
            <span className="text-[11px] font-bold tracking-[0.12em] text-[#007a40] uppercase">
              {date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')} {date.getFullYear()}
            </span>
          </time>
        )}
      </div>

      <div className={`flex grow flex-col px-3 pt-3 pb-1.5 md:pt-3.5 ${featured ? 'md:justify-center md:px-8 md:py-6 lg:px-10' : ''}`}>
        <h3 className={`leading-snug font-bold tracking-tight text-pretty text-gray-900 transition-colors duration-300 group-hover:text-[#003f7f] ${featured ? 'text-lg md:text-2xl lg:text-3xl' : 'text-[1.0625rem] md:text-lg'}`}>
          {/* Botão "esticado": o ::after cobre o card inteiro, então qualquer clique abre o modal */}
          <button
            type="button"
            // O Safari não foca botões no clique: foca aqui para o modal devolver o foco ao cartão ao fechar. Sem anel
            // (é clique de mouse/toque) e só se o foco não estiver nele (Chrome já focou no mousedown; teclado também).
            onClick={(e) => {
              if (document.activeElement !== e.currentTarget) e.currentTarget.focus(MOUSE_FOCUS);
              onOpen(item);
            }}
            aria-haspopup="dialog"
            // block: como inline-block, o botão deixava um vão de descendente embaixo do título
            className="block w-full cursor-pointer text-left after:absolute after:inset-0 after:z-10 after:rounded-[1.75rem] after:content-[''] focus-visible:shadow-none! focus-visible:outline-none!"
          >
            <span className="line-clamp-2">{item.title}</span>
          </button>
        </h3>

        {/* Resumo só quando sobra altura (o destaque único tem espaço de sobra no desktop) */}
        {item.excerpt && (
          <p className={`mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-600 ${featured ? 'md:mt-4 md:line-clamp-3 md:text-[15px] max-md:[@media(max-height:700px)]:hidden' : '[@media(max-height:700px)]:hidden'}`}>
            {item.excerpt}
          </p>
        )}

        <div className={`mt-auto flex items-center justify-between gap-3 pt-3 ${featured ? 'md:pt-6' : ''}`}>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <FaRegClock aria-hidden="true" className="text-[#00a859]" />
            {item.minutes} min de leitura
          </span>
          <span aria-hidden="true" className="inline-flex items-center gap-2 text-sm font-bold text-[#003f7f]">
            Ler notícia
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#003f7f]/8 transition-[background-color,color,translate] duration-300 group-hover:translate-x-0.5 group-hover:bg-[#003f7f] group-hover:text-white motion-reduce:transition-none">
              <FaArrowRight className="text-[11px]" />
            </span>
          </span>
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
  const sectionRef = React.useRef<HTMLElement>(null);

  // Cabeçalho e cartões entram ao rolar; reprocessa quando as notícias chegam
  useReveal(sectionRef, [isLoading, news.length]);
  useCardsMotion(sectionRef, [isLoading, news.length]);

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/noticias?limit=6');
        if (response.ok) {
          const data = await response.json();

          const mappedNews: NewsItem[] = data.slice(0, 6).map((item: { id: number; title: string; excerpt?: string | null; content?: string | null; date?: string | null; category?: string | null; author?: string | null; image?: string | null; campaigns?: NewsItem['campaign'] }, index: number) => ({
            id: item.id,
            title: item.title,
            excerpt: getExcerpt(item.excerpt, item.content),
            content: item.content || '',
            date: item.date || '',
            category: item.category || 'Notícias',
            color: COLORS[index % COLORS.length],
            author: item.author || 'CDL Ipirá',
            image: item.image || undefined,
            // ~200 palavras por minuto
            minutes: Math.max(1, Math.round(plainText(item.content).split(' ').length / 200)),
            campaign: item.campaigns ?? null,
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

  // Sem notícias, a seção some (nada de bloco vazio na home)
  if (!isLoading && news.length === 0) return null;

  // Até 2 notícias os cartões ficam mais largos no desktop (a vista nunca passa do total)
  const sizes = news.length <= 2 ? '(min-width: 768px) 50vw, 88vw' : '(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 46vw, (min-width: 640px) 62vw, 88vw';

  return (
    <section
      ref={sectionRef}
      aria-labelledby="noticias-titulo"
      aria-busy={isLoading || undefined}
      // Bloco névoa da home (borda reta entre as seções): ocupa a área útil da tela (janela - barra compacta - barra
      // inferior) com o conteúdo centrado. Janela muito baixa (celular deitado): altura natural.
      className="relative flex flex-col justify-center overflow-hidden bg-[#f4f8fc] py-(--scene-blend) [@media(min-height:560px)]:min-h-(--screen-fit)"
    >
      {/* Brilhos discretos de fundo: gradiente radial em vez de filter: blur (área grande sob o header de vidro) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(28rem_28rem_at_88%_30%,rgba(0,63,127,0.05),transparent_70%),radial-gradient(28rem_28rem_at_4%_72%,rgba(0,168,89,0.05),transparent_70%)]" />

      <div className="relative container mx-auto w-full px-4">
        <SectionCarousel
          label="Últimas notícias"
          itemName="notícia"
          header={
            <SectionHeading
              id="noticias-titulo"
              eyebrow={
                <>
                  <FaNewspaper aria-hidden="true" />
                  Últimas Notícias
                </>
              }
              eyebrowClass="bg-[#ffd000] text-[#003f7f]"
              title="Fique por Dentro"
              text="Novidades, campanhas e ações da CDL Ipirá para fortalecer o comércio da cidade."
            />
          }
          action={{ href: '/imprensa/noticias', label: 'Ver todas' }}
          prevLabel="Notícias anteriores"
          nextLabel="Próximas notícias"
          loading={isLoading}
          autoplay={7000}
          // Com o modal aberto o carrossel não anda (senão o card de origem sai de vista e o foco não volta para ele)
          paused={isModalOpen}
        >
          {news.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              featured={news.length === 1}
              sizes={sizes}
              onOpen={(n) => {
                setSelectedNews(n);
                setIsModalOpen(true);
              }}
            />
          ))}
        </SectionCarousel>
      </div>

      <NewsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} news={selectedNews} />
    </section>
  );
};

export default NewsCarousel;
