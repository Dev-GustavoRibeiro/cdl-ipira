import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  // Obter IP do request
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';

  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;

    // Buscar nome do usuário para o log
    let userName = 'Admin';
    if (sessionId) {
      const { data: user } = await supabase
        .from('admin_users')
        .select('name, username')
        .eq('id', sessionId)
        .single();
      
      if (user) {
        userName = user.name || user.username;
      }
    }

    // Registrar logout na auditoria
    try {
      await supabase.from('audit_log').insert({
        action: 'LOGOUT',
        table_name: 'auth',
        user_name: userName,
        ip_address: ip,
      });
    } catch (auditError) {
      console.error('Erro ao registrar auditoria de logout:', auditError);
    }
    
    // Remove o cookie de sessão
    cookieStore.delete('admin_session');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    );
  }
}

