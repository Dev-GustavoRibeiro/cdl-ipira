import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { auditServer } from '@/lib/audit-server';
import { validateAndSanitize, getClientIP, logSecurityEvent, isSafeLink } from '@/lib/security';
import { getAdminUser } from '@/lib/supabase-server';

// Cada alteração salva chama revalidatePath('/'): a home traz os slides no HTML (ISR) e mostra a mudança na hora
const UNAUTHORIZED = { error: 'Não autorizado' };
const INVALID_LINK = { error: 'Link do botão deve ser um caminho do site (ex: /eventos) ou um endereço http(s)://' };

// Opções do painel (cores da marca). As classes viram className no site, então só valores conhecidos são gravados.
const GRADIENTS = new Set([
  '',
  'from-[#003f7f] via-[#0052a3] to-[#0066cc]',
  'from-[#001a3d] via-[#002855] to-[#003f7f]',
  'from-[#00a859] via-[#00c46a] to-[#00d670]',
  'from-[#ffd000] via-[#ffda33] to-[#ffed4e]',
]);
const ACCENTS = new Set(['', 'bg-[#ffd000]', 'bg-[#0066cc]', 'bg-[#00a859]', 'bg-white']);
const FITS = new Set(['cover', 'contain']);
const POSITIONS = new Set(['left top', 'top', 'right top', 'left', 'center', 'right', 'left bottom', 'bottom', 'right bottom']);
const PATTERNS = new Set(['', 'music', 'business']);

/** Mensagem de erro de opção fora da lista (null = ok). Campos ausentes não são checados (PUT parcial). */
function invalidOption(s: Record<string, unknown>) {
  if (s.gradient !== undefined && !GRADIENTS.has(String(s.gradient))) return 'Cor de fundo inválida.';
  if (s.accentColor !== undefined && !ACCENTS.has(String(s.accentColor))) return 'Cor do botão inválida.';
  if (s.imageFit !== undefined && !FITS.has(String(s.imageFit))) return 'Ajuste da imagem inválido.';
  if (s.imagePosition !== undefined && !POSITIONS.has(String(s.imagePosition))) return 'Posição da imagem inválida.';
  if (s.pattern !== undefined && s.pattern !== null && !PATTERNS.has(String(s.pattern))) return 'Textura inválida.';
  return null;
}

