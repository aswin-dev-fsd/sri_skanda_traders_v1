import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// WCAG 2.1 AA (brief Prompt 00-L), on every main page. The embedded visualizer is the temporary
// third-party demo and is checked separately when it is replaced.
const pages = [
  '/',
  '/tiles',
  '/tiles/bathroom',
  '/bathware',
  '/collection/ivory-marble',
  '/product/aurum-wall-hung-wc',
  '/visualizer',
  '/my-selection',
  '/contact',
  '/about',
  '/gallery',
];

for (const path of pages) {
  test(`${path} has no serious accessibility issues and no script errors`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'tablet', 'Covered by desktop and phone.');
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // The WebGL visualizer shares the page's main thread and starves headless Chrome; it is the
    // temporary demo and excluded from this audit, so serve a blank stand-in for it.
    await page.route('**/embed/visualizer.html', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="en"><title>Visualizer</title></html>' }),
    );
    await page.goto(path);
    // Let entrance and reveal animations settle so contrast is measured on final colours.
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.setAttribute('data-revealed', '')));
    await page.waitForTimeout(1000);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('[data-viz-iframe]')
      .analyze();
    const serious = results.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id}: ${v.help} (${v.nodes.length}) → ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);

    expect(serious, serious.join('\n')).toEqual([]);
    expect(errors).toEqual([]);
  });
}
