import { NextRequest, NextResponse } from 'next/server';
import { auditServer } from '@/lib/audit-server';
import { sanitizeString } from '@/lib/security';
import { supabaseAdmin } from '@/lib/supabase-admin';

function sanitizePayload(body: Record<string, unknown>) {
  return {
    title: sanitizeString(String(body.title || '')),
    description: sanitizeString(String(body.description || '')) || null,
    edition: sanitizeString(String(body.edition || '')) || null,
    date: body.date ? String(body.date) : null,
    cover_url: sanitizeString(String(body.cover_url || '')) || null,
    file_url: sanitizeString(String(body.file_url || '')),
    is_active: body.is_active !== false,
  };
}

function validatePayload(payload: ReturnType<typeof sanitizePayload>) {
  if (!payload.title || !payload.file_url || !payload.date) {
    return 'Título, arquivo e data são obrigatórios.';
  }

  return null;
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('magazines')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar revistas:', error);
      return NextResponse.json({ error: 'Erro ao buscar revistas.' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar revistas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = sanitizePayload(body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('magazines')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar revista:', error);
      return NextResponse.json({ error: 'Erro ao criar revista.' }, { status: 500 });
    }

    await auditServer.create('magazines', data.id.toString(), payload.title, { edition: payload.edition }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao criar revista:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'ID da revista é obrigatório.' }, { status: 400 });
    }

    const payload = sanitizePayload(body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('magazines')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar revista:', error);
      return NextResponse.json({ error: 'Erro ao atualizar revista.' }, { status: 500 });
    }

    await auditServer.update('magazines', id.toString(), payload.title, { edition: payload.edition }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao atualizar revista:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'ID da revista é obrigatório.' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('magazines')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('magazines')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir revista:', error);
      return NextResponse.json({ error: 'Erro ao excluir revista.' }, { status: 500 });
    }

    await auditServer.delete('magazines', id.toString(), existing?.title || 'Revista', {}, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir revista:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
