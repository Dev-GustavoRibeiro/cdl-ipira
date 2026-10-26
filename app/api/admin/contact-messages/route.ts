import { NextRequest, NextResponse } from 'next/server';
import { auditServer } from '@/lib/audit-server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUser } from '@/lib/supabase-server';

/**
 * Mensagens do Fale Conosco (formulário público em /api/contact).
 * A tabela tem RLS sem nenhuma política liberada: só o service role (supabaseAdmin) lê e altera.
 * Auditoria sem dados pessoais: só o id e a ação (o título é fixo), para o log não guardar o que o titular pediu para apagar.
 */

const TABLE = 'contact_messages';
const AUDIT_TITLE = 'Mensagem do Fale Conosco';
// ip_address e user_agent ficam de fora: o painel não precisa deles para responder
const COLUMNS = 'id, nome, email, telefone, assunto, mensagem, status, created_at';

const STATUSES = new Set(['new', 'read', 'answered']);
// Mesmos assuntos aceitos por /api/contact
const SUBJECTS = new Set(['associacao', 'spc', 'certificado', 'eventos', 'duvidas', 'privacidade', 'outros']);
// Pedido do titular (LGPD): o assunto "privacidade" do formulário ou qualquer texto antigo que cite LGPD
const PRIVACY_FILTER = 'assunto.ilike.%privacidade%,assunto.ilike.%lgpd%';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const unauthorized = () => NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
const headCount = () => supabaseAdmin.from(TABLE).select('id', { count: 'exact', head: true });

/** Totais para os filtros e o contador do menu (não dependem da busca). */
async function getCounts() {
  const [all, unread, answered, privacyOpen] = await Promise.all([
    headCount(),
    headCount().eq('status', 'new'),
    headCount().eq('status', 'answered'),
    headCount().or(PRIVACY_FILTER).neq('status', 'answered'),
  ]);
  const failed = [all, unread, answered, privacyOpen].find((r) => r.error);
  if (failed) throw failed.error;
  return {
    all: all.count ?? 0,
    unread: unread.count ?? 0,
    answered: answered.count ?? 0,
    privacyOpen: privacyOpen.count ?? 0,
  };
}

// GET - lista paginada (mais recentes primeiro); ?summary=1 devolve só os totais (contador do menu)
export async function GET(request: NextRequest) {
  if (!(await getAdminUser())) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);

    if (searchParams.get('summary') === '1') {
      return NextResponse.json(await getCounts());
    }

    const page = Math.max(parseInt(searchParams.get('page') || '1', 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10) || 20, 1), 50);
    const status = searchParams.get('status') || '';
    const assunto = searchParams.get('assunto') || '';
    const search = searchParams.get('search') || '';
    // Remove a sintaxe do filtro PostgREST (vírgula, parênteses, aspas, curingas), como em /api/admin/audit
    const term = search.replace(/[,()"'%*\\]/g, ' ').trim().slice(0, 100);

    // Lista filtrada; com head=true serve só para contar (página além do fim, abaixo)
    const filtered = (head = false) => {
      let query = supabaseAdmin.from(TABLE).select(head ? 'id' : COLUMNS, { count: 'exact', head });
      if (STATUSES.has(status)) query = query.eq('status', status);
      if (assunto === 'privacidade') query = query.or(PRIVACY_FILTER);
      else if (SUBJECTS.has(assunto)) query = query.eq('assunto', assunto);
      if (term) {
        query = query.or(`nome.ilike.%${term}%,email.ilike.%${term}%,telefone.ilike.%${term}%,mensagem.ilike.%${term}%`);
      }
      return query;
    };

    const from = (page - 1) * limit;
    const [list, counts] = await Promise.all([
      filtered().order('created_at', { ascending: false }).range(from, from + limit - 1),
      getCounts(),
    ]);
    let { data, error, count } = list;
    // Página além do fim (?page=99, ou itens que saíram do filtro): o PostgREST responde 416 (PGRST103).
    // Vira lista vazia com o total real, e a tela volta para a última página.
    if (error?.code === 'PGRST103') ({ data, error, count } = await filtered(true));

    if (error) {
      console.error('Erro ao buscar mensagens do Fale Conosco:', error.code, error.message);
      return NextResponse.json({ error: 'Erro ao buscar as mensagens.' }, { status: 500 });
    }

    return NextResponse.json({
      data: data ?? [],
      pagination: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
      counts,
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens do Fale Conosco:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// PATCH - marcar como lida, respondida ou não lida
export async function PATCH(request: NextRequest) {
  if (!(await getAdminUser())) return unauthorized();

  try {
    const body = await request.json().catch(() => null);
    const id = typeof body?.id === 'string' ? body.id : '';
    const status = typeof body?.status === 'string' ? body.status : '';

    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: 'ID da mensagem inválido.' }, { status: 400 });
    }
    if (!STATUSES.has(status)) {
      return NextResponse.json({ error: 'Status inválido.' }, { status: 400 });
    }

    // Status anterior: decide se a mudança vai para a auditoria
    const { data: current, error: readError } = await supabaseAdmin.from(TABLE).select('status').eq('id', id).maybeSingle();
    if (readError) {
      console.error('Erro ao alterar status da mensagem:', readError.code, readError.message);
      return NextResponse.json({ error: 'Erro ao alterar o status.' }, { status: 500 });
    }
    if (!current) {
      return NextResponse.json({ error: 'Mensagem não encontrada.' }, { status: 404 });
    }
    if (current.status === status) {
      return NextResponse.json({ success: true, data: { id, status } });
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .update({ status })
      .eq('id', id)
      .select('id, status')
      .maybeSingle();

    if (error) {
      console.error('Erro ao alterar status da mensagem:', error.code, error.message);
      return NextResponse.json({ error: 'Erro ao alterar o status.' }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Mensagem não encontrada.' }, { status: 404 });
    }

    // Abrir uma mensagem nova a marca como lida sozinho: isso não é ação do admin e encheria a "Atividade recente" do dashboard
    if (!(current.status === 'new' && status === 'read')) {
      await auditServer.update(TABLE, id, AUDIT_TITLE, { status }, request);
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao alterar status da mensagem:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// DELETE - apaga a mensagem (ex.: pedido de exclusão do titular)
export async function DELETE(request: NextRequest) {
  if (!(await getAdminUser())) return unauthorized();

  try {
    const id = new URL(request.url).searchParams.get('id') || '';

    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: 'ID da mensagem inválido.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.from(TABLE).delete().eq('id', id).select('id');

    if (error) {
      console.error('Erro ao apagar mensagem:', error.code, error.message);
      return NextResponse.json({ error: 'Erro ao apagar a mensagem.' }, { status: 500 });
    }
    if (!data?.length) {
      return NextResponse.json({ error: 'Mensagem não encontrada.' }, { status: 404 });
    }

    await auditServer.delete(TABLE, id, AUDIT_TITLE, {}, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao apagar mensagem:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
