import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { event_id, name, email, cpf, phone, company } = body;

        if (!event_id || !name || !email || !cpf || !phone) {
            return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
        }

        // 1. Verificar se já existe inscrição com este CPF para este evento
        const { data: existing } = await supabaseAdmin
            .from('event_registrations')
            .select('id')
            .eq('event_id', event_id)
            .eq('cpf', cpf)
            .single();

        if (existing) {
            return NextResponse.json({ error: 'CPF já inscrito neste evento', code: 'DUPLICATE_CPF' }, { status: 409 });
        }

        // 2. Inserir a inscrição
        const { error: insertError } = await supabaseAdmin
            .from('event_registrations')
            .insert([
                {
                    event_id,
                    name,
                    email,
                    cpf,
                    phone,
                    company
                }
            ]);

        if (insertError) {
            console.error('Erro ao inserir inscrição:', insertError);
            return NextResponse.json({ error: 'Erro ao processar inscrição', details: insertError }, { status: 500 });
        }

        // 3. Incrementar o contador de participantes no evento
        try {
            // Primeiro pegamos o valor atual para garantir consistência
            const { data: eventData, error: eventError } = await supabaseAdmin
                .from('events')
                .select('attendees')
                .eq('id', event_id)
                .single();

            if (!eventError && eventData) {
                const currentAttendees = eventData.attendees || 0;

                await supabaseAdmin
                    .from('events')
                    .update({ attendees: currentAttendees + 1 })
                    .eq('id', event_id);
            }
        } catch (countError) {
            // Não falhamos a requisição se apenas o contador falhar, mas logamos
            console.error('Erro ao atualizar contador de participantes:', countError);
        }

        return NextResponse.json({ success: true, message: 'Inscrição realizada com sucesso' });

    } catch (error) {
        console.error('Erro interno na inscrição:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
