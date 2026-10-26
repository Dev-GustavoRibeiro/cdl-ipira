import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUser } from '@/lib/supabase-server';
import { validateAndSanitize } from '@/lib/security';
import { auditServer } from '@/lib/audit-server';

const FIELD_LABELS: Record<string, string> = {
  title: 'Título',
  description: 'Descrição',
  date: 'Data',
  time: 'Horário',
  location: 'Local',
  category: 'Categoria',
  status: 'Status',
  image: 'Imagem de capa',
  gradient: 'Cor do card',
};

/** "Campo 'location' excede..." -> "Local excede..." (mensagem que o painel mostra no aviso) */
function friendlyErrors(errors: string[]): string {
  return errors.map((e) => e.replace(/Campo '(\w+)'/, (_, key: string) => FIELD_LABELS[key] || key)).join(' ');
}

const STATUSES = ['upcoming', 'ongoing', 'past'];

/** Regras que o validateAndSanitize não cobre (formatos aceitos pelas colunas date/time/status/attendees). */
function checkFormats(sanitized: Record<string, unknown>, attendees: unknown): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(sanitized.date))) return 'Data inválida.';
  if (sanitized.time && !/^\d{2}:\d{2}(:\d{2})?$/.test(String(sanitized.time))) return 'Horário inválido.';
  if (sanitized.status && !STATUSES.includes(String(sanitized.status))) return 'Status inválido.';
  if (attendees !== undefined && attendees !== null && attendees !== '' && !(Number.isInteger(Number(attendees)) && Number(attendees) >= 0)) {
    return 'O número de inscritos exibido deve ser um inteiro igual ou maior que zero.';
  }
  return null;
}

function parseId(value: unknown): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** campaign_id do corpo: id > 0, null (sem campanha) ou undefined (campo ausente, não altera). false = inválido. */
function parseCampaignId(value: unknown): number | null | undefined | false {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const id = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN;
  return Number.isInteger(id) && id > 0 ? id : false;
}

/** registration_enabled do corpo: boolean, ou undefined (campo ausente, não altera). null = inválido. */
function parseRegistrationEnabled(value: unknown): boolean | undefined | null {
  if (value === undefined) return undefined;
  return typeof value === 'boolean' ? value : null;
}

const INVALID_REGISTRATION = { error: 'O campo "Aceita inscrições" deve ser verdadeiro ou falso.' };

// GET - Listar todos os eventos (incluindo inativos para admin)
export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { data: events, error } = await supabaseAdmin
      .from('events')
      .select('*, registrations:event_registrations(count)')
      .order('date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar eventos:', error);
      return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 });
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
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

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
      return NextResponse.json({ error: friendlyErrors(errors), details: errors }, { status: 400 });
    }

    const formatError = checkFormats(sanitized, body.attendees);
    if (formatError) {
      return NextResponse.json({ error: formatError }, { status: 400 });
    }

    const campaignId = parseCampaignId(body.campaign_id);
    if (campaignId === false) {
      return NextResponse.json({ error: 'Campanha inválida.' }, { status: 400 });
    }

    const registrationEnabled = parseRegistrationEnabled(body.registration_enabled);
    if (registrationEnabled === null) {
      return NextResponse.json(INVALID_REGISTRATION, { status: 400 });
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
          attendees: body.attendees ? Number(body.attendees) : 0,
          is_active: true,
          registration_enabled: registrationEnabled ?? true,
          ...(campaignId !== undefined && { campaign_id: campaignId })
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar evento:', error);
      return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 });
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
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { id: rawId, ...updateData } = body;
    const id = parseId(rawId);

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
      return NextResponse.json({ error: friendlyErrors(errors), details: errors }, { status: 400 });
    }

    const formatError = checkFormats(sanitized, body.attendees);
    if (formatError) {
      return NextResponse.json({ error: formatError }, { status: 400 });
    }

    const campaignId = parseCampaignId(updateData.campaign_id);
    if (campaignId === false) {
      return NextResponse.json({ error: 'Campanha inválida.' }, { status: 400 });
    }

    const registrationEnabled = parseRegistrationEnabled(updateData.registration_enabled);
    if (registrationEnabled === null) {
      return NextResponse.json(INVALID_REGISTRATION, { status: 400 });
    }

    const updatePayload: Record<string, unknown> = {
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

    if (body.attendees !== undefined && body.attendees !== null && body.attendees !== '') {
      updatePayload.attendees = Number(body.attendees);
    }

    if (campaignId !== undefined) {
      updatePayload.campaign_id = campaignId;
    }

    if (registrationEnabled !== undefined) {
      updatePayload.registration_enabled = registrationEnabled;
    }

    const { data, error } = await supabaseAdmin
      .from('events')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar evento:', error);
      return NextResponse.json({ error: 'Erro ao atualizar evento' }, { status: 500 });
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
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = parseId(searchParams.get('id'));

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
      return NextResponse.json({ error: 'Erro ao excluir evento' }, { status: 500 });
    }

    // Registrar auditoria
    await auditServer.delete(
      'events',
      id.toString(),
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

