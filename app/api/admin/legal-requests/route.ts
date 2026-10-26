import { NextRequest, NextResponse } from 'next/server';
import { auditServer } from '@/lib/audit-server';
import { isValidEmail } from '@/lib/security';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUser } from '@/lib/supabase-server';

const VALID_STATUSES = new Set(['pending', 'in_progress', 'completed']);

// Texto puro (mesma regra de /api/juridico): o painel exibe via React, então não escapamos entidades
// aqui — senão cada edição escaparia de novo o texto já salvo ("&" -> "&amp;" -> "&amp;amp;")
function cleanText(value: unknown, keepLineBreaks = false): string {
  if (typeof value !== 'string') return '';
  const controlChars = keepLineBreaks ? /[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g : /[\x00-\x1F\x7F]/g;
  return value.replace(/<[^>]*>/g, '').replace(controlChars, '').trim();
}

function sanitizePayload(body: Record<string, unknown>) {
  const payload: Record<string, string | null> = {
    nome: cleanText(body.nome),
    empresa: cleanText(body.empresa),
    assunto: cleanText(body.assunto),
    status: cleanText(body.status) || 'pending',
  };
  // Contato e descrição vêm do formulário público; só entram no update quando enviados (não apaga o que já existe)
  if ('telefone' in body) payload.telefone = cleanText(body.telefone).replace(/[^\d+\-()\s]/g, '') || null;
  if ('email' in body) payload.email = cleanText(body.email).toLowerCase() || null;
  if ('descricao' in body) payload.descricao = cleanText(body.descricao, true) || null;
  return payload;
}

function validatePayload(payload: ReturnType<typeof sanitizePayload>) {
  if (!payload.nome || !payload.empresa || !payload.assunto) {
    return 'Nome, empresa e assunto são obrigatórios.';
  }

  if (!VALID_STATUSES.has(payload.status ?? '')) {
    return 'Status inválido.';
  }

  if (payload.email && !isValidEmail(payload.email)) {
    return 'Informe um e-mail válido.';
  }

  if (
    (payload.nome?.length ?? 0) > 120 ||
    (payload.empresa?.length ?? 0) > 150 ||
    (payload.assunto?.length ?? 0) > 200 ||
    (payload.telefone?.length ?? 0) > 30 ||
    (payload.descricao?.length ?? 0) > 3000
  ) {
    return 'Os dados informados excedem o tamanho permitido.';
  }

  return null;
}

export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

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
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

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

    // Auditoria sem assunto/empresa (texto do solicitante): se ele pedir a exclusão, nada dele fica no log
    await auditServer.create('legal_requests', data.id.toString(), `Solicitação jurídica #${data.id}`, {}, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao criar solicitação jurídica:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

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

    await auditServer.update('legal_requests', id.toString(), `Solicitação jurídica #${id}`, {}, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao atualizar solicitação jurídica:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// PATCH - troca rápida de status (lista do painel)
export async function PATCH(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = Number(body?.id);
    const status = cleanText(body?.status);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'ID da solicitação é obrigatório.' }, { status: 400 });
    }
    if (!VALID_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Status inválido.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('legal_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao alterar status da solicitação jurídica:', error);
      return NextResponse.json({ error: 'Erro ao alterar o status.' }, { status: 500 });
    }

    await auditServer.update('legal_requests', id.toString(), `Solicitação jurídica #${id}`, { status }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao alterar status da solicitação jurídica:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'ID da solicitação é obrigatório.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('legal_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir solicitação jurídica:', error);
      return NextResponse.json({ error: 'Erro ao excluir solicitação.' }, { status: 500 });
    }

    await auditServer.delete('legal_requests', id.toString(), `Solicitação jurídica #${id}`, {}, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir solicitação jurídica:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
