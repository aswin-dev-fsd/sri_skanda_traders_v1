import { business, isPlaceholder, whatsappMessage } from '@/config/site';

/**
 * Builds a wa.me link with the brief's pre-filled message.
 * While the number is a placeholder, the link opens WhatsApp's contact picker instead.
 * @param topic Page or collection name inserted into the message.
 * @returns A `https://wa.me/...` URL.
 */
export function whatsappUrl(topic: string): string {
  return whatsappLink(whatsappMessage.replace('{topic}', topic));
}

/**
 * WhatsApp link that opens a chat with any message filled in.
 * @param text Message text.
 * @returns A wa.me URL (contact picker while the number is a placeholder).
 */
export function whatsappLink(text: string): string {
  const number = isPlaceholder(business.whatsapp) ? '' : business.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * Returns the URL, or `#` while it is still a placeholder.
 * @param url A URL from `site.ts` that may be a placeholder.
 * @returns A safe href.
 */
export function hrefOrHash(url: string): string {
  return isPlaceholder(url) ? '#' : url;
}
