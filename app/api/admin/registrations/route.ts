import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { auditServer } from '@/lib/audit-server';

// GET - Listar inscrições de um evento
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId');

        if (!eventId) {
            return NextResponse.json({ error: 'ID do evento é obrigatório' }, { status: 400 });
        }

        const { data: registrations, error } = await supabaseAdmin
            .from('event_registrations')
            .select('*')
            .eq('event_id', eventId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar inscrições:', error);
            return NextResponse.json({ error: 'Erro ao buscar inscrições', details: error }, { status: 500 });
        }

        return NextResponse.json(registrations || []);
    } catch (error) {
        console.error('Erro interno:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}

// DELETE - Excluir inscrição
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const eventId = searchParams.get('eventId');

        if (!id || !eventId) {
            return NextResponse.json({ error: 'ID da inscrição e do evento são obrigatórios' }, { status: 400 });
        }

        // Buscar dados antes de excluir para auditoria e logs
        const { data: registration } = await supabaseAdmin
            .from('event_registrations')
            .select('name')
            .eq('id', id)
            .single();

        const { error } = await supabaseAdmin
            .from('event_registrations')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao excluir inscrição:', error);
            return NextResponse.json({ error: 'Erro ao excluir inscrição', details: error }, { status: 500 });
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

        // Registrar auditoria (opcional)
        if (registration) {
            /* await auditServer.delete(
              'event_registrations',
              id,
              registration.name,
              { eventId },
              request
            ); */
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro interno:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
