import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseServerClient, toAdminUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { logAuditServer } from '@/lib/audit-server';
import {
  getClientIP,
  isValidEmail,
  logSecurityEvent,
  generateCSRFToken,
  CSRF_COOKIE,
  CSRF_COOKIE_OPTIONS,
} from '@/lib/security';

class LoginConfigError extends Error {}

// 'on' quando o CAPTCHA do Supabase Auth (Attack Protection, com a chave secreta do Turnstile) estiver ligado: aí quem
// confere o token é o Supabase, o que vale também para quem chama o Supabase direto, sem passar por esta rota. O token
// do Turnstile só vale uma vez, então é conferido aqui OU lá, nunca nos dois.
// Esta rota não tem como saber se o CAPTCHA está ligado no Supabase: para desfazer, desligue lá E apague esta variável
// (com redeploy). Só desligar no Supabase deixa o login sem captcha nenhum.
const CAPTCHA_IN_SUPABASE = process.env.SUPABASE_AUTH_CAPTCHA === 'on';

// Confere o token do Cloudflare Turnstile aqui (quando o Supabase não confere)
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Chaves de teste da Cloudflare: 1x0000... sempre passa; 2x0000... e 3x0000... sempre falham
  if (!secret || /^[123]x0{10}/.test(secret)) {
    // Em produção falha fechado: sem a chave real o captcha virava enfeite
    if (process.env.NODE_ENV === 'production') {
      throw new LoginConfigError('TURNSTILE_SECRET_KEY ausente ou de teste');
    }
    return !secret || secret.startsWith('1x');
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

// Toda falha de login leva o mesmo tempo (piso fixo + variação): a demora não revela se o usuário/e-mail existe
// (usuário inexistente nem chega ao Supabase; existente passa pelo bcrypt do Supabase Auth)
const FAILURE_FLOOR_MS = 900;
const FAILURE_JITTER_MS = 200;

async function waitFailureFloor(startedAt: number): Promise<void> {
  const wait = startedAt + FAILURE_FLOOR_MS + Math.random() * FAILURE_JITTER_MS - Date.now();
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
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

const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,50}$/;

/**
 * Login por e-mail da conta do Supabase Auth ou por nome de usuário. O usuário fica em app_metadata.username
 * (só o service role altera) e aqui é convertido no e-mail da conta.
 */
async function resolveLoginEmail(identifier: string): Promise<string | null> {
  if (identifier.includes('@')) return isValidEmail(identifier) ? identifier.toLowerCase() : null;
  if (!USERNAME_RE.test(identifier)) return null;

  const wanted = identifier.toLowerCase();
  // ponytail: varre a lista de usuários (são poucos admins); trocar por consulta indexada se a base crescer
  for (let page = 1; page <= 10; page++) {
    let result;
    try {
      result = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
    } catch (configError) {
      // Sem SUPABASE_SERVICE_ROLE_KEY não há como localizar o usuário
      throw new LoginConfigError(String(configError));
    }
    const { data, error } = result;
    if (error) throw new LoginConfigError(error.message);
    const match = data.users.find((u) => String(u.app_metadata?.username ?? '').toLowerCase() === wanted);
    if (match?.email) return match.email.toLowerCase();
    if (data.users.length < 200) break;
  }
  return null;
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
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
    const { username, password, turnstileToken } = body ?? {};
    const identifier = typeof username === 'string' ? username.trim() : '';

    if (!turnstileToken || typeof turnstileToken !== 'string') {
      return NextResponse.json(
        { error: 'Verificação de segurança necessária' },
        { status: 400 }
      );
    }

    if (!CAPTCHA_IN_SUPABASE && !(await verifyTurnstile(turnstileToken, ip))) {
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

    if (!identifier || identifier.length > 254) {
      return NextResponse.json(
        { error: 'Informe o e-mail ou o usuário' },
        { status: 400 }
      );
    }

    if (typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return NextResponse.json(
        { error: 'Senha deve ter entre 6 e 128 caracteres' },
        { status: 400 }
      );
    }

    const loginEmail = await resolveLoginEmail(identifier);
    const supabase = await createSupabaseServerClient();
    const { data, error } = loginEmail
      ? await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
          options: CAPTCHA_IN_SUPABASE ? { captchaToken: turnstileToken } : undefined,
        })
      : { data: null, error: { code: 'unknown_user' } };

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
        user_name: identifier.slice(0, 100),
        details: {
          success: false,
          reason: error?.code === 'captcha_failed' ? 'Verificação de segurança inválida'
            : error ? 'Credenciais inválidas' : 'Usuário sem permissão de administrador',
        },
      }, request);
      logSecurityEvent({
        type: 'auth_failure',
        ip,
        path: '/api/admin/auth',
        details: { usuario: identifier.slice(0, 100), reason: error?.code || 'not_admin' }
      });

      // Mensagem genérica (inclusive para captcha recusado pelo Supabase, que só é conferido para usuário existente)
      // e tempo igual para não revelar se a conta existe
      await waitFailureFloor(startedAt);
      return NextResponse.json(
        { error: 'Usuário ou senha incorretos' },
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
    if (error instanceof LoginConfigError) {
      console.error('[AUTH] Login indisponível, configuração do servidor incompleta:', error.message);
      return NextResponse.json(
        { error: 'Login indisponível: configuração do servidor incompleta.' },
        { status: 503 }
      );
    }
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
