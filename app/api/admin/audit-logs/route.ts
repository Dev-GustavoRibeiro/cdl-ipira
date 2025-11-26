import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const action = searchParams.get('action');
    const tableName = searchParams.get('table_name');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    // Construir query
    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Aplicar filtros
    if (action) {
      query = query.eq('action', action);
    }

    if (tableName) {
      query = query.eq('table_name', tableName);
    }

    if (search) {
      query = query.or(`user_name.ilike.%${search}%,record_title.ilike.%${search}%`);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error('Erro ao buscar logs de auditoria:', error);
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar logs de auditoria' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      logs: data || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Erro ao buscar logs de auditoria:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, table_name, record_id, record_title, user_name, details, ip_address } = body;

    if (!action || !table_name) {
      return NextResponse.json(
        { success: false, error: 'Ação e tabela são obrigatórios' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        action,
        table_name,
        record_id: record_id?.toString() || null,
        record_title: record_title || null,
        user_name: user_name || null,
        details: details || null,
        ip_address: ip_address || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao registrar log de auditoria:', error);
      return NextResponse.json(
        { success: false, error: 'Erro ao registrar log de auditoria' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, log: data });
  } catch (error) {
    console.error('Erro ao registrar log de auditoria:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

