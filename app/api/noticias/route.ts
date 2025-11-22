import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('date', { ascending: false });

    if (error) {
      console.error('Erro detalhado Supabase:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: 'Erro ao buscar notícias', details: error }, { status: 500 });
    }

    // Se não houver notícias, retornar array vazio
    return NextResponse.json(news || []);
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

