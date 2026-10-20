import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    const { data: videos, error } = await supabase
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
