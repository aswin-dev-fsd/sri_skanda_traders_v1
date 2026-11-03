import { expect, test } from '@playwright/test';
import {
  buildEnquiryMessage,
  buildShortlistMessage,
  describeItem,
  normalisePhone,
  roomName,
  validateEnquiry,
} from '../../src/lib/enquiry';
import { whatsappLink } from '../../src/lib/links';
import type { SavedItem } from '../../src/lib/types';

const marble: SavedItem = {
  id: 'ivory-marble:IM-103',
  kind: 'collection',
  name: 'Ivory Marble',
  colour: 'Sand Vein',
  code: 'IM-103',
  size: '600 × 1200 mm',
  brand: 'Brand A',
  href: '/collection/ivory-marble#colour-IM-103',
  room: 'living-room',
  approxArea: 220,
  savedAt: 1,
};
const mixer: SavedItem = { id: 'arc', kind: 'product', name: 'Arc Basin Mixer', code: 'JSN-FT-105', brand: 'Johnson', href: '/product/arc', savedAt: 2 };

test.describe('normalisePhone', () => {
  for (const input of ['9876543210', '+91 98765 43210', '91-9876543210', '09876543210']) {
    test(`accepts ${input}`, () => expect(normalisePhone(input)).toBe('9876543210'));
  }
  for (const input of ['12345', '5876543210', '98765432101']) {
    test(`rejects ${input}`, () => expect(normalisePhone(input)).toBeNull());
  }
});

test('validateEnquiry gives friendly messages', () => {
  expect(validateEnquiry({ name: ' ', phone: '' })).toEqual({
    name: 'Please tell us your name.',
    phone: 'Please add a phone number so we can call you back.',
  });
  expect(validateEnquiry({ name: 'Lakshmi', phone: '123' }).phone).toBe('Please enter a 10-digit mobile number.');
  expect(validateEnquiry({ name: 'Lakshmi', phone: '9876543210' })).toEqual({});
});

test('roomName falls back to "Not sorted yet"', () => {
  expect(roomName('living-room')).toBe('Living room');
  expect(roomName(undefined)).toBe('Not sorted yet');
});

test('describeItem includes colour, code, size, brand, room and area', () => {
  expect(describeItem(marble)).toBe('Ivory Marble, Sand Vein (IM-103), 600 × 1200 mm, Brand A, for living room, about 220 sq ft');
});

test('buildEnquiryMessage lists the details and every saved item', () => {
  const message = buildEnquiryMessage({
    name: 'Ravi K',
    phone: '98450 12345',
    role: 'Builder',
    company: 'RK Builders',
    stage: 'Planning',
    items: [marble, mixer],
  });
  expect(message).toContain('Name: Ravi K');
  expect(message).toContain('Phone: +91 9845012345');
  expect(message).toContain('Company / firm: RK Builders');
  expect(message).toContain('Project stage: Planning');
  expect(message).toContain('My saved items (2):');
  expect(message).toContain('2. Arc Basin Mixer (JSN-FT-105), Johnson');
});

test('buildShortlistMessage groups items by room', () => {
  const message = buildShortlistMessage([marble, mixer]);
  expect(message).toMatch(/Living room:\n- Ivory Marble/);
  expect(message).toMatch(/Not sorted yet:\n- Arc Basin Mixer/);
});

test('whatsappLink encodes the message', () => {
  const link = whatsappLink('Hi & hello\nthere');
  expect(link).toMatch(/^https:\/\/wa\.me\/\d*\?text=/);
  expect(decodeURIComponent(link.split('text=')[1])).toBe('Hi & hello\nthere');
});
