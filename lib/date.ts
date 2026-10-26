/**
 * Datas "YYYY-MM-DD" do banco são datas de calendário, sem fuso.
 * new Date('2026-10-20') vira meia-noite UTC e aparece como dia 19 no Brasil (UTC-3).
 */

/** Converte 'YYYY-MM-DD' (ou ISO com hora) ou 'DD/MM/YYYY' em Date local, sem deslocar o dia. */
export function parseDateOnly(value: string | null | undefined): Date | null {
  if (!value) return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const br = iso ? null : /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  const [y, m, d] = iso ? [iso[1], iso[2], iso[3]] : br ? [br[3], br[2], br[1]] : [];
  if (!y) return null;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Data de hoje em Ipirá (America/Bahia, UTC-3) no formato 'YYYY-MM-DD'.
 * Fixa o fuso para o servidor (UTC na Vercel) não virar o dia às 21h.
 */
export function todayISO(now: Date = new Date()): string {
  return now.toLocaleDateString('en-CA', { timeZone: 'America/Bahia' });
}

/** 'YYYY-MM-DD' -> 'DD/MM/YYYY' ('' se inválida). */
export function formatDateBR(value: string | null | undefined): string {
  const date = parseDateOnly(value);
  return date ? date.toLocaleDateString('pt-BR') : '';
}

/** 'YYYY-MM-DD' -> '20 de outubro de 2026' ('' se inválida). */
export function formatDateLong(value: string | null | undefined): string {
  const date = parseDateOnly(value);
  return date ? date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
}

/** true se a data (YYYY-MM-DD) é hoje ou no futuro. Comparação lexicográfica é segura nesse formato. */
export function isTodayOrFuture(value: string | null | undefined, today: string = todayISO()): boolean {
  return Boolean(value) && String(value).slice(0, 10) >= today;
}
