import { NextRequest, NextResponse } from 'next/server';
import { auditServer } from '@/lib/audit-server';
import { isSafeLink, sanitizeString } from '@/lib/security';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUser } from '@/lib/supabase-server';

const VALID_ROLES = new Set(['presidente', 'vice_presidente', 'diretor', 'suplente', 'colaborador']);

function sanitizePayload(body: Record<string, unknown>) {
  return {
    name: sanitizeString(String(body.name || '')),
    role: sanitizeString(String(body.role || '')),
    position: sanitizeString(String(body.position || '')),
    photo_url: sanitizeString(String(body.photo_url || '')) || null,
    bio: sanitizeString(String(body.bio || '')) || null,
    contribution: sanitizeString(String(body.contribution || '')) || null,
    function_description: sanitizeString(String(body.function_description || '')) || null,
    display_order: Number(body.display_order || 0),
    is_active: body.is_active !== false,
  };
}

function validatePayload(payload: ReturnType<typeof sanitizePayload>) {
  if (!payload.name || !payload.position || !payload.role) {
    return 'Nome, cargo e função são obrigatórios.';
  }

  if (!VALID_ROLES.has(payload.role)) {
    return 'Tipo de membro inválido.';
  }

  if (!Number.isInteger(payload.display_order) || payload.display_order < 0) {
    return 'Ordem inválida.';
  }

  if (payload.photo_url && !isSafeLink(payload.photo_url, 1000)) {
    return 'A foto deve ser um endereço http(s):// ou um caminho do site.';
  }

  return null;
}

export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Erro ao buscar membros:', error);
      return NextResponse.json({ error: 'Erro ao buscar membros.' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
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
      .from('team_members')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar membro:', error);
      return NextResponse.json({ error: 'Erro ao criar membro.' }, { status: 500 });
    }

    await auditServer.create('team_members', data.id.toString(), payload.name, { role: payload.role }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao criar membro:', error);
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
      return NextResponse.json({ error: 'ID do membro é obrigatório.' }, { status: 400 });
    }

    const payload = sanitizePayload(body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('team_members')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar membro:', error);
      return NextResponse.json({ error: 'Erro ao atualizar membro.' }, { status: 500 });
    }

    await auditServer.update('team_members', id.toString(), payload.name, { role: payload.role }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao atualizar membro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// PATCH - reordenação: { items: [{ id, display_order }] } (só a ordem muda)
export async function PATCH(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const items: unknown = body?.items;
    const valid =
      Array.isArray(items) &&
      items.length > 0 &&
      items.length <= 200 &&
      items.every(
        (it) => Number.isInteger(it?.id) && it.id > 0 && Number.isInteger(it?.display_order) && it.display_order >= 0 && it.display_order <= 9999
      );

    if (!valid) {
      return NextResponse.json({ error: 'Ordem inválida.' }, { status: 400 });
    }

    const results = await Promise.all(
      (items as { id: number; display_order: number }[]).map(({ id, display_order }) =>
        supabaseAdmin.from('team_members').update({ display_order }).eq('id', id)
      )
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      console.error('Erro ao reordenar membros:', failed.error);
      return NextResponse.json({ error: 'Erro ao salvar a nova ordem.' }, { status: 500 });
    }

    await auditServer.update('team_members', 'ordem', 'Ordem da diretoria', { itens: (items as unknown[]).length }, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao reordenar membros:', error);
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
      return NextResponse.json({ error: 'ID do membro é obrigatório.' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('team_members')
      .select('name')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir membro:', error);
      return NextResponse.json({ error: 'Erro ao excluir membro.' }, { status: 500 });
    }

    await auditServer.delete('team_members', id.toString(), existing?.name || 'Membro', {}, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir membro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
