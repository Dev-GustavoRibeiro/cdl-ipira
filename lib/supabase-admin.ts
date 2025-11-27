/**
 * Cliente Supabase Admin (Server-Side Only)
 * 
 * IMPORTANTE: Este cliente usa a Service Role Key e tem acesso irrestrito ao banco.
 * Nunca importe este arquivo em componentes client-side ("use client").
 * 
 * Use apenas em:
 * - API Routes (/api/...)
 * - Server Actions
 * - Server Components (sem "use client")
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Criar cliente admin apenas se as variáveis estiverem disponíveis
// Durante o build, as variáveis podem não estar disponíveis
let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) {
    return _supabaseAdmin;
  }

  if (!supabaseUrl) {
    throw new Error(
      '[supabaseAdmin] NEXT_PUBLIC_SUPABASE_URL não está configurada. ' +
      'Verifique seu arquivo .env.local'
    );
  }

  if (!supabaseServiceKey) {
    throw new Error(
      '[supabaseAdmin] SUPABASE_SERVICE_ROLE_KEY não está configurada. ' +
      'Verifique seu arquivo .env.local. ' +
      'ATENÇÃO: Nunca exponha esta chave no client-side!'
    );
  }

  // Criar cliente admin com Service Role Key
  // Este cliente bypassa RLS e tem acesso total ao banco
  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      // Desabilitar auto refresh de token para operações server-side
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _supabaseAdmin;
}

// Exportar como getter para lazy initialization
// Isso evita falhas durante o build quando as envs não estão disponíveis
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabaseAdmin();
    const value = client[prop as keyof SupabaseClient];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
