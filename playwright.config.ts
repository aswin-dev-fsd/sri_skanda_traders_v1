import { defineConfig, devices } from '@playwright/test';

/**
 * Tests run against the production build (`astro build` + `astro preview` on port 4322).
 *   unit — pure functions in src/lib (no browser)
 *   e2e  — key flows and axe accessibility checks, at desktop, showroom tablet and phone sizes
 */
const PORT = 4322;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'unit', testDir: 'tests/unit' },
    {
      name: 'desktop',
      testDir: 'tests/e2e',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'tablet',
      testDir: 'tests/e2e',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 }, hasTouch: true },
    },
    {
      name: 'phone',
      testDir: 'tests/e2e',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: `npm run build && npx astro preview --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
