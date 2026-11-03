import { expect, test } from '@playwright/test';
import { captureWindowOpen, lastWhatsAppText } from './helpers';

test('Enquire on a card opens the drawer about that item and builds the WhatsApp message', async ({ page }) => {
  await captureWindowOpen(page);
  await page.goto('/tiles');
  const card = page.locator('[data-listing-item]:not([hidden])').first();
  const name = (await card.locator('h3').textContent())!.trim();
  await card.getByRole('link', { name: 'Enquire' }).click();

  const drawer = page.locator('[data-drawer="enquiry"]');
  await expect(drawer).toHaveAttribute('data-open', '');
  await expect(drawer.locator('[data-about-text]')).toHaveText(name);

  // Friendly validation first.
  await drawer.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(drawer.locator('#enq-name-error')).toHaveText('Please tell us your name.');

  await drawer.locator('#enq-name').fill('Ravi K');
  await drawer.locator('#enq-phone').fill('98450 12345');
  await drawer.getByText('Homeowner', { exact: true }).click();
  await drawer.getByRole('button', { name: 'Send enquiry' }).click();

  const text = await lastWhatsAppText(page);
  expect(text).toContain('Name: Ravi K');
  expect(text).toContain('Phone: +91 9845012345');
  expect(text).toContain('I am a: Homeowner');
  expect(text).toContain(`Asking about: ${name}`);
  await expect(drawer.locator('[data-success-title]')).toHaveText('Thank you, Ravi.');
});

test('Contact form adds the trade fields for builders', async ({ page }) => {
  await captureWindowOpen(page);
  await page.goto('/contact');
  const form = page.locator('[data-contact-form]');
  await expect(form.locator('[data-trade]')).toBeHidden();
  await form.getByText('Builder', { exact: true }).click();
  await expect(form.locator('[data-trade]')).toBeVisible();

  await form.locator('#ct-name').fill('Ravi K');
  await form.locator('#ct-phone').fill('9845012345');
  await form.locator('#ct-company').fill('RK Builders');
  await form.getByText('Under construction', { exact: true }).click();
  await form.getByRole('button', { name: 'Send enquiry' }).click();

  const text = await lastWhatsAppText(page);
  expect(text).toContain('Company / firm: RK Builders');
  expect(text).toContain('Project stage: Under construction');
});
