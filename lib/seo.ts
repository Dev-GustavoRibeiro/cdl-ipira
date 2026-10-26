/**
 * SEO do site: endereço público, metadata padrão das páginas e dados estruturados (schema.org) para o Google.
 * Os contatos vêm de navigation/navItems (mesma fonte do Header e do Footer).
 */

import type { Metadata } from 'next';
import { CONTACT } from '@/app/components/navigation/navItems';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cdlipira.com.br').replace(/\/+$/, '');
export const SITE_NAME = 'CDL Ipirá';
export const SITE_TITLE = 'CDL Ipirá - Câmara de Dirigentes Lojistas de Ipirá (BA)';
export const SITE_DESCRIPTION =
  'CDL Ipirá, a Câmara de Dirigentes Lojistas de Ipirá-BA: consulta SPC Brasil, certificado digital, balcão de empregos, campanhas e apoio ao comércio local.';
export const TITLE_TEMPLATE = `%s - ${SITE_NAME}`;

/** '/imprensa' ou URL externa -> URL absoluta do site. */
export const absoluteUrl = (path: string) => new URL(path, `${SITE_URL}/`).href;

// Arte fixa em app/opengraph-image.jpg (JPEG de ~140 KB: o WhatsApp some com a miniatura de imagens pesadas).
// Segmentos que definem openGraph perdem a imagem do arquivo (o merge é raso), por isso ela vai explícita aqui.
const DEFAULT_IMAGE = { url: '/opengraph-image.jpg', type: 'image/jpeg', width: 1200, height: 630, alt: SITE_TITLE };

// Deixa o Google mostrar foto grande e trecho completo (Discover e resultados de notícia)
const ROBOTS: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
};

/** Corta no último espaço antes do limite (resumo de notícia vindo do banco pode ser longo). */
export function clampText(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > 0 ? cut.slice(0, space) : cut).replace(/[\s,.;:–-]+$/, '')}…`;
}

interface PageSeo {
  /** Sem título: usa o título do site (página inicial) */
  title?: string;
  description: string;
  path: string;
  image?: string | null;
  /** Notícia: og:type article com datas */
  article?: { publishedTime?: string | null; modifiedTime?: string | null; section?: string | null };
  noindex?: boolean;
}

/** Metadata completo da rota: canonical, Open Graph e Twitter sempre juntos (o Next não mescla campos aninhados). */
export function pageMetadata({ title, description, path, image, article, noindex }: PageSeo): Metadata {
  const fullTitle = title ? TITLE_TEMPLATE.replace('%s', title) : SITE_TITLE;
  const desc = clampText(description);
  const images = image ? [{ url: image, alt: title || SITE_TITLE }] : [DEFAULT_IMAGE];
  const shared = { locale: 'pt_BR', siteName: SITE_NAME, url: path, description: desc, images };

  return {
    // default + template: as rotas filhas do segmento (ex.: /imprensa/noticias/[id]) mantêm o sufixo do site
    ...(title && { title: { default: title, template: TITLE_TEMPLATE } }),
    description: desc,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: true } : ROBOTS,
    openGraph: article
      ? {
          ...shared,
          type: 'article',
          title,
          publishedTime: article.publishedTime || undefined,
          modifiedTime: article.modifiedTime || undefined,
          section: article.section || undefined,
        }
      : { ...shared, type: 'website', title: fullTitle },
    twitter: { card: 'summary_large_image', title: fullTitle, description: desc, images },
  };
}

// ---------- Dados estruturados (JSON-LD) ----------

type JsonLdNode = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organizacao`;
const LOGO_URL = absoluteUrl('/icons/icon-512.png'); // quadrado e com fundo branco, como o Google pede para logo

/** Referência curta à CDL (autor e publisher). */
const orgRef = { '@type': 'Organization', '@id': ORG_ID, name: SITE_NAME, url: SITE_URL, logo: LOGO_URL };

// sameAs (perfis em redes sociais) fica de fora: o site ainda não tem links oficiais dos perfis
export const organizationJsonLd: JsonLdNode = {
  ...orgRef,
  legalName: CONTACT.razaoSocial,
  alternateName: ['Câmara de Dirigentes Lojistas de Ipirá', 'CDL de Ipirá'],
  description: SITE_DESCRIPTION,
  image: absoluteUrl('/cdl-ipira-sede.jpg'),
  email: CONTACT.email.label,
  telephone: CONTACT.phone.href.replace('tel:', ''),
  taxID: CONTACT.cnpj,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${CONTACT.address[0]}, Centro`,
    addressLocality: 'Ipirá',
    addressRegion: 'BA',
    postalCode: CONTACT.cep,
    addressCountry: 'BR',
  },
  areaServed: { '@type': 'City', name: 'Ipirá' },
};

export const websiteJsonLd: JsonLdNode = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#site`,
  url: SITE_URL,
  name: SITE_NAME,
  alternateName: 'Câmara de Dirigentes Lojistas de Ipirá',
  inLanguage: 'pt-BR',
  publisher: { '@id': ORG_ID },
  // /pesquisa lê o ?q= da URL
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/pesquisa?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

/** Trilha a partir do Início: breadcrumbJsonLd(['Notícias', '/imprensa/noticias'], [titulo, caminho]). */
export const breadcrumbJsonLd = (...trail: [name: string, path: string][]): JsonLdNode => ({
  '@type': 'BreadcrumbList',
  itemListElement: [['Início', '/'] as const, ...trail].map(([name, path], index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    item: absoluteUrl(path),
  })),
});

export interface NewsSeoRow {
  id: number;
  title: string;
  image: string | null;
  date: string | null;
  updated_at?: string | null;
  category: string | null;
  author: string | null;
}

export const newsArticleJsonLd = (news: NewsSeoRow, description: string, path: string): JsonLdNode => ({
  '@type': 'NewsArticle',
  headline: clampText(news.title, 110),
  description,
  image: [news.image || absoluteUrl(DEFAULT_IMAGE.url)],
  datePublished: news.date || undefined,
  dateModified: news.updated_at || news.date || undefined,
  // Autor em texto livre no painel: nome de pessoa, ou a própria CDL
  author: news.author && news.author !== SITE_NAME ? { '@type': 'Person', name: news.author } : orgRef,
  publisher: orgRef,
  mainEntityOfPage: absoluteUrl(path),
  articleSection: news.category || undefined,
  inLanguage: 'pt-BR',
});
