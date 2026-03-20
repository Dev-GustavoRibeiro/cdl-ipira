import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateAdminSession, validateFile, getClientIP, logSecurityEvent } from '@/lib/security';

const IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
] as const;

const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const;

interface BucketConfig {
  allowedTypes: readonly string[];
  maxSizeMB: number;
  isPublic: boolean;
}

const BUCKET_CONFIG: Record<string, BucketConfig> = {
  defaults: { allowedTypes: [...IMAGE_TYPES], maxSizeMB: 10, isPublic: true },
  partners: { allowedTypes: [...IMAGE_TYPES], maxSizeMB: 10, isPublic: true },
  news: { allowedTypes: [...IMAGE_TYPES], maxSizeMB: 10, isPublic: true },
  events: { allowedTypes: [...IMAGE_TYPES], maxSizeMB: 10, isPublic: true },
  heroes: { allowedTypes: [...IMAGE_TYPES], maxSizeMB: 10, isPublic: true },
  gallery: { allowedTypes: [...IMAGE_TYPES], maxSizeMB: 20, isPublic: true },
  'team-photos': { allowedTypes: [...IMAGE_TYPES], maxSizeMB: 10, isPublic: true },
  magazines: { allowedTypes: [...IMAGE_TYPES, ...DOCUMENT_TYPES], maxSizeMB: 100, isPublic: true },
  'transparency-documents': { allowedTypes: [...IMAGE_TYPES, ...DOCUMENT_TYPES], maxSizeMB: 50, isPublic: true },
  resumes: { allowedTypes: [...IMAGE_TYPES, ...DOCUMENT_TYPES], maxSizeMB: 10, isPublic: false },
};

type AllowedBucket = keyof typeof BUCKET_CONFIG;

function isAllowedBucket(bucket: string): bucket is AllowedBucket {
  return bucket in BUCKET_CONFIG;
}

function isSafeStoragePath(value: string): boolean {
  return Boolean(value) && !value.includes('..') && !value.includes('//') && !value.startsWith('/');
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  
  try {
    const session = await validateAdminSession(request);
    if (!session.valid) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string || 'defaults';
    const folder = formData.get('folder') as string || '';

    // Validação: arquivo obrigatório
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Validação: bucket na whitelist
    if (!isAllowedBucket(bucket)) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        path: '/api/upload',
        details: { reason: 'Bucket não permitido', bucket }
      });
      return NextResponse.json({ error: 'Bucket não permitido' }, { status: 400 });
    }

    // Validação: folder não pode conter path traversal
    if (folder && !isSafeStoragePath(folder)) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        path: '/api/upload',
        details: { reason: 'Path traversal detectado', folder }
      });
      return NextResponse.json({ error: 'Caminho inválido' }, { status: 400 });
    }

    const bucketConfig = BUCKET_CONFIG[bucket];

    // Validação: tipo MIME
    if (!bucketConfig.allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: `Tipo de arquivo não permitido: ${file.type}`,
        allowedTypes: bucketConfig.allowedTypes
      }, { status: 400 });
    }

    // Validação completa do arquivo (tamanho, magic bytes, etc)
    const validation = await validateFile(file, {
      maxSizeMB: bucketConfig.maxSizeMB,
      allowedTypes: bucketConfig.allowedTypes,
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

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Erro no upload Supabase:', error);
      throw error;
    }

    const responsePayload: { path: string; url?: string } = { path: filePath };

    if (bucketConfig.isPublic) {
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(filePath);
      responsePayload.url = publicUrl;
    }

    return NextResponse.json(responsePayload);
  } catch (error: unknown) {
    console.error('Erro na rota de upload:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno no upload';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const ip = getClientIP(request);

  try {
    const session = await validateAdminSession(request);
    if (!session.valid) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json() as { bucket?: string; path?: string };
    const bucket = body.bucket || '';
    const path = body.path || '';

    if (!isAllowedBucket(bucket)) {
      return NextResponse.json({ error: 'Bucket não permitido' }, { status: 400 });
    }

    if (!isSafeStoragePath(path)) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        path: '/api/upload',
        details: { reason: 'Path de exclusão inválido', bucket, path }
      });
      return NextResponse.json({ error: 'Caminho inválido' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);

    if (error) {
      console.error('Erro ao excluir arquivo do storage:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Erro ao excluir arquivo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno ao excluir arquivo';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

