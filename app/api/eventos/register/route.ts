import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isValidEmail } from '@/lib/security';
import { isTodayOrFuture } from '@/lib/date';
import { checkFormGuard } from '@/lib/form-guard';

// Uma inscrição por e-mail em cada evento (o CPF deixou de ser pedido: coleta mínima). E-mail novo ou já inscrito
// recebem a mesma resposta: dizer "já inscrito" revelava a terceiros que aquela pessoa vai ao evento.
// Resta o contador público (events.attendees, que o anon lê): só o e-mail novo soma 1. Fecha com confirmação por
// e-mail (o contador só sobe ao confirmar) ou deixando de publicar o número exato.
const REGISTERED = { success: true, message: 'Inscrição realizada com sucesso' };

// Remove caracteres de controle e < > (o React já escapa na exibição; não convertemos para entidades HTML)
function cleanText(value: unknown, maxLength: number): string {
    if (typeof value !== 'string') return '';
    return value.replace(/[\x00-\x1F\x7F<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null);
        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
        }

        // Anti-robô: campo-armadilha preenchido ou envio rápido demais
        const botError = checkFormGuard(body);
        if (botError) {
            return NextResponse.json({ error: botError }, { status: 400 });
        }

        const eventId = Number(body.event_id);
        const name = cleanText(body.name, 120);
        const email = cleanText(body.email, 254).toLowerCase();
        const phone = typeof body.phone === 'string' ? body.phone.replace(/[^\d+\-() ]/g, '').trim().slice(0, 30) : '';
        const company = cleanText(body.company, 120) || null;

        if (!Number.isInteger(eventId) || eventId <= 0 || !name || !email || !phone) {
            return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
        }

        // 1. O evento precisa existir, estar ativo, não ter passado e aceitar inscrição
        // (antes de validar os campos: evento fechado responde o motivo certo)
        const { data: event } = await supabaseAdmin
            .from('events')
            .select('id, date, is_active, attendees, registration_enabled')
            .eq('id', eventId)
            .maybeSingle();

        if (!event || !event.is_active) {
            return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
        }

        if (!isTodayOrFuture(event.date)) {
            return NextResponse.json({ error: 'As inscrições para este evento estão encerradas.' }, { status: 400 });
        }

        if (event.registration_enabled === false) {
            return NextResponse.json(
                { error: 'Este evento tem entrada livre e não recebe inscrições.', code: 'REGISTRATION_DISABLED' },
                { status: 400 }
            );
        }

        if (name.length < 3) {
            return NextResponse.json({ error: 'Informe seu nome completo.' }, { status: 400 });
        }

        if (!isValidEmail(email)) {
            return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
        }

        const phoneDigits = phone.replace(/\D/g, '').length;
        if (phoneDigits < 10 || phoneDigits > 13) {
            return NextResponse.json({ error: 'Informe um telefone válido com DDD.' }, { status: 400 });
        }

        // 2. Inserir a inscrição
        const { error: insertError } = await supabaseAdmin
            .from('event_registrations')
            .insert([
                {
                    event_id: eventId,
                    name,
                    email,
                    phone,
                    company
                }
            ]);

        if (insertError) {
            // E-mail já inscrito neste evento (índice único da migração 20261024120000_event_registrations_email_unique.sql):
            // mesma resposta de sucesso e sem somar participante
            if (insertError.code === '23505') {
                return NextResponse.json(REGISTERED);
            }
            console.error('Erro ao inserir inscrição:', insertError.code, insertError.message);
            return NextResponse.json({ error: 'Erro ao processar inscrição' }, { status: 500 });
        }

        // 3. Incrementar o contador de participantes no evento
        try {
            await supabaseAdmin
                .from('events')
                .update({ attendees: (event.attendees || 0) + 1 })
                .eq('id', eventId);
        } catch (countError) {
            // Não falhamos a requisição se apenas o contador falhar, mas logamos
            console.error('Erro ao atualizar contador de participantes:', countError);
        }

        return NextResponse.json(REGISTERED);

    } catch (error) {
        console.error('Erro interno na inscrição:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
