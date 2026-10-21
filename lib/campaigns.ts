/**
 * Campanhas: tipo da tabela public.campaigns e regras compartilhadas entre site e painel.
 * O status não é gravado no banco: deriva das datas (start_date/end_date, formato YYYY-MM-DD).
 */

import { todayISO } from './date';

export interface Campaign {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  cover_image: string | null;
  start_date: string;
  end_date: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type CampaignStatus = 'upcoming' | 'active' | 'finished';

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, { text: string; color: string }> = {
  upcoming: { text: 'Em breve', color: 'bg-[#00a859] text-white' },
  active: { text: 'Em andamento', color: 'bg-[#ffd000] text-[#003f7f]' },
  finished: { text: 'Realizada', color: 'bg-gray-600 text-white' },
};

export function getCampaignStatus(
  campaign: Pick<Campaign, 'start_date' | 'end_date'>,
  today: string = todayISO()
): CampaignStatus {
  if (campaign.start_date > today) return 'upcoming';
  if (campaign.end_date && campaign.end_date < today) return 'finished';
  return 'active';
}

/** 'Natal Premiado 2026!' -> 'natal-premiado-2026' */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 70) // deixa espaço para o sufixo de unicidade (-2, -3...) dentro do limite de 80
    .replace(/^-+|-+$/g, '');
}
