import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { auditServer } from '@/lib/audit-server';
import { validateAndSanitize, scanForThreats, getClientIP, logSecurityEvent } from '@/lib/security';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('hero_slides')
      .select('id, title, subtitle, description, button_text, button_link, gradient, accent_color, image, image_position, image_fit, pattern, order_index, is_active')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar slides:', error);
    return NextResponse.json({ error: 'Erro ao buscar slides' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  
  try {
    const body = await request.json();
    
    // Verificar ameaças
    const { safe, threats } = scanForThreats(body, request);
    if (!safe) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        path: '/api/hero',
        details: { threats, method: 'POST' }
      });
      return NextResponse.json({ error: 'Dados inválidos detectados' }, { status: 400 });
    }
    
    // Validar e sanitizar
    const { valid, errors, sanitized } = validateAndSanitize(body, {
      title: { type: 'string', required: true, maxLength: 100 },
      subtitle: { type: 'string', required: false, maxLength: 200 },
      description: { type: 'string', required: false, maxLength: 500 },
      buttonText: { type: 'string', required: false, maxLength: 50 },
      buttonLink: { type: 'string', required: false, maxLength: 500 },
      gradient: { type: 'string', required: false, maxLength: 200 },
      accentColor: { type: 'string', required: false, maxLength: 50 },
      image: { type: 'url', required: false },
      imagePosition: { type: 'string', required: false, maxLength: 50 },
      imageFit: { type: 'string', required: false, maxLength: 20 },
      pattern: { type: 'string', required: false, maxLength: 50 },
      order: { type: 'number', required: false, min: 0, max: 9999 }
    });
    
    if (!valid) {
      console.error('[POST /api/hero] Erro de validação:', errors);
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }
    
    const { data, error } = await supabaseAdmin
      .from('hero_slides')
      .insert([
        {
          title: sanitized.title,
          subtitle: sanitized.subtitle || null,
          description: sanitized.description || null,
          button_text: sanitized.buttonText || null,
          button_link: sanitized.buttonLink || null,
          gradient: sanitized.gradient ?? '',
          accent_color: sanitized.accentColor ?? '',
          image: sanitized.image || null,
          image_position: sanitized.imagePosition || 'center',
          image_fit: sanitized.imageFit || 'cover',
          pattern: sanitized.pattern || null,
          order_index: sanitized.order || 0,
          is_active: true
        }
      ])
      .select();

    if (error) throw error;

    // Registrar auditoria
    await auditServer.create(
      'hero_slides',
      data[0].id.toString(),
      sanitized.title as string,
      undefined,
      request
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erro ao criar slide:', error);
    return NextResponse.json({ error: 'Erro ao criar slide' }, { status: 500 });
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
        path: '/api/hero',
        details: { threats, method: 'PUT' }
      });
      return NextResponse.json({ error: 'Dados inválidos detectados' }, { status: 400 });
    }
    
    // Validar ID
    if (!body.id || typeof body.id !== 'number' || body.id < 1) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const { id, ...updates } = body;

    // Validar e sanitizar
    const { valid, errors, sanitized } = validateAndSanitize(updates, {
      title: { type: 'string', required: false, maxLength: 100 },
      subtitle: { type: 'string', required: false, maxLength: 200 },
      description: { type: 'string', required: false, maxLength: 500 },
      buttonText: { type: 'string', required: false, maxLength: 50 },
      buttonLink: { type: 'string', required: false, maxLength: 500 },
      gradient: { type: 'string', required: false, maxLength: 200 },
      accentColor: { type: 'string', required: false, maxLength: 50 },
      image: { type: 'url', required: false },
      imagePosition: { type: 'string', required: false, maxLength: 50 },
      imageFit: { type: 'string', required: false, maxLength: 20 },
      pattern: { type: 'string', required: false, maxLength: 50 },
      order: { type: 'number', required: false, min: 0, max: 9999 }
    });
    
    if (!valid) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('hero_slides')
      .update({
        ...(sanitized.title && { title: sanitized.title }),
        ...(sanitized.subtitle !== undefined && { subtitle: sanitized.subtitle || null }),
        ...(sanitized.description !== undefined && { description: sanitized.description || null }),
        ...(sanitized.buttonText !== undefined && { button_text: sanitized.buttonText || null }),
        ...(sanitized.buttonLink !== undefined && { button_link: sanitized.buttonLink || null }),
        ...(sanitized.gradient !== undefined && { gradient: sanitized.gradient ?? '' }),
        ...(sanitized.accentColor !== undefined && { accent_color: sanitized.accentColor ?? '' }),
        ...(sanitized.image !== undefined && { image: sanitized.image || null }),
        ...(sanitized.imagePosition !== undefined && { image_position: sanitized.imagePosition || 'center' }),
        ...(sanitized.imageFit !== undefined && { image_fit: sanitized.imageFit || 'cover' }),
        ...(sanitized.pattern !== undefined && { pattern: sanitized.pattern || null }),
        ...(sanitized.order !== undefined && { order_index: sanitized.order }),
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    // Registrar auditoria
    await auditServer.update(
      'hero_slides',
      id.toString(),
      sanitized.title as string || 'Slide',
      undefined,
      request
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erro ao atualizar slide:', error);
    return NextResponse.json({ error: 'Erro ao atualizar slide' }, { status: 500 });
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
      path: '/api/hero',
      details: { reason: 'ID inválido', id }
    });
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    // Buscar dados antes de excluir para o log
    const { data: slideData } = await supabaseAdmin
      .from('hero_slides')
      .select('title')
      .eq('id', parseInt(id))
      .single();

    const { error } = await supabaseAdmin
      .from('hero_slides')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;

    // Registrar auditoria
    await auditServer.delete(
      'hero_slides',
      id,
      slideData?.title || 'Slide',
      undefined,
      request
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir slide:', error);
    return NextResponse.json({ error: 'Erro ao excluir slide' }, { status: 500 });
  }
}

