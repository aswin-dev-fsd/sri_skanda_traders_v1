import { expect, test } from '@playwright/test';
import { captureWindowOpen, lastWhatsAppText } from './helpers';

test('save from a listing, see it in My Selection, remove and undo', async ({ page }) => {
  await page.goto('/tiles');
  const card = page.locator('[data-listing-item]:not([hidden])').first();
  const name = (await card.locator('h3').textContent())!.trim();

  await card.locator('[data-save]').click();
  await expect(card.locator('[data-save]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-header] [data-selection-count]')).toHaveText('1');
  await expect(page.locator('[data-toast]')).toContainText('Saved to My Selection');

  await page.goto('/my-selection');
  await expect(page.locator('[data-ms-list] .row')).toHaveCount(1);
  await expect(page.locator('[data-ms-list] .name')).toContainText(name);
  await expect(page.locator('[data-ms-count]')).toHaveText('(1 item)');

  await page.locator('[data-ms-list] [data-remove]').click();
  await expect(page.locator('[data-ms-empty]')).toBeVisible();
  await page.locator('[data-toast-action]').click(); // Undo
  await expect(page.locator('[data-ms-list] .row')).toHaveCount(1);
});

test('saved list survives a reload and opens in the drawer', async ({ page }) => {
  await page.goto('/collection/ivory-marble');
  await page.locator('[data-colour-panel] [data-save]').click();
  await page.reload();
  await page.locator('[data-header] [data-selection-open]').click();
  const drawer = page.locator('[data-drawer="selection"]');
  await expect(drawer).toHaveAttribute('data-open', '');
  await expect(drawer.locator('[data-selection-list] li')).toHaveCount(1);
  await expect(drawer).toContainText('Ivory Marble · Ivory');
});

test('My Selection sends one WhatsApp enquiry with every item', async ({ page }) => {
  await captureWindowOpen(page);
  await page.goto('/product/arc-basin-mixer');
  await page.locator('.details [data-save]').click();
  await page.goto('/my-selection');

  const send = page.locator('[data-ms-send]');
  if (!(await send.isVisible())) await page.locator('[data-send-open]').click();
  await page.locator('#ms-name').fill('Lakshmi R');
  await page.locator('#ms-phone').fill('98765 43210');
  await send.getByRole('button', { name: 'Send as one enquiry' }).click();

  const text = await lastWhatsAppText(page);
  expect(text).toContain('Name: Lakshmi R');
  expect(text).toContain('Arc Basin Mixer (JSN-FT-105)');
  await expect(page.locator('[data-sent-title]')).toContainText('Lakshmi');
});
