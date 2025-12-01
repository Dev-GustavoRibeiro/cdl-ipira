import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getClientIP, logSecurityEvent } from '@/lib/security';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string || 'uploads';
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }
    
    // Validar tipo de arquivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        path: '/api/admin/upload',
        details: { reason: 'Invalid file type', fileType: file.type }
      });
      return NextResponse.json({ error: 'Tipo de arquivo não permitido. Use: JPEG, PNG, WebP ou GIF' }, { status: 400 });
    }
    
    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo: 5MB' }, { status: 400 });
    }
    
    // Gerar nome único
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    
    // Converter para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Upload para o Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      return NextResponse.json({ error: 'Erro ao fazer upload', details: uploadError.message }, { status: 500 });
    }

    // Obter URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({ 
      success: true, 
      url: urlData.publicUrl,
      fileName 
    });
  } catch (error) {
    console.error('Erro interno no upload:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}





