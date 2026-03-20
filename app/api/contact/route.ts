import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail, sanitizeString } from '@/lib/security';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface ContactPayload {
  nome?: string;
  email?: string;
  telefone?: string;
  assunto?: string;
  mensagem?: string;
}

const ALLOWED_SUBJECTS = new Set([
  'associacao',
  'spc',
  'certificado',
  'eventos',
  'duvidas',
  'outros',
]);

function getRequestIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');

  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || null;
  }

  return request.headers.get('x-real-ip');
}

function sanitizePhone(value: string): string {
  return value.trim().replace(/[^\d+\-()\s]/g, '');
}

async function saveContactFallback(
  request: NextRequest,
  payload: {
    nome: string;
    email: string;
    telefone: string;
    assunto: string;
    mensagem: string;
  }
) {
  const { data, error } = await supabaseAdmin
    .from('audit_log')
    .insert({
      action: 'CREATE',
      table_name: 'contact_messages',
      record_title: payload.nome,
      user_name: payload.nome,
      details: {
        email: payload.email,
        telefone: payload.telefone,
        assunto: payload.assunto,
        mensagem: payload.mensagem,
        source: 'public_contact_form_fallback',
      },
      ip_address: getRequestIp(request),
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function POST(request: NextRequest) {
  let nome = '';
  let email = '';
  let telefone = '';
  let assunto = '';
  let mensagem = '';

  try {
    const body = (await request.json()) as ContactPayload;

    nome = sanitizeString(body.nome || '');
    email = sanitizeString(body.email || '').toLowerCase();
    telefone = sanitizePhone(body.telefone || '');
    assunto = sanitizeString(body.assunto || '');
    mensagem = sanitizeString(body.mensagem || '');

    if (!nome || !email || !telefone || !assunto || !mensagem) {
      return NextResponse.json(
        { success: false, error: 'Preencha todos os campos obrigatórios.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Informe um e-mail válido.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_SUBJECTS.has(assunto)) {
      return NextResponse.json(
        { success: false, error: 'Selecione um assunto válido.' },
        { status: 400 }
      );
    }

    if (nome.length > 120 || telefone.length > 30 || mensagem.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Os dados informados excedem o tamanho permitido.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert({
        nome,
        email,
        telefone,
        assunto,
        mensagem,
        ip_address: getRequestIp(request),
        user_agent: request.headers.get('user-agent'),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao salvar mensagem de contato:', error);

      const isMissingTable =
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        error.message.toLowerCase().includes('contact_messages');

      if (isMissingTable) {
        const fallbackId = await saveContactFallback(request, {
          nome,
          email,
          telefone,
          assunto,
          mensagem,
        });

        return NextResponse.json(
          {
            success: true,
            id: fallbackId,
            message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
          },
          { status: 201 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Não foi possível enviar sua mensagem no momento.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        id: data.id,
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const isMissingTable =
      message.includes('contact_messages') ||
      message.toLowerCase().includes('schema cache');

    if (isMissingTable) {
      try {
        const fallbackId = await saveContactFallback(request, {
          nome,
          email,
          telefone,
          assunto,
          mensagem,
        });

        return NextResponse.json(
          {
            success: true,
            id: fallbackId,
            message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
          },
          { status: 201 }
        );
      } catch (fallbackError) {
        console.error('Erro no fallback de contato via auditoria:', fallbackError);
      }
    }

    console.error('Erro na API de contato:', error);

    return NextResponse.json(
      { success: false, error: 'Não foi possível processar sua mensagem.' },
      { status: 500 }
    );
  }
}
