import { NextRequest, NextResponse } from 'next/server';
import { getClientIP, isValidEmail, sanitizeString } from '@/lib/security';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkFormGuard } from '@/lib/form-guard';

interface ContactPayload {
  [field: string]: unknown;
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
  // Pedidos do titular pela LGPD (link "Exercer meus direitos" da política e do rodapé)
  'privacidade',
  'outros',
]);

function sanitizePhone(value: string): string {
  return value.trim().replace(/[^\d+\-()\s]/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactPayload;
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Requisição inválida.' }, { status: 400 });
    }

    // Anti-robô: campo-armadilha preenchido ou envio rápido demais
    const botError = checkFormGuard(body);
    if (botError) {
      return NextResponse.json({ success: false, error: botError }, { status: 400 });
    }

    const nome = sanitizeString(body.nome || '');
    const email = sanitizeString(body.email || '').toLowerCase();
    // Opcional: o e-mail já basta para responder (a coluna é NOT NULL, então vazio vira '')
    const telefone = sanitizePhone(body.telefone || '');
    const assunto = sanitizeString(body.assunto || '');
    const mensagem = sanitizeString(body.mensagem || '');

    if (!nome || !email || !assunto || !mensagem) {
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

    // Sem plano B no audit_log: lá a mensagem ficaria visível a toda a equipe e sem como ser excluída
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert({
        nome,
        email,
        telefone,
        assunto,
        mensagem,
        ip_address: getClientIP(request),
        user_agent: request.headers.get('user-agent'),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao salvar mensagem de contato:', error.code, error.message);
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
    console.error('Erro na API de contato:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { success: false, error: 'Não foi possível processar sua mensagem.' },
      { status: 500 }
    );
  }
}
