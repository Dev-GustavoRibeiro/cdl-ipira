import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isValidEmail } from '@/lib/security';
import { isTodayOrFuture } from '@/lib/date';

const DUPLICATE_CPF = { error: 'CPF já inscrito neste evento', code: 'DUPLICATE_CPF' };

// Remove caracteres de controle e < > (o React já escapa na exibição; não convertemos para entidades HTML)
function cleanText(value: unknown, maxLength: number): string {
    if (typeof value !== 'string') return '';
    return value.replace(/[\x00-\x1F\x7F<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

// CPF: 11 dígitos, não todos iguais, com os dois dígitos verificadores corretos
function isValidCPF(digits: string): boolean {
    if (!/^\d{11}$/.test(digits) || /^(\d)\1{10}$/.test(digits)) return false;
    for (const length of [9, 10]) {
        let sum = 0;
        for (let i = 0; i < length; i++) sum += Number(digits[i]) * (length + 1 - i);
        if (((sum * 10) % 11) % 10 !== Number(digits[length])) return false;
    }
    return true;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null);
        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
        }

        const eventId = Number(body.event_id);
        const name = cleanText(body.name, 120);
        const email = cleanText(body.email, 254).toLowerCase();
        const phone = typeof body.phone === 'string' ? body.phone.replace(/[^\d+\-() ]/g, '').trim().slice(0, 30) : '';
        const cpfDigits = typeof body.cpf === 'string' ? body.cpf.replace(/\D/g, '') : '';
        const company = cleanText(body.company, 120) || null;

        if (!Number.isInteger(eventId) || eventId <= 0 || !name || !email || !cpfDigits || !phone) {
            return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
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

        if (!isValidCPF(cpfDigits)) {
            return NextResponse.json({ error: 'Informe um CPF válido.' }, { status: 400 });
        }

        // Mesmo formato da máscara do formulário (000.000.000-00), para a checagem de duplicidade bater com os registros existentes
        const cpf = cpfDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

        // 1. O evento precisa existir, estar ativo e não ter passado
        const { data: event } = await supabaseAdmin
            .from('events')
            .select('id, date, is_active, attendees')
            .eq('id', eventId)
            .maybeSingle();

        if (!event || !event.is_active) {
            return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
        }

        if (!isTodayOrFuture(event.date)) {
            return NextResponse.json({ error: 'As inscrições para este evento estão encerradas.' }, { status: 400 });
        }

        // 2. Verificar se já existe inscrição com este CPF para este evento
        const { data: existing } = await supabaseAdmin
            .from('event_registrations')
            .select('id')
            .eq('event_id', eventId)
            .eq('cpf', cpf)
            .limit(1);

        if (existing && existing.length > 0) {
            return NextResponse.json(DUPLICATE_CPF, { status: 409 });
        }

        // 3. Inserir a inscrição
        const { error: insertError } = await supabaseAdmin
            .from('event_registrations')
            .insert([
                {
                    event_id: eventId,
                    name,
                    email,
                    cpf,
                    phone,
                    company
                }
            ]);

        if (insertError) {
            // Violação de unicidade (inscrições simultâneas com o mesmo CPF)
            if (insertError.code === '23505') {
                return NextResponse.json(DUPLICATE_CPF, { status: 409 });
            }
            console.error('Erro ao inserir inscrição:', insertError.code, insertError.message);
            return NextResponse.json({ error: 'Erro ao processar inscrição' }, { status: 500 });
        }

        // 4. Incrementar o contador de participantes no evento
        try {
            await supabaseAdmin
                .from('events')
                .update({ attendees: (event.attendees || 0) + 1 })
                .eq('id', eventId);
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
