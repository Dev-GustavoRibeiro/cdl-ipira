/**
 * Anti-robô dos formulários públicos (contato, orientação jurídica e inscrição em evento), sem captcha para o visitante:
 * - campo-armadilha: invisível e fora do Tab; pessoas não o preenchem, robôs que preenchem tudo, sim;
 * - tempo de preenchimento: medido no navegador (do formulário aparecer até o envio, com o relógio monotônico da
 *   página), então o relógio errado de quem envia não atrapalha.
 * Serve ao navegador (stampFormOpenedAt, formGuardFields) e às rotas da API (checkFormGuard).
 *
 * ponytail: o tempo é declarado pelo próprio envio (fillMs), então só barra robôs genéricos; um script feito para
 * este site manda {website: '', fillMs: 5000} e passa, sobrando o limite por IP de cada rota. Se aparecer robô
 * direcionado: carimbo de tempo assinado no servidor (HMAC) entregue com o formulário e conferido aqui.
 */

export const HONEYPOT_FIELD = 'website';
// Pessoa com preenchimento automático ainda leva alguns segundos; robô envia na hora
const MIN_FILL_MS = 2000;

/** ref do <form>: marca quando ele apareceu (só na primeira vez). */
export function stampFormOpenedAt(form: HTMLFormElement | null) {
  if (form && !form.dataset.openedAt) form.dataset.openedAt = String(performance.now());
}

/** Campos anti-robô para juntar ao corpo do envio: { ...dados, ...formGuardFields(form) }. */
export function formGuardFields(form: HTMLFormElement) {
  const honeypot = form.elements.namedItem(HONEYPOT_FIELD);
  return {
    [HONEYPOT_FIELD]: honeypot instanceof HTMLInputElement ? honeypot.value : '',
    // Sem a marca vira null (JSON de NaN) e a API recusa
    fillMs: Math.round(performance.now() - Number(form.dataset.openedAt)),
  };
}

/** Na API: mensagem de recusa, ou null quando o envio parece de uma pessoa. */
export function checkFormGuard(body: Record<string, unknown>): string | null {
  if (body[HONEYPOT_FIELD]) return 'Não foi possível enviar. Recarregue a página e tente novamente.';
  const fillMs = body.fillMs;
  if (typeof fillMs !== 'number' || !Number.isFinite(fillMs)) return 'Não foi possível enviar. Recarregue a página e tente novamente.';
  if (fillMs < MIN_FILL_MS) return 'Envio rápido demais. Aguarde alguns segundos e envie de novo.';
  return null;
}
