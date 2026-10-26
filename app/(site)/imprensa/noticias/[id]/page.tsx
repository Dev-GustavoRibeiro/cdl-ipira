import React, { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanitizeNewsHtml } from '@/lib/sanitize';
import { supabase } from '@/lib/supabase';
import {
  FaArrowLeft,
  FaArrowRight,
  FaBullhorn,
  FaFacebookF,
  FaLinkedinIn,
  FaNewspaper,
  FaRegCalendarAlt,
  FaRegClock,
  FaTwitter,
  FaUser,
  FaWhatsapp,
} from 'react-icons/fa';
import JsonLd from '@/app/components/seo/JsonLd';
import { formatDateBR, formatDateLong } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import { breadcrumbJsonLd, newsArticleJsonLd, pageMetadata, SITE_URL } from '@/lib/seo';

// Regera a página no máximo a cada 5 minutos (novas notícias/edições aparecem sem novo deploy)
export const revalidate = 300;

const DEFAULT_COLOR = 'from-[#003f7f] to-[#0066cc]';

// Tipografia do corpo (sem plugin de typography): 18px, entrelinha 1.8 e estilos para o HTML do editor
const BODY_CLASS = [
  // 60ch no Inter dá ~70 caracteres por linha
  'text-lg leading-[1.8] text-gray-800 [&>*]:max-w-[60ch]',
  '[&_p]:mb-6 [&_p:last-child]:mb-0',
  '[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-[#003f7f] sm:[&_h2]:text-3xl',
  '[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#003f7f]',
  '[&_a]:font-semibold [&_a]:text-[#0052a3] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[#003f7f]',
  '[&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_li]:marker:text-[#00a859]',
  '[&_strong]:font-bold [&_strong]:text-gray-900',
  '[&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-[#00a859] [&_blockquote]:pl-6 [&_blockquote]:text-xl [&_blockquote]:italic [&_blockquote]:text-gray-600',
  '[&_img]:my-8 [&_img]:h-auto [&_img]:rounded-2xl [&_figcaption]:mt-2 [&_figcaption]:text-sm [&_figcaption]:text-gray-500',
].join(' ');

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
  updated_at: string | null;
  campaign_id: number | null;
  /** Campanha ligada; o RLS devolve null para campanha desativada */
  campaigns: { slug: string; title: string } | null;
}

const NEWS_COLUMNS = 'id, title, excerpt, content, image, date, category, color, author, updated_at, campaign_id, campaigns(slug, title)';

// cache(): generateMetadata e a página compartilham a mesma consulta
const getNews = cache(async (rawId: string): Promise<News | null> => {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return null;

  const { data, error } = await supabase
    .from('news')
    .select(NEWS_COLUMNS)
    .eq('id', id)
    .eq('is_published', true)
    // Sem tipos gerados, o embed viria tipado como lista; para muitos-para-um o PostgREST devolve um objeto
    .maybeSingle<News>();

  if (error) {
    console.error('Erro ao carregar notícia:', error.message);
    return null;
  }
  return data;
});

