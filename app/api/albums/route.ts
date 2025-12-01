import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');

    // Buscar álbuns ativos com contagem de fotos
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
        is_active
      `)
      .eq('is_active', true)
      .order('date', { ascending: false });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: albums, error } = await query;

    if (error) {
      console.error('Erro ao buscar álbuns:', error);
      return NextResponse.json({ error: 'Erro ao buscar álbuns' }, { status: 500 });
    }

    // Buscar contagem de fotos para cada álbum
    const albumsWithPhotoCount = await Promise.all(
      (albums || []).map(async (album) => {
        const { count } = await supabase
          .from('album_photos')
          .select('*', { count: 'exact', head: true })
          .eq('album_id', album.id);

        return {
          id: album.id,
          title: album.title,
          description: album.description,
          category: album.category,
          date: album.date,
          location: album.location,
          image: album.cover_url || '/placeholder-gallery.jpg',
          photos: count || 0,
          is_active: album.is_active
        };
      })
    );

    return NextResponse.json(albumsWithPhotoCount);
  } catch (error) {
    console.error('Erro ao buscar álbuns:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

