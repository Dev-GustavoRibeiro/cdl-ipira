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
  // Desativar cadastro via API para forçar uso do WhatsApp e cadastro via Dashboard
  return NextResponse.json(
    { error: 'O cadastro de vagas pelo site foi desativado. Por favor, atualize a página e use o botão de envio para WhatsApp.' },
    { status: 403 }
  );
}
