import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar vagas:', error);
      return NextResponse.json({ error: 'Erro ao buscar vagas' }, { status: 500 });
    }

    return NextResponse.json(jobs || []);
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação básica
    if (!body.empresa || !body.cargo || !body.descricao) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          company: body.empresa,
          title: body.cargo,
          description: body.descricao,
          quantity: parseInt(body.quantidade) || 1,
          location: body.localizacao,
          category: 'Todas', // Padrão, pode ser ajustado no form
          date: new Date().toISOString().split('T')[0], // Data atual
          is_active: false // Requer aprovação do admin
        }
      ])
      .select();

    if (error) {
      console.error('Erro ao criar vaga:', error);
      return NextResponse.json({ error: 'Erro ao criar vaga' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

