import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail } from '@/lib/security';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkFormGuard } from '@/lib/form-guard';

/**
 * Formulário público de Orientação Jurídica.
 * Grava em legal_requests (sem acesso anônimo, por isso usa o cliente admin) para a equipe tratar no painel.
 */

// Texto puro: o painel exibe via React (escapa na renderização), então basta remover tags e caracteres de controle
function cleanText(value: unknown, keepLineBreaks = false): string {
  if (typeof value !== 'string') return '';
  const controlChars = keepLineBreaks ? /[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g : /[\x00-\x1F\x7F]/g;
  return value.replace(/<[^>]*>/g, '').replace(controlChars, '').trim();
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> | null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  // JSON válido mas não-objeto (ex.: "null") também é requisição inválida
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ success: false, error: 'Requisição inválida.' }, { status: 400 });
  }

  // Anti-robô: campo-armadilha preenchido ou envio rápido demais
  const botError = checkFormGuard(body);
  if (botError) {
    return NextResponse.json({ success: false, error: botError }, { status: 400 });
  }

  const nome = cleanText(body.nome);
  const empresa = cleanText(body.empresa);
  const assunto = cleanText(body.assunto);
  const telefone = cleanText(body.telefone).replace(/[^\d+\-()\s]/g, '');
  const email = cleanText(body.email).toLowerCase();
  const descricao = cleanText(body.descricao, true);

  if (!nome || !empresa || !assunto || !telefone || !email || !descricao) {
    return NextResponse.json(
      { success: false, error: 'Preencha todos os campos obrigatórios.' },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ success: false, error: 'Informe um e-mail válido.' }, { status: 400 });
  }

  if (
    nome.length > 120 ||
    empresa.length > 150 ||
    assunto.length > 200 ||
    telefone.length > 30 ||
    descricao.length > 3000
  ) {
    return NextResponse.json(
      { success: false, error: 'Os dados informados excedem o tamanho permitido.' },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabaseAdmin
      .from('legal_requests')
      .insert({ nome, empresa, assunto, telefone, email, descricao, status: 'pending' });

    if (error) {
      console.error('Erro ao salvar solicitação jurídica:', error.code, error.message);
      return NextResponse.json(
        { success: false, error: 'Não foi possível enviar sua solicitação no momento.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Erro na API de orientação jurídica:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { success: false, error: 'Não foi possível enviar sua solicitação no momento.' },
      { status: 500 }
    );
  }
}
