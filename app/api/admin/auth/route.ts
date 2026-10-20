import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseServerClient, toAdminUser } from '@/lib/supabase-server';
import { logAuditServer } from '@/lib/audit-server';
import {
  getClientIP,
  logSecurityEvent,
  isValidEmail,
  generateCSRFToken,
  CSRF_COOKIE,
  CSRF_COOKIE_OPTIONS,
} from '@/lib/security';

// Verificar token Cloudflare Turnstile
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Sem chave configurada ou com chave de teste, pula a verificação
  if (!secret || secret.startsWith('1x000000000000') || secret.startsWith('2x000000000000')) {
    // Chaves de teste: 1x0000...AA = always passes, 2x0000...AB = always fails
    if (!secret && process.env.NODE_ENV === 'production') {
      console.warn('[SECURITY] TURNSTILE_SECRET_KEY não configurada: captcha do login desativado');
    }
    return !secret?.startsWith('2x');
  }
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }).toString(),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

// Tentativas de login falhas por IP (força bruta); o Supabase Auth também limita por conta própria
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos

function isIPBlocked(ip: string): { blocked: boolean; remainingTime?: number } {
  const attempts = loginAttempts.get(ip);
  if (!attempts) return { blocked: false };

  const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;

  if (timeSinceLastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(ip);
    return { blocked: false };
  }

  if (attempts.count >= MAX_ATTEMPTS) {
    const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 1000);
    return { blocked: true, remainingTime };
  }

  return { blocked: false };
}

function recordFailedAttempt(ip: string): void {
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(ip, attempts);
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);

  const { blocked, remainingTime } = isIPBlocked(ip);
  if (blocked) {
    logSecurityEvent({
      type: 'auth_failure',
      ip,
      path: '/api/admin/auth',
      details: { reason: 'IP bloqueado por muitas tentativas' }
    });
    return NextResponse.json(
      {
        error: 'Muitas tentativas de login. Tente novamente mais tarde.',
        retryAfter: remainingTime
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, password, turnstileToken } = body ?? {};

    if (!turnstileToken || typeof turnstileToken !== 'string') {
      return NextResponse.json(
        { error: 'Verificação de segurança necessária' },
        { status: 400 }
      );
    }

    if (!(await verifyTurnstile(turnstileToken, ip))) {
      logSecurityEvent({
        type: 'auth_failure',
        ip,
        path: '/api/admin/auth',
        details: { reason: 'Falha na verificação Turnstile' }
      });
      return NextResponse.json(
        { error: 'Verificação de segurança inválida. Recarregue a página e tente novamente.' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || !isValidEmail(email.trim())) {
      return NextResponse.json(
        { error: 'Informe um e-mail válido' },
        { status: 400 }
      );
    }

    if (typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return NextResponse.json(
        { error: 'Senha deve ter entre 6 e 128 caracteres' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    const admin = toAdminUser(data?.user);

    if (error || !admin) {
      // Usuário válido sem papel de admin não mantém sessão
      if (data?.session) {
        await supabase.auth.signOut({ scope: 'local' });
      }

      recordFailedAttempt(ip);
      await logAuditServer({
        action: 'LOGIN',
        table_name: 'auth',
        user_name: normalizedEmail,
        details: {
          success: false,
          reason: error ? 'Credenciais inválidas' : 'Usuário sem permissão de administrador',
        },
      }, request);
      logSecurityEvent({
        type: 'auth_failure',
        ip,
        path: '/api/admin/auth',
        details: { email: normalizedEmail, reason: error?.code || 'not_admin' }
      });

      // Mensagem genérica para não revelar se a conta existe
      return NextResponse.json(
        { error: 'E-mail ou senha incorretos' },
        { status: 401 }
      );
    }

    loginAttempts.delete(ip);

    await logAuditServer({
      action: 'LOGIN',
      table_name: 'auth',
      user_id: admin.id,
      user_name: admin.name,
      details: { success: true, email: admin.email },
    }, request);

    const cookieStore = await cookies();
    cookieStore.set(CSRF_COOKIE, generateCSRFToken(), CSRF_COOKIE_OPTIONS);

    return NextResponse.json({ success: true, user: admin });
  } catch (error) {
    console.error('Erro na autenticação:', error);
    logSecurityEvent({
      type: 'suspicious_activity',
      ip,
      path: '/api/admin/auth',
      details: { error: 'Erro interno na autenticação' }
    });
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
