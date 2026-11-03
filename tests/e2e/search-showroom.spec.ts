import { expect, test } from '@playwright/test';
import { isDesktop } from './helpers';

test('search suggests the exact colour for a code', async ({ page }) => {
  await page.goto('/');
  let input;
  if (await isDesktop(page)) {
    await page.locator('[data-search-trigger]').click();
    input = page.locator('#site-search');
  } else {
    await page.locator('[data-menu-open]').click();
    input = page.locator('#mobile-search');
  }
  await input.fill('im-103');
  const list = page.locator(`#${await input.getAttribute('aria-controls')}`);
  await expect(list.locator('.sg-group').first()).toHaveText('Exact code');
  await expect(list.locator('[role="option"]').first()).toHaveAttribute('href', '/collection/ivory-marble#colour-IM-103');

  await input.press('Enter');
  await expect(page).toHaveURL(/\/collection\/ivory-marble#colour-IM-103$/);
  await expect(page.locator('[data-panel-code]')).toHaveText('IM-103');
});

test('showroom mode: remembered, hides WhatsApp, New customer clears the list', async ({ page }) => {
  await page.goto('/product/arc-basin-mixer?mode=showroom');
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'showroom');
  await expect(page.locator('.wa-float')).toBeHidden();
  await page.locator('.details [data-save]').click();

  await page.goto('/my-selection');
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'showroom'); // remembered without the parameter
  await page.locator('main [data-new-customer]').click();
  const dialog = page.locator('[data-new-customer-dialog]');
  await expect(dialog).toBeVisible();
  // Centred on screen (the CSS reset once pinned dialogs to the top-left corner).
  const box = (await dialog.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(24);
  expect(Math.abs(box.y + box.height / 2 - viewport.height / 2)).toBeLessThan(24);
  await dialog.getByRole('button', { name: 'Clear and start fresh' }).click();
  await expect(page.locator('[data-ms-empty]')).toBeVisible();

  await page.goto('/?mode=off');
  await expect(page.locator('html')).not.toHaveAttribute('data-mode', 'showroom');
  await expect(page.locator('.wa-float')).toBeVisible();
});
