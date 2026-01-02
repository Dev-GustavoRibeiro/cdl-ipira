import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('date', { ascending: true });

    if (error) {
      console.error('Erro ao buscar eventos:', error);
      return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 });
    }

    return NextResponse.json(events || []);
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}










