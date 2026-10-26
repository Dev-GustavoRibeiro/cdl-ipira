import { NextResponse } from 'next/server';
import { fetchActiveHeroSlides } from '@/lib/hero';

export async function GET() {
  try {
    return NextResponse.json(await fetchActiveHeroSlides());
  } catch (error) {
    console.error('Erro ao buscar slides:', error);
    return NextResponse.json({ error: 'Erro ao buscar slides' }, { status: 500 });
  }
}
