/**
 * Classes compartilhadas do kit do painel (Tailwind v4).
 * Cores só da marca: azul #003f7f / #0052a3 / #0066cc, verde #00a859, amarelo #ffd000, cinzas.
 */

/** Anel de foco visível só no teclado. */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc] focus-visible:ring-offset-2';

/** Superfície padrão de cartão (branco, borda sutil, sombra leve). */
export const cardSurface = 'rounded-2xl bg-white ring-1 ring-gray-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)]';

/** Junta classes ignorando valores falsos. */
export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
