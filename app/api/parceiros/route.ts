import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { auditServer } from '@/lib/audit-server';
import { validateAndSanitize, scanForThreats, isValidUrl, getClientIP, logSecurityEvent } from '@/lib/security';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('partners')
      .select('id, name, logo, website, order_index, is_active')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar associados:', error);
    return NextResponse.json({ error: 'Erro ao buscar associados' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  
  try {
    const body = await request.json();
    
    // Verificar ameaças no payload
    const { safe, threats } = scanForThreats(body, request);
    if (!safe) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        path: '/api/parceiros',
        details: { threats, method: 'POST' }
      });
      return NextResponse.json({ error: 'Dados inválidos detectados' }, { status: 400 });
    }
    
    // Validar e sanitizar dados
    const { valid, errors, sanitized } = validateAndSanitize(body, {
      name: { type: 'string', required: true, maxLength: 100, minLength: 2 },
      logo: { type: 'url', required: true },
      website: { type: 'url', required: false },
      order: { type: 'number', required: false, min: 0, max: 9999 }
    });
    
    if (!valid) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }
    
    // Validar URL da logo (deve ser do Supabase)
    if (sanitized.logo && !sanitized.logo.toString().includes('supabase.co')) {
      return NextResponse.json({ error: 'URL da logo deve ser do storage autorizado' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('partners')
      .insert([
        {
          name: sanitized.name,
          logo: sanitized.logo,
          website: sanitized.website || null,
          order_index: sanitized.order || 0,
          is_active: true
        }
      ])
      .select();

    if (error) throw error;

    // Registrar auditoria
    await auditServer.create(
      'partners',
      data[0].id.toString(),
      sanitized.name as string,
      { website: sanitized.website, order: sanitized.order },
      request
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erro ao criar parceiro:', error);
    return NextResponse.json({ error: 'Erro ao criar parceiro' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const ip = getClientIP(request);
  
  try {
    const body = await request.json();
    
    // Verificar ameaças
    const { safe, threats } = scanForThreats(body, request);
    if (!safe) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        path: '/api/parceiros',
        details: { threats, method: 'PUT' }
      });
      return NextResponse.json({ error: 'Dados inválidos detectados' }, { status: 400 });
    }
    
    // Validar ID
    if (!body.id || typeof body.id !== 'number' || body.id < 1) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const { id, ...updates } = body;

    // Validar e sanitizar dados
    const { valid, errors, sanitized } = validateAndSanitize(updates, {
      name: { type: 'string', required: false, maxLength: 100, minLength: 2 },
      logo: { type: 'url', required: false },
      website: { type: 'url', required: false },
      order: { type: 'number', required: false, min: 0, max: 9999 }
    });
    
    if (!valid) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }
    
    // Validar URL da logo
    if (sanitized.logo && !sanitized.logo.toString().includes('supabase.co')) {
      return NextResponse.json({ error: 'URL da logo deve ser do storage autorizado' }, { status: 400 });
    }

    // Buscar dados antigos para o log
    const { data: oldData } = await supabaseAdmin
      .from('partners')
      .select('name')
      .eq('id', id)
      .single();

    const { data, error } = await supabaseAdmin
      .from('partners')
      .update({
        ...(sanitized.name && { name: sanitized.name }),
        ...(sanitized.logo && { logo: sanitized.logo }),
        ...(sanitized.website !== undefined && { website: sanitized.website || null }),
        ...(sanitized.order !== undefined && { order_index: sanitized.order }),
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    // Registrar auditoria
    await auditServer.update(
      'partners',
      id.toString(),
      (sanitized.name as string) || oldData?.name,
      { 
        old_name: oldData?.name,
        new_name: sanitized.name,
        website: sanitized.website, 
        order: sanitized.order 
      },
      request
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erro ao atualizar parceiro:', error);
    return NextResponse.json({ error: 'Erro ao atualizar parceiro' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const ip = getClientIP(request);
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  // Validar ID
  if (!id || !/^\d+$/.test(id)) {
    logSecurityEvent({
      type: 'invalid_input',
      ip,
      path: '/api/parceiros',
      details: { reason: 'ID inválido', id }
    });
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    // Buscar dados antes de excluir para o log
    const { data: partnerData } = await supabaseAdmin
      .from('partners')
      .select('name')
      .eq('id', parseInt(id))
      .single();

    const { error } = await supabaseAdmin
      .from('partners')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;

    // Registrar auditoria
    await auditServer.delete(
      'partners',
      id,
      partnerData?.name || 'Parceiro',
      undefined,
      request
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir parceiro:', error);
    return NextResponse.json({ error: 'Erro ao excluir parceiro' }, { status: 500 });
  }
}
