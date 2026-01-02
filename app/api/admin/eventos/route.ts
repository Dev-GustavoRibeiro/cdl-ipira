import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateAndSanitize } from '@/lib/security';
import { auditServer } from '@/lib/audit-server';

// GET - Listar todos os eventos (incluindo inativos para admin)
// GET - Listar todos os eventos (incluindo inativos para admin)
export async function GET() {
  try {
    const { data: events, error } = await supabaseAdmin
      .from('events')
      .select('*, registrations:event_registrations(count)')
      .order('date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar eventos:', error);
      return NextResponse.json({ error: 'Erro ao buscar eventos', details: error }, { status: 500 });
    }

    // Transform the data to flatten the count
    const eventsWithCount = events?.map(event => ({
      ...event,
      registrations_count: event.registrations?.[0]?.count || 0
    }));

    return NextResponse.json(eventsWithCount || []);
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST - Criar novo evento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar campos obrigatórios
    if (!body.title || !body.date || !body.location || !body.category) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando: título, data, local e categoria são obrigatórios' }, { status: 400 });
    }

    // Validar e sanitizar
    const { valid, errors, sanitized } = validateAndSanitize(body, {
      title: { type: 'string', required: true, maxLength: 500 },
      description: { type: 'string', required: false, maxLength: 5000 },
      date: { type: 'string', required: true, maxLength: 20 },
      time: { type: 'string', required: false, maxLength: 10 },
      location: { type: 'string', required: true, maxLength: 300 },
      category: { type: 'string', required: true, maxLength: 50 },
      status: { type: 'string', required: false, maxLength: 20 },
      image: { type: 'url', required: false },
      gradient: { type: 'string', required: false, maxLength: 100 }
    });

    if (!valid) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('events')
      .insert([
        {
          title: sanitized.title,
          description: sanitized.description || '',
          date: sanitized.date,
          time: sanitized.time || '19:00',
          location: sanitized.location,
          category: sanitized.category,
          status: sanitized.status || 'upcoming',
          image: sanitized.image || null,
          gradient: sanitized.gradient || 'from-[#003f7f] to-[#0066cc]',
          attendees: body.attendees ? parseInt(body.attendees) : 0,
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar evento:', error);
      return NextResponse.json({ error: 'Erro ao criar evento', details: error }, { status: 500 });
    }

    // Registrar auditoria
    await auditServer.create(
      'events',
      data.id.toString(),
      sanitized.title as string,
      { category: sanitized.category },
      request
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// PUT - Atualizar evento existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID do evento é obrigatório' }, { status: 400 });
    }

    // Validar campos obrigatórios
    if (!updateData.title || !updateData.date || !updateData.location || !updateData.category) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando: título, data, local e categoria são obrigatórios' }, { status: 400 });
    }

    // Validar e sanitizar
    const { valid, errors, sanitized } = validateAndSanitize(updateData, {
      title: { type: 'string', required: true, maxLength: 500 },
      description: { type: 'string', required: false, maxLength: 5000 },
      date: { type: 'string', required: true, maxLength: 20 },
      time: { type: 'string', required: false, maxLength: 10 },
      location: { type: 'string', required: true, maxLength: 300 },
      category: { type: 'string', required: true, maxLength: 50 },
      status: { type: 'string', required: false, maxLength: 20 },
      image: { type: 'url', required: false },
      gradient: { type: 'string', required: false, maxLength: 100 }
    });

    if (!valid) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }

    const updatePayload: any = {
      title: sanitized.title,
      description: sanitized.description || '',
      date: sanitized.date,
      time: sanitized.time || '19:00',
      location: sanitized.location,
      category: sanitized.category,
      status: sanitized.status || 'upcoming',
      image: sanitized.image || null,
      gradient: sanitized.gradient || 'from-[#003f7f] to-[#0066cc]',
      is_active: true
    };

    if (body.attendees !== undefined) {
      updatePayload.attendees = parseInt(body.attendees);
    }

    const { data, error } = await supabaseAdmin
      .from('events')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar evento:', error);
      return NextResponse.json({ error: 'Erro ao atualizar evento', details: error }, { status: 500 });
    }

    // Registrar auditoria
    await auditServer.update(
      'events',
      id.toString(),
      sanitized.title as string,
      { category: sanitized.category },
      request
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// DELETE - Excluir evento
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do evento é obrigatório' }, { status: 400 });
    }

    // Buscar dados do evento antes de excluir (para auditoria)
    const { data: evento } = await supabaseAdmin
      .from('events')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir evento:', error);
      return NextResponse.json({ error: 'Erro ao excluir evento', details: error }, { status: 500 });
    }

    // Registrar auditoria
    await auditServer.delete(
      'events',
      id,
      evento?.title || 'Evento desconhecido',
      {},
      request
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

