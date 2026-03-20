import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('partners')
      .select('id, name, logo, website, order_index, is_active')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar associados:', error);
    return NextResponse.json({ error: 'Erro ao buscar associados' }, { status: 500 });
  }
}
