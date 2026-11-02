import { business, isPlaceholder } from '@/config/site';
import type { SelectionItem } from '@/lib/types';

export { whatsappLink } from '@/lib/links';

/** Who is enquiring (brief: "I am a…"). */
export const roles = ['Homeowner', 'Architect or Designer', 'Builder', 'Contractor'] as const;

/** What they are interested in. */
export const interests = ['Floor tiles', 'Wall tiles', 'Vitrified', 'Granite', 'Bathware', 'Adhesives'] as const;

export interface Enquiry {
  name: string;
  phone: string;
  area?: string;
  role?: string;
  interests?: string[];
  message?: string;
  /** The collection or product the enquiry was opened from. */
  about?: SelectionItem;
  /** Saved items attached from My Selection. */
  items?: SelectionItem[];
  /** Page the enquiry was sent from. */
  sourcePage?: string;
}

export interface EnquiryErrors {
  name?: string;
  phone?: string;
}

/**
 * Normalises an Indian mobile number to 10 digits.
 * @param phone What the customer typed, with or without +91, spaces or dashes.
 * @returns The 10-digit number, or null if it is not a valid mobile number.
 */
export function normalisePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

/**
 * Checks the required fields with friendly messages.
 * @param enquiry The form values.
 * @returns Errors by field; empty when valid.
 */
export function validateEnquiry(enquiry: Pick<Enquiry, 'name' | 'phone'>): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!enquiry.name.trim()) errors.name = 'Please tell us your name.';
  if (!enquiry.phone.trim()) errors.phone = 'Please add a phone number so we can call you back.';
  else if (!normalisePhone(enquiry.phone)) errors.phone = 'Please enter a 10-digit mobile number.';
  return errors;
}

/**
 * One line describing an item, e.g. "Ivory Marble, Ivory (IM-101), 600 × 1200 mm".
 * @param item A collection or product.
 * @returns A readable line.
 */
export function describeItem(item: SelectionItem): string {
  const parts = [item.colour ? `${item.name}, ${item.colour}` : item.name];
  if (item.code) parts[0] += ` (${item.code})`;
  if (item.size) parts.push(item.size);
  if (item.brand) parts.push(item.brand);
  return parts.join(', ');
}

/**
 * Builds the plain-text enquiry sent over WhatsApp or email.
 * @param enquiry The form values.
 * @returns Multi-line message text.
 */
export function buildEnquiryMessage(enquiry: Enquiry): string {
  const phone = normalisePhone(enquiry.phone) ?? enquiry.phone;
  const lines = [`Hi ${business.name}, I'd like to enquire.`, '', `Name: ${enquiry.name.trim()}`, `Phone: +91 ${phone}`];
  if (enquiry.area?.trim()) lines.push(`Area: ${enquiry.area.trim()}`);
  if (enquiry.role) lines.push(`I am a: ${enquiry.role}`);
  if (enquiry.interests?.length) lines.push(`Interested in: ${enquiry.interests.join(', ')}`);
  if (enquiry.about) lines.push('', `Asking about: ${describeItem(enquiry.about)}`);
  if (enquiry.items?.length) {
    lines.push('', `My saved items (${enquiry.items.length}):`);
    enquiry.items.forEach((item, i) => lines.push(`${i + 1}. ${describeItem(item)}`));
  }
  if (enquiry.message?.trim()) lines.push('', enquiry.message.trim());
  return lines.join('\n');
}

/**
 * Email link with the message filled in, or null while the email address is a placeholder.
 * @param text Message text.
 * @param subject Email subject.
 * @returns A mailto: URL or null.
 */
export function emailLink(text: string, subject = 'Enquiry from the website'): string | null {
  if (isPlaceholder(business.email)) return null;
  return `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
}
