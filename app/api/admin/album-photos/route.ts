import { NextRequest, NextResponse } from 'next/server';
import { auditServer } from '@/lib/audit-server';
import { isSafeLink, sanitizeString } from '@/lib/security';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUser } from '@/lib/supabase-server';

function sanitizePhotoPayload(body: Record<string, unknown>) {
  return {
    album_id: Number(body.album_id),
    url: sanitizeString(String(body.url || '')),
    title: sanitizeString(String(body.title || '')).slice(0, 255) || null,
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

  if (!isSafeLink(payload.url, 1000)) {
    return 'A foto deve ser um endereço http(s):// ou um caminho do site.';
  }

  if (!Number.isInteger(payload.display_order) || payload.display_order < 0) {
    return 'Ordem da foto inválida.';
  }

  return null;
}

export async function GET(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

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
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

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

// PUT - Reordenar as fotos de um álbum: { album_id, ids: [idDaPrimeira, idDaSegunda, ...] }
export async function PUT(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const albumId = Number(body.album_id);
    const ids: unknown[] = Array.isArray(body.ids) ? body.ids : [];

    if (!Number.isInteger(albumId) || albumId <= 0) {
      return NextResponse.json({ error: 'Álbum inválido.' }, { status: 400 });
    }
    if (ids.length === 0 || ids.length > 1000 || !ids.every((id) => Number.isInteger(id) && (id as number) > 0) || new Set(ids).size !== ids.length) {
      return NextResponse.json({ error: 'Lista de fotos inválida.' }, { status: 400 });
    }

    // ponytail: uma atualização por foto (álbuns têm dezenas de fotos); trocar por uma função SQL se passarem de centenas
    const results = await Promise.all(
      (ids as number[]).map((id, index) =>
        supabaseAdmin.from('album_photos').update({ display_order: index }).eq('id', id).eq('album_id', albumId)
      )
    );
    const failed = results.find((result) => result.error);

    if (failed?.error) {
      console.error('Erro ao reordenar fotos:', failed.error);
      return NextResponse.json({ error: 'Erro ao salvar a nova ordem das fotos.' }, { status: 500 });
    }

    await auditServer.update('album_photos', String(albumId), 'Ordem das fotos', { album_id: albumId, total: ids.length }, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao reordenar fotos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

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
