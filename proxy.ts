import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateAdminSession, addSecurityHeaders, checkRateLimit, getClientIP } from '@/lib/security';

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
  if (pathname === '/admin/login' || pathname === '/api/admin/auth' || pathname === '/api/admin/logout') {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
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


