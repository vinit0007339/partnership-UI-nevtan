// The NevTan WhatsApp support line — the same number NevTan Mail's chat widget uses.
export const WHATSAPP_NUMBER = "+16614028769";

export const whatsAppLink = (message) => {
  const base = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
