import { supabase } from '@/lib/supabase';

/** Slides ativos do hero, na ordem do painel (usado pela home no servidor e por /api/hero). */
export async function fetchActiveHeroSlides() {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('id, title, subtitle, description, button_text, button_link, gradient, accent_color, image, image_mobile, image_position, image_fit, pattern, order_index, is_active')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data || [];
}
