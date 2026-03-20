import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateAdminSession } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const session = await validateAdminSession(request);
    if (!session.valid) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const buckets = ['partners', 'hero', 'news', 'events', 'videos', 'jobs'];
    const results = [];

    for (const bucket of buckets) {
      // Tentar criar o bucket
      const { data, error } = await supabaseAdmin.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
      });

      if (error) {
        if (error.message.includes('already exists')) {
          results.push({ bucket, status: 'exists' });
        } else {
          console.error(`Erro ao criar bucket ${bucket}:`, error);
          results.push({ bucket, status: 'error', error: error.message });
        }
      } else {
        results.push({ bucket, status: 'created' });
      }
    }

    return NextResponse.json({ message: 'Configuração de storage concluída', results });
  } catch (error: any) {
    console.error('Erro ao configurar storage:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