export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('hero_slides')
      .select('id, title, subtitle, description, button_text, button_link, gradient, accent_color, image, image_mobile, image_position, image_fit, pattern, order_index, is_active')
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar slides do admin:', error);
    return NextResponse.json({ error: 'Erro ao buscar slides' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  try {
    const body = await request.json();

    if (body.buttonLink && !isSafeLink(body.buttonLink)) {
      return NextResponse.json(INVALID_LINK, { status: 400 });
    }

    const { valid, errors, sanitized } = validateAndSanitize(body, {
      title: { type: 'string', required: true, maxLength: 100 },
      subtitle: { type: 'string', required: false, maxLength: 200 },
      description: { type: 'string', required: false, maxLength: 500 },
      buttonText: { type: 'string', required: false, maxLength: 50 },
      buttonLink: { type: 'url', required: false },
      gradient: { type: 'string', required: false, maxLength: 200 },
      accentColor: { type: 'string', required: false, maxLength: 50 },
      image: { type: 'url', required: false },
      imageMobile: { type: 'url', required: false },
      imagePosition: { type: 'string', required: false, maxLength: 50 },
      imageFit: { type: 'string', required: false, maxLength: 20 },
      pattern: { type: 'string', required: false, maxLength: 50 },
      order: { type: 'number', required: false, min: 0, max: 9999 },
      isActive: { type: 'boolean', required: false },
    });

    if (!valid) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }

    const optionError = invalidOption(sanitized);
    if (optionError) {
      return NextResponse.json({ error: optionError }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('hero_slides')
      .insert([
        {
          title: sanitized.title,
          // Colunas NOT NULL sem valor padrão na tabela: campo opcional vazio vira '' (null quebrava a criação)
          subtitle: sanitized.subtitle || '',
          description: sanitized.description || '',
          button_text: sanitized.buttonText || '',
          button_link: sanitized.buttonLink || '',
          gradient: sanitized.gradient ?? '',
          accent_color: sanitized.accentColor ?? '',
          image: sanitized.image || null,
          image_mobile: sanitized.imageMobile || null,
          image_position: sanitized.imagePosition || 'center',
          image_fit: sanitized.imageFit || 'cover',
          pattern: sanitized.pattern || null,
          order_index: sanitized.order || 0,
          is_active: sanitized.isActive !== false
        }
      ])
      .select();

    if (error) throw error;

    await auditServer.create(
      'hero_slides',
      data[0].id.toString(),
      sanitized.title as string,
      undefined,
      request
    );

    revalidatePath('/');
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erro ao criar slide:', error);
    return NextResponse.json({ error: 'Erro ao criar slide' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.id || typeof body.id !== 'number' || body.id < 1) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    if (body.buttonLink && !isSafeLink(body.buttonLink)) {
      return NextResponse.json(INVALID_LINK, { status: 400 });
    }

    const { id, ...updates } = body;
    const { valid, errors, sanitized } = validateAndSanitize(updates, {
      title: { type: 'string', required: false, maxLength: 100 },
      subtitle: { type: 'string', required: false, maxLength: 200 },
      description: { type: 'string', required: false, maxLength: 500 },
      buttonText: { type: 'string', required: false, maxLength: 50 },
      buttonLink: { type: 'url', required: false },
      gradient: { type: 'string', required: false, maxLength: 200 },
      accentColor: { type: 'string', required: false, maxLength: 50 },
      image: { type: 'url', required: false },
      imageMobile: { type: 'url', required: false },
      imagePosition: { type: 'string', required: false, maxLength: 50 },
      imageFit: { type: 'string', required: false, maxLength: 20 },
      pattern: { type: 'string', required: false, maxLength: 50 },
      order: { type: 'number', required: false, min: 0, max: 9999 },
      isActive: { type: 'boolean', required: false },
    });

    if (!valid) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 });
    }

    const optionError = invalidOption(sanitized);
    if (optionError) {
      return NextResponse.json({ error: optionError }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('hero_slides')
      .update({
        ...(sanitized.title && { title: sanitized.title }),
        ...(sanitized.subtitle !== undefined && { subtitle: sanitized.subtitle || '' }),
        ...(sanitized.description !== undefined && { description: sanitized.description || '' }),
        ...(sanitized.buttonText !== undefined && { button_text: sanitized.buttonText || '' }),
        ...(sanitized.buttonLink !== undefined && { button_link: sanitized.buttonLink || '' }),
        ...(sanitized.gradient !== undefined && { gradient: sanitized.gradient ?? '' }),
        ...(sanitized.accentColor !== undefined && { accent_color: sanitized.accentColor ?? '' }),
        ...(sanitized.image !== undefined && { image: sanitized.image || null }),
        ...(sanitized.imageMobile !== undefined && { image_mobile: sanitized.imageMobile || null }),
        ...(sanitized.imagePosition !== undefined && { image_position: sanitized.imagePosition || 'center' }),
        ...(sanitized.imageFit !== undefined && { image_fit: sanitized.imageFit || 'cover' }),
        ...(sanitized.pattern !== undefined && { pattern: sanitized.pattern || null }),
        ...(sanitized.order !== undefined && { order_index: sanitized.order }),
        ...(sanitized.isActive !== undefined && { is_active: sanitized.isActive }),
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data?.length) {
      return NextResponse.json({ error: 'Slide não encontrado' }, { status: 404 });
    }

    await auditServer.update(
      'hero_slides',
      id.toString(),
      (sanitized.title as string) || data[0].title || 'Slide',
      sanitized.isActive !== undefined ? { is_active: sanitized.isActive } : undefined,
      request
    );

    revalidatePath('/');
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Erro ao atualizar slide:', error);
    return NextResponse.json({ error: 'Erro ao atualizar slide' }, { status: 500 });
  }
}

// PATCH - reordenação: { items: [{ id, order }] } (só a ordem muda)
export async function PATCH(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  try {
    const body = await request.json();
    const items: unknown = body?.items;
    const valid =
      Array.isArray(items) &&
      items.length > 0 &&
      items.length <= 200 &&
      items.every((it) => Number.isInteger(it?.id) && it.id > 0 && Number.isInteger(it?.order) && it.order >= 0 && it.order <= 9999);

    if (!valid) {
      return NextResponse.json({ error: 'Ordem inválida' }, { status: 400 });
    }

    const results = await Promise.all(
      (items as { id: number; order: number }[]).map(({ id, order }) =>
        supabaseAdmin.from('hero_slides').update({ order_index: order }).eq('id', id)
      )
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) throw failed.error;

    await auditServer.update('hero_slides', 'ordem', 'Ordem dos slides', { itens: (items as unknown[]).length }, request);
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao reordenar slides:', error);
    return NextResponse.json({ error: 'Erro ao salvar a nova ordem' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  const ip = getClientIP(request);
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id || !/^\d+$/.test(id)) {
    logSecurityEvent({
      type: 'invalid_input',
      ip,
      path: '/api/admin/hero',
      details: { reason: 'ID inválido', id }
    });
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const { data: slideData } = await supabaseAdmin
      .from('hero_slides')
      .select('title')
      .eq('id', parseInt(id, 10))
      .single();

    const { error } = await supabaseAdmin
      .from('hero_slides')
      .delete()
      .eq('id', parseInt(id, 10));

    if (error) throw error;

    await auditServer.delete(
      'hero_slides',
      id,
      slideData?.title || 'Slide',
      undefined,
      request
    );

    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir slide:', error);
    return NextResponse.json({ error: 'Erro ao excluir slide' }, { status: 500 });
  }
}
