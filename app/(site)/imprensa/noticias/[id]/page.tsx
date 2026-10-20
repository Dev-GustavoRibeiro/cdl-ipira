import React, { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { supabase } from '@/lib/supabase';
import { FaWhatsapp } from 'react-icons/fa';
import { formatDateBR, formatDateLong } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import { cardClass, staggerDelay } from '../components/LoadStates';

// Regera a página no máximo a cada 5 minutos (novas notícias/edições aparecem sem novo deploy)
export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cdlipira.com.br';
const DEFAULT_COLOR = 'from-[#003f7f] to-[#0066cc]';

interface News {
  id: number;
  title: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  date: string | null;
  category: string | null;
  color: string | null;
  author: string | null;
}

const NEWS_COLUMNS = 'id, title, excerpt, content, image, date, category, color, author';

// cache(): generateMetadata e a página compartilham a mesma consulta
const getNews = cache(async (rawId: string): Promise<News | null> => {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return null;

  const { data, error } = await supabase
    .from('news')
    .select(NEWS_COLUMNS)
    .eq('id', id)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    console.error('Erro ao carregar notícia:', error.message);
    return null;
  }
  return data;
});

async function getRelatedNews(news: News): Promise<News[]> {
  if (!news.category) return [];
  const { data } = await supabase
    .from('news')
    .select(NEWS_COLUMNS)
    .eq('is_published', true)
    .eq('category', news.category)
    .neq('id', news.id)
    .order('date', { ascending: false })
    .limit(3);
  return data || [];
}

const hasHtml = (text: string) => /<[a-z][\s\S]*>/i.test(text);
const toPlainText = (text: string) => text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

