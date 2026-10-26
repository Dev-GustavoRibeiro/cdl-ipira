import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isAuthRetryableFetchError } from '@supabase/supabase-js';
import {
  verifyCSRFToken,
  generateCSRFToken,
  addSecurityHeaders,
  checkRateLimit,
  getClientIP,
  CSRF_COOKIE,
  CSRF_COOKIE_OPTIONS,
} from '@/lib/security';
import { supabaseUrl, supabasePublicKey, AUTH_COOKIE_OPTIONS, toAdminUser, isSessionExpired } from '@/lib/supabase-server';

const LOGIN_PAGE = '/admin/login';
const LOGIN_API = '/api/admin/auth';

const CSRF_PROTECTED_PATHS = ['/api/admin', '/api/upload'];

function isMutationMethod(method: string): boolean {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
}

function matchesPath(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`);
}

// Leituras públicas de conteúdo (notícias, eventos, busca...): cache curto na CDN da Vercel contra rajadas.
// Nenhuma leitura pública depende de quem pede; uma que dependa precisa ficar fora deste cache.
const PUBLIC_API_CACHE = 'public, s-maxage=60, stale-while-revalidate=300';

/**
 * Envio público (formulários e login) só como JSON e de uma página do próprio site. Barra o <form> de outro site
 * (text/plain vira JSON válido no request.json()) e o fetch de outra origem, que usaria o navegador dos visitantes
 * dele para fugir do limite por IP. Navegadores sempre mandam Origin em POST.
 */
function isSameSiteJson(request: NextRequest): boolean {
  const contentType = request.headers.get('content-type') ?? '';
  const fetchSite = request.headers.get('sec-fetch-site');
  const origin = request.headers.get('origin');
  if (!/^application\/json\s*(;|$)/i.test(contentType) || !origin) return false;
  if (fetchSite && fetchSite !== 'same-origin') return false;
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

// ==================== PROXY PRINCIPAL (Next.js 16+) ====================

export async function proxy(request: NextRequest) {
  const ip = getClientIP(request);

  // O roteador decodifica o caminho (/api/%61dmin -> /api/admin): as checagens precisam ver o mesmo caminho
  let pathname: string;
  try {
    pathname = decodeURIComponent(request.nextUrl.pathname);
  } catch {
    return addSecurityHeaders(NextResponse.json({ error: 'Requisição inválida' }, { status: 400 }));
  }

  // ==================== PROTEÇÃO DE RATE LIMITING ====================

  const rateLimitType =
    pathname === LOGIN_API ? 'auth'
    : pathname === '/api/upload' ? 'upload'
    : pathname.startsWith('/api/admin') ? 'admin'
    // Leituras públicas não entram: várias pessoas na mesma rede (CGNAT da operadora) dividem o IP
    : pathname.startsWith('/api/') && isMutationMethod(request.method) ? 'public'
    : null;

  if (rateLimitType) {
    const rateLimitResponse = checkRateLimit(request, rateLimitType);
    if (rateLimitResponse) {
      console.warn(`[SECURITY] Rate limit ${rateLimitType} excedido: IP=${ip}`);
      return addSecurityHeaders(rateLimitResponse);
    }
  }

  const isMutation = isMutationMethod(request.method);
  const isPanelWrite =
    isMutation && pathname !== LOGIN_API && CSRF_PROTECTED_PATHS.some((path) => matchesPath(pathname, path));

  // ==================== CSRF ====================

  if (isPanelWrite && !(await verifyCSRFToken(request))) {
    console.warn(`[SECURITY] CSRF inválido: IP=${ip}, path=${pathname}`);
    return addSecurityHeaders(NextResponse.json({ error: 'Token CSRF inválido' }, { status: 403 }));
  }

  // ==================== ENVIOS PÚBLICOS (formulários e login) ====================

  if (isMutation && !isPanelWrite && pathname.startsWith('/api/') && !isSameSiteJson(request)) {
    console.warn(`[SECURITY] Envio recusado (origem ou formato): IP=${ip}, path=${pathname}`);
    return addSecurityHeaders(NextResponse.json({ error: 'Requisição recusada.' }, { status: 403 }));
  }

  const isAdminApi = matchesPath(pathname, '/api/admin');
  const isAdminPage = matchesPath(pathname, '/admin');
  const isUpload = matchesPath(pathname, '/api/upload');

  if (!isAdminApi && !isAdminPage && !isUpload) {
    const response = addSecurityHeaders(NextResponse.next());
    if (request.method === 'GET' || request.method === 'HEAD') {
      response.headers.set('Cache-Control', PUBLIC_API_CACHE);
      response.headers.delete('Pragma');
    }
    return response;
  }

  // ==================== AUTENTICAÇÃO (Supabase Auth) ====================

  // Renova a sessão e repassa os cookies atualizados para a rota e para o navegador
  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabasePublicKey, {
    cookieOptions: AUTH_COOKIE_OPTIONS,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Não colocar código entre createServerClient e getClaims (recomendação do Supabase)
  const { data } = await supabase.auth.getClaims();
  let admin = toAdminUser(data?.claims);

  // Login com mais de 4h: encerra a sessão (os cookies limpos seguem no redirect/401 abaixo)
  if (admin && isSessionExpired(data?.claims)) {
    await supabase.auth.signOut({ scope: 'local' });
    admin = null;
  }

  // Escritas do painel e do upload perguntam ao servidor do Supabase se a sessão ainda vale: getClaims só confere a
  // assinatura, então logout em outro aparelho, sessão revogada ou papel retirado só pesariam quando o token expirasse
  // (até 1h). Leituras seguem só com getClaims.
  if (admin && isPanelWrite) {
    const { data: fresh, error } = await supabase.auth.getUser();
    if (toAdminUser(fresh.user)?.id !== admin.id) {
      // Sessão encerrada: limpa os cookies (senão o painel continuaria "logado" só para leitura).
      // Falha de rede só recusa esta escrita.
      if (!isAuthRetryableFetchError(error)) await supabase.auth.signOut({ scope: 'local' });
      admin = null;
    }
  }

  // Respostas próprias (redirect/401) precisam levar os cookies renovados
  const withSession = (res: NextResponse) => {
    response.cookies.getAll().forEach((cookie) => res.cookies.set(cookie));
    return addSecurityHeaders(res);
  };

  if (isAdminPage) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  if (pathname === LOGIN_API) {
    return addSecurityHeaders(response);
  }

  if (pathname === LOGIN_PAGE) {
    return admin
      ? withSession(NextResponse.redirect(new URL('/admin/dashboard', request.url)))
      : addSecurityHeaders(response);
  }

  if (!admin) {
    console.warn(`[SECURITY] Acesso admin sem sessão válida: IP=${ip}, path=${pathname}`);
    return isAdminPage
      ? withSession(NextResponse.redirect(new URL(LOGIN_PAGE, request.url)))
      : withSession(NextResponse.json({ error: 'Não autorizado' }, { status: 401 }));
  }

  // Garante o token CSRF usado pelas mutações do painel
  if (!request.cookies.get(CSRF_COOKIE)) {
    response.cookies.set(CSRF_COOKIE, generateCSRFToken(), CSRF_COOKIE_OPTIONS);
  }

  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*'
  ],
};
