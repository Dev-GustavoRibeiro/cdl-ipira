import React, { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { todayISO } from '@/lib/date';
import { CampaignDetail, Campaign, isMissingSchema } from '../components';

export const revalidate = 300;

interface CampanhaPageProps {
  params: Promise<{ slug: string }>;
}

// Mesma consulta em generateMetadata e na página (deduplicada por requisição)
const getCampaign = cache(async (slug: string): Promise<Campaign | null> => {
  // Slugs são gerados por slugify(): evita consultar o banco com qualquer coisa
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return null;

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    if (isMissingSchema(error)) return null;
    // Falha temporária: não responder 404 (que ficaria em cache)
    throw new Error('Erro ao carregar campanha');
  }
  return data;
});

export async function generateMetadata({ params }: CampanhaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  if (!campaign) return { title: 'Campanha não encontrada' };

  const description = campaign.summary || `Conheça a campanha ${campaign.title} da CDL Ipirá.`;
  return {
    title: campaign.title,
    description,
    openGraph: {
      title: `${campaign.title} - CDL Ipirá`,
      description,
      url: `/imprensa/campanhas/${campaign.slug}`,
      type: 'article',
      ...(campaign.cover_image && { images: [campaign.cover_image] }),
    },
  };
}

export default async function CampanhaPage({ params }: CampanhaPageProps) {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  if (!campaign) notFound();

  return <CampaignDetail campaign={campaign} serverToday={todayISO()} />;
}
