import { NextRequest, NextResponse } from 'next/server';
import { auditServer } from '@/lib/audit-server';
import { sanitizeString } from '@/lib/security';
import { supabaseAdmin } from '@/lib/supabase-admin';

function sanitizePayload(body: Record<string, unknown>) {
  return {
    title: sanitizeString(String(body.title || '')),
    description: sanitizeString(String(body.description || '')) || null,
    type: sanitizeString(String(body.type || 'PDF')) || 'PDF',
    category: sanitizeString(String(body.category || '')) || null,
    date: body.date ? String(body.date) : null,
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
      .from('transparency_documents')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar documentos:', error);
      return NextResponse.json({ error: 'Erro ao buscar documentos.' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
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
      .from('transparency_documents')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar documento:', error);
      return NextResponse.json({ error: 'Erro ao criar documento.' }, { status: 500 });
    }

    await auditServer.create('transparency_documents', data.id.toString(), payload.title, { category: payload.category }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'ID do documento é obrigatório.' }, { status: 400 });
    }

    const payload = sanitizePayload(body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('transparency_documents')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar documento:', error);
      return NextResponse.json({ error: 'Erro ao atualizar documento.' }, { status: 500 });
    }

    await auditServer.update('transparency_documents', id.toString(), payload.title, { category: payload.category }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'ID do documento é obrigatório.' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('transparency_documents')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('transparency_documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir documento:', error);
      return NextResponse.json({ error: 'Erro ao excluir documento.' }, { status: 500 });
    }

    await auditServer.delete('transparency_documents', id.toString(), existing?.title || 'Documento', {}, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir documento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
