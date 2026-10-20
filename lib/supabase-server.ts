/**
 * Supabase Auth no servidor (route handlers, server components e proxy).
 *
 * O login acontece apenas no servidor (/api/admin/auth), então os cookies de
 * sessão são httpOnly: o navegador nunca lê o token.
 * Administrador = usuário com app_metadata.role === 'admin' (só o service role altera app_metadata).
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AuthIdentity {
  sub?: string;
  id?: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

// Sessão do painel dura 4h a partir do login (como no sistema anterior), mesmo com o token sendo renovado
export const ADMIN_SESSION_MAX_AGE_S = 4 * 60 * 60;

/** true se o login (amr; iat como reserva) foi há mais de ADMIN_SESSION_MAX_AGE_S. */
export function isSessionExpired(
  claims: { iat?: number; amr?: Array<{ timestamp: number } | string> } | null | undefined,
  nowS: number = Date.now() / 1000
): boolean {
  const logins = (claims?.amr ?? []).flatMap((a) => (typeof a === 'object' ? [a.timestamp] : []));
  const loginAt = logins.length ? Math.min(...logins) : claims?.iat;
  return !loginAt || nowS - loginAt > ADMIN_SESSION_MAX_AGE_S;
}

/** Converte claims do JWT (ou um User) em AdminUser, ou null se não for admin. */
export function toAdminUser(identity: AuthIdentity | null | undefined): AdminUser | null {
  if (!identity || identity.app_metadata?.role !== 'admin') return null;
  const id = identity.sub || identity.id;
  if (!id) return null;
  const email = identity.email || '';
  const name = identity.user_metadata?.full_name || identity.user_metadata?.name || email || 'Admin';
  return { id, email, name: String(name) };
}

/** Cliente Supabase ligado aos cookies da requisição atual. */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublicKey, {
    cookieOptions: AUTH_COOKIE_OPTIONS,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chamado de um Server Component: o proxy já renova a sessão.
        }
      },
    },
  });
}

/** Administrador autenticado na requisição atual, ou null. */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims || isSessionExpired(data.claims)) return null;
    return toAdminUser(data.claims);
  } catch {
    return null;
  }
}
