import { NextRequest, NextResponse } from 'next/server';
import { auditServer } from '@/lib/audit-server';
import { sanitizeString } from '@/lib/security';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUser } from '@/lib/supabase-server';

/** campaign_id do corpo: id > 0, null (sem campanha) ou undefined (campo ausente, não altera). false = inválido. */
function parseCampaignId(value: unknown): number | null | undefined | false {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const id = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN;
  return Number.isInteger(id) && id > 0 ? id : false;
}

function sanitizeAlbumPayload(body: Record<string, unknown>) {
  return {
    title: sanitizeString(String(body.title || '')),
    description: sanitizeString(String(body.description || '')) || null,
    category: sanitizeString(String(body.category || '')),
    date: body.date ? String(body.date) : null,
    location: sanitizeString(String(body.location || '')) || null,
    cover_url: sanitizeString(String(body.cover_url || '')) || null,
    cover: sanitizeString(String(body.cover || '')) || null,
    is_active: body.is_active !== false,
  };
}

function validateAlbumPayload(payload: ReturnType<typeof sanitizeAlbumPayload>) {
  if (!payload.title || !payload.category || !payload.date) {
    return 'Título, categoria e data são obrigatórios.';
  }

  return null;
}

export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { data: albums, error } = await supabaseAdmin
      .from('albums')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar álbuns:', error);
      return NextResponse.json({ error: 'Erro ao buscar álbuns.' }, { status: 500 });
    }

    const albumsWithCount = await Promise.all(
      (albums || []).map(async (album) => {
        const { count } = await supabaseAdmin
          .from('album_photos')
          .select('*', { count: 'exact', head: true })
          .eq('album_id', album.id);

        return {
          ...album,
          cover_url: album.cover_url || album.cover,
          is_active: album.is_active !== false,
          photo_count: count || 0,
        };
      })
    );

    return NextResponse.json(albumsWithCount);
  } catch (error) {
    console.error('Erro ao buscar álbuns:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = sanitizeAlbumPayload(body);
    const validationError = validateAlbumPayload(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const campaignId = parseCampaignId(body.campaign_id);
    if (campaignId === false) {
      return NextResponse.json({ error: 'Campanha inválida.' }, { status: 400 });
    }

    const insertPayload = {
      ...payload,
      cover_url: payload.cover_url || payload.cover,
      cover: payload.cover || payload.cover_url,
      ...(campaignId !== undefined && { campaign_id: campaignId }),
    };

    const { data, error } = await supabaseAdmin
      .from('albums')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar álbum:', error);
      return NextResponse.json({ error: 'Erro ao criar álbum.' }, { status: 500 });
    }

    await auditServer.create('albums', data.id.toString(), payload.title, { category: payload.category }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao criar álbum:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'ID do álbum é obrigatório.' }, { status: 400 });
    }

    const payload = sanitizeAlbumPayload(body);
    const validationError = validateAlbumPayload(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const campaignId = parseCampaignId(body.campaign_id);
    if (campaignId === false) {
      return NextResponse.json({ error: 'Campanha inválida.' }, { status: 400 });
    }

    // Sem campaign_id no corpo (ex.: botão ativar/ocultar) o vínculo atual é mantido
    const updatePayload = {
      ...payload,
      cover_url: payload.cover_url || payload.cover,
      cover: payload.cover || payload.cover_url,
      ...(campaignId !== undefined && { campaign_id: campaignId }),
    };

    const { data, error } = await supabaseAdmin
      .from('albums')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar álbum:', error);
      return NextResponse.json({ error: 'Erro ao atualizar álbum.' }, { status: 500 });
    }

    await auditServer.update('albums', id.toString(), payload.title, { category: payload.category }, request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao atualizar álbum:', error);
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
      return NextResponse.json({ error: 'ID do álbum é obrigatório.' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('albums')
      .select('title')
      .eq('id', id)
      .single();

    await supabaseAdmin
      .from('album_photos')
      .delete()
      .eq('album_id', id);

    const { error } = await supabaseAdmin
      .from('albums')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir álbum:', error);
      return NextResponse.json({ error: 'Erro ao excluir álbum.' }, { status: 500 });
    }

    await auditServer.delete('albums', id.toString(), existing?.title || 'Álbum', {}, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir álbum:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
