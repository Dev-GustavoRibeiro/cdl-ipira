import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ignorar rota de login/logout da API e da Interface Admin
  // Verifica explicitamente o path exato ou se é uma chamada para autenticação/logout
  if (pathname === '/admin/login' || pathname === '/api/admin/auth' || pathname === '/api/admin/logout') {
    return NextResponse.next();
  }

  // 2. Proteção para rotas de API Administrativa
  if (pathname.startsWith('/api/admin')) {
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
  }

  // 3. Proteção para rotas de Interface Administrativa
  if (pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ],
};
