import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export interface AuditLogEntry {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  table_name: string;
  record_id?: string;
  record_title?: string;
  user_id?: string;
  user_name?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
}

export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    { error: 'Criação direta de auditoria desabilitada. Use o backend server-side.' },
    { status: 405 }
  );
}

// GET - Buscar logs de auditoria
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100);
    const action = searchParams.get('action');
    const table_name = searchParams.get('table_name');
    const search = searchParams.get('search');

    let query = supabaseAdmin
      .from('audit_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (action) {
      query = query.eq('action', action);
    }
    if (table_name) {
      query = query.eq('table_name', table_name);
    }
    if (search) {
      query = query.or(`record_title.ilike.%${search}%,user_name.ilike.%${search}%`);
    }

    // Paginação
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar logs de auditoria:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Erro na API de auditoria:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

