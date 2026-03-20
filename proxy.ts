import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateAdminSession, verifyCSRFToken, addSecurityHeaders, checkRateLimit, getClientIP } from '@/lib/security';

const CSRF_PROTECTED_PATHS = [
  '/api/admin',
  '/api/upload',
  '/api/hero',
  '/api/parceiros',
  '/api/setup-storage',
];

function isMutationMethod(method: string): boolean {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
}

function requiresCSRFProtection(pathname: string): boolean {
  return CSRF_PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

// ==================== PROXY PRINCIPAL (Next.js 16+) ====================

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);

  // ==================== PROTEÇÃO DE RATE LIMITING ====================

  // Rate limiting para autenticação (mais restritivo)
  if (pathname === '/api/admin/auth') {
    const rateLimitResponse = checkRateLimit(request, 'auth');
    if (rateLimitResponse) {
      console.warn(`[SECURITY] Rate limit auth excedido: IP=${ip}`);
      return addSecurityHeaders(rateLimitResponse);
    }
  }

  // Rate limiting para upload
  if (pathname === '/api/upload') {
    const rateLimitResponse = checkRateLimit(request, 'upload');
    if (rateLimitResponse) {
      console.warn(`[SECURITY] Rate limit upload excedido: IP=${ip}`);
      return addSecurityHeaders(rateLimitResponse);
    }
  }

  // Rate limiting para APIs admin (exceto auth que já tem rate limit específico)
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/auth') {
    const rateLimitResponse = checkRateLimit(request, 'admin');
    if (rateLimitResponse) {
      console.warn(`[SECURITY] Rate limit admin excedido: IP=${ip}`);
      return addSecurityHeaders(rateLimitResponse);
    }
  }

  // Rate limiting para APIs públicas
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/admin')) {
    const rateLimitResponse = checkRateLimit(request, 'public');
    if (rateLimitResponse) {
      console.warn(`[SECURITY] Rate limit API excedido: IP=${ip}`);
      return addSecurityHeaders(rateLimitResponse);
    }
  }

  // ==================== AUTENTICAÇÃO ====================

  // Ignorar rota de login/logout (não requer autenticação)
  if (pathname === '/admin/login' || pathname === '/api/admin/auth') {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  if (isMutationMethod(request.method) && requiresCSRFProtection(pathname)) {
    const csrfValid = await verifyCSRFToken(request);
    if (!csrfValid) {
      console.warn(`[SECURITY] CSRF inválido: IP=${ip}, path=${pathname}`);
      const response = NextResponse.json(
        { error: 'Token CSRF inválido' },
        { status: 403 }
      );
      return addSecurityHeaders(response);
    }
  }

  // Proteção para rotas de API Administrativa
  if (pathname.startsWith('/api/admin')) {
    const session = await validateAdminSession(request);

    if (!session.valid) {
      console.warn(`[SECURITY] Sessão inválida em API admin: IP=${ip}, erro=${session.error}`);
      const response = NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
      return addSecurityHeaders(response);
    }

    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Proteção para rotas de Interface Administrativa
  if (pathname.startsWith('/admin')) {
    const session = await validateAdminSession(request);

    if (!session.valid) {
      console.warn(`[SECURITY] Sessão inválida na interface: IP=${ip}, erro=${session.error}`);
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_session');
      return addSecurityHeaders(response);
    }

    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Adicionar headers de segurança à resposta para outras rotas
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*'
  ],
};


