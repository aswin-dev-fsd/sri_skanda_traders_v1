import { expect, test, type Page } from '@playwright/test';

// No page may be wider than a phone screen. One element that is too wide makes the whole page
// scroll sideways and pushes the fixed header's menu button off screen.
const pages = [
  '/',
  '/products',
  '/tiles',
  '/tiles/floor',
  '/tiles/bathroom',
  '/bathware',
  '/bathware/faucets',
  '/granite',
  '/adhesives',
  '/collection/ivory-marble',
  '/product/aurum-wall-hung-wc',
  '/visualizer',
  '/my-selection',
  '/contact',
  '/about',
  '/gallery',
];

/** Elements that stick out past the right edge and are not clipped by a parent. */
async function overflowing(page: Page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const found: string[] = [];
    for (const el of document.querySelectorAll<HTMLElement>('body *')) {
      const box = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (!box.width || box.right <= width + 1 || style.visibility === 'hidden' || style.position === 'fixed') continue;
      const parent = el.parentElement!;
      if (parent !== document.body && parent.getBoundingClientRect().right > width + 1) continue; // report the outermost only
      let clipped = false;
      for (let a: HTMLElement | null = parent; a && a !== document.body; a = a.parentElement) {
        if (/hidden|auto|scroll|clip/.test(getComputedStyle(a).overflowX) && a.getBoundingClientRect().right <= width + 1) {
          clipped = true;
          break;
        }
      }
      if (!clipped) found.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} (right edge ${Math.round(box.right)}px)`);
    }
    return { scrollWidth: document.documentElement.scrollWidth, width, found };
  });
}

const cases = [
  { name: '360px', width: 360, fontSize: '' },
  { name: '320px', width: 320, fontSize: '' },
  // Phones with a larger text setting.
  { name: '360px with large text', width: 360, fontSize: '125%' },
];

for (const path of pages) {
  test(`${path} fits a phone screen`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'phone', 'Phone widths only.');
    await page.route('**/embed/visualizer.html', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="en"><title>Visualizer</title></html>' }),
    );

    for (const c of cases) {
      await page.setViewportSize({ width: c.width, height: 780 });
      await page.goto(path);
      await page.evaluate((size) => (document.documentElement.style.fontSize = size), c.fontSize);
      const result = await overflowing(page);
      expect(result.scrollWidth, `${c.name}: ${result.found.join(', ')}`).toBeLessThanOrEqual(result.width);
    }
  });
}
