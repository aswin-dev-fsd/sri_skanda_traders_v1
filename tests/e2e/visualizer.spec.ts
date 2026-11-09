import { expect, test } from '@playwright/test';

// The script creates the iframe when the 3D view is switched On, so it must still get its sizing
// styles (it once fell back to the browser's 300 × 150 default). The heavy WebGL embed is stubbed.
test('3D view switched On fills the visualizer frame', async ({ page }) => {
  await page.route('**/embed/visualizer.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Visualizer stub</title>' }),
  );
  await page.goto('/visualizer');

  const toggle = page.locator('[data-viz-switch]');
  await expect(toggle).toHaveAttribute('aria-checked', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', 'true');

  const iframe = page.locator('[data-viz-iframe]');
  await expect(iframe).toBeAttached();
  const frameBox = (await page.locator('[data-viz-frame]').boundingBox())!;
  const iframeBox = (await iframe.boundingBox())!;
  // Inside the frame's 1px border on each side.
  expect(Math.abs(iframeBox.width - (frameBox.width - 2))).toBeLessThanOrEqual(1);
  expect(Math.abs(iframeBox.height - (frameBox.height - 2))).toBeLessThanOrEqual(1);

  await toggle.click();
  await expect(iframe).toHaveCount(0);
});
