import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const limit = Number(request.nextUrl.searchParams.get('limit'));

    // Buscar álbuns ativos com contagem de fotos embutida (uma única consulta)
    let query = supabase
      .from('albums')
      .select(`
        id,
        title,
        description,
        category,
        date,
        location,
        cover_url,
        cover,
        is_active,
        album_photos(count)
      `)
      .eq('is_active', true)
      .order('date', { ascending: false });

    if (Number.isInteger(limit) && limit > 0) {
      query = query.limit(Math.min(limit, 50));
    }

    const { data: albums, error } = await query;

    if (error) {
      console.error('Erro ao buscar álbuns:', error.message);
      return NextResponse.json({ error: 'Erro ao buscar álbuns' }, { status: 500 });
    }

    return NextResponse.json(
      (albums || []).map((album) => ({
        id: album.id,
        title: album.title,
        description: album.description,
        category: album.category,
        date: album.date,
        location: album.location,
        image: album.cover_url || album.cover || null,
        photos: album.album_photos?.[0]?.count ?? 0,
        is_active: album.is_active
      }))
    );
  } catch (error) {
    console.error('Erro ao buscar álbuns:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
