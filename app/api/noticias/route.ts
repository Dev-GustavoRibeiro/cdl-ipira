import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // ?limit=N (1-50); sem parâmetro retorna todas as publicadas
    const limit = Number(request.nextUrl.searchParams.get('limit'));

    let query = supabase
      .from('news')
      // Campanha ligada para o atalho no modal da home (o RLS devolve null para campanha desativada)
      .select('*, campaigns(slug, title)')
      .eq('is_published', true)
      .order('date', { ascending: false });

    if (Number.isInteger(limit) && limit > 0) {
      query = query.limit(Math.min(limit, 50));
    }

    const { data: news, error } = await query;

    if (error) {
      console.error('Erro ao buscar notícias:', error.message);
      return NextResponse.json({ error: 'Erro ao buscar notícias' }, { status: 500 });
    }

    // Se não houver notícias, retornar array vazio
    return NextResponse.json(news || []);
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
