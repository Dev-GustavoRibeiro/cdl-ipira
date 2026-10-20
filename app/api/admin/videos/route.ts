import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateAndSanitize, isSafeLink } from '@/lib/security';
import { auditServer } from '@/lib/audit-server';
import { getAdminUser } from '@/lib/supabase-server';
import { todayISO } from '@/lib/date';

const UNAUTHORIZED = { error: 'Não autorizado' };
const INVALID_LINK = { error: 'URL do vídeo e da thumbnail devem ser endereços http(s)://' };

// Helper para extrair ID do YouTube
function getYoutubeId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

// GET - Listar todos os vídeos (incluindo inativos para admin)
export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  try {
    const { data: videos, error } = await supabaseAdmin
      .from('videos')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar vídeos:', error);
      return NextResponse.json({ error: 'Erro ao buscar vídeos' }, { status: 500 });
    }

    return NextResponse.json(videos || []);
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST - Criar novo vídeo
export async function POST(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validar campos obrigatórios
    if (!body.title || !body.video_url || !body.category) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando: título, URL do vídeo e categoria são obrigatórios' }, { status: 400 });
    }
    
    // Validar e sanitizar
    const { valid, errors, sanitized } = validateAndSanitize(body, {
      title: { type: 'string', required: true, maxLength: 500 },
      description: { type: 'string', required: false, maxLength: 5000 },
      video_url: { type: 'url', required: true },
      thumbnail: { type: 'url', required: false },
      category: { type: 'string', required: true, maxLength: 50 },
      duration: { type: 'string', required: false, maxLength: 20 }
    });
    
    if (!valid) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }

    if (!isSafeLink(sanitized.video_url) || (sanitized.thumbnail && !isSafeLink(sanitized.thumbnail))) {
      return NextResponse.json(INVALID_LINK, { status: 400 });
    }
    
    // Extrair YouTube ID
    const youtubeId = getYoutubeId(sanitized.video_url as string);
    
    const { data, error } = await supabaseAdmin
      .from('videos')
      .insert([
        {
          title: sanitized.title,
          description: sanitized.description || '',
          video_url: sanitized.video_url,
          youtube_id: youtubeId,
          thumbnail: sanitized.thumbnail || null,
          category: sanitized.category,
          duration: sanitized.duration || '00:00',
          date: todayISO(),
          views: '0',
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar vídeo:', error);
      return NextResponse.json({ error: 'Erro ao criar vídeo' }, { status: 500 });
    }

    // Registrar auditoria
    await auditServer.create(
      'videos',
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

// PUT - Atualizar vídeo existente
export async function PUT(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID do vídeo é obrigatório' }, { status: 400 });
    }
    
    // Validar campos obrigatórios
    if (!updateData.title || !updateData.video_url || !updateData.category) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando: título, URL do vídeo e categoria são obrigatórios' }, { status: 400 });
    }
    
    // Validar e sanitizar
    const { valid, errors, sanitized } = validateAndSanitize(updateData, {
      title: { type: 'string', required: true, maxLength: 500 },
      description: { type: 'string', required: false, maxLength: 5000 },
      video_url: { type: 'url', required: true },
      thumbnail: { type: 'url', required: false },
      category: { type: 'string', required: true, maxLength: 50 },
      duration: { type: 'string', required: false, maxLength: 20 }
    });
    
    if (!valid) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }

    if (!isSafeLink(sanitized.video_url) || (sanitized.thumbnail && !isSafeLink(sanitized.thumbnail))) {
      return NextResponse.json(INVALID_LINK, { status: 400 });
    }
    
    // Extrair YouTube ID
    const youtubeId = getYoutubeId(sanitized.video_url as string);
    
    const { data, error } = await supabaseAdmin
      .from('videos')
      .update({
        title: sanitized.title,
        description: sanitized.description || '',
        video_url: sanitized.video_url,
        youtube_id: youtubeId,
        thumbnail: sanitized.thumbnail || null,
        category: sanitized.category,
        duration: sanitized.duration || '00:00',
        is_active: true
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar vídeo:', error);
      return NextResponse.json({ error: 'Erro ao atualizar vídeo' }, { status: 500 });
    }

    // Registrar auditoria
    await auditServer.update(
      'videos',
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

// DELETE - Excluir vídeo
export async function DELETE(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID do vídeo é obrigatório' }, { status: 400 });
    }
    
    // Buscar dados do vídeo antes de excluir (para auditoria)
    const { data: video } = await supabaseAdmin
      .from('videos')
      .select('title')
      .eq('id', id)
      .single();
    
    const { error } = await supabaseAdmin
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir vídeo:', error);
      return NextResponse.json({ error: 'Erro ao excluir vídeo' }, { status: 500 });
    }

    // Registrar auditoria
    await auditServer.delete(
      'videos',
      id,
      video?.title || 'Vídeo desconhecido',
      {},
      request
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

