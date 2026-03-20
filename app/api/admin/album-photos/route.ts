import { NextRequest, NextResponse } from 'next/server';
import { auditServer } from '@/lib/audit-server';
import { sanitizeString } from '@/lib/security';
import { supabaseAdmin } from '@/lib/supabase-admin';

function sanitizePhotoPayload(body: Record<string, unknown>) {
  return {
    album_id: Number(body.album_id),
    url: sanitizeString(String(body.url || '')),
    title: sanitizeString(String(body.title || '')) || null,
    display_order: Number(body.display_order || 0),
  };
}

function validatePhotoPayload(payload: ReturnType<typeof sanitizePhotoPayload>) {
  if (!Number.isInteger(payload.album_id) || payload.album_id <= 0) {
    return 'Álbum inválido.';
  }

  if (!payload.url) {
    return 'URL da foto é obrigatória.';
  }

  if (!Number.isInteger(payload.display_order) || payload.display_order < 0) {
    return 'Ordem da foto inválida.';
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const albumId = Number(searchParams.get('albumId'));

    if (!Number.isInteger(albumId) || albumId <= 0) {
      return NextResponse.json({ error: 'Parâmetro albumId é obrigatório.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('album_photos')
      .select('*')
      .eq('album_id', albumId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Erro ao buscar fotos do álbum:', error);
      return NextResponse.json({ error: 'Erro ao buscar fotos.' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar fotos do álbum:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = sanitizePhotoPayload(body);
    const validationError = validatePhotoPayload(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('album_photos')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar foto do álbum:', error);
      return NextResponse.json({ error: 'Erro ao salvar foto.' }, { status: 500 });
    }

    await auditServer.create('album_photos', data.id.toString(), payload.title || 'Foto do álbum', { album_id: payload.album_id }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao criar foto do álbum:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'ID da foto é obrigatório.' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('album_photos')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('album_photos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir foto do álbum:', error);
      return NextResponse.json({ error: 'Erro ao excluir foto.' }, { status: 500 });
    }

    await auditServer.delete('album_photos', id.toString(), existing?.title || 'Foto do álbum', {}, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir foto do álbum:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