/** "Leia também": 3 notícias, primeiro as da mesma campanha, depois as da mesma categoria, completando com as mais recentes. */
async function getRelatedNews(news: News): Promise<News[]> {
  const recent = (column?: 'campaign_id' | 'category', value?: number | string) => {
    const query = supabase.from('news').select(NEWS_COLUMNS).eq('is_published', true).neq('id', news.id);
    return (column ? query.eq(column, value) : query)
      .order('date', { ascending: false, nullsFirst: false })
      .limit(3)
      .overrideTypes<News[], { merge: false }>();
  };
  const results = await Promise.all([
    news.campaign_id ? recent('campaign_id', news.campaign_id) : null,
    news.category ? recent('category', news.category) : null,
    recent(),
  ]);

  const related = new Map<number, News>();
  for (const result of results) {
    if (result?.error) console.error('Erro ao carregar notícias relacionadas:', result.error.message);
    for (const item of result?.data || []) if (related.size < 3) related.set(item.id, item);
  }
  return [...related.values()];
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

  return pageMetadata({
    title: news.title,
    description: getSummary(news),
    path: `/imprensa/noticias/${news.id}`,
    image: news.image,
    article: { publishedTime: news.date, modifiedTime: news.updated_at, section: news.category },
  });
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

  const lead = news.excerpt?.trim() || '';
  const shareLinks = [
    { label: 'Facebook', icon: FaFacebookF, href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { label: 'Twitter', icon: FaTwitter, href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}` },
    { label: 'LinkedIn', icon: FaLinkedinIn, href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
    { label: 'WhatsApp', icon: FaWhatsapp, href: `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}` },
  ];

  const path = `/imprensa/noticias/${news.id}`;
  return (
    <>
      <article>
        {/* Capa: foto larga com gradiente, trilha de navegação, categoria, título e dados da notícia */}
        <header className={`relative isolate overflow-hidden bg-linear-to-br ${color}`}>
          {news.image && (
            <Image
              src={news.image}
              alt=""
              fill
              priority
              sizes="100vw"
              // O otimizador só aceita hosts do next.config; URL colada no admin vai direto
              unoptimized={!isOptimizableImage(news.image)}
              className="-z-10 object-cover"
            />
          )}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-[#001a3d] via-[#001a3d]/70 to-[#001a3d]/25" />
          {/* Faixa escura no topo: a trilha de navegação fica legível sobre fotos claras */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-28 bg-linear-to-b from-[#001a3d]/70 to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mesma largura da coluna do texto: capa e corpo alinhados à esquerda */}
            <div className="mx-auto flex min-h-[26rem] max-w-3xl flex-col pt-6 pb-10 sm:min-h-[30rem] sm:pb-14 md:min-h-[34rem] md:pb-16">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-white/90 sm:gap-2 sm:text-sm">
                  <li>
                    <Link href="/" className="transition-colors hover:text-[#ffd000]">Início</Link>
                  </li>
                  <li aria-hidden="true" className="text-white/40">/</li>
                  <li>
                    <Link href="/imprensa/noticias" className="transition-colors hover:text-[#ffd000]">Notícias</Link>
                  </li>
                  <li aria-hidden="true" className="text-white/40">/</li>
                  <li aria-current="page" className="max-w-[18ch] truncate font-semibold text-white sm:max-w-xs">
                    {news.title}
                  </li>
                </ol>
              </nav>

              <div className="mt-auto pt-16 animate-blur-fade-in">
                <div className="flex flex-wrap items-center gap-2">
                  {news.category && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#003f7f] shadow-sm">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#003f7f]" />
                      {news.category}
                    </span>
                  )}
                  {/* Notícia de campanha: atalho para a página dela (regulamento, lojas, sorteios) */}
                  {news.campaigns && (
                    <Link
                      href={`/imprensa/campanhas/${news.campaigns.slug}`}
                      className="group inline-flex min-h-8 items-center gap-2 rounded-full bg-white/12 px-4 py-1.5 text-left text-xs leading-tight font-bold text-white ring-1 ring-white/35 backdrop-blur-sm transition-[background-color,color] duration-200 hover:bg-white hover:text-[#003f7f]"
                    >
                      <FaBullhorn aria-hidden="true" className="h-3 w-3 shrink-0 text-[#ffd000] transition-colors group-hover:text-[#003f7f]" />
                      Campanha {news.campaigns.title}
                      <FaArrowRight aria-hidden="true" className="h-2.5 w-2.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </Link>
                  )}
                </div>
                <h1 className="mt-4 text-3xl font-black leading-[1.08] tracking-tight text-balance text-white drop-shadow-[0_2px_12px_rgba(0,26,61,0.5)] sm:text-4xl md:text-5xl lg:text-[3.5rem]">
                  {news.title}
                </h1>
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/85 sm:text-base">
                  <span className="inline-flex items-center gap-2 font-semibold text-white">
                    <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
                      <FaUser className="h-3 w-3" />
                    </span>
                    {author}
                  </span>
                  {formattedDate && (
                    <span className="inline-flex items-center gap-2">
                      <FaRegCalendarAlt aria-hidden="true" className="h-3.5 w-3.5 text-[#ffd000]" />
                      <time dateTime={news.date?.slice(0, 10)}>{formattedDate}</time>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2">
                    <FaRegClock aria-hidden="true" className="h-3.5 w-3.5 text-[#ffd000]" />
                    {readTime} min de leitura
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Corpo: coluna estreita, 18px e entrelinha generosa */}
        <div className="bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl py-10 sm:py-14 md:py-16">
              {lead && (
                <p className="mb-10 border-l-4 border-[#ffd000] pl-5 text-xl font-medium leading-relaxed text-gray-700 sm:pl-6 sm:text-2xl sm:leading-relaxed">
                  {lead}
                </p>
              )}

              {/* Conteúdo pode vir em HTML (sanitizado) ou texto puro (um parágrafo por quebra de linha) */}
              {hasHtml(content) ? (
                <div className={BODY_CLASS} dangerouslySetInnerHTML={{ __html: sanitizeNewsHtml(content) }} />
              ) : (
                <div className={BODY_CLASS}>
                  {content.split('\n').map((paragraph) => paragraph.trim()).filter(Boolean).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}

              {/* Compartilhar */}
              <div className="mt-12 flex flex-col gap-4 border-t border-gray-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-black tracking-tight text-[#003f7f]">Compartilhe esta notícia</p>
                <ul className="flex flex-wrap gap-2.5">
                  {shareLinks.map(({ label, icon: Icon, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Compartilhar no ${label} (abre em nova aba)`}
                        title={`Compartilhar no ${label}`}
                        className={`grid h-11 w-11 place-items-center rounded-full bg-[#003f7f]/5 text-[#003f7f] ring-1 ring-[#003f7f]/10 transition-[background-color,color,translate,scale] duration-200 hover:-translate-y-0.5 hover:text-white active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                          label === 'WhatsApp' ? 'hover:bg-[#00a859]' : 'hover:bg-[#003f7f]'
                        }`}
                      >
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/imprensa/noticias"
                className="group mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#003f7f] transition-colors hover:text-[#0052a3] sm:text-base"
              >
                <FaArrowLeft aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none" />
                Voltar para Notícias
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Leia também */}
      {relatedNews.length > 0 && (
        <section aria-labelledby="leia-tambem-titulo" className="relative overflow-hidden bg-gray-50 py-16 md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-[#003f7f]/5 blur-3xl" />
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#003f7f] shadow-sm">
                  <FaNewspaper aria-hidden="true" className="h-3.5 w-3.5" />
                  Mais notícias
                </span>
                <h2 id="leia-tambem-titulo" className="mt-4 text-3xl font-black leading-[1.08] tracking-tight text-balance text-[#003f7f] sm:text-4xl lg:text-5xl">
                  Leia também
                </h2>
                <div aria-hidden="true" className="mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
              </div>
              <Link
                href="/imprensa/noticias"
                className="group inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#003f7f] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#0052a3] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:self-auto"
              >
                Ver todas
                <FaArrowRight aria-hidden="true" className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
              </Link>
            </div>

            <div className="cards-grid gap-5 sm:gap-6 md:gap-8">
              {relatedNews.map((item, index) => (
                <article
                  key={item.id}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-gray-100 shadow-[0_20px_50px_-24px_rgba(0,63,127,0.4)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(0,63,127,0.5)] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#003f7f] motion-reduce:transition-none motion-reduce:hover:translate-y-0 animate-scale-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className={`relative aspect-16/10 shrink-0 overflow-hidden bg-linear-to-br ${item.color || DEFAULT_COLOR}`}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                        unoptimized={!isOptimizableImage(item.image)}
                        className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    ) : (
                      <FaNewspaper aria-hidden="true" className="absolute inset-0 m-auto h-14 w-14 text-white/30" />
                    )}
                    {item.category && (
                      <span className="absolute top-4 left-4 flex max-w-[70%] items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-[#003f7f] shadow-lg backdrop-blur-sm">
                        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a859]" />
                        <span className="truncate">{item.category}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex grow flex-col p-6">
                    <h3 className="text-lg font-bold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-[#003f7f]">
                      <Link
                        href={`/imprensa/noticias/${item.id}`}
                        className="after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:shadow-none! focus-visible:outline-none!"
                      >
                        <span className="line-clamp-2">{item.title}</span>
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">{getSummary(item, 120)}</p>
                    <div className="mt-auto pt-6">
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <time dateTime={item.date?.slice(0, 10)} className="text-xs font-semibold text-gray-500">
                          {formatDateBR(item.date)}
                        </time>
                        <span aria-hidden="true" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#003f7f] transition-[gap] duration-300 group-hover:gap-2.5">
                          Ler notícia
                          <FaArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* NewsArticle: data, foto e autor para os resultados de notícia do Google */}
      <JsonLd
        data={[
          newsArticleJsonLd(news, getSummary(news), path),
          breadcrumbJsonLd(['Notícias', '/imprensa/noticias'], [news.title, path]),
        ]}
      />
    </>
  );
}
