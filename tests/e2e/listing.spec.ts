import { expect, test } from '@playwright/test';
import { isDesktop } from './helpers';

const visibleCards = '[data-listing-item]:not([hidden])';

test('filters update the results and the URL, and the URL restores them', async ({ page }) => {
  await page.goto('/tiles');
  const count = page.locator('[data-result-count]');
  await expect(count).toHaveText('16 collections');

  if (await isDesktop(page)) {
    await page.locator('[data-filter-scope="sidebar"]').getByText('Marble', { exact: true }).click();
  } else {
    await page.locator('[data-open-filters]').click();
    const sheet = page.locator('[data-filter-scope="sheet"]');
    await sheet.getByText('Marble', { exact: true }).click();
    await expect(page.locator('[data-sheet-apply]')).toHaveText('Show 3 collections');
    await page.locator('[data-sheet-apply]').click();
  }

  await expect(count).toHaveText('3 collections');
  await expect(page).toHaveURL(/\?look=marble$/);
  await expect(page.locator('.active-chip')).toHaveText('Marble');

  await page.goto('/tiles?look=marble&sort=az');
  await expect(count).toHaveText('3 collections');
  await expect(page.locator(`${visibleCards} h3`).first()).toHaveText('Calacatta Gold');
});

test('no results shows suggestions that recover', async ({ page }) => {
  await page.goto('/tiles?look=marble&colour=black');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await page.locator('[data-suggestions] button').first().click();
  await expect(page.locator('[data-empty]')).toBeHidden();
  await expect(page.locator(visibleCards).first()).toBeVisible();
});

test('Load more shows the rest', async ({ page }) => {
  await page.goto('/tiles');
  await expect(page.locator(visibleCards)).toHaveCount(12);
  await page.getByRole('button', { name: 'Load more' }).click();
  await expect(page.locator(visibleCards)).toHaveCount(16);
  await expect(page.locator('[data-showing]')).toHaveText('Showing 16 of 16');
});

test('/products?brand=johnson goes to bathware', async ({ page }) => {
  await page.goto('/products?brand=johnson');
  await expect(page).toHaveURL(/\/bathware\?brand=johnson$/);
  await expect(page.locator('[data-result-count]')).toHaveText('6 products');
});
