import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getClientIP, logSecurityEvent, sanitizeString, generateCSRFToken } from '@/lib/security';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Armazenar tentativas de login falhas para detectar ataques de força bruta
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos

// Função auxiliar para registrar auditoria diretamente no banco
async function logAudit(
  action: 'LOGIN' | 'LOGOUT',
  userName: string,
  ipAddress: string,
  success: boolean = true,
  details: Record<string, unknown> = {}
) {
  try {
    await supabase.from('audit_log').insert({
      action,
      table_name: 'auth',
      user_name: userName,
      ip_address: ipAddress,
      details: { success, ...details },
    });
  } catch (error) {
    console.error('Erro ao registrar auditoria:', error);
  }
}

// Verificar se IP está bloqueado por muitas tentativas
function isIPBlocked(ip: string): { blocked: boolean; remainingTime?: number } {
  const attempts = loginAttempts.get(ip);
  if (!attempts) return { blocked: false };
  
  const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
  
  // Se passou o tempo de lockout, resetar
  if (timeSinceLastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(ip);
    return { blocked: false };
  }
  
  // Se excedeu o limite, bloquear
  if (attempts.count >= MAX_ATTEMPTS) {
    const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 1000);
    return { blocked: true, remainingTime };
  }
  
  return { blocked: false };
}

// Registrar tentativa de login falha
function recordFailedAttempt(ip: string): void {
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(ip, attempts);
}

// Limpar tentativas após login bem-sucedido
function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);

  // Verificar se IP está bloqueado
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
    const { username, password } = body;

    // Validação básica
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar formato do username (prevenir injeção)
    if (typeof username !== 'string' || username.length > 50 || !/^[a-zA-Z0-9_.-]+$/.test(username)) {
      logSecurityEvent({
        type: 'invalid_input',
        ip,
        path: '/api/admin/auth',
        details: { reason: 'Username inválido', username: sanitizeString(username).substring(0, 20) }
      });
      return NextResponse.json(
        { error: 'Formato de usuário inválido' },
        { status: 400 }
      );
    }

    // Validar tamanho da senha
    if (typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return NextResponse.json(
        { error: 'Senha deve ter entre 6 e 128 caracteres' },
        { status: 400 }
      );
    }

    // Buscar usuário no banco de dados
    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('id, username, name, email, password_hash, role, is_active')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (userError || !user) {
      // Registrar tentativa de login falha
      recordFailedAttempt(ip);
      await logAudit('LOGIN', username, ip, false, { reason: 'Usuário não encontrado' });
      
      // Mensagem genérica para não revelar se o usuário existe
      return NextResponse.json(
        { error: 'Usuário ou senha incorretos' },
        { status: 401 }
      );
    }

    // Verificar senha com timing constante
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      // Registrar tentativa de login falha
      recordFailedAttempt(ip);
      await logAudit('LOGIN', username, ip, false, { reason: 'Senha incorreta', userId: user.id });
      
      logSecurityEvent({
        type: 'auth_failure',
        ip,
        path: '/api/admin/auth',
        details: { username, userId: user.id }
      });
      
      return NextResponse.json(
        { error: 'Usuário ou senha incorretos' },
        { status: 401 }
      );
    }

    // Login bem-sucedido - limpar tentativas
    clearAttempts(ip);

    // Atualizar último login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Registrar login bem-sucedido na auditoria
    await logAudit('LOGIN', user.name || username, ip, true, { userId: user.id });

    // Gerar token CSRF
    const csrfToken = generateCSRFToken();

    // Criar cookies de sessão
    const cookieStore = await cookies();
    
    // Cookie de sessão
    cookieStore.set('admin_session', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 horas (reduzido de 24)
      path: '/',
    });
    
    // Cookie CSRF (pode ser lido pelo JavaScript)
    cookieStore.set('csrf_token', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 horas
      path: '/',
    });

    // Retornar dados do usuário (sem dados sensíveis)
    const safeUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return NextResponse.json({
      success: true,
      user: safeUser,
      csrfToken, // Enviar também no body para uso imediato
    });
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
