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

// The embed's Save and Enquire buttons message the page (postMessage, same origin). A stub embed
// sends the same messages the real one does, without loading the 3D room.
test('Save and Enquire from the visualizer reach My Selection and the enquiry drawer', async ({ page }) => {
  const stub = `<!doctype html><title>Visualizer stub</title><canvas></canvas>
    <button id="save">Save</button><button id="enquire">Enquire</button>
    <script>
      const item = { id: 'viz-test-600x600', name: 'Test Tile', code: 'T-01', size: '600 × 600 mm' };
      const send = (type) => parent.postMessage({ source: 'ss-viz', type, item }, location.origin);
      addEventListener('message', (e) => { document.body.dataset.saved = String(!!e.data.saved); });
      document.getElementById('save').onclick = () => send('save');
      document.getElementById('enquire').onclick = () => send('enquire');
      send('look');
    </script>`;
  await page.route('**/embed/visualizer.html', (route) => route.fulfill({ contentType: 'text/html', body: stub }));
  await page.goto('/visualizer');
  await page.locator('[data-viz-switch]').click();

  const frame = page.frameLocator('[data-viz-iframe]');
  await expect(frame.locator('body')).toHaveAttribute('data-saved', 'false');
  await frame.locator('#save').click();
  await expect(frame.locator('body')).toHaveAttribute('data-saved', 'true');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('sst:selection:v1') ?? '[]'));
  expect(saved).toEqual([expect.objectContaining({ id: 'viz-test-600x600', name: 'Test Tile', href: '/visualizer' })]);

  await frame.locator('#enquire').click();
  await expect(page.locator('[data-about-text]').first()).toHaveText('Test Tile, T-01');
});
