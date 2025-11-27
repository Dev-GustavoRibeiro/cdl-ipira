import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateFile, getClientIP, logSecurityEvent } from '@/lib/security';

// Buckets permitidos (whitelist)
const ALLOWED_BUCKETS = ['defaults', 'partners', 'news', 'events', 'heroes', 'team', 'gallery', 'transparency'];

// Tipos MIME permitidos
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'application/pdf'
];

// Tamanho máximo por tipo (em MB)
const MAX_SIZE_BY_TYPE: Record<string, number> = {
  'image/png': 5,
  'image/jpeg': 5,
  'image/jpg': 5,
  'image/webp': 5,
  'image/gif': 5,
  'application/pdf': 10,
  'default': 5
};

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string || 'defaults';
    const folder = formData.get('folder') as string || '';

    // Validação: arquivo obrigatório
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Validação: bucket na whitelist
    if (!ALLOWED_BUCKETS.includes(bucket)) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        path: '/api/upload',
        details: { reason: 'Bucket não permitido', bucket }
      });
      return NextResponse.json({ error: 'Bucket não permitido' }, { status: 400 });
    }

    // Validação: folder não pode conter path traversal
    if (folder.includes('..') || folder.includes('//') || folder.startsWith('/')) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        path: '/api/upload',
        details: { reason: 'Path traversal detectado', folder }
      });
      return NextResponse.json({ error: 'Caminho inválido' }, { status: 400 });
    }

    // Validação: tipo MIME
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: `Tipo de arquivo não permitido: ${file.type}`,
        allowedTypes: ALLOWED_MIME_TYPES
      }, { status: 400 });
    }

    // Validação completa do arquivo (tamanho, magic bytes, etc)
    const maxSize = MAX_SIZE_BY_TYPE[file.type] || MAX_SIZE_BY_TYPE['default'];
    const validation = await validateFile(file, {
      maxSizeMB: maxSize,
      allowedTypes: ALLOWED_MIME_TYPES,
      validateMagicBytes: true
    });

    if (!validation.valid) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        path: '/api/upload',
        details: { reason: 'Validação de arquivo falhou', error: validation.error }
      });
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Garantir que o bucket existe
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.find(b => b.name === bucket);

    if (!bucketExists) {
      await supabaseAdmin.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ALLOWED_MIME_TYPES
      });
    }

    // Gerar nome de arquivo seguro (sem caracteres especiais)
    const fileExt = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
    const timestamp = Date.now();
    const randomId = crypto.randomUUID().split('-')[0];
    const fileName = `${timestamp}-${randomId}.${fileExt}`;
    
    // Sanitizar folder
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9-_/]/g, '');
    const filePath = sanitizedFolder ? `${sanitizedFolder}/${fileName}` : fileName;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Erro no upload Supabase:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (error: unknown) {
    console.error('Erro na rota de upload:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno no upload';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

