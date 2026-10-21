import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { auditServer } from '@/lib/audit-server';
import { getAdminUser } from '@/lib/supabase-server';

function parseId(value: string | null): number | null {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// GET - Listar inscrições de um evento
export async function GET(request: NextRequest) {
    if (!(await getAdminUser())) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const eventId = parseId(searchParams.get('eventId'));

        if (!eventId) {
            return NextResponse.json({ error: 'ID do evento é obrigatório' }, { status: 400 });
        }

        const { data: registrations, error } = await supabaseAdmin
            .from('event_registrations')
            .select('*')
            .eq('event_id', eventId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar inscrições:', error.message);
            return NextResponse.json({ error: 'Erro ao buscar inscrições' }, { status: 500 });
        }

        return NextResponse.json(registrations || []);
    } catch (error) {
        console.error('Erro interno:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}

// DELETE - Excluir inscrição
export async function DELETE(request: NextRequest) {
    if (!(await getAdminUser())) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = parseId(searchParams.get('id'));
        const eventId = parseId(searchParams.get('eventId'));

        if (!id || !eventId) {
            return NextResponse.json({ error: 'ID da inscrição e do evento são obrigatórios' }, { status: 400 });
        }

        // Buscar dados antes de excluir para auditoria
        const { data: registration } = await supabaseAdmin
            .from('event_registrations')
            .select('name')
            .eq('id', id)
            .eq('event_id', eventId)
            .single();

        if (!registration) {
            return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 });
        }

        const { error } = await supabaseAdmin
            .from('event_registrations')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao excluir inscrição:', error.message);
            return NextResponse.json({ error: 'Erro ao excluir inscrição' }, { status: 500 });
        }

        // Decrementar contador de participantes no evento
        // Nota: Isso é um "fix" manual, idealmente seria via trigger
        try {
            const { data: eventData } = await supabaseAdmin
                .from('events')
                .select('attendees')
                .eq('id', eventId)
                .single();

            if (eventData && eventData.attendees > 0) {
                await supabaseAdmin
                    .from('events')
                    .update({ attendees: eventData.attendees - 1 })
                    .eq('id', eventId);
            }
        } catch (countError) {
            console.error('Erro ao atualizar contador:', countError);
        }

        await auditServer.delete(
            'event_registrations',
            String(id),
            registration.name,
            { eventId },
            request
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro interno:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
