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

// POST - Criar novo registro de auditoria
export async function POST(request: NextRequest) {
  try {
    const body: AuditLogEntry = await request.json();
    
    // Obter IP do request
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';

    const { data, error } = await supabaseAdmin
      .from('audit_log')
      .insert({
        action: body.action,
        table_name: body.table_name,
        record_id: body.record_id || null,
        record_title: body.record_title || null,
        user_id: body.user_id || null,
        user_name: body.user_name || null,
        details: body.details || null,
        ip_address: body.ip_address || ip,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar log de auditoria:', error);
      // Não retornar erro para não afetar a operação principal
      return NextResponse.json({ success: false, error: error.message }, { status: 200 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro na API de auditoria:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 200 });
  }
}

// GET - Buscar logs de auditoria
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
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

