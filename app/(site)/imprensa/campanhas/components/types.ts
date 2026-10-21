import { formatDateLong } from '@/lib/date';
import type { Campaign } from '@/lib/campaigns';

export type { Campaign, CampaignStatus } from '@/lib/campaigns';

/** '1 de dezembro de 2026 – 31 de dezembro de 2026' ou 'A partir de 1 de dezembro de 2026' */
export const formatPeriod = (
  campaign: Pick<Campaign, 'start_date' | 'end_date'>,
  format: (value: string) => string = formatDateLong
) =>
  campaign.end_date
    ? `${format(campaign.start_date)} – ${format(campaign.end_date)}`
    : `A partir de ${format(campaign.start_date)}`;

/** Tabela ou coluna ainda não criada (migração pendente): a página trata como lista vazia. */
export const isMissingSchema = (error: { code?: string } | null) =>
  ['42P01', '42703', 'PGRST204', 'PGRST205'].includes(error?.code ?? '');
