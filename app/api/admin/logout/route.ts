import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseServerClient, toAdminUser } from '@/lib/supabase-server';
import { logAuditServer } from '@/lib/audit-server';
import { CSRF_COOKIE } from '@/lib/security';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getClaims();
    const admin = toAdminUser(data?.claims);

    // Encerra só esta sessão (outros dispositivos continuam logados)
    await supabase.auth.signOut({ scope: 'local' });

    await logAuditServer({
      action: 'LOGOUT',
      table_name: 'auth',
      user_id: admin?.id,
      user_name: admin?.name || 'Admin',
    }, request);

    cookieStore.delete(CSRF_COOKIE);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    cookieStore.delete(CSRF_COOKIE);
    return NextResponse.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    );
  }
}
