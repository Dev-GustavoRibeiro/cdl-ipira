import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ==================== RATE LIMITING (em memória) ====================
// Em produção, use Redis ou outro store distribuído

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMITS = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5, blockMs: 30 * 60 * 1000 },
  api: { windowMs: 60 * 1000, maxRequests: 100, blockMs: 5 * 60 * 1000 },
  upload: { windowMs: 60 * 1000, maxRequests: 10, blockMs: 10 * 60 * 1000 },
};

function getClientIP(request: NextRequest): string {
  const cfIP = request.headers.get('cf-connecting-ip');
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return cfIP || (forwarded ? forwarded.split(',')[0].trim() : null) || realIP || 'unknown';
}

function checkRateLimit(
  ip: string,
  type: keyof typeof RATE_LIMITS
): { blocked: boolean; retryAfter?: number } {
  const config = RATE_LIMITS[type];
  const key = `${type}:${ip}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  // Verificar se está bloqueado
  if (entry?.blockedUntil && entry.blockedUntil > now) {
    return { blocked: true, retryAfter: Math.ceil((entry.blockedUntil - now) / 1000) };
  }

  // Resetar se a janela expirou
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { blocked: false };
  }

  // Incrementar e verificar
  entry.count++;
  if (entry.count > config.maxRequests) {
    entry.blockedUntil = now + config.blockMs;
    rateLimitStore.set(key, entry);
    return { blocked: true, retryAfter: Math.ceil(config.blockMs / 1000) };
  }

  rateLimitStore.set(key, entry);
  return { blocked: false };
}

// Limpar entradas antigas periodicamente
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // A cada minuto

// ==================== MIDDLEWARE PRINCIPAL ====================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);
  
  // Headers de segurança para todas as respostas
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  // ==================== PROTEÇÃO DE RATE LIMITING ====================
  
  // Rate limiting para autenticação (mais restritivo)
  if (pathname === '/api/admin/auth') {
    const { blocked, retryAfter } = checkRateLimit(ip, 'auth');
    if (blocked) {
      console.warn(`[SECURITY] Rate limit auth excedido: IP=${ip}`);
      return NextResponse.json(
        { error: 'Muitas tentativas de login. Tente novamente mais tarde.', retryAfter },
        { 
          status: 429, 
          headers: { 
            ...securityHeaders,
            'Retry-After': retryAfter?.toString() || '1800',
          } 
        }
      );
    }
  }

  // Rate limiting para upload
  if (pathname === '/api/upload') {
    const { blocked, retryAfter } = checkRateLimit(ip, 'upload');
    if (blocked) {
      console.warn(`[SECURITY] Rate limit upload excedido: IP=${ip}`);
      return NextResponse.json(
        { error: 'Limite de uploads excedido. Tente novamente mais tarde.', retryAfter },
        { status: 429, headers: { ...securityHeaders, 'Retry-After': retryAfter?.toString() || '600' } }
      );
    }
  }

  // Rate limiting para APIs públicas
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/admin')) {
    const { blocked, retryAfter } = checkRateLimit(ip, 'api');
    if (blocked) {
      console.warn(`[SECURITY] Rate limit API excedido: IP=${ip}`);
      return NextResponse.json(
        { error: 'Muitas requisições. Tente novamente mais tarde.', retryAfter },
        { status: 429, headers: { ...securityHeaders, 'Retry-After': retryAfter?.toString() || '300' } }
      );
    }
  }

  // ==================== AUTENTICAÇÃO ====================
  
  // Ignorar rota de login/logout
  if (pathname === '/admin/login' || pathname === '/api/admin/auth' || pathname === '/api/admin/logout') {
    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Proteção para rotas de API Administrativa
  if (pathname.startsWith('/api/admin')) {
    const adminSession = request.cookies.get('admin_session');
    
    if (!adminSession?.value) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401, headers: securityHeaders }
      );
    }
    
    // Validar formato do ID da sessão (deve ser numérico)
    if (!/^\d+$/.test(adminSession.value)) {
      console.warn(`[SECURITY] Sessão inválida detectada: IP=${ip}`);
      return NextResponse.json(
        { error: 'Sessão inválida' },
        { status: 401, headers: securityHeaders }
      );
    }
  }

  // Proteção para rotas de Interface Administrativa
  if (pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session');
    
    if (!adminSession?.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Validar formato do ID da sessão
    if (!/^\d+$/.test(adminSession.value)) {
      console.warn(`[SECURITY] Sessão inválida na interface: IP=${ip}`);
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_session');
      return response;
    }
  }

  // Adicionar headers de segurança à resposta
  const response = NextResponse.next();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*'
  ],
};
