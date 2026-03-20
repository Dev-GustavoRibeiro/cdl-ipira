import { NextRequest, NextResponse } from 'next/server';
import { auditServer } from '@/lib/audit-server';
import { sanitizeString } from '@/lib/security';
import { supabaseAdmin } from '@/lib/supabase-admin';

const VALID_STATUSES = new Set(['pending', 'in_progress', 'completed']);

function sanitizePayload(body: Record<string, unknown>) {
  const nome = sanitizeString(String(body.nome || ''));
  const empresa = sanitizeString(String(body.empresa || ''));
  const assunto = sanitizeString(String(body.assunto || ''));
  const status = sanitizeString(String(body.status || 'pending'));

  return {
    nome,
    empresa,
    assunto,
    status,
  };
}

function validatePayload(payload: ReturnType<typeof sanitizePayload>) {
  if (!payload.nome || !payload.empresa || !payload.assunto) {
    return 'Nome, empresa e assunto são obrigatórios.';
  }

  if (!VALID_STATUSES.has(payload.status)) {
    return 'Status inválido.';
  }

  return null;
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('legal_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar solicitações jurídicas:', error);
      return NextResponse.json({ error: 'Erro ao buscar solicitações.' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar solicitações jurídicas:', error);
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
      .from('legal_requests')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar solicitação jurídica:', error);
      return NextResponse.json({ error: 'Erro ao criar solicitação.' }, { status: 500 });
    }

    await auditServer.create('legal_requests', data.id.toString(), payload.assunto, { empresa: payload.empresa }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao criar solicitação jurídica:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'ID da solicitação é obrigatório.' }, { status: 400 });
    }

    const payload = sanitizePayload(body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('legal_requests')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar solicitação jurídica:', error);
      return NextResponse.json({ error: 'Erro ao atualizar solicitação.' }, { status: 500 });
    }

    await auditServer.update('legal_requests', id.toString(), payload.assunto, { empresa: payload.empresa }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao atualizar solicitação jurídica:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'ID da solicitação é obrigatório.' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('legal_requests')
      .select('assunto')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('legal_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir solicitação jurídica:', error);
      return NextResponse.json({ error: 'Erro ao excluir solicitação.' }, { status: 500 });
    }

    await auditServer.delete('legal_requests', id.toString(), existing?.assunto || 'Solicitação', {}, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir solicitação jurídica:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
