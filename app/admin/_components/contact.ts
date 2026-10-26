/** Link do WhatsApp com DDI 55 (aceita "(75) 99811-2233", "075...", "5575..."). null se o número for curto demais. */
export function whatsappHref(phone: string, text: string) {
  const digits = phone.replace(/\D/g, '').replace(/^0+/, '');
  if (digits.length < 10) return null;
  const full = digits.startsWith('55') && digits.length >= 12 ? digits : `55${digits}`;
  return `https://wa.me/${full}?text=${encodeURIComponent(text)}`;
}

/** Disparado pela tela Fale Conosco após mudar/apagar mensagens: o menu atualiza o contador de não lidas (detail numérico = ajuste direto). */
export const CONTACT_MESSAGES_EVENT = 'cdl-admin:contact-messages';
