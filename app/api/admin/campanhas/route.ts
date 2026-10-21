import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUser } from '@/lib/supabase-server';
import { validateAndSanitize } from '@/lib/security';
import { auditServer } from '@/lib/audit-server';
import { slugify } from '@/lib/campaigns';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const FIELD_LABELS: Record<string, string> = {
  title: 'Título',
  summary: 'Resumo',
  description: 'Descrição',
  cover_image: 'Imagem de capa',
  start_date: 'Data de início',
  end_date: 'Data de término',
};

// Texto puro: sem tags nem caracteres de controle, mantendo quebras de linha.
// Não escapa entidades: o React já escapa na renderização e o escape duplo corromperia "&" a cada edição.
function plainText(value: unknown): string {
  return typeof value === 'string'
    ? value.replace(/<[^>]*>/g, '').replace(/[\x00-\x09\x0B-\x1F\x7F]/g, '').trim()
    : '';
}

// Valida o corpo de POST/PUT e devolve a linha pronta para o banco, ou a mensagem de erro
function parseCampaignBody(body: Record<string, unknown>) {
  const fields = {
    title: plainText(body.title),
    summary: plainText(body.summary),
    description: plainText(body.description),
    cover_image: plainText(body.cover_image),
    start_date: plainText(body.start_date),
    end_date: plainText(body.end_date),
  };

  const { valid, errors } = validateAndSanitize(fields, {
    title: { type: 'string', required: true, maxLength: 150 },
    summary: { type: 'string', maxLength: 300 },
    description: { type: 'string', maxLength: 5000 },
    cover_image: { type: 'url' },
    start_date: { type: 'string', required: true, maxLength: 10 },
    end_date: { type: 'string', maxLength: 10 },
  });

  if (!valid) {
    return { error: errors[0].replace(/'(\w+)'/, (_, key: string) => FIELD_LABELS[key] || key) };
  }
  if (!DATE_REGEX.test(fields.start_date)) {
    return { error: 'Data de início inválida.' };
  }
  if (fields.end_date && !DATE_REGEX.test(fields.end_date)) {
    return { error: 'Data de término inválida.' };
  }
  if (fields.end_date && fields.end_date < fields.start_date) {
    return { error: 'A data de término deve ser igual ou posterior à data de início.' };
  }

  return {
    row: {
      title: fields.title,
      summary: fields.summary || null,
      description: fields.description || null,
      cover_image: fields.cover_image || null,
      start_date: fields.start_date,
      end_date: fields.end_date || null,
      is_featured: body.is_featured === true,
      is_active: body.is_active !== false,
    },
  };
}

// Slug único: natal-premiado, natal-premiado-2, natal-premiado-3...
async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || 'campanha';
  const { data } = await supabaseAdmin.from('campaigns').select('slug').like('slug', `${base}%`);
  const taken = new Set((data || []).map((item) => item.slug));

  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

function parseId(value: unknown): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET - Listar todas as campanhas (incluindo inativas) com o total de conteúdos vinculados
export async function GET() {
  if (!(await getAdminUser())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const { data, error } = await supabaseAdmin
      .from('campaigns')
      .select('*, news(count), events(count), albums(count)')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar campanhas:', error);
      return NextResponse.json({ error: 'Erro ao buscar campanhas.' }, { status: 500 });
    }

    const campaigns = (data || []).map(({ news, events, albums, ...campaign }) => ({
      ...campaign,
      news_count: news?.[0]?.count || 0,
      events_count: events?.[0]?.count || 0,
      albums_count: albums?.[0]?.count || 0,
    }));

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// POST - Criar nova campanha
export async function POST(request: NextRequest) {
  if (!(await getAdminUser())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const parsed = parseCampaignBody(await request.json());
    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    // ponytail: duas criações simultâneas com o mesmo título podem colidir no slug; o índice único barra e o admin tenta de novo
    const slug = await uniqueSlug(parsed.row.title);

    const { data, error } = await supabaseAdmin
      .from('campaigns')
      .insert([{ ...parsed.row, slug }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar campanha:', error);
      return NextResponse.json({ error: 'Erro ao criar campanha. Tente novamente.' }, { status: 500 });
    }

    await auditServer.create('campaigns', data.id.toString(), data.title, { slug }, request);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// PUT - Atualizar campanha existente (o slug não muda, para não quebrar links já divulgados)
export async function PUT(request: NextRequest) {
  if (!(await getAdminUser())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const body = await request.json();
    const id = parseId(body.id);

    if (!id) {
      return NextResponse.json({ error: 'ID da campanha é obrigatório.' }, { status: 400 });
    }

    const parsed = parseCampaignBody(body);
    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('campaigns')
      .update(parsed.row)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar campanha:', error);
      return NextResponse.json({ error: 'Erro ao atualizar campanha.' }, { status: 500 });
    }

    await auditServer.update('campaigns', id.toString(), data.title, { slug: data.slug }, request);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// DELETE - Excluir campanha (notícias, eventos e álbuns vinculados ficam sem campanha)
export async function DELETE(request: NextRequest) {
  if (!(await getAdminUser())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const id = parseId(new URL(request.url).searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ error: 'ID da campanha é obrigatório.' }, { status: 400 });
    }

    // Buscar título antes de excluir (para auditoria)
    const { data: campanha } = await supabaseAdmin
      .from('campaigns')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir campanha:', error);
      return NextResponse.json({ error: 'Erro ao excluir campanha.' }, { status: 500 });
    }

    await auditServer.delete('campaigns', id.toString(), campanha?.title || 'Campanha desconhecida', {}, request);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
