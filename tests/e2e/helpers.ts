import type { Page } from '@playwright/test';

/** Captures window.open() calls (WhatsApp links) instead of opening tabs. Call before page.goto. */
export async function captureWindowOpen(page: Page): Promise<void> {
  await page.addInitScript(() => {
    (window as unknown as { __opened: string[] }).__opened = [];
    window.open = ((url?: string | URL) => {
      (window as unknown as { __opened: string[] }).__opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
}

/** The decoded text of the last WhatsApp link the page tried to open. */
export async function lastWhatsAppText(page: Page): Promise<string> {
  const urls = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
  const last = urls.at(-1) ?? '';
  return decodeURIComponent(last.split('text=')[1] ?? '');
}

/** True when the page shows the desktop layout (sidebar filters, desktop nav). */
export async function isDesktop(page: Page): Promise<boolean> {
  return (page.viewportSize()?.width ?? 0) >= 1200;
}
