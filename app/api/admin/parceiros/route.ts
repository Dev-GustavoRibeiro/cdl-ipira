import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { auditServer } from '@/lib/audit-server';
import { validateAndSanitize, getClientIP, logSecurityEvent, isSafeLink } from '@/lib/security';
import { getAdminUser } from '@/lib/supabase-server';

const UNAUTHORIZED = { error: 'Não autorizado' };
const INVALID_LOGO = { error: 'A logo deve ser enviada pelo painel (Storage do site)' };

// Logo só do Storage do Supabase (antes era `includes('supabase.co')`, que aceitava qualquer URL com esse texto)
function isStorageUrl(value: unknown) {
  try {
    const url = new URL(String(value));
    return url.protocol === 'https:' && (url.hostname === 'supabase.co' || url.hostname.endsWith('.supabase.co'));
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('partners')
      .select('id, name, logo, website, order_index, is_active')
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar parceiros do admin:', error);
    return NextResponse.json({ error: 'Erro ao buscar parceiros' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  try {
    const body = await request.json();

    const { valid, errors, sanitized } = validateAndSanitize(body, {
      name: { type: 'string', required: true, maxLength: 100, minLength: 2 },
      logo: { type: 'url', required: true },
      website: { type: 'url', required: false },
      order: { type: 'number', required: false, min: 0, max: 9999 },
      isActive: { type: 'boolean', required: false },
    });

    if (!valid) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }

    if (sanitized.website && !isSafeLink(sanitized.website)) {
      return NextResponse.json({ error: 'Website deve ser um endereço http(s):// ou um caminho do site (ex: /associados)' }, { status: 400 });
    }

    if (!isStorageUrl(sanitized.logo)) {
      return NextResponse.json(INVALID_LOGO, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('partners')
      .insert([
        {
          name: sanitized.name,
          logo: sanitized.logo,
          website: sanitized.website || null,
          order_index: sanitized.order || 0,
          is_active: sanitized.isActive !== false
        }
      ])
      .select();

    if (error) throw error;

    await auditServer.create(
      'partners',
      data[0].id.toString(),
      sanitized.name as string,
      { website: sanitized.website, order: sanitized.order },
      request
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erro ao criar parceiro:', error);
    return NextResponse.json({ error: 'Erro ao criar parceiro' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.id || typeof body.id !== 'number' || body.id < 1) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const { id, ...updates } = body;
    const { valid, errors, sanitized } = validateAndSanitize(updates, {
      name: { type: 'string', required: false, maxLength: 100, minLength: 2 },
      logo: { type: 'url', required: false },
      website: { type: 'url', required: false },
      order: { type: 'number', required: false, min: 0, max: 9999 },
      isActive: { type: 'boolean', required: false },
    });

    if (!valid) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }

    if (sanitized.website && !isSafeLink(sanitized.website)) {
      return NextResponse.json({ error: 'Website deve ser um endereço http(s):// ou um caminho do site (ex: /associados)' }, { status: 400 });
    }

    if (sanitized.logo && !isStorageUrl(sanitized.logo)) {
      return NextResponse.json(INVALID_LOGO, { status: 400 });
    }

    const { data: oldData } = await supabaseAdmin
      .from('partners')
      .select('name')
      .eq('id', id)
      .single();

    const { data, error } = await supabaseAdmin
      .from('partners')
      .update({
        ...(sanitized.name && { name: sanitized.name }),
        ...(sanitized.logo && { logo: sanitized.logo }),
        ...(sanitized.website !== undefined && { website: sanitized.website || null }),
        ...(sanitized.order !== undefined && { order_index: sanitized.order }),
        ...(sanitized.isActive !== undefined && { is_active: sanitized.isActive }),
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    await auditServer.update(
      'partners',
      id.toString(),
      (sanitized.name as string) || oldData?.name,
      {
        old_name: oldData?.name,
        new_name: sanitized.name,
        website: sanitized.website,
        order: sanitized.order,
        is_active: sanitized.isActive,
      },
      request
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erro ao atualizar parceiro:', error);
    return NextResponse.json({ error: 'Erro ao atualizar parceiro' }, { status: 500 });
  }
}

// PATCH - reordenação: { items: [{ id, order }] } (só a ordem muda)
export async function PATCH(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  try {
    const body = await request.json();
    const items: unknown = body?.items;
    const valid =
      Array.isArray(items) &&
      items.length > 0 &&
      items.length <= 1000 &&
      items.every((it) => Number.isInteger(it?.id) && it.id > 0 && Number.isInteger(it?.order) && it.order >= 0 && it.order <= 9999);

    if (!valid) {
      return NextResponse.json({ error: 'Ordem inválida' }, { status: 400 });
    }

    // Em lotes, para não abrir centenas de conexões de uma vez na primeira renumeração
    const list = items as { id: number; order: number }[];
    for (let i = 0; i < list.length; i += 25) {
      const results = await Promise.all(
        list.slice(i, i + 25).map(({ id, order }) => supabaseAdmin.from('partners').update({ order_index: order }).eq('id', id))
      );
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
    }

    await auditServer.update('partners', 'ordem', 'Ordem dos associados', { itens: list.length }, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao reordenar associados:', error);
    return NextResponse.json({ error: 'Erro ao salvar a nova ordem' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  const ip = getClientIP(request);
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id || !/^\d+$/.test(id)) {
    logSecurityEvent({
      type: 'invalid_input',
      ip,
      path: '/api/admin/parceiros',
      details: { reason: 'ID inválido', id }
    });
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const { data: partnerData } = await supabaseAdmin
      .from('partners')
      .select('name')
      .eq('id', parseInt(id, 10))
      .single();

    const { error } = await supabaseAdmin
      .from('partners')
      .delete()
      .eq('id', parseInt(id, 10));

    if (error) throw error;

    await auditServer.delete(
      'partners',
      id,
      partnerData?.name || 'Parceiro',
      undefined,
      request
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir parceiro:', error);
    return NextResponse.json({ error: 'Erro ao excluir parceiro' }, { status: 500 });
  }
}
