import DOMPurify from 'isomorphic-dompurify';

/**
 * HTML das notícias (vem do painel): só o que o estilo do corpo da notícia formata. Fora ficam style, <style>,
 * formulários, iframes e afins, que mesmo sem script permitiriam pichar a página ou sobrepor uma tela falsa ao site.
 * Usado na página da notícia e no modal da home, para os dois mostrarem o mesmo conteúdo.
 */
const NEWS_HTML_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'h2', 'h3', 'a', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'blockquote', 'img', 'figure', 'figcaption'],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
  ALLOW_DATA_ATTR: false,
};

export function sanitizeNewsHtml(html: string): string {
  return DOMPurify.sanitize(html, NEWS_HTML_CONFIG);
}
