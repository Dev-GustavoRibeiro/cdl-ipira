import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const [
      { count: newsCount, error: newsError },
      { count: eventsCount, error: eventsError },
      { count: videosCount, error: videosError },
      { count: heroCount, error: heroError },
      { count: partnersCount, error: partnersError },
      { count: jobsCount, error: jobsError },
    ] = await Promise.all([
      supabaseAdmin.from('news').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('events').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('videos').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('hero_slides').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('partners').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('jobs').select('*', { count: 'exact', head: true }),
    ]);

    const firstError =
      newsError ||
      eventsError ||
      videosError ||
      heroError ||
      partnersError ||
      jobsError;

    if (firstError) {
      throw firstError;
    }

    return NextResponse.json({
      news: newsCount || 0,
      events: eventsCount || 0,
      videos: videosCount || 0,
      hero_slides: heroCount || 0,
      partners: partnersCount || 0,
      jobs: jobsCount || 0,
    });
  } catch (error) {
    console.error('Erro ao carregar estatísticas do dashboard:', error);
    return NextResponse.json({ error: 'Erro ao carregar estatísticas.' }, { status: 500 });
  }
}
