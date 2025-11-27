import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getClientIP, SESSION_TOKEN_LENGTH } from '@/lib/security';

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);

  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;

    let userName = 'Admin';
    
    if (sessionToken) {
      // Validar formato do token (64 caracteres hex)
      const isValidToken = sessionToken.length === SESSION_TOKEN_LENGTH && /^[a-f0-9]+$/.test(sessionToken);
      
      if (isValidToken) {
        // Buscar a sessão para obter o admin_id e nome do usuário
        const { data: session } = await supabaseAdmin
          .from('admin_sessions')
          .select('admin_id')
          .eq('token', sessionToken)
          .single();

        if (session?.admin_id) {
          const { data: user } = await supabaseAdmin
            .from('admin_users')
            .select('full_name, username')
            .eq('id', session.admin_id)
            .single();
          
          if (user) {
            userName = user.full_name || user.username;
          }
        }

        // Deletar a sessão do banco de dados
        await supabaseAdmin
          .from('admin_sessions')
          .delete()
          .eq('token', sessionToken);
      }
    }

    // Registrar logout na auditoria
    try {
      await supabaseAdmin.from('audit_log').insert({
        action: 'LOGOUT',
        table_name: 'auth',
        user_name: userName,
        ip_address: ip,
      });
    } catch (auditError) {
      console.error('Erro ao registrar auditoria de logout:', auditError);
    }
    
    // Remove os cookies de sessão e CSRF
    cookieStore.delete('admin_session');
    cookieStore.delete('csrf_token');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    
    // Mesmo com erro, tenta limpar os cookies
    try {
      const cookieStore = await cookies();
      cookieStore.delete('admin_session');
      cookieStore.delete('csrf_token');
    } catch {
      // Ignora erros ao limpar cookies
    }
    
    return NextResponse.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    );
  }
}
