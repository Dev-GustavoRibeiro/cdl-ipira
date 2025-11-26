import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auditServer } from '@/lib/audit-server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar slides:', error);
    return NextResponse.json({ error: 'Erro ao buscar slides' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('hero_slides')
      .insert([
        {
          title: body.title,
          subtitle: body.subtitle,
          description: body.description,
          button_text: body.buttonText,
          button_link: body.buttonLink,
          gradient: body.gradient,
          accent_color: body.accentColor,
          image: body.image,
          pattern: body.pattern,
          order_index: body.order,
          is_active: true
        }
      ])
      .select();

    if (error) throw error;

    // Registrar auditoria
    await auditServer.create(
      'hero_slides',
      data[0].id.toString(),
      body.title,
      undefined,
      request
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erro ao criar slide:', error);
    return NextResponse.json({ error: 'Erro ao criar slide' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const { data, error } = await supabase
      .from('hero_slides')
      .update({
        title: updates.title,
        subtitle: updates.subtitle,
        description: updates.description,
        button_text: updates.buttonText,
        button_link: updates.buttonLink,
        gradient: updates.gradient,
        accent_color: updates.accentColor,
        image: updates.image,
        pattern: updates.pattern,
        order_index: updates.order,
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    // Registrar auditoria
    await auditServer.update(
      'hero_slides',
      id.toString(),
      updates.title,
      undefined,
      request
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erro ao atualizar slide:', error);
    return NextResponse.json({ error: 'Erro ao atualizar slide' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
  }

  try {
    // Buscar dados antes de excluir para o log
    const { data: slideData } = await supabase
      .from('hero_slides')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Registrar auditoria
    await auditServer.delete(
      'hero_slides',
      id,
      slideData?.title || 'Slide',
      undefined,
      request
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir slide:', error);
    return NextResponse.json({ error: 'Erro ao excluir slide' }, { status: 500 });
  }
}

