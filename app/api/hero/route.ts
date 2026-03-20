import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('hero_slides')
      .select('id, title, subtitle, description, button_text, button_link, gradient, accent_color, image, image_position, image_fit, pattern, order_index, is_active')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar slides:', error);
    return NextResponse.json({ error: 'Erro ao buscar slides' }, { status: 500 });
  }
}

