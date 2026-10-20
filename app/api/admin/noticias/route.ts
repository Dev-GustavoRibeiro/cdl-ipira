import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUser } from '@/lib/supabase-server';
import { validateAndSanitize } from '@/lib/security';
import { auditServer } from '@/lib/audit-server';

// Cores das categorias
const CATEGORY_COLORS: Record<string, string> = {
  'Economia': 'from-blue-600 to-blue-800',
  'Comércio': 'from-green-600 to-green-800',
  'Agronegócio': 'from-yellow-600 to-yellow-800',
  'Dicas': 'from-purple-600 to-purple-800',
  'Eventos': 'from-red-600 to-red-800',
  'Serviços': 'from-indigo-600 to-indigo-800',
};

/** campaign_id do corpo: id > 0, null (sem campanha) ou undefined (campo ausente, não altera). false = inválido. */
function parseCampaignId(value: unknown): number | null | undefined | false {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const id = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN;
  return Number.isInteger(id) && id > 0 ? id : false;
}

// GET - Listar todas as notícias (incluindo rascunhos para admin)
export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { data: news, error } = await supabaseAdmin
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar notícias:', error);
      return NextResponse.json({ error: 'Erro ao buscar notícias' }, { status: 500 });
    }

    return NextResponse.json(news || []);
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST - Criar nova notícia
export async function POST(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validar campos obrigatórios manualmente (content pode ter HTML)
    if (!body.title || !body.excerpt || !body.content || !body.category || !body.date) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando: título, resumo, conteúdo, categoria e data são obrigatórios' }, { status: 400 });
    }
    
    // Validar e sanitizar (exceto content que pode ter HTML)
    const { valid, errors, sanitized } = validateAndSanitize(body, {
      title: { type: 'string', required: true, maxLength: 500 },
      excerpt: { type: 'string', required: true, maxLength: 1000 },
      category: { type: 'string', required: true, maxLength: 50 },
      date: { type: 'string', required: true, maxLength: 20 },
      image: { type: 'url', required: false },
      author: { type: 'string', required: false, maxLength: 100 }
    });
    
    // Adicionar content ao sanitized (permitindo HTML)
    sanitized.content = body.content;
    
    if (!valid) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }

    const campaignId = parseCampaignId(body.campaign_id);
    if (campaignId === false) {
      return NextResponse.json({ error: 'Campanha inválida.' }, { status: 400 });
    }
    
    const color = CATEGORY_COLORS[sanitized.category as string] || 'from-gray-600 to-gray-800';
    
    const { data, error } = await supabaseAdmin
      .from('news')
      .insert([
        {
          title: sanitized.title,
          excerpt: sanitized.excerpt,
          content: sanitized.content,
          category: sanitized.category,
          date: sanitized.date,
          image: sanitized.image || null,
          author: sanitized.author || 'CDL Ipirá',
          color: color,
          // Sem o campo, publica (compatível com chamadas antigas); false salva como rascunho
          is_published: body.is_published !== false,
          ...(campaignId !== undefined && { campaign_id: campaignId })
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar notícia:', error);
      return NextResponse.json({ error: 'Erro ao criar notícia' }, { status: 500 });
    }

    // Registrar auditoria
    await auditServer.create(
      'news',
      data.id.toString(),
      sanitized.title as string,
      { category: sanitized.category },
      request
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// PUT - Atualizar notícia existente
export async function PUT(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID da notícia é obrigatório' }, { status: 400 });
    }
    
    // Validar campos obrigatórios manualmente (content pode ter HTML)
    if (!updateData.title || !updateData.excerpt || !updateData.content || !updateData.category || !updateData.date) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando: título, resumo, conteúdo, categoria e data são obrigatórios' }, { status: 400 });
    }
    
    // Validar e sanitizar (exceto content que pode ter HTML)
    const { valid, errors, sanitized } = validateAndSanitize(updateData, {
      title: { type: 'string', required: true, maxLength: 500 },
      excerpt: { type: 'string', required: true, maxLength: 1000 },
      category: { type: 'string', required: true, maxLength: 50 },
      date: { type: 'string', required: true, maxLength: 20 },
      image: { type: 'url', required: false },
      author: { type: 'string', required: false, maxLength: 100 }
    });
    
    // Adicionar content ao sanitized (permitindo HTML)
    sanitized.content = updateData.content;
    
    if (!valid) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }

    const campaignId = parseCampaignId(updateData.campaign_id);
    if (campaignId === false) {
      return NextResponse.json({ error: 'Campanha inválida.' }, { status: 400 });
    }
    
    const color = CATEGORY_COLORS[sanitized.category as string] || 'from-gray-600 to-gray-800';
    
    const { data, error } = await supabaseAdmin
      .from('news')
      .update({
        title: sanitized.title,
        excerpt: sanitized.excerpt,
        content: sanitized.content,
        category: sanitized.category,
        date: sanitized.date,
        image: sanitized.image || null,
        author: sanitized.author || 'CDL Ipirá',
        color: color,
        is_published: updateData.is_published !== false,
        ...(campaignId !== undefined && { campaign_id: campaignId })
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar notícia:', error);
      return NextResponse.json({ error: 'Erro ao atualizar notícia' }, { status: 500 });
    }

    // Registrar auditoria
    await auditServer.update(
      'news',
      id.toString(),
      sanitized.title as string,
      { category: sanitized.category },
      request
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// DELETE - Excluir notícia
export async function DELETE(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID da notícia é obrigatório' }, { status: 400 });
    }
    
    // Buscar dados da notícia antes de excluir (para auditoria)
    const { data: noticia } = await supabaseAdmin
      .from('news')
      .select('title')
      .eq('id', id)
      .single();
    
    const { error } = await supabaseAdmin
      .from('news')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir notícia:', error);
      return NextResponse.json({ error: 'Erro ao excluir notícia' }, { status: 500 });
    }

    // Registrar auditoria
    await auditServer.delete(
      'news',
      id,
      noticia?.title || 'Notícia desconhecida',
      {},
      request
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

