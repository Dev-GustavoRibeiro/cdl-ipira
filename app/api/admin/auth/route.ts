import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Função auxiliar para registrar auditoria diretamente no banco
async function logAudit(
  action: 'LOGIN' | 'LOGOUT',
  userName: string,
  ipAddress: string,
  success: boolean = true
) {
  try {
    await supabase.from('audit_log').insert({
      action,
      table_name: 'auth',
      user_name: userName,
      ip_address: ipAddress,
      details: { success },
    });
  } catch (error) {
    console.error('Erro ao registrar auditoria:', error);
  }
}

export async function POST(request: NextRequest) {
  // Obter IP do request
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar usuário no banco de dados
    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (userError || !user) {
      // Registrar tentativa de login falha
      await logAudit('LOGIN', username, ip, false);
      return NextResponse.json(
        { error: 'Usuário ou senha incorretos' },
        { status: 401 }
      );
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      // Registrar tentativa de login falha
      await logAudit('LOGIN', username, ip, false);
      return NextResponse.json(
        { error: 'Usuário ou senha incorretos' },
        { status: 401 }
      );
    }

    // Atualizar último login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Registrar login bem-sucedido na auditoria
    await logAudit('LOGIN', user.name || username, ip, true);

    // Criar cookie de sessão
    // Em produção, use um JWT assinado. Para este exemplo, usaremos o ID do usuário.
    const cookieStore = await cookies();
    cookieStore.set('admin_session', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });

    // Retornar dados do usuário (sem a senha)
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
