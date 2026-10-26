import React, { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/app/components/seo/JsonLd';
import { supabase } from '@/lib/supabase';
import { todayISO } from '@/lib/date';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
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

  return pageMetadata({
    title: campaign.title,
    description: campaign.summary || `Conheça a campanha ${campaign.title} da CDL Ipirá e participe no comércio de Ipirá-BA.`,
    path: `/imprensa/campanhas/${campaign.slug}`,
    image: campaign.cover_image,
    article: { publishedTime: campaign.created_at, modifiedTime: campaign.updated_at },
  });
}

export default async function CampanhaPage({ params }: CampanhaPageProps) {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  if (!campaign) notFound();

  // Sem Event: os eventos da campanha não têm página própria, e o Google só aceita Event em página de um evento só
  return (
    <>
      <CampaignDetail campaign={campaign} serverToday={todayISO()} />
      <JsonLd data={[breadcrumbJsonLd(['Campanhas', '/imprensa/campanhas'], [campaign.title, `/imprensa/campanhas/${campaign.slug}`])]} />
    </>
  );
}