/** Resumo para cards/SEO: excerpt ou início do conteúdo em texto puro. */
function getSummary(news: News, maxLength = 160): string {
  if (news.excerpt?.trim()) return news.excerpt.trim();
  const text = toPlainText(news.content || '');
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}...` : text;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const news = await getNews(id);

  if (!news) {
    return {
      title: 'Notícia não encontrada',
    };
  }

  const description = getSummary(news);
  return {
    title: news.title,
    description,
    alternates: { canonical: `/imprensa/noticias/${news.id}` },
    openGraph: {
      type: 'article',
      title: news.title,
      description,
      url: `/imprensa/noticias/${news.id}`,
      publishedTime: news.date || undefined,
      images: news.image ? [news.image] : undefined,
    },
  };
}

export default async function NoticiaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const news = await getNews(id);

  if (!news) {
    notFound();
  }

  const relatedNews = await getRelatedNews(news);
  const content = news.content || '';
  const plainContent = toPlainText(content);
  const readTime = Math.max(1, Math.round(plainContent.split(' ').filter(Boolean).length / 200));
  const color = news.color || DEFAULT_COLOR;
  const author = news.author || 'CDL Ipirá';
  const formattedDate = formatDateLong(news.date);

  // Links de compartilhamento com a URL pública da notícia
  const shareUrl = encodeURIComponent(`${SITE_URL}/imprensa/noticias/${news.id}`);
  const shareText = encodeURIComponent(news.title);

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-[#003f7f] text-white py-2.5 sm:py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm" aria-label="Breadcrumb">
            <Link 
              href="/" 
              className="hover:text-[#ffd000] transition-colors flex items-center gap-1 group"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-[-2px] transition-transform" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Início</span>
            </Link>
            <span className="text-white/40">/</span>
            <Link 
              href="/imprensa/noticias" 
              className="hover:text-[#ffd000] transition-colors"
            >
              Notícias
            </Link>
            <span className="text-white/40">/</span>
            <span aria-current="page" className="text-white font-semibold line-clamp-1">{news.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
        <div className={`absolute inset-0 bg-linear-to-br ${color} opacity-90`}>
          {news.image && (
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              // O otimizador só aceita hosts do next.config; URL colada no admin vai direto
              unoptimized={!isOptimizableImage(news.image)}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent"></div>
        
        {/* Badge categoria */}
        {news.category && (
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-[#003f7f] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-black shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00a859] rounded-full"></span>
            {news.category}
          </span>
        </div>
        )}
      </section>

      {/* Main Content */}
      <article className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Coluna de leitura mais estreita: linhas longas demais cansam a leitura */}
          <div className="max-w-3xl mx-auto">
            {/* Header do Artigo */}
            <header className="mb-6 sm:mb-8 animate-blur-fade-in">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#003f7f] mb-4 sm:mb-6 leading-[1.1]">
                {news.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-semibold">{author}</span>
                </div>
                {formattedDate && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={news.date || undefined}>{formattedDate}</time>
                </div>
                )}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{readTime} min de leitura</span>
                </div>
              </div>

              <div className="h-1.5 w-24 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full" aria-hidden="true"></div>
            </header>

            {/* Conteúdo do Artigo */}
            {/* Conteúdo pode vir em HTML (sanitizado) ou texto puro (um parágrafo por quebra de linha) */}
            {hasHtml(content) ? (
              <div 
                className="prose max-w-none md:text-[17px] mb-8 sm:mb-12 animate-blur-fade-in"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
                style={{
                  lineHeight: '1.8',
                }}
              />
            ) : (
              <div 
                className="prose max-w-none md:text-[17px] mb-8 sm:mb-12 animate-blur-fade-in"
                style={{
                  lineHeight: '1.8',
                }}
              >
                {content.split('\n').map((paragraph) => paragraph.trim()).filter(Boolean).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}

            {/* Share Buttons */}
            <div className="border-t border-gray-200 pt-6 sm:pt-8 mb-8 sm:mb-12">
              <h3 className="text-lg sm:text-xl font-bold text-[#003f7f] mb-4">Compartilhar:</h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Compartilhar no Facebook"
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#1877f2] text-white rounded-full font-bold hover:bg-[#166fe5] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 active:scale-[0.98] text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Compartilhar no Twitter"
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#1da1f2] text-white rounded-full font-bold hover:bg-[#1a91da] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 active:scale-[0.98] text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Compartilhar no LinkedIn"
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#0077b5] text-white rounded-full font-bold hover:bg-[#006399] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 active:scale-[0.98] text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Compartilhar no WhatsApp"
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#00a859] text-white rounded-full font-bold hover:bg-[#008f4d] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 active:scale-[0.98] text-sm sm:text-base"
                >
                  <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Botão Voltar */}
            <div className="mb-8 sm:mb-12">
              <Link
                href="/imprensa/noticias"
                className="inline-flex items-center gap-2 text-[#003f7f] font-bold hover:text-[#0066cc] transition-colors group text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Voltar para Notícias
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Notícias Relacionadas */}
      {relatedNews.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-black tracking-[-0.015em] text-[#003f7f] mb-4 text-center">
                Notícias Relacionadas
              </h2>
              <div className="h-1.5 w-24 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-8 sm:mb-10" aria-hidden="true"></div>
              <div className="cards-grid gap-5 sm:gap-6 md:gap-8">
                {relatedNews.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/imprensa/noticias/${item.id}`}
                    className={cardClass}
                    style={staggerDelay(index)}
                  >
                    <div className={`relative h-44 sm:h-52 bg-linear-to-br ${item.color || DEFAULT_COLOR} overflow-hidden shrink-0`}>
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                          unoptimized={!isOptimizableImage(item.image)}
                          className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      )}
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                        <span className="bg-white/95 backdrop-blur-sm text-[#003f7f] px-3 py-1.5 rounded-full text-[11px] font-black shadow-lg">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 sm:p-6 flex flex-col grow">
                      <h3 className="text-lg sm:text-xl font-extrabold tracking-[-0.015em] text-gray-900 mb-2 group-hover:text-[#003f7f] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">
                        {getSummary(item, 120)}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">{formatDateBR(item.date)}</span>
                        <span className="text-[#00a859] font-bold text-xs sm:text-sm group-hover:gap-2 transition-all inline-flex items-center gap-1">
                          Ler
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

