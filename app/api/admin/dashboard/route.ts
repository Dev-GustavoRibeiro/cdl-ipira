import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUser } from '@/lib/supabase-server';

// Contagens com head:true (só o total, sem trazer linhas)
const headCount = (table: string) => supabaseAdmin.from(table).select('*', { count: 'exact', head: true });

const COUNTS = {
  news: () => headCount('news'),
  events: () => headCount('events'),
  campaigns: () => headCount('campaigns'),
  videos: () => headCount('videos'),
  albums: () => headCount('albums'),
  magazines: () => headCount('magazines'),
  hero_slides: () => headCount('hero_slides'),
  partners: () => headCount('partners'),
  jobs: () => headCount('jobs'),
  registrations: () => headCount('event_registrations'),
  legal_pending: () => headCount('legal_requests').eq('status', 'pending'),
};

export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const keys = Object.keys(COUNTS) as Array<keyof typeof COUNTS>;
    const [results, recentResult] = await Promise.all([
      Promise.all(keys.map((key) => COUNTS[key]())),
      supabaseAdmin
        .from('audit_log')
        .select('id, action, table_name, record_title, user_name, created_at')
        .order('created_at', { ascending: false })
        .limit(6),
    ]);

    // Uma tabela com problema (ex.: migração pendente) vira null ("—" no painel) em vez de derrubar o dashboard
    const counts = {} as Record<keyof typeof COUNTS, number | null>;
    results.forEach(({ count, error }, i) => {
      if (error) console.error(`Erro ao contar ${keys[i]}:`, error);
      counts[keys[i]] = error ? null : count ?? 0;
    });

    if (keys.every((key) => counts[key] === null)) {
      throw new Error('Nenhuma contagem disponível');
    }

    if (recentResult.error) {
      console.error('Erro ao buscar atividade recente:', recentResult.error);
    }

    return NextResponse.json({ ...counts, recent: recentResult.data ?? [] });
  } catch (error) {
    console.error('Erro ao carregar estatísticas do dashboard:', error);
    return NextResponse.json({ error: 'Erro ao carregar estatísticas.' }, { status: 500 });
  }
}
