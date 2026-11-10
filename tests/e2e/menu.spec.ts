import { expect, test } from '@playwright/test';

// The full-screen menu (below 1200px): the Products list starts closed and toggles from its row.
test('menu Products list starts closed and toggles', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/contact');
  await page.getByRole('button', { name: /menu/i }).first().click();

  const products = page.locator('[data-accordion]');
  const list = page.locator('#mobile-products');
  await expect(products).toHaveAttribute('aria-expanded', 'false');
  await expect(list).toBeHidden();

  await products.click();
  await expect(products).toHaveAttribute('aria-expanded', 'true');
  await expect(list).toBeVisible();

  await products.click();
  await expect(list).toBeHidden();
});
