import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getYoutubeId } from '@/lib/youtube';
import { validateAndSanitize, scanForThreats, getClientIP, logSecurityEvent } from '@/lib/security';
import { auditServer } from '@/lib/audit-server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limitParam = searchParams.get('limit');
  
  // Validar e limitar o parâmetro limit (máximo 100)
  let limit = 100;
  if (limitParam) {
    const parsedLimit = parseInt(limitParam);
    if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100) {
      limit = parsedLimit;
    }
  }

  try {
    const { data: videos, error } = await supabaseAdmin
      .from('videos')
      .select('id, title, description, video_url, youtube_id, thumbnail, category, date, duration, is_active')
      .eq('is_active', true)
      .order('date', { ascending: false })
      .limit(limit);

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

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  
  try {
    const body = await request.json();
    
    // Verificar ameaças
    const { safe, threats } = scanForThreats(body, request);
    if (!safe) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        path: '/api/videos',
        details: { threats, method: 'POST' }
      });
      return NextResponse.json({ error: 'Dados inválidos detectados' }, { status: 400 });
    }
    
    // Validar e sanitizar
    const { valid, errors, sanitized } = validateAndSanitize(body, {
      title: { type: 'string', required: true, maxLength: 200 },
      description: { type: 'string', required: false, maxLength: 2000 },
      video_url: { type: 'url', required: true },
      thumbnail: { type: 'url', required: false },
      category: { type: 'string', required: false, maxLength: 50 },
      duration: { type: 'string', required: false, maxLength: 10 }
    });
    
    if (!valid) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }
    
    // Validar que é uma URL do YouTube
    const videoUrl = sanitized.video_url as string;
    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      return NextResponse.json({ error: 'URL deve ser do YouTube' }, { status: 400 });
    }
    
    // Extrair ID do YouTube
    const youtubeId = getYoutubeId(videoUrl);
    if (!youtubeId) {
      return NextResponse.json({ error: 'URL do YouTube inválida' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('videos')
      .insert([
        {
          title: sanitized.title,
          description: sanitized.description || null,
          video_url: sanitized.video_url,
          youtube_id: youtubeId,
          thumbnail: sanitized.thumbnail || null,
          category: sanitized.category || 'Geral',
          date: new Date().toISOString().split('T')[0],
          duration: sanitized.duration || '00:00',
          is_active: true
        }
      ])
      .select();

    if (error) {
      console.error('Erro ao criar vídeo:', error);
      return NextResponse.json({ error: 'Erro ao criar vídeo' }, { status: 500 });
    }

    // Registrar auditoria
    await auditServer.create(
      'videos',
      data[0].id.toString(),
      sanitized.title as string,
      { youtube_id: youtubeId },
      request
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}


