import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
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

  // ==================== CSRF ====================

  if (
    isMutationMethod(request.method) &&
    pathname !== LOGIN_API &&
    CSRF_PROTECTED_PATHS.some((path) => matchesPath(pathname, path))
  ) {
    if (!(await verifyCSRFToken(request))) {
      console.warn(`[SECURITY] CSRF inválido: IP=${ip}, path=${pathname}`);
      return addSecurityHeaders(NextResponse.json({ error: 'Token CSRF inválido' }, { status: 403 }));
    }
  }

  const isAdminApi = matchesPath(pathname, '/api/admin');
  const isAdminPage = matchesPath(pathname, '/admin');

  if (!isAdminApi && !isAdminPage) {
    return addSecurityHeaders(NextResponse.next());
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
    return isAdminApi
      ? withSession(NextResponse.json({ error: 'Não autorizado' }, { status: 401 }))
      : withSession(NextResponse.redirect(new URL(LOGIN_PAGE, request.url)));
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
