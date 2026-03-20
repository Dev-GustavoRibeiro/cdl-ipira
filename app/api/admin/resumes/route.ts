import { NextRequest, NextResponse } from 'next/server';
import { auditServer } from '@/lib/audit-server';
import { isValidEmail, sanitizeString } from '@/lib/security';
import { supabaseAdmin } from '@/lib/supabase-admin';

function sanitizePhone(value: string | undefined): string | null {
  if (!value) return null;
  return value.trim().replace(/[^\d+\-()\s]/g, '') || null;
}

function sanitizePayload(body: Record<string, unknown>) {
  const candidate_name = sanitizeString(String(body.candidate_name || ''));
  const candidate_email = sanitizeString(String(body.candidate_email || '')).toLowerCase();
  const candidate_phone = sanitizePhone(typeof body.candidate_phone === 'string' ? body.candidate_phone : undefined);
  const file_url = sanitizeString(String(body.file_url || ''));
  const notes = sanitizeString(String(body.notes || ''));
  const job_id = Number(body.job_id);

  return {
    job_id,
    candidate_name,
    candidate_email: candidate_email || null,
    candidate_phone,
    file_url,
    notes: notes || null,
  };
}

function validatePayload(payload: ReturnType<typeof sanitizePayload>) {
  if (!Number.isInteger(payload.job_id) || payload.job_id <= 0) {
    return 'Vaga inválida.';
  }

  if (!payload.candidate_name || !payload.file_url) {
    return 'Nome do candidato e arquivo são obrigatórios.';
  }

  if (payload.candidate_email && !isValidEmail(payload.candidate_email)) {
    return 'E-mail inválido.';
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = Number(searchParams.get('jobId'));

    if (!Number.isInteger(jobId) || jobId <= 0) {
      return NextResponse.json({ error: 'Parâmetro jobId é obrigatório.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('resumes')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar currículos:', error);
      return NextResponse.json({ error: 'Erro ao buscar currículos.' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar currículos:', error);
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
      .from('resumes')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar currículo:', error);
      return NextResponse.json({ error: 'Erro ao salvar currículo.' }, { status: 500 });
    }

    await auditServer.create('resumes', data.id.toString(), payload.candidate_name, { job_id: payload.job_id }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao criar currículo:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'ID do currículo é obrigatório.' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('resumes')
      .select('candidate_name')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('resumes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir currículo:', error);
      return NextResponse.json({ error: 'Erro ao excluir currículo.' }, { status: 500 });
    }

    await auditServer.delete('resumes', id.toString(), existing?.candidate_name || 'Currículo', {}, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir currículo:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
