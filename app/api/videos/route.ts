import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getYoutubeId } from '@/lib/youtube';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;

  try {
    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
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
  try {
    const body = await request.json();
    
    // Extrair ID do YouTube se for uma URL do YouTube
    let youtubeId = null;
    if (body.video_url) {
        youtubeId = getYoutubeId(body.video_url);
    }

    const { data, error } = await supabase
      .from('videos')
      .insert([
        {
          title: body.title,
          description: body.description,
          video_url: body.video_url,
          youtube_id: youtubeId,
          thumbnail: body.thumbnail, // Opcional se tiver youtube_id
          category: body.category,
          date: new Date().toISOString().split('T')[0],
          duration: body.duration || '00:00',
          is_active: true
        }
      ])
      .select();

    if (error) {
      console.error('Erro ao criar vídeo:', error);
      return NextResponse.json({ error: 'Erro ao criar vídeo' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}


