import { NextRequest, NextResponse } from 'next/server';
import { auditServer } from '@/lib/audit-server';
import { isValidEmail, sanitizeString } from '@/lib/security';
import { supabaseAdmin } from '@/lib/supabase-admin';

function sanitizePhone(value: string | undefined): string | null {
  if (!value) return null;
  return value.trim().replace(/[^\d+\-()\s]/g, '') || null;
}

function sanitizeJobPayload(body: Record<string, unknown>) {
  const title = sanitizeString(String(body.title || ''));
  const company = sanitizeString(String(body.company || ''));
  const description = sanitizeString(String(body.description || ''));
  const location = sanitizeString(String(body.location || ''));
  const category = sanitizeString(String(body.category || ''));
  const contact_name = sanitizeString(String(body.contact_name || ''));
  const contact_email = sanitizeString(String(body.contact_email || '')).toLowerCase();
  const contact_phone = sanitizePhone(typeof body.contact_phone === 'string' ? body.contact_phone : undefined);
  const quantity = Number(body.quantity || 1);
  const is_active = Boolean(body.is_active);
  const date = body.date ? String(body.date) : null;

  return {
    title,
    company,
    description,
    location: location || null,
    category: category || null,
    contact_name: contact_name || null,
    contact_email: contact_email || null,
    contact_phone,
    quantity,
    is_active,
    date,
  };
}

function validateJobPayload(payload: ReturnType<typeof sanitizeJobPayload>) {
  if (!payload.title || !payload.company || !payload.description) {
    return 'Título, empresa e descrição são obrigatórios.';
  }

  if (!Number.isInteger(payload.quantity) || payload.quantity < 1 || payload.quantity > 9999) {
    return 'Quantidade inválida.';
  }

  if (payload.contact_email && !isValidEmail(payload.contact_email)) {
    return 'E-mail de contato inválido.';
  }

  return null;
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Erro ao buscar vagas.' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = sanitizeJobPayload(body);
    const validationError = validateJobPayload(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('jobs')
      .insert([
        {
          ...payload,
          date: payload.date || new Date().toISOString().split('T')[0],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar vaga:', error);
      return NextResponse.json({ error: 'Erro ao criar vaga.' }, { status: 500 });
    }

    await auditServer.create('jobs', data.id.toString(), payload.title, { company: payload.company }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'ID da vaga é obrigatório.' }, { status: 400 });
    }

    const payload = sanitizeJobPayload(body);
    const validationError = validateJobPayload(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('jobs')
      .update({
        ...payload,
        date: payload.date || undefined,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar vaga:', error);
      return NextResponse.json({ error: 'Erro ao atualizar vaga.' }, { status: 500 });
    }

    await auditServer.update('jobs', id.toString(), payload.title, { company: payload.company }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao atualizar vaga:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'ID da vaga é obrigatório.' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('jobs')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir vaga:', error);
      return NextResponse.json({ error: 'Erro ao excluir vaga.' }, { status: 500 });
    }

    await auditServer.delete('jobs', id.toString(), existing?.title || 'Vaga', {}, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir vaga:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
