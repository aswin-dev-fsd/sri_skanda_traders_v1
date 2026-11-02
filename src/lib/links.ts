import { business, isPlaceholder, whatsappMessage } from '@/config/site';

/**
 * Builds a wa.me link with the brief's pre-filled message.
 * While the number is a placeholder, the link opens WhatsApp's contact picker instead.
 * @param topic Page or collection name inserted into the message.
 * @returns A `https://wa.me/...` URL.
 */
export function whatsappUrl(topic: string): string {
  const text = encodeURIComponent(whatsappMessage.replace('{topic}', topic));
  const number = isPlaceholder(business.whatsapp) ? '' : business.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${text}`;
}

/**
 * Returns the URL, or `#` while it is still a placeholder.
 * @param url A URL from `site.ts` that may be a placeholder.
 * @returns A safe href.
 */
export function hrefOrHash(url: string): string {
  return isPlaceholder(url) ? '#' : url;
}
