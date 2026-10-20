/**
 * next/image só otimiza hosts de images.remotePatterns (Storage do projeto e miniaturas do YouTube).
 * URLs coladas no painel podem vir de qualquer site: essas vão com unoptimized, em vez de quebrar a página.
 */

const OPTIMIZABLE_HOSTS = new Set(
  [
    (() => {
      try {
        return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').host;
      } catch {
        return '';
      }
    })(),
    'i.ytimg.com',
    'img.youtube.com',
  ].filter(Boolean)
);

export function isOptimizableImage(src: string | null | undefined): boolean {
  if (!src) return false;
  if (src.startsWith('/') && !src.startsWith('//')) return true;
  try {
    const url = new URL(src);
    return url.protocol === 'https:' && OPTIMIZABLE_HOSTS.has(url.host);
  } catch {
    return false;
  }
}
