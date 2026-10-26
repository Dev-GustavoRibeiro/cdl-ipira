import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/supabase-server';

// Administrador logado (nome/e-mail para o menu da conta do painel). O proxy já aplica no-store em /api/admin.
export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  return NextResponse.json({ id: admin.id, email: admin.email, name: admin.name });
}
