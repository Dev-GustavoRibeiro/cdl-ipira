import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

function extractResumePath(fileUrl: string): string | null {
  if (!fileUrl) return null;

  if (fileUrl.includes('/resumes/')) {
    return fileUrl.split('/resumes/')[1] || null;
  }

  return fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
}

export async function GET(request: NextRequest) {
  try {
    const fileUrl = request.nextUrl.searchParams.get('fileUrl') || '';
    const path = extractResumePath(fileUrl);

    if (!path) {
      return NextResponse.json({ error: 'Arquivo inválido.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.storage
      .from('resumes')
      .createSignedUrl(path, 60);

    if (error || !data?.signedUrl) {
      console.error('Erro ao gerar URL assinada do currículo:', error);
      return NextResponse.json({ error: 'Não foi possível acessar o currículo.' }, { status: 500 });
    }

    return NextResponse.redirect(data.signedUrl);
  } catch (error) {
    console.error('Erro no download do currículo:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
