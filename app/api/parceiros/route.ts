import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { auditServer } from '@/lib/audit-server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar parceiros:', error);
    return NextResponse.json({ error: 'Erro ao buscar parceiros' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from('partners')
      .insert([
        {
          name: body.name,
          logo: body.logo,
          website: body.website,
          order_index: body.order,
          is_active: true
        }
      ])
      .select();

    if (error) throw error;

    // Registrar auditoria
    await auditServer.create(
      'partners',
      data[0].id.toString(),
      body.name,
      { website: body.website, order: body.order },
      request
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erro ao criar parceiro:', error);
    return NextResponse.json({ error: 'Erro ao criar parceiro' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    // Buscar dados antigos para o log
    const { data: oldData } = await supabaseAdmin
      .from('partners')
      .select('name')
      .eq('id', id)
      .single();

    const { data, error } = await supabaseAdmin
      .from('partners')
      .update({
        name: updates.name,
        logo: updates.logo,
        website: updates.website,
        order_index: updates.order,
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    // Registrar auditoria
    await auditServer.update(
      'partners',
      id.toString(),
      updates.name || oldData?.name,
      { 
        old_name: oldData?.name,
        new_name: updates.name,
        website: updates.website, 
        order: updates.order 
      },
      request
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erro ao atualizar parceiro:', error);
    return NextResponse.json({ error: 'Erro ao atualizar parceiro' }, { status: 500 });
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
    const { data: partnerData } = await supabaseAdmin
      .from('partners')
      .select('name')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('partners')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Registrar auditoria
    await auditServer.delete(
      'partners',
      id,
      partnerData?.name || 'Parceiro',
      undefined,
      request
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir parceiro:', error);
    return NextResponse.json({ error: 'Erro ao excluir parceiro' }, { status: 500 });
  }
}
